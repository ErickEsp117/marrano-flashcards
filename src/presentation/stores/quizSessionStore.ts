import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { QuizQuestion } from '@/domain/entities/QuizQuestion'
import type { QuizSession } from '@/domain/entities/QuizSession'
import {
  getCurrentQuestion,
  isQuizComplete,
  getQuizScore,
} from '@/domain/entities/QuizSession'
import { useCases } from '@/di/container'

export const useQuizSessionStore = defineStore('quizSession', () => {
  const session = ref<QuizSession | null>(null)
  const isActive = ref(false)
  const _trigger = ref(0)

  const currentQuestion = computed(() => {
    _trigger.value
    return session.value ? getCurrentQuestion(session.value) : null
  })
  const isComplete = computed(() => {
    _trigger.value
    return session.value ? isQuizComplete(session.value) : false
  })
  const currentIndex = computed(() => {
    _trigger.value
    return session.value?.currentIndex ?? 0
  })
  const totalQuestions = computed(() => session.value?.questions.length ?? 0)
  const score = computed(() => {
    _trigger.value
    return session.value ? getQuizScore(session.value) : { correct: 0, total: 0 }
  })
  const canGoBack = computed(() => currentIndex.value > 0)
  const canGoForward = computed(() => currentIndex.value < totalQuestions.value - 1)

  const selectedAnswer = computed(() => {
    _trigger.value
    if (!session.value || !currentQuestion.value) return null
    return session.value.answers.get(currentQuestion.value.id) ?? null
  })

  const isFinished = computed(() => {
    _trigger.value
    return session.value?.isCompleted ?? false
  })

  function start(questions: QuizQuestion[]) {
    session.value = useCases.startQuizSession().execute(questions)
    isActive.value = true
    _trigger.value++
  }

  function selectAnswer(label: 'A' | 'B' | 'C' | 'D') {
    if (!session.value || !currentQuestion.value) return
    if (session.value.answers.has(currentQuestion.value.id)) return
    useCases.answerQuizQuestion().execute(session.value, currentQuestion.value.id, label)
    _trigger.value++
  }

  function goNext() {
    if (!session.value || !canGoForward.value) return
    session.value.currentIndex++
    _trigger.value++
  }

  function goPrev() {
    if (!session.value || !canGoBack.value) return
    session.value.currentIndex--
    _trigger.value++
  }

  function finish() {
    if (!session.value) return
    session.value.isCompleted = true
    _trigger.value++
  }

  function close() {
    isActive.value = false
    session.value = null
    _trigger.value++
  }

  return {
    session, isActive, currentQuestion, isComplete, isFinished,
    currentIndex, totalQuestions, score, canGoBack, canGoForward,
    selectedAnswer,
    start, selectAnswer, goNext, goPrev, finish, close,
  }
})
