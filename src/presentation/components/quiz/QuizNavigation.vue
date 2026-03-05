<script setup lang="ts">
import DeckNavButton from '../deck/DeckNavButton.vue'
import BaseButton from '../common/BaseButton.vue'

defineProps<{
  canGoBack: boolean
  canGoForward: boolean
  isLastQuestion: boolean
  hasAnswered: boolean
}>()

defineEmits<{
  prev: []
  next: []
  finish: []
}>()
</script>

<template>
  <div class="quiz-nav">
    <DeckNavButton label="← Anterior" :disabled="!canGoBack" @click="$emit('prev')" />
    <DeckNavButton v-if="!isLastQuestion" label="Siguiente →" :disabled="!canGoForward" @click="$emit('next')" />
    <BaseButton
      v-if="isLastQuestion && hasAnswered"
      label="Finalizar"
      variant="accent"
      @click="$emit('finish')"
    />
  </div>
</template>

<style scoped>
.quiz-nav {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  align-items: center;
}
</style>
