import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { GenerationStage } from '@/application/use-cases/GenerateFlashcardsFromPdf'
import type { FlashcardSet } from '@/domain/entities/FlashcardSet'
import { useCases } from '@/di/container'

export const useUploadStore = defineStore('upload', () => {
  const isUploading = ref(false)
  const currentStage = ref<GenerationStage | null>(null)
  const stageDetail = ref('')
  const error = ref<string | null>(null)
  const generatedSet = ref<FlashcardSet | null>(null)

  async function processFile(file: File): Promise<FlashcardSet> {
    isUploading.value = true
    error.value = null
    currentStage.value = null

    try {
      const useCase = useCases.generateFlashcardsFromPdf()
      const set = await useCase.execute({
        file,
        onProgress: (stage, detail) => {
          currentStage.value = stage
          stageDetail.value = detail
        },
      })
      generatedSet.value = set
      return set
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Error desconocido'
      error.value = message
      currentStage.value = 'error'
      throw e
    } finally {
      isUploading.value = false
    }
  }

  function reset() {
    isUploading.value = false
    currentStage.value = null
    stageDetail.value = ''
    error.value = null
    generatedSet.value = null
  }

  return {
    isUploading, currentStage, stageDetail, error, generatedSet,
    processFile, reset,
  }
})
