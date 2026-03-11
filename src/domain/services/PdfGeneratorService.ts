import type { FlashcardSet } from '../entities/FlashcardSet'
import type { GenerateProgress } from './TextGeneratorService'

export interface PdfGeneratorService {
  generateFromPdf(
    file: File,
    onProgress?: (progress: GenerateProgress) => void,
  ): Promise<FlashcardSet>
}
