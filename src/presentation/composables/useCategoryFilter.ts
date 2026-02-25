import { computed } from 'vue'
import { useFlashcardSetStore } from '../stores/flashcardSetStore'

export function useCategoryFilter() {
  const store = useFlashcardSetStore()

  const categories = computed(() => store.categories)
  const activeFilter = computed(() => store.activeFilter)

  function filter(categoryId: string) {
    store.applyFilter(categoryId)
  }

  function isActive(categoryId: string): boolean {
    return store.activeFilter === categoryId
  }

  return { categories, activeFilter, filter, isActive }
}
