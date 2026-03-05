import type { SetId } from '../value-objects/SetId'
import type { Flashcard } from './Flashcard'
import type { Category } from './Category'
import type { QuizQuestion } from './QuizQuestion'

export interface FlashcardSet {
  readonly id: SetId
  readonly title: string
  readonly subtitle: string
  readonly sourceFileName: string
  readonly categories: Category[]
  readonly flashcards: Flashcard[]
  readonly quizQuestions?: QuizQuestion[]
  readonly createdAt: string
  readonly totalPages: number
}
