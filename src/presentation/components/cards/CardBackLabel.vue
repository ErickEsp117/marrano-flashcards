<script setup lang="ts">
defineProps<{
  text?: string
}>()
</script>

<template>
  <div class="back-label">{{ text ?? 'Respuesta' }}</div>
</template>

<style scoped>
.back-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 0.8rem;
  opacity: 0.7;
}
</style>
