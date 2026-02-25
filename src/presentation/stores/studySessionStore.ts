import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Flashcard } from '@/domain/entities/Flashcard'
import type { StudySession } from '@/domain/entities/StudySession'
import type { StudyResultType } from '@/domain/entities/StudyResult'
import {
  getCurrentCard,
  isSessionComplete,
  getSessionScore,
} from '@/domain/entities/StudySession'
import { useCases } from '@/di/container'

export const useStudySessionStore = defineStore('studySession', () => {
  const session = ref<StudySession | null>(null)
  const isActive = ref(false)
  const _trigger = ref(0)

  const currentCard = computed(() => {
    _trigger.value
    return session.value ? getCurrentCard(session.value) : null
  })
  const isFlipped = computed(() => {
    _trigger.value
    return session.value?.isFlipped ?? false
  })
  const isComplete = computed(() => {
    _trigger.value
    return session.value ? isSessionComplete(session.value) : false
  })
  const currentIndex = computed(() => {
    _trigger.value
    return session.value?.currentIndex ?? 0
  })
  const totalCards = computed(() => session.value?.cards.length ?? 0)
  const score = computed(() => {
    _trigger.value
    return session.value ? getSessionScore(session.value) : { known: 0, review: 0, total: 0 }
  })
  const canGoBack = computed(() => currentIndex.value > 0)
  const canGoForward = computed(() => currentIndex.value < totalCards.value - 1)

  function start(flashcards: Flashcard[]) {
    session.value = useCases.startStudySession().execute(flashcards)
    isActive.value = true
    _trigger.value++
  }

  function flipCurrent() {
    if (!session.value) return
    session.value.isFlipped = !session.value.isFlipped
    _trigger.value++
  }

  function scoreCurrentCard(result: StudyResultType) {
    if (!session.value || !currentCard.value) return
    useCases.scoreCard().execute(session.value, currentCard.value.id, result)
    if (session.value.currentIndex < session.value.cards.length - 1) {
      session.value.currentIndex++
      session.value.isFlipped = false
    }
    _trigger.value++
  }

  function goNext() {
    if (!session.value || !canGoForward.value) return
    session.value.currentIndex++
    session.value.isFlipped = false
    _trigger.value++
  }

  function goPrev() {
    if (!session.value || !canGoBack.value) return
    session.value.currentIndex--
    session.value.isFlipped = false
    _trigger.value++
  }

  function close() {
    isActive.value = false
    session.value = null
    _trigger.value++
  }

  return {
    session, isActive, currentCard, isFlipped, isComplete,
    currentIndex, totalCards, score, canGoBack, canGoForward,
    start, flipCurrent, scoreCurrentCard, goNext, goPrev, close,
  }
})
