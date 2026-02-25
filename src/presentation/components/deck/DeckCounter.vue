<script setup lang="ts">
defineProps<{
  current: number
  total: number
}>()
</script>

<template>
  <div class="deck-counter">
    Tarjeta <span>{{ current }}</span> / <span>{{ total }}</span>
  </div>
</template>

<style scoped>
.deck-counter {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.75rem;
  color: var(--muted);
}

.deck-counter span {
  color: var(--accent);
}
</style>
