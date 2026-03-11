import type { QuizResultRepository } from '@/domain/repositories/QuizResultRepository'
import type { QuizResult } from '@/domain/entities/QuizResult'

export class GetQuizResults {
  constructor(private quizResultRepository: QuizResultRepository) {}

  async execute(setId?: string): Promise<QuizResult[]> {
    if (setId) {
      return this.quizResultRepository.getBySetId(setId)
    }
    return this.quizResultRepository.getAll()
  }
}
