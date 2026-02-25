<script setup lang="ts">
import DeckCounter from './DeckCounter.vue'
import DeckCloseButton from './DeckCloseButton.vue'

defineProps<{
  current: number
  total: number
}>()

defineEmits<{
  close: []
}>()
</script>

<template>
  <div class="deck-header">
    <DeckCounter :current="current" :total="total" />
    <DeckCloseButton @click="$emit('close')" />
  </div>
</template>

<style scoped>
.deck-header {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: center;
}
</style>
