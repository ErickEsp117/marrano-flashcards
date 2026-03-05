<script setup lang="ts">
import DeckCounter from '../deck/DeckCounter.vue'
import IconButton from '../common/IconButton.vue'

defineProps<{
  current: number
  total: number
}>()

defineEmits<{
  close: []
}>()
</script>

<template>
  <div class="quiz-header">
    <DeckCounter :current="current" :total="total" />
    <IconButton icon="✕" ariaLabel="Cerrar cuestionario" @click="$emit('close')" />
  </div>
</template>

<style scoped>
.quiz-header {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: center;
}
</style>
