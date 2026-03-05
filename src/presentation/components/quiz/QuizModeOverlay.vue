<script setup lang="ts">
import { computed } from 'vue'
import type { Category } from '@/domain/entities/Category'
import { useQuizNavigation } from '@/presentation/composables/useQuizNavigation'
import { useQuizKeyboardShortcuts } from '@/presentation/composables/useQuizKeyboardShortcuts'
import QuizHeader from './QuizHeader.vue'
import QuizQuestionCard from './QuizQuestionCard.vue'
import QuizNavigation from './QuizNavigation.vue'
import QuizCompletionMessage from './QuizCompletionMessage.vue'

const props = defineProps<{
  categories: Category[]
}>()

const quiz = useQuizNavigation()
useQuizKeyboardShortcuts()

const currentCategoryName = computed(() => {
  if (!quiz.currentQuestion.value) return ''
  const cat = props.categories.find(c => c.id === quiz.currentQuestion.value?.categoryId)
  return cat?.name ?? ''
})

const isLastQuestion = computed(() =>
  quiz.currentIndex.value === quiz.totalQuestions.value - 1
)
</script>

<template>
  <Teleport to="body">
    <div class="quiz-mode" :class="{ active: quiz.isActive.value }">
      <template v-if="quiz.isActive.value">
        <QuizHeader
          :current="quiz.currentIndex.value + 1"
          :total="quiz.totalQuestions.value"
          @close="quiz.close()"
        />

        <template v-if="!quiz.isFinished.value && quiz.currentQuestion.value">
          <QuizQuestionCard
            :key="quiz.currentQuestion.value.id"
            :question="quiz.currentQuestion.value"
            :category-name="currentCategoryName"
            :selected-answer="quiz.selectedAnswer.value"
            @select="quiz.selectAnswer"
          />

          <QuizNavigation
            :can-go-back="quiz.canGoBack.value"
            :can-go-forward="quiz.canGoForward.value"
            :is-last-question="isLastQuestion"
            :has-answered="!!quiz.selectedAnswer.value"
            @prev="quiz.prev()"
            @next="quiz.next()"
            @finish="quiz.finish()"
          />

          <div class="quiz-score-display">
            <span class="s-correct">{{ quiz.score.value.correct }}</span> correctas de {{ quiz.score.value.total }} respondidas
          </div>
        </template>

        <QuizCompletionMessage
          v-else
          :correct="quiz.score.value.correct"
          :total="quiz.score.value.total"
          @close="quiz.close()"
        />
      </template>
    </div>
  </Teleport>
</template>

<style scoped>
.quiz-mode {
  display: none;
  position: fixed;
  inset: 0;
  background: var(--deck-overlay-bg);
  z-index: 100;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.quiz-mode.active {
  display: flex;
}

.quiz-score-display {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
  color: var(--muted);
  text-align: center;
  margin-top: 0.8rem;
}

.s-correct {
  color: var(--accent);
}
</style>
