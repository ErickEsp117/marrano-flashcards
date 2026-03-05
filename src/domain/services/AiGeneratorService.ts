import type { Flashcard } from '../entities/Flashcard'
import type { Category } from '../entities/Category'
import type { QuizQuestion } from '../entities/QuizQuestion'

export interface AiFlashcardResult {
  flashcards: Flashcard[]
  categories: Category[]
  quizQuestions: QuizQuestion[]
  suggestedTitle: string
  suggestedSubtitle: string
}

export interface AiGeneratorService {
  generateFromPages(
    pages: { pageNumber: number; text: string; imageDataUrl?: string }[],
    existingCategories?: Category[]
  ): Promise<AiFlashcardResult>
}
