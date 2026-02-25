import type { FlashcardSetRepository } from '@/domain/repositories/FlashcardSetRepository'
import type { FlashcardSet } from '@/domain/entities/FlashcardSet'
import type { SetId } from '@/domain/value-objects/SetId'

export class GetFlashcardSet {
  constructor(private repository: FlashcardSetRepository) {}

  async execute(id: SetId): Promise<FlashcardSet | null> {
    return this.repository.getById(id)
  }
}
