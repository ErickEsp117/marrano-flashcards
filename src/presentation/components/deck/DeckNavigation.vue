<script setup lang="ts">
import DeckNavButton from './DeckNavButton.vue'

defineProps<{
  canGoBack: boolean
  canGoForward: boolean
}>()

defineEmits<{
  prev: []
  next: []
}>()
</script>

<template>
  <div class="deck-nav">
    <DeckNavButton label="← Anterior" :disabled="!canGoBack" @click="$emit('prev')" />
    <DeckNavButton label="Siguiente →" :disabled="!canGoForward" @click="$emit('next')" />
  </div>
</template>

<style scoped>
.deck-nav {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  align-items: center;
}
</style>
