import type { Flashcard } from '../entities/Flashcard'
import type { Category } from '../entities/Category'

export interface AiFlashcardResult {
  flashcards: Flashcard[]
  categories: Category[]
  suggestedTitle: string
  suggestedSubtitle: string
}

export interface AiGeneratorService {
  generateFromPages(
    pages: { pageNumber: number; text: string; imageDataUrl?: string }[],
    existingCategories?: Category[]
  ): Promise<AiFlashcardResult>
}
