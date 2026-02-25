<script setup lang="ts">
defineProps<{
  text?: string
}>()
</script>

<template>
  <div class="card-hint">{{ text ?? 'Clic para respuesta' }}</div>
</template>

<style scoped>
.card-hint {
  font-size: 0.7rem;
  color: var(--muted);
  font-style: italic;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.card-hint::before {
  content: '\21BB';
  font-style: normal;
  opacity: 0.5;
}
</style>
