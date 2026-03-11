import type { User } from '../entities/User'
import type { AuthResponse } from '../entities/AuthTokens'

export interface RegisterInput {
  email: string
  password: string
  name: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface AuthRepository {
  register(input: RegisterInput): Promise<AuthResponse>
  login(input: LoginInput): Promise<AuthResponse>
  logout(refreshToken: string): Promise<void>
  refreshToken(refreshToken: string): Promise<AuthResponse>
  getCurrentUser(): Promise<User>
}
