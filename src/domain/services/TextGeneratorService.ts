import type { FlashcardSet } from '../entities/FlashcardSet'

export interface GenerateProgress {
  type: 'batch-complete' | 'complete' | 'error'
  batchIndex?: number
  totalBatches?: number
  partialResult?: {
    flashcards: unknown[]
    categories: unknown[]
    quizQuestions: unknown[]
    suggestedTitle: string
    suggestedSubtitle: string
  }
  flashcardSet?: FlashcardSet
  message?: string
}

export interface TextGeneratorService {
  generateFromText(
    text: string,
    onProgress?: (progress: GenerateProgress) => void,
  ): Promise<FlashcardSet>
}
