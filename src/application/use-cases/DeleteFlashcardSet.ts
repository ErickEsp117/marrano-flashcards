import type { FlashcardSetRepository } from '@/domain/repositories/FlashcardSetRepository'
import type { SetId } from '@/domain/value-objects/SetId'

export class DeleteFlashcardSet {
  constructor(private repository: FlashcardSetRepository) {}

  async execute(id: SetId): Promise<void> {
    await this.repository.delete(id)
  }
}
