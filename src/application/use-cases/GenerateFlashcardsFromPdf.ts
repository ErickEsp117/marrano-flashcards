import type { PdfProcessorService } from '@/domain/services/PdfProcessorService'
import type { AiGeneratorService } from '@/domain/services/AiGeneratorService'
import type { FlashcardSetRepository } from '@/domain/repositories/FlashcardSetRepository'
import type { FlashcardSet } from '@/domain/entities/FlashcardSet'
import { createSetId } from '@/domain/value-objects/SetId'

export type GenerationStage = 'extracting' | 'analyzing' | 'generating' | 'saving' | 'complete' | 'error'

export interface GenerateFlashcardsInput {
  file: File
  onProgress?: (stage: GenerationStage, detail: string) => void
}

export class GenerateFlashcardsFromPdf {
  constructor(
    private pdfProcessor: PdfProcessorService,
    private aiGenerator: AiGeneratorService,
    private setRepository: FlashcardSetRepository,
  ) {}

  async execute(input: GenerateFlashcardsInput): Promise<FlashcardSet> {
    const { file, onProgress } = input

    onProgress?.('extracting', `Extrayendo texto de ${file.name}...`)
    const pages = await this.pdfProcessor.extractPages(file)

    onProgress?.('analyzing', `Analizando ${pages.length} paginas con IA...`)
    const result = await this.aiGenerator.generateFromPages(
      pages.map(p => ({ pageNumber: p.pageNumber, text: p.text, imageDataUrl: p.imageDataUrl }))
    )

    onProgress?.('generating', `${result.flashcards.length} flashcards generadas en ${result.categories.length} categorias`)

    const flashcardSet: FlashcardSet = {
      id: createSetId(),
      title: result.suggestedTitle,
      subtitle: result.suggestedSubtitle,
      sourceFileName: file.name,
      categories: result.categories,
      flashcards: result.flashcards,
      createdAt: new Date().toISOString(),
      totalPages: pages.length,
    }

    onProgress?.('saving', 'Guardando...')
    await this.setRepository.save(flashcardSet)

    onProgress?.('complete', 'Listo!')
    return flashcardSet
  }
}
