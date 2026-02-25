import { computed } from 'vue'
import { useFlashcardSetStore } from '../stores/flashcardSetStore'

export function useProgress() {
  const store = useFlashcardSetStore()

  return {
    visibleCount: computed(() => store.visibleCards),
    totalCount: computed(() => store.totalCards),
    seenCount: computed(() => store.seenCards),
    progressPercent: computed(() => store.progressPercent),
  }
}
