import type { PdfProcessorService } from '@/domain/services/PdfProcessorService'
import type { AiGeneratorService } from '@/domain/services/AiGeneratorService'
import type { FlashcardSetRepository } from '@/domain/repositories/FlashcardSetRepository'
import type { FlashcardSet } from '@/domain/entities/FlashcardSet'
import type { Flashcard } from '@/domain/entities/Flashcard'
import type { Category } from '@/domain/entities/Category'
import type { QuizQuestion } from '@/domain/entities/QuizQuestion'
import { createSetId } from '@/domain/value-objects/SetId'

const BATCH_SIZE = 3

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

    const pageCount = await this.pdfProcessor.getPageCount(file)
    if (pageCount > 15) {
      throw new Error(`El PDF tiene ${pageCount} páginas. El límite es 15 páginas por documento.`)
    }

    onProgress?.('extracting', `Extrayendo texto de ${file.name}...`)
    const pages = await this.pdfProcessor.extractPages(file)

    // Split pages into batches of BATCH_SIZE to avoid hitting AI output token limits
    const batches: (typeof pages)[] = []
    for (let i = 0; i < pages.length; i += BATCH_SIZE) {
      batches.push(pages.slice(i, i + BATCH_SIZE))
    }

    let allFlashcards: Flashcard[] = []
    let allCategories: Category[] = []
    let allQuizQuestions: QuizQuestion[] = []
    let suggestedTitle = ''
    let suggestedSubtitle = ''

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i]!
      const startPage = batch[0]!.pageNumber
      const endPage = batch[batch.length - 1]!.pageNumber
      onProgress?.(
        'analyzing',
        `Analizando páginas ${startPage}–${endPage} (lote ${i + 1} de ${batches.length})...`,
      )

      const result = await this.aiGenerator.generateFromPages(
        batch.map(p => ({ pageNumber: p.pageNumber, text: p.text })),
        allCategories,
      )

      if (i === 0) {
        suggestedTitle = result.suggestedTitle
        suggestedSubtitle = result.suggestedSubtitle
      }

      // Merge categories: only add categories not seen yet
      for (const cat of result.categories) {
        if (!allCategories.find(c => c.id === cat.id)) {
          allCategories.push(cat)
        }
      }

      allFlashcards = [...allFlashcards, ...result.flashcards]
      allQuizQuestions = [...allQuizQuestions, ...result.quizQuestions]
    }

    onProgress?.('generating', `${allFlashcards.length} flashcards + ${allQuizQuestions.length} preguntas de quiz en ${allCategories.length} categorías`)

    const flashcardSet: FlashcardSet = {
      id: createSetId(),
      title: suggestedTitle,
      subtitle: suggestedSubtitle,
      sourceFileName: file.name,
      categories: allCategories,
      flashcards: allFlashcards,
      quizQuestions: allQuizQuestions,
      createdAt: new Date().toISOString(),
      totalPages: pages.length,
    }

    onProgress?.('saving', 'Guardando...')
    await this.setRepository.save(flashcardSet)

    onProgress?.('complete', 'Listo!')
    return flashcardSet
  }
}
