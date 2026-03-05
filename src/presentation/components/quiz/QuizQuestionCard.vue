<script setup lang="ts">
import type { QuizQuestion } from '@/domain/entities/QuizQuestion'
import QuizOptionButton from './QuizOptionButton.vue'

const props = defineProps<{
  question: QuizQuestion
  categoryName: string
  selectedAnswer: 'A' | 'B' | 'C' | 'D' | null
}>()

defineEmits<{
  select: ['A' | 'B' | 'C' | 'D']
}>()

function optionState(label: 'A' | 'B' | 'C' | 'D'): 'default' | 'correct' | 'wrong' {
  if (!props.selectedAnswer) return 'default'
  if (label === props.question.correctOptionLabel) return 'correct'
  if (label === props.selectedAnswer && label !== props.question.correctOptionLabel) return 'wrong'
  return 'default'
}
</script>

<template>
  <div class="quiz-card">
    <div class="quiz-card__cat">{{ categoryName }}</div>
    <div class="quiz-card__question">{{ question.question }}</div>
    <div class="quiz-card__options">
      <QuizOptionButton
        v-for="opt in question.options"
        :key="opt.label"
        :label="opt.label"
        :text="opt.text"
        :state="optionState(opt.label)"
        :disabled="!!selectedAnswer"
        @click="$emit('select', opt.label)"
      />
    </div>
    <div v-if="!selectedAnswer" class="quiz-card__hint">
      Selecciona una opcion o usa las teclas A, B, C, D
    </div>
  </div>
</template>

<style scoped>
.quiz-card {
  width: min(600px, 90vw);
  background: var(--card-front);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.quiz-card__cat {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--accent);
}

.quiz-card__question {
  font-family: 'Playfair Display', serif;
  font-size: 1.15rem;
  line-height: 1.5;
  font-weight: 700;
  color: var(--text);
}

.quiz-card__options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.quiz-card__hint {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.65rem;
  color: var(--muted);
  text-align: center;
  font-style: italic;
}
</style>
