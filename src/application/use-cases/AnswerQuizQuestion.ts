import type { QuizSession } from '@/domain/entities/QuizSession'
import type { QuestionId } from '@/domain/value-objects/QuestionId'
import { answerQuestion } from '@/domain/entities/QuizSession'

export class AnswerQuizQuestion {
  execute(
    session: QuizSession,
    questionId: QuestionId,
    selectedLabel: 'A' | 'B' | 'C' | 'D',
  ): QuizSession {
    answerQuestion(session, questionId, selectedLabel)
    return session
  }
}
