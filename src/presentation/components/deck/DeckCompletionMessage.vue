<script setup lang="ts">
import BaseButton from '../common/BaseButton.vue'

defineProps<{
  known: number
  total: number
}>()

defineEmits<{
  close: []
}>()
</script>

<template>
  <div class="completion">
    <div class="completion__emoji">&#127881;</div>
    <div class="completion__text">Completado! {{ known }}/{{ total }} correctas</div>
    <BaseButton label="Cerrar" variant="accent" @click="$emit('close')" />
  </div>
</template>

<style scoped>
.completion {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.completion__emoji {
  font-size: 3rem;
}

.completion__text {
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text);
}
</style>
