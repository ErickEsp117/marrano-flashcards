<script setup lang="ts">
defineProps<{
  visible: number
  total: number
}>()
</script>

<template>
  <div class="progress-info">
    Tarjetas visibles: <span>{{ visible }}</span> / <span>{{ total }}</span>
  </div>
</template>

<style scoped>
.progress-info {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.75rem;
  color: var(--muted);
}

.progress-info span {
  color: var(--accent);
  font-weight: 600;
}
</style>
