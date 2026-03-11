import type { PdfGeneratorService } from '@/domain/services/PdfGeneratorService'
import type { GenerateProgress } from '@/domain/services/TextGeneratorService'
import type { FlashcardSet } from '@/domain/entities/FlashcardSet'
import { httpClient } from '@/infrastructure/http/ApiHttpClient'
import { apiConfig } from '@/infrastructure/http/api-endpoints'
import { mapBackendSet, type BackendFlashcardSet } from './ApiFlashcardSetRepository'

export class ApiPdfGeneratorService implements PdfGeneratorService {
  async generateFromPdf(
    file: File,
    onProgress?: (progress: GenerateProgress) => void,
  ): Promise<FlashcardSet> {
    const formData = new FormData()
    formData.append('pdf', file)

    return new Promise<FlashcardSet>((resolve, reject) => {
      let finalSet: FlashcardSet | null = null

      httpClient
        .streamForm(
          apiConfig.endpoints.generateFromPdf,
          formData,
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
              reject(new Error(event.message ?? 'Error en la generación del PDF'))
            }
          },
        )
        .then(() => {
          if (finalSet) {
            resolve(finalSet)
          } else {
            reject(new Error('No se recibió el set completo del PDF'))
          }
        })
        .catch(reject)
    })
  }
}
