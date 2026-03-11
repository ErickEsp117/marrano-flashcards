import type { TextGeneratorService, GenerateProgress } from '@/domain/services/TextGeneratorService'
import type { FlashcardSet } from '@/domain/entities/FlashcardSet'
import { httpClient } from '@/infrastructure/http/ApiHttpClient'
import { apiConfig } from '@/infrastructure/http/api-endpoints'
import { mapBackendSet, type BackendFlashcardSet } from './ApiFlashcardSetRepository'

export class ApiTextGeneratorService implements TextGeneratorService {
  async generateFromText(
    text: string,
    onProgress?: (progress: GenerateProgress) => void,
  ): Promise<FlashcardSet> {
    return new Promise<FlashcardSet>((resolve, reject) => {
      let finalSet: FlashcardSet | null = null

      httpClient
        .stream(
          apiConfig.endpoints.generateFromText,
          { text },
          (data: unknown) => {
            const event = data as {
              type: string
              batchIndex?: number
              totalBatches?: number
              partialResult?: unknown
              flashcardSet?: BackendFlashcardSet
              message?: string
            }

            if (event.type === 'batch-complete') {
              onProgress?.({
                type: 'batch-complete',
                batchIndex: event.batchIndex,
                totalBatches: event.totalBatches,
                partialResult: event.partialResult as GenerateProgress['partialResult'],
              })
            } else if (event.type === 'complete' && event.flashcardSet) {
              finalSet = mapBackendSet(event.flashcardSet)
              onProgress?.({
                type: 'complete',
                flashcardSet: finalSet,
              })
            } else if (event.type === 'error') {
              onProgress?.({
                type: 'error',
                message: event.message,
              })
              reject(new Error(event.message ?? 'Error en la generación'))
            }
          },
        )
        .then(() => {
          if (finalSet) {
            resolve(finalSet)
          } else {
            reject(new Error('No se recibió el set completo'))
          }
        })
        .catch(reject)
    })
  }
}
