// import { LocalStorageFlashcardSetRepository } from '@/infrastructure/persistence/LocalStorageFlashcardSetRepository'
import { ApiPdfGeneratorService } from '@/infrastructure/http/ApiPdfGeneratorService'
import { GenerateFlashcardsFromPdf } from '@/application/use-cases/GenerateFlashcardsFromPdf'
import { GetFlashcardSet } from '@/application/use-cases/GetFlashcardSet'
import { GetAllFlashcardSets } from '@/application/use-cases/GetAllFlashcardSets'
import { DeleteFlashcardSet } from '@/application/use-cases/DeleteFlashcardSet'
import { FilterFlashcardsByCategory } from '@/application/use-cases/FilterFlashcardsByCategory'
import { ShuffleFlashcards } from '@/application/use-cases/ShuffleFlashcards'
import { StartStudySession } from '@/application/use-cases/StartStudySession'
import { ScoreCard } from '@/application/use-cases/ScoreCard'
import { StartQuizSession } from '@/application/use-cases/StartQuizSession'
import { AnswerQuizQuestion } from '@/application/use-cases/AnswerQuizQuestion'

// API repositories
import { ApiAuthRepository } from '@/infrastructure/http/ApiAuthRepository'
import { ApiFlashcardSetRepository } from '@/infrastructure/http/ApiFlashcardSetRepository'
import { ApiQuizResultRepository } from '@/infrastructure/http/ApiQuizResultRepository'
import { ApiShareRepository } from '@/infrastructure/http/ApiShareRepository'
import { ApiTextGeneratorService } from '@/infrastructure/http/ApiTextGeneratorService'

// Auth use cases
import { RegisterUser } from '@/application/use-cases/auth/RegisterUser'
import { LoginUser } from '@/application/use-cases/auth/LoginUser'
import { GetCurrentUser } from '@/application/use-cases/auth/GetCurrentUser'
import { LogoutUser } from '@/application/use-cases/auth/LogoutUser'

// API use cases
import { GenerateFlashcardsFromText } from '@/application/use-cases/GenerateFlashcardsFromText'
import { SaveQuizResult } from '@/application/use-cases/SaveQuizResult'
import { GetQuizResults } from '@/application/use-cases/GetQuizResults'
import { ShareFlashcardSet } from '@/application/use-cases/ShareFlashcardSet'
import { GetSharedFlashcardSet } from '@/application/use-cases/GetSharedFlashcardSet'

// API repositories (backend)
const authRepository = new ApiAuthRepository()
const apiFlashcardSetRepository = new ApiFlashcardSetRepository()
const quizResultRepository = new ApiQuizResultRepository()
const shareRepository = new ApiShareRepository()
const textGeneratorService = new ApiTextGeneratorService()
const pdfGeneratorService = new ApiPdfGeneratorService()

export const useCases = {
  // PDF generation (backend processes PDF via SSE)
  generateFlashcardsFromPdf: () => new GenerateFlashcardsFromPdf(pdfGeneratorService),

  // Flashcard set management (now uses API)
  getFlashcardSet: () => new GetFlashcardSet(apiFlashcardSetRepository),
  getAllFlashcardSets: () => new GetAllFlashcardSets(apiFlashcardSetRepository),
  deleteFlashcardSet: () => new DeleteFlashcardSet(apiFlashcardSetRepository),

  // Local-only operations
  filterFlashcardsByCategory: () => new FilterFlashcardsByCategory(),
  shuffleFlashcards: () => new ShuffleFlashcards(),
  startStudySession: () => new StartStudySession(),
  scoreCard: () => new ScoreCard(),
  startQuizSession: () => new StartQuizSession(),
  answerQuizQuestion: () => new AnswerQuizQuestion(),

  // Auth
  registerUser: () => new RegisterUser(authRepository),
  loginUser: () => new LoginUser(authRepository),
  getCurrentUser: () => new GetCurrentUser(authRepository),
  logoutUser: () => new LogoutUser(authRepository),

  // Backend generation (SSE)
  generateFlashcardsFromText: () => new GenerateFlashcardsFromText(textGeneratorService),

  // Quiz results
  saveQuizResult: () => new SaveQuizResult(quizResultRepository),
  getQuizResults: () => new GetQuizResults(quizResultRepository),

  // Share
  shareFlashcardSet: () => new ShareFlashcardSet(shareRepository),
  getSharedFlashcardSet: () => new GetSharedFlashcardSet(shareRepository),
}
