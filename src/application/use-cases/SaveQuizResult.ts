import type { QuizResultRepository, SaveQuizResultInput } from '@/domain/repositories/QuizResultRepository'
import type { QuizResult } from '@/domain/entities/QuizResult'

export class SaveQuizResult {
  constructor(private quizResultRepository: QuizResultRepository) {}

  async execute(input: SaveQuizResultInput): Promise<QuizResult> {
    return this.quizResultRepository.save(input)
  }
}
