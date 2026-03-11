import type { AuthRepository, RegisterInput } from '@/domain/repositories/AuthRepository'
import type { AuthResponse } from '@/domain/entities/AuthTokens'

export class RegisterUser {
  constructor(private authRepository: AuthRepository) {}

  async execute(input: RegisterInput): Promise<AuthResponse> {
    if (!input.email || !input.password || !input.name) {
      throw new Error('Todos los campos son requeridos')
    }
    if (input.password.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres')
    }
    if (input.name.length < 2) {
      throw new Error('El nombre debe tener al menos 2 caracteres')
    }
    return this.authRepository.register(input)
  }
}
