import { useFlashcardSetStore } from '../stores/flashcardSetStore'
import type { CardId } from '@/domain/value-objects/CardId'

export function useCardFlip() {
  const store = useFlashcardSetStore()

  function toggle(cardId: CardId) {
    store.toggleFlip(cardId)
  }

  function isFlipped(cardId: CardId): boolean {
    return store.isCardFlipped(cardId)
  }

  return { toggle, isFlipped }
}
