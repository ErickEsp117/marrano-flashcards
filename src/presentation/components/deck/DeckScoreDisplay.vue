<script setup lang="ts">
defineProps<{
  known: number
  review: number
}>()
</script>

<template>
  <div class="score-display">
    <span class="s-yes">{{ known }}</span> correctas &nbsp;|&nbsp;
    <span class="s-no">{{ review }}</span> a repasar
  </div>
</template>

<style scoped>
.score-display {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
  color: var(--muted);
  text-align: center;
  margin-top: 0.8rem;
}

.s-yes { color: var(--accent); }
.s-no { color: var(--accent2); }
</style>
