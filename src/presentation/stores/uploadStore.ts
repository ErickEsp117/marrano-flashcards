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
  /** True while background batches are still being generated after navigation */
  const isGeneratingMore = ref(false)
  /** Total batches expected */
  const totalBatches = ref(0)
  /** Batches completed so far */
  const completedBatches = ref(0)

  async function processFile(
    file: File,
    callbacks?: {
      onFirstBatchReady?: (set: FlashcardSet) => void
      onBatchUpdate?: (set: FlashcardSet) => void
    },
  ): Promise<FlashcardSet> {
    isUploading.value = true
    isGeneratingMore.value = false
    error.value = null
    currentStage.value = null
    totalBatches.value = 0
    completedBatches.value = 0

    try {
      const useCase = useCases.generateFlashcardsFromPdf()
      const set = await useCase.execute({
        file,
        onProgress: (stage, detail) => {
          currentStage.value = stage
          stageDetail.value = detail
        },
        onFirstBatchReady: (set) => {
          generatedSet.value = set
          isGeneratingMore.value = true
          completedBatches.value = 1
          callbacks?.onFirstBatchReady?.(set)
        },
        onBatchUpdate: (set) => {
          generatedSet.value = set
          completedBatches.value++
          callbacks?.onBatchUpdate?.(set)
        },
      })
      generatedSet.value = set
      isGeneratingMore.value = false
      return set
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Error desconocido'
      error.value = message
      currentStage.value = 'error'
      isGeneratingMore.value = false
      throw e
    } finally {
      isUploading.value = false
    }
  }

  function reset() {
    isUploading.value = false
    isGeneratingMore.value = false
    currentStage.value = null
    stageDetail.value = ''
    error.value = null
    generatedSet.value = null
    totalBatches.value = 0
    completedBatches.value = 0
  }

  return {
    isUploading, currentStage, stageDetail, error, generatedSet,
    isGeneratingMore, totalBatches, completedBatches,
    processFile, reset,
  }
})
