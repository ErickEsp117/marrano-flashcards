<script setup lang="ts">
defineProps<{
  name: string
  color: string
}>()
</script>

<template>
  <div class="card-category" :style="{ color }">{{ name }}</div>
</template>

<style scoped>
.card-category {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 0.8rem;
  opacity: 0.6;
}
</style>
