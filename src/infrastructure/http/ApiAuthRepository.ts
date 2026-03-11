import type { AuthRepository, RegisterInput, LoginInput } from '@/domain/repositories/AuthRepository'
import type { AuthResponse } from '@/domain/entities/AuthTokens'
import type { User } from '@/domain/entities/User'
import { httpClient } from '@/infrastructure/http/ApiHttpClient'
import { apiConfig } from '@/infrastructure/http/api-endpoints'
import { setTokens } from '@/infrastructure/http/token-storage'

export class ApiAuthRepository implements AuthRepository {
  async register(input: RegisterInput): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>(
      apiConfig.endpoints.register,
      input,
      false,
    )
    setTokens(response.accessToken, response.refreshToken)
    return response
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>(
      apiConfig.endpoints.login,
      input,
      false,
    )
    setTokens(response.accessToken, response.refreshToken)
    return response
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      await httpClient.post(apiConfig.endpoints.logout, { refreshToken }, true)
    } catch {
      // Ignore errors on logout — clear tokens locally regardless
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>(
      apiConfig.endpoints.refresh,
      { refreshToken },
      false,
    )
    setTokens(response.accessToken, response.refreshToken)
    return response
  }

  async getCurrentUser(): Promise<User> {
    return httpClient.get<User>(apiConfig.endpoints.me)
  }
}
