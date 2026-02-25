import { LocalStorageFlashcardSetRepository } from '@/infrastructure/persistence/LocalStorageFlashcardSetRepository'
import { PdfJsProcessorService } from '@/infrastructure/pdf/PdfJsProcessorService'
import { GeminiAiGeneratorService } from '@/infrastructure/ai/GeminiAiGeneratorService'
import { GenerateFlashcardsFromPdf } from '@/application/use-cases/GenerateFlashcardsFromPdf'
import { GetFlashcardSet } from '@/application/use-cases/GetFlashcardSet'
import { GetAllFlashcardSets } from '@/application/use-cases/GetAllFlashcardSets'
import { DeleteFlashcardSet } from '@/application/use-cases/DeleteFlashcardSet'
import { FilterFlashcardsByCategory } from '@/application/use-cases/FilterFlashcardsByCategory'
import { ShuffleFlashcards } from '@/application/use-cases/ShuffleFlashcards'
import { StartStudySession } from '@/application/use-cases/StartStudySession'
import { ScoreCard } from '@/application/use-cases/ScoreCard'
import { getStoredApiKey } from '@/infrastructure/config/api-config'

const flashcardSetRepository = new LocalStorageFlashcardSetRepository()
const pdfProcessor = new PdfJsProcessorService()

function createAiGenerator(): GeminiAiGeneratorService {
  const apiKey = getStoredApiKey()
  if (!apiKey) throw new Error('Gemini API key no configurada')
  return new GeminiAiGeneratorService(apiKey)
}

export const useCases = {
  generateFlashcardsFromPdf: () =>
    new GenerateFlashcardsFromPdf(pdfProcessor, createAiGenerator(), flashcardSetRepository),
  getFlashcardSet: () => new GetFlashcardSet(flashcardSetRepository),
  getAllFlashcardSets: () => new GetAllFlashcardSets(flashcardSetRepository),
  deleteFlashcardSet: () => new DeleteFlashcardSet(flashcardSetRepository),
  filterFlashcardsByCategory: () => new FilterFlashcardsByCategory(),
  shuffleFlashcards: () => new ShuffleFlashcards(),
  startStudySession: () => new StartStudySession(),
  scoreCard: () => new ScoreCard(),
}
