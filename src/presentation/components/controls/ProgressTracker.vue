<script setup lang="ts">
import ProgressBar from '../common/ProgressBar.vue'

defineProps<{
  percent: number
  seenCount: number
}>()
</script>

<template>
  <div class="progress-tracker">
    <ProgressBar :percent="percent" />
    <span class="seen-label">{{ seenCount }} vistas</span>
  </div>
</template>

<style scoped>
.progress-tracker {
  margin-top: 0.4rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.seen-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.65rem;
  color: var(--muted);
}
</style>
