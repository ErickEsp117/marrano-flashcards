<script setup lang="ts">
import BaseButton from '../common/BaseButton.vue'

defineProps<{
  correct: number
  total: number
}>()

defineEmits<{
  close: []
}>()
</script>

<template>
  <div class="completion">
    <div class="completion__emoji">&#128640;</div>
    <div class="completion__title">Cuestionario completado</div>
    <div class="completion__score">
      <span class="completion__correct">{{ correct }}</span> / {{ total }} respuestas correctas
    </div>
    <div class="completion__percent">{{ Math.round((correct / total) * 100) }}%</div>
    <BaseButton label="Cerrar" variant="accent" @click="$emit('close')" />
  </div>
</template>

<style scoped>
.completion {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.completion__emoji {
  font-size: 3rem;
}

.completion__title {
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text);
}

.completion__score {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.85rem;
  color: var(--muted);
}

.completion__correct {
  color: var(--accent);
  font-weight: 700;
}

.completion__percent {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 2rem;
  font-weight: 700;
  color: var(--accent);
}
</style>
