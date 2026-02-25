import type { Flashcard } from '@/domain/entities/Flashcard'

export class FilterFlashcardsByCategory {
  execute(flashcards: Flashcard[], categoryId: string | 'all'): Flashcard[] {
    if (categoryId === 'all') return [...flashcards]
    return flashcards.filter(fc => fc.categoryId === categoryId)
  }
}
