<script setup lang="ts">
import type { Flashcard } from '@/domain/entities/Flashcard'
import DeckCardFront from './DeckCardFront.vue'
import DeckCardBack from './DeckCardBack.vue'

defineProps<{
  card: Flashcard
  categoryName: string
  isFlipped: boolean
}>()

defineEmits<{
  flip: []
}>()
</script>

<template>
  <div class="deck-card" :class="{ flipped: isFlipped }" @click="$emit('flip')">
    <div class="deck-card-inner">
      <DeckCardFront :category-name="categoryName" :question="card.question" />
      <DeckCardBack :answer="card.answer" />
    </div>
  </div>
</template>

<style scoped>
.deck-card {
  width: min(560px, 90vw);
  perspective: 1200px;
}

.deck-card-inner {
  width: 100%;
  height: 320px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  cursor: pointer;
}

.deck-card.flipped .deck-card-inner {
  transform: rotateY(180deg);
}
</style>
