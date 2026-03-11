import type { ShareRepository, ShareInfo } from '@/domain/repositories/ShareRepository'

export class ShareFlashcardSet {
  constructor(private shareRepository: ShareRepository) {}

  async generateToken(setId: string): Promise<ShareInfo> {
    return this.shareRepository.generateShareToken(setId)
  }

  async revokeToken(setId: string): Promise<void> {
    return this.shareRepository.revokeShareToken(setId)
  }
}
