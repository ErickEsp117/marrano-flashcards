const TOKEN_KEYS = {
  ACCESS_TOKEN: 'marrano_access_token',
  REFRESH_TOKEN: 'marrano_refresh_token',
} as const

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN)
}

export function setTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken)
  localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, refreshToken)
}

export function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN)
  localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN)
}

export function hasTokens(): boolean {
  return !!getAccessToken() && !!getRefreshToken()
}
