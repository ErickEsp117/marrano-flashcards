<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>

<template>
  <span class="tag-label">{{ text }}</span>
</template>

<style scoped>
.tag-label {
  display: inline-block;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--accent);
  border: 1px solid var(--accent);
  padding: 0.3rem 0.8rem;
  border-radius: 2px;
}
</style>
