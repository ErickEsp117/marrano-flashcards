import type { FlashcardSet } from '../entities/FlashcardSet'
import type { SetId } from '../value-objects/SetId'

export interface FlashcardSetRepository {
  save(set: FlashcardSet): Promise<FlashcardSet>
  getById(id: SetId): Promise<FlashcardSet | null>
  getAll(): Promise<FlashcardSet[]>
  delete(id: SetId): Promise<void>
}
