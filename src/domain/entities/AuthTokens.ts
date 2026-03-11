import type { User } from './User'

export interface AuthTokens {
  readonly accessToken: string
  readonly refreshToken: string
}

export interface AuthResponse {
  readonly user: User
  readonly accessToken: string
  readonly refreshToken: string
}
