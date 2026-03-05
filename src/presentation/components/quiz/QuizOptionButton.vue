<script setup lang="ts">
defineProps<{
  label: 'A' | 'B' | 'C' | 'D'
  text: string
  state: 'default' | 'correct' | 'wrong'
  disabled: boolean
}>()

defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    class="quiz-option"
    :class="[`quiz-option--${state}`]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <span class="quiz-option__label">{{ label }})</span>
    <span class="quiz-option__text">{{ text }}</span>
  </button>
</template>

<style scoped>
.quiz-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--quiz-option-border);
  background: var(--quiz-option-bg);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.quiz-option:hover:not(:disabled):not(.quiz-option--correct):not(.quiz-option--wrong) {
  background: var(--quiz-option-hover);
  border-color: var(--accent);
}

.quiz-option:disabled {
  cursor: default;
}

.quiz-option--correct {
  background: var(--quiz-correct-bg);
  border-color: var(--quiz-correct-border);
}

.quiz-option--wrong {
  background: var(--quiz-wrong-bg);
  border-color: var(--quiz-wrong-border);
}

.quiz-option__label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--accent);
  min-width: 1.5rem;
}

.quiz-option--correct .quiz-option__label {
  color: var(--accent);
}

.quiz-option--wrong .quiz-option__label {
  color: var(--accent2);
}

.quiz-option__text {
  font-family: 'IBM Plex Sans', system-ui, sans-serif;
  font-size: 0.88rem;
  color: var(--text);
  line-height: 1.4;
}
</style>
