import type { ShareRepository } from '@/domain/repositories/ShareRepository'
import type { FlashcardSet } from '@/domain/entities/FlashcardSet'

export class GetSharedFlashcardSet {
  constructor(private shareRepository: ShareRepository) {}

  async execute(token: string): Promise<FlashcardSet> {
    return this.shareRepository.getSharedSet(token)
  }
}
