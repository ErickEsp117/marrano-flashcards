import type { QuizQuestion } from '@/domain/entities/QuizQuestion'
import { createQuizSession, type QuizSession } from '@/domain/entities/QuizSession'

export class StartQuizSession {
  execute(questions: QuizQuestion[]): QuizSession {
    if (questions.length === 0) {
      throw new Error('No se puede iniciar cuestionario sin preguntas')
    }
    return createQuizSession(questions)
  }
}
