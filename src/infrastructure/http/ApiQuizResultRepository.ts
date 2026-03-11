import type { QuizResultRepository, SaveQuizResultInput } from '@/domain/repositories/QuizResultRepository'
import type { QuizResult } from '@/domain/entities/QuizResult'
import { httpClient } from '@/infrastructure/http/ApiHttpClient'
import { apiConfig } from '@/infrastructure/http/api-endpoints'

export class ApiQuizResultRepository implements QuizResultRepository {
  async save(input: SaveQuizResultInput): Promise<QuizResult> {
    return httpClient.post<QuizResult>(apiConfig.endpoints.quizResults, input)
  }

  async getAll(): Promise<QuizResult[]> {
    return httpClient.get<QuizResult[]>(apiConfig.endpoints.quizResults)
  }

  async getBySetId(setId: string): Promise<QuizResult[]> {
    return httpClient.get<QuizResult[]>(apiConfig.endpoints.quizResultsBySet(setId))
  }
}
