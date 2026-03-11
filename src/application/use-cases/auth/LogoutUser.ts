import type { AuthRepository } from '@/domain/repositories/AuthRepository'
import { getRefreshToken, clearTokens } from '@/infrastructure/http/token-storage'

export class LogoutUser {
  constructor(private authRepository: AuthRepository) {}

  async execute(): Promise<void> {
    const refreshToken = getRefreshToken()
    if (refreshToken) {
      await this.authRepository.logout(refreshToken)
    }
    clearTokens()
  }
}
