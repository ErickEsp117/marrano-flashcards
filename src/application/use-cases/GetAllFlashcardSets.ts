import type { FlashcardSetRepository } from '@/domain/repositories/FlashcardSetRepository'
import type { FlashcardSet } from '@/domain/entities/FlashcardSet'

export class GetAllFlashcardSets {
  constructor(private repository: FlashcardSetRepository) {}

  async execute(): Promise<FlashcardSet[]> {
    return this.repository.getAll()
  }
}
