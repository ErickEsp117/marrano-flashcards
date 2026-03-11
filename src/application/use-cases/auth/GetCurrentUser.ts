import type { AuthRepository } from '@/domain/repositories/AuthRepository'
import type { User } from '@/domain/entities/User'

export class GetCurrentUser {
  constructor(private authRepository: AuthRepository) {}

  async execute(): Promise<User> {
    return this.authRepository.getCurrentUser()
  }
}
