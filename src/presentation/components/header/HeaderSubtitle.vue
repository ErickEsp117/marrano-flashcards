<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>

<template>
  <p class="subtitle">{{ text }}</p>
</template>

<style scoped>
.subtitle {
  font-size: 0.85rem;
  color: var(--muted);
  font-style: italic;
}
</style>
