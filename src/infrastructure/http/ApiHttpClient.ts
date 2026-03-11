import { apiConfig } from './api-endpoints'
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from './token-storage'

export class ApiHttpClient {
  private baseUrl = apiConfig.baseUrl
  private isRefreshing = false
  private refreshPromise: Promise<boolean> | null = null

  private getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    if (includeAuth) {
      const token = getAccessToken()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }
    return headers
  }

  private async tryRefreshToken(): Promise<boolean> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise
    }

    this.isRefreshing = true
    this.refreshPromise = this.doRefresh()

    try {
      return await this.refreshPromise
    } finally {
      this.isRefreshing = false
      this.refreshPromise = null
    }
  }

  private async doRefresh(): Promise<boolean> {
    const refreshToken = getRefreshToken()
    if (!refreshToken) return false

    try {
      const response = await fetch(`${this.baseUrl}${apiConfig.endpoints.refresh}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })

      if (!response.ok) {
        clearTokens()
        return false
      }

      const data = await response.json()
      setTokens(data.accessToken, data.refreshToken)
      return true
    } catch {
      clearTokens()
      return false
    }
  }

  async request<T>(
    path: string,
    options: RequestInit = {},
    requireAuth = true,
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`
    const headers = this.getHeaders(requireAuth)

    let response = await fetch(url, {
      ...options,
      headers: { ...headers, ...(options.headers ?? {}) },
    })

    // If 401 and we have a refresh token, try to refresh
    if (response.status === 401 && requireAuth) {
      const refreshed = await this.tryRefreshToken()
      if (refreshed) {
        const newHeaders = this.getHeaders(true)
        response = await fetch(url, {
          ...options,
          headers: { ...newHeaders, ...(options.headers ?? {}) },
        })
      } else {
        clearTokens()
        window.dispatchEvent(new CustomEvent('auth:session-expired'))
        throw new ApiError('Sesión expirada. Por favor inicia sesión de nuevo.', 401)
      }
    }

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}))
      const message = errorBody.message || errorBody.error || `Error ${response.status}`
      throw new ApiError(message, response.status)
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T
    }

    return response.json()
  }

  async get<T>(path: string, requireAuth = true): Promise<T> {
    return this.request<T>(path, { method: 'GET' }, requireAuth)
  }

  async post<T>(path: string, body?: unknown, requireAuth = true): Promise<T> {
    return this.request<T>(
      path,
      {
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined,
      },
      requireAuth,
    )
  }

  async put<T>(path: string, body?: unknown, requireAuth = true): Promise<T> {
    return this.request<T>(
      path,
      {
        method: 'PUT',
        body: body ? JSON.stringify(body) : undefined,
      },
      requireAuth,
    )
  }

  async delete<T>(path: string, requireAuth = true): Promise<T> {
    return this.request<T>(path, { method: 'DELETE' }, requireAuth)
  }

  /**
   * SSE stream request for endpoints like /generate/from-text
   */
  async stream(
    path: string,
    body: unknown,
    onMessage: (data: unknown) => void,
  ): Promise<void> {
    return this.streamRaw(path, JSON.stringify(body), { 'Content-Type': 'application/json' }, onMessage)
  }

  /**
   * SSE stream request with FormData body (multipart/form-data) for /generate/from-pdf
   */
  async streamForm(
    path: string,
    formData: FormData,
    onMessage: (data: unknown) => void,
  ): Promise<void> {
    // Do NOT set Content-Type — browser sets it automatically with the correct boundary
    return this.streamRaw(path, formData, {}, onMessage)
  }

  private async streamRaw(
    path: string,
    body: BodyInit,
    extraHeaders: Record<string, string>,
    onMessage: (data: unknown) => void,
  ): Promise<void> {
    const url = `${this.baseUrl}${path}`
    const authHeaders = this.getHeaders(true)
    // Merge auth headers but allow extraHeaders to override Content-Type
    const headers = { ...authHeaders, ...extraHeaders }
    // When sending FormData, remove the Content-Type set by getHeaders so fetch sets it with boundary
    if (body instanceof FormData) {
      delete (headers as Record<string, string>)['Content-Type']
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    })

    if (response.status === 401) {
      const refreshed = await this.tryRefreshToken()
      if (refreshed) {
        return this.streamRaw(path, body, extraHeaders, onMessage)
      }
      clearTokens()
      window.dispatchEvent(new CustomEvent('auth:session-expired'))
      throw new ApiError('Sesión expirada. Por favor inicia sesión de nuevo.', 401)
    }

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}))
      throw new ApiError(
        errorBody.message || 'Error en la generación',
        response.status,
      )
    }

    const reader = response.body?.getReader()
    if (!reader) throw new ApiError('No se pudo leer la respuesta', 500)

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })

      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.startsWith('data: ')) {
          try {
            const json = JSON.parse(trimmed.slice(6))
            onMessage(json)
          } catch {
            // Skip malformed JSON
          }
        }
      }
    }

    // Process any remaining buffer
    if (buffer.trim().startsWith('data: ')) {
      try {
        const json = JSON.parse(buffer.trim().slice(6))
        onMessage(json)
      } catch {
        // Skip
      }
    }
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Singleton instance
export const httpClient = new ApiHttpClient()
