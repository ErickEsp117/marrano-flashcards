import type { TextGeneratorService, GenerateProgress } from '@/domain/services/TextGeneratorService'
import type { FlashcardSet } from '@/domain/entities/FlashcardSet'

export class GenerateFlashcardsFromText {
  constructor(private textGenerator: TextGeneratorService) {}

  async execute(
    text: string,
    onProgress?: (progress: GenerateProgress) => void,
  ): Promise<FlashcardSet> {
    if (!text || text.length < 50) {
      throw new Error('El texto debe tener al menos 50 caracteres')
    }
    if (text.length > 100000) {
      throw new Error('El texto no puede exceder 100,000 caracteres')
    }
    return this.textGenerator.generateFromText(text, onProgress)
  }
}
