import type { QuizResult } from '../entities/QuizResult'

export interface SaveQuizResultInput {
  flashcardSetId: string
  totalQuestions: number
  correctAnswers: number
}

export interface QuizResultRepository {
  save(input: SaveQuizResultInput): Promise<QuizResult>
  getAll(): Promise<QuizResult[]>
  getBySetId(setId: string): Promise<QuizResult[]>
}
