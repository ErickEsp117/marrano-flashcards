import type { PdfGeneratorService } from '@/domain/services/PdfGeneratorService'
import type { FlashcardSet } from '@/domain/entities/FlashcardSet'

export type GenerationStage = 'uploading' | 'generating' | 'complete' | 'error'

export interface GenerateFlashcardsInput {
  file: File
  onProgress?: (stage: GenerationStage, detail: string) => void
  /** Called when the complete set arrives from the backend SSE stream */
  onFirstBatchReady?: (set: FlashcardSet) => void
  /** Called after each subsequent batch update (for compatibility) */
  onBatchUpdate?: (set: FlashcardSet) => void
}

export class GenerateFlashcardsFromPdf {
  constructor(private pdfGenerator: PdfGeneratorService) {}

  async execute(input: GenerateFlashcardsInput): Promise<FlashcardSet> {
    const { file, onProgress, onFirstBatchReady, onBatchUpdate } = input

    onProgress?.('uploading', `Subiendo ${file.name} al servidor...`)

    let batchCount = 0
    let hasCalledFirstBatch = false

    const set = await this.pdfGenerator.generateFromPdf(file, (progress) => {
      if (progress.type === 'batch-complete') {
        batchCount++
        const cards = (progress.partialResult?.flashcards?.length ?? 0)
        const questions = (progress.partialResult?.quizQuestions?.length ?? 0)
        onProgress?.(
          'generating',
          `Lote ${batchCount} completado — ${cards} flashcards, ${questions} preguntas de quiz generadas`,
        )
      } else if (progress.type === 'complete' && progress.flashcardSet) {
        const s = progress.flashcardSet
        if (!hasCalledFirstBatch) {
          hasCalledFirstBatch = true
          onFirstBatchReady?.(s)
        } else {
          onBatchUpdate?.(s)
        }
        onProgress?.('complete', `¡${s.flashcards.length} flashcards generadas y guardadas!`)
      } else if (progress.type === 'error') {
        onProgress?.('error', progress.message ?? 'Error en la generación')
      }
    })

    return set
  }
}