<script setup lang="ts">
import { computed } from 'vue'
import type { Flashcard } from '@/domain/entities/Flashcard'
import type { Category } from '@/domain/entities/Category'
import type { CardId } from '@/domain/value-objects/CardId'
import FlashcardItem from './FlashcardItem.vue'

const props = defineProps<{
  cards: Flashcard[]
  categories: Category[]
  flippedCardIds: Set<CardId>
}>()

defineEmits<{
  cardFlip: [cardId: CardId]
}>()

const categoryMap = computed(() => {
  const map = new Map<string, Category>()
  for (const cat of props.categories) {
    map.set(cat.id, cat)
  }
  return map
})

function getCategory(categoryId: string): Category {
  return categoryMap.value.get(categoryId) ?? {
    id: categoryId,
    name: categoryId,
    color: { primary: '#6b7a99', gradient: 'linear-gradient(90deg, #6b7a99, #4a5568)', border: 'rgba(107,122,153,0.2)' },
  }
}
</script>

<template>
  <div class="flashcard-grid">
    <FlashcardItem
      v-for="(card, index) in cards"
      :key="card.id"
      :card="card"
      :category="getCategory(card.categoryId)"
      :is-flipped="flippedCardIds.has(card.id)"
      :animation-delay="Math.min(index * 0.02, 0.12)"
      @flip="$emit('cardFlip', card.id)"
    />
  </div>
</template>

<style scoped>
.flashcard-grid {
  position: relative;
  z-index: 10;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem 2rem 4rem;
  max-width: 1400px;
  margin: 0 auto;
}

@media (max-width: 600px) {
  .flashcard-grid {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
}
</style>
