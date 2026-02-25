import { computed } from 'vue'
import { useStudySessionStore } from '../stores/studySessionStore'
import type { Flashcard } from '@/domain/entities/Flashcard'

export function useDeckNavigation() {
  const store = useStudySessionStore()

  function open(flashcards: Flashcard[]) {
    store.start(flashcards)
  }

  return {
    isActive: computed(() => store.isActive),
    currentCard: computed(() => store.currentCard),
    isFlipped: computed(() => store.isFlipped),
    currentIndex: computed(() => store.currentIndex),
    totalCards: computed(() => store.totalCards),
    score: computed(() => store.score),
    canGoBack: computed(() => store.canGoBack),
    canGoForward: computed(() => store.canGoForward),
    isComplete: computed(() => store.isComplete),
    open,
    close: () => store.close(),
    flip: () => store.flipCurrent(),
    next: () => store.goNext(),
    prev: () => store.goPrev(),
    scoreKnown: () => store.scoreCurrentCard('known'),
    scoreReview: () => store.scoreCurrentCard('review'),
  }
}
