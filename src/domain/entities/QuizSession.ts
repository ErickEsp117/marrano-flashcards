import type { QuestionId } from '../value-objects/QuestionId'
import type { QuizQuestion } from './QuizQuestion'

export interface QuizSession {
  readonly questions: QuizQuestion[]
  currentIndex: number
  answers: Map<QuestionId, 'A' | 'B' | 'C' | 'D'>
  isCompleted: boolean
}

export function createQuizSession(questions: QuizQuestion[]): QuizSession {
  return {
    questions: [...questions],
    currentIndex: 0,
    answers: new Map(),
    isCompleted: false,
  }
}

export function getCurrentQuestion(session: QuizSession): QuizQuestion | null {
  return session.questions[session.currentIndex] ?? null
}

export function answerQuestion(
  session: QuizSession,
  questionId: QuestionId,
  selectedLabel: 'A' | 'B' | 'C' | 'D',
): void {
  session.answers.set(questionId, selectedLabel)
}

export function isQuizComplete(session: QuizSession): boolean {
  return session.answers.size >= session.questions.length
}

export function getQuizScore(session: QuizSession): { correct: number; total: number } {
  let correct = 0
  for (const q of session.questions) {
    if (session.answers.get(q.id) === q.correctOptionLabel) {
      correct++
    }
  }
  return { correct, total: session.questions.length }
}
