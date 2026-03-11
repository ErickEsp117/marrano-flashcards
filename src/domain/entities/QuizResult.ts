export interface QuizResult {
  readonly id: string
  readonly userId: string
  readonly flashcardSetId: string
  readonly totalQuestions: number
  readonly correctAnswers: number
  readonly percentage: number
  readonly completedAt: string
}
