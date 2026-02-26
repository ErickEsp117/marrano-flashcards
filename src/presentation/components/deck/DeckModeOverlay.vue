<script setup lang="ts">
import { computed } from 'vue'
import type { Category } from '@/domain/entities/Category'
import { useDeckNavigation } from '@/presentation/composables/useDeckNavigation'
import { useKeyboardShortcuts } from '@/presentation/composables/useKeyboardShortcuts'
import DeckHeader from './DeckHeader.vue'
import DeckCard from './DeckCard.vue'
import DeckNavigation from './DeckNavigation.vue'
import DeckScoreButtons from './DeckScoreButtons.vue'
import DeckScoreDisplay from './DeckScoreDisplay.vue'
import DeckCompletionMessage from './DeckCompletionMessage.vue'

const props = defineProps<{
  categories: Category[]
}>()

const deck = useDeckNavigation()
useKeyboardShortcuts()

const currentCategoryName = computed(() => {
  if (!deck.currentCard.value) return ''
  const cat = props.categories.find(c => c.id === deck.currentCard.value?.categoryId)
  return cat?.name ?? ''
})
</script>

<template>
  <Teleport to="body">
    <div class="deck-mode" :class="{ active: deck.isActive.value }">
      <template v-if="deck.isActive.value">
        <DeckHeader
          :current="deck.currentIndex.value + 1"
          :total="deck.totalCards.value"
          @close="deck.close()"
        />

        <template v-if="!deck.isComplete.value && deck.currentCard.value">
          <DeckCard
            :card="deck.currentCard.value"
            :category-name="currentCategoryName"
            :is-flipped="deck.isFlipped.value"
            @flip="deck.flip()"
          />

          <DeckNavigation
            :can-go-back="deck.canGoBack.value"
            :can-go-forward="deck.canGoForward.value"
            @prev="deck.prev()"
            @next="deck.next()"
          />

          <DeckScoreButtons
            :visible="deck.isFlipped.value"
            @known="deck.scoreKnown()"
            @review="deck.scoreReview()"
          />
        </template>

        <DeckCompletionMessage
          v-else
          :known="deck.score.value.known"
          :total="deck.score.value.total"
          @close="deck.close()"
        />

        <DeckScoreDisplay
          :known="deck.score.value.known"
          :review="deck.score.value.review"
        />
      </template>
    </div>
  </Teleport>
</template>

<style scoped>
.deck-mode {
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

.deck-mode.active {
  display: flex;
}
</style>
