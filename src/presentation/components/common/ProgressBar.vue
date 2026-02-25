<script setup lang="ts">
defineProps<{
  percent: number
  width?: string
}>()
</script>

<template>
  <div class="progress-bar" :style="{ width: width ?? '200px' }">
    <div class="progress-fill" :style="{ width: percent + '%' }"></div>
  </div>
</template>

<style scoped>
.progress-bar {
  height: 3px;
  background: rgba(255,255,255,0.08);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), #00b8d9);
  border-radius: 2px;
  transition: width 0.4s ease;
}
</style>
