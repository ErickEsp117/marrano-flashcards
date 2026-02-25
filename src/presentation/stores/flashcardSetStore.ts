import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { FlashcardSet } from '@/domain/entities/FlashcardSet'
import type { Flashcard } from '@/domain/entities/Flashcard'
import type { Category } from '@/domain/entities/Category'
import type { SetId } from '@/domain/value-objects/SetId'
import type { CardId } from '@/domain/value-objects/CardId'
import { useCases } from '@/di/container'

export const useFlashcardSetStore = defineStore('flashcardSet', () => {
  const currentSet = ref<FlashcardSet | null>(null)
  const allSets = ref<FlashcardSet[]>([])
  const activeFilter = ref<string>('all')
  const filteredCards = ref<Flashcard[]>([])
  const flippedCardIds = ref<Set<CardId>>(new Set())
  const isLoading = ref(false)

  const categories = computed<Category[]>(() => currentSet.value?.categories ?? [])
  const totalCards = computed(() => currentSet.value?.flashcards.length ?? 0)
  const visibleCards = computed(() => filteredCards.value.length)
  const seenCards = computed(() => {
    return filteredCards.value.filter(c => flippedCardIds.value.has(c.id)).length
  })
  const progressPercent = computed(() => {
    if (visibleCards.value === 0) return 0
    return (seenCards.value / visibleCards.value) * 100
  })

  async function loadSet(id: SetId) {
    isLoading.value = true
    try {
      currentSet.value = await useCases.getFlashcardSet().execute(id)
      applyFilter('all')
    } finally {
      isLoading.value = false
    }
  }

  function setCurrentSet(set: FlashcardSet) {
    currentSet.value = set
    applyFilter('all')
  }

  async function loadAllSets() {
    allSets.value = await useCases.getAllFlashcardSets().execute()
  }

  async function deleteSet(id: SetId) {
    await useCases.deleteFlashcardSet().execute(id)
    await loadAllSets()
  }

  function applyFilter(categoryId: string) {
    activeFilter.value = categoryId
    if (!currentSet.value) { filteredCards.value = []; return }
    filteredCards.value = useCases.filterFlashcardsByCategory()
      .execute(currentSet.value.flashcards, categoryId)
  }

  function shuffleVisible() {
    filteredCards.value = useCases.shuffleFlashcards().execute(filteredCards.value)
  }

  function toggleFlip(cardId: CardId) {
    const newSet = new Set(flippedCardIds.value)
    if (newSet.has(cardId)) {
      newSet.delete(cardId)
    } else {
      newSet.add(cardId)
    }
    flippedCardIds.value = newSet
  }

  function isCardFlipped(cardId: CardId): boolean {
    return flippedCardIds.value.has(cardId)
  }

  function resetAll() {
    flippedCardIds.value = new Set()
    if (currentSet.value) {
      applyFilter(activeFilter.value)
    }
  }

  return {
    currentSet, allSets, activeFilter, filteredCards, flippedCardIds, isLoading,
    categories, totalCards, visibleCards, seenCards, progressPercent,
    loadSet, setCurrentSet, loadAllSets, deleteSet, applyFilter, shuffleVisible,
    toggleFlip, isCardFlipped, resetAll,
  }
})
