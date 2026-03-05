import { computed } from 'vue'
import { useQuizSessionStore } from '../stores/quizSessionStore'
import type { QuizQuestion } from '@/domain/entities/QuizQuestion'

export function useQuizNavigation() {
  const store = useQuizSessionStore()

  function open(questions: QuizQuestion[]) {
    store.start(questions)
  }

  return {
    isActive: computed(() => store.isActive),
    currentQuestion: computed(() => store.currentQuestion),
    currentIndex: computed(() => store.currentIndex),
    totalQuestions: computed(() => store.totalQuestions),
    score: computed(() => store.score),
    canGoBack: computed(() => store.canGoBack),
    canGoForward: computed(() => store.canGoForward),
    isComplete: computed(() => store.isComplete),
    isFinished: computed(() => store.isFinished),
    selectedAnswer: computed(() => store.selectedAnswer),
    open,
    close: () => store.close(),
    selectAnswer: (label: 'A' | 'B' | 'C' | 'D') => store.selectAnswer(label),
    next: () => store.goNext(),
    prev: () => store.goPrev(),
    finish: () => store.finish(),
  }
}
