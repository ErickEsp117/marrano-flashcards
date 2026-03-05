import type { QuestionId } from '../value-objects/QuestionId'

export interface QuizOption {
  readonly label: 'A' | 'B' | 'C' | 'D'
  readonly text: string
}

export interface QuizQuestion {
  readonly id: QuestionId
  readonly question: string
  readonly options: [QuizOption, QuizOption, QuizOption, QuizOption]
  readonly correctOptionLabel: 'A' | 'B' | 'C' | 'D'
  readonly categoryId: string
  readonly sourcePageNumber: number
}
