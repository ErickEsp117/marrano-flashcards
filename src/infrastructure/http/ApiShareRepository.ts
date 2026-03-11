import type { ShareRepository, ShareInfo } from '@/domain/repositories/ShareRepository'
import type { FlashcardSet } from '@/domain/entities/FlashcardSet'
import { httpClient } from '@/infrastructure/http/ApiHttpClient'
import { apiConfig } from '@/infrastructure/http/api-endpoints'
import { mapBackendSet, type BackendFlashcardSet } from './ApiFlashcardSetRepository'

export class ApiShareRepository implements ShareRepository {
  async generateShareToken(setId: string): Promise<ShareInfo> {
    return httpClient.post<ShareInfo>(apiConfig.endpoints.share(setId))
  }

  async revokeShareToken(setId: string): Promise<void> {
    await httpClient.delete(apiConfig.endpoints.share(setId))
  }

  async getSharedSet(token: string): Promise<FlashcardSet> {
    const raw = await httpClient.get<BackendFlashcardSet>(
      apiConfig.endpoints.sharedSet(token),
      false,
    )
    return mapBackendSet(raw)
  }
}
