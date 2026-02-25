import type { SetId } from '../value-objects/SetId'
import type { Flashcard } from './Flashcard'
import type { Category } from './Category'

export interface FlashcardSet {
  readonly id: SetId
  readonly title: string
  readonly subtitle: string
  readonly sourceFileName: string
  readonly categories: Category[]
  readonly flashcards: Flashcard[]
  readonly createdAt: string
  readonly totalPages: number
}
