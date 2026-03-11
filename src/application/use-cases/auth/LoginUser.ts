import type { AuthRepository, LoginInput } from '@/domain/repositories/AuthRepository'
import type { AuthResponse } from '@/domain/entities/AuthTokens'

export class LoginUser {
  constructor(private authRepository: AuthRepository) {}

  async execute(input: LoginInput): Promise<AuthResponse> {
    if (!input.email || !input.password) {
      throw new Error('Email y contraseña son requeridos')
    }
    return this.authRepository.login(input)
  }
}
