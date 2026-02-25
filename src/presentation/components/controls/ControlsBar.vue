<script setup lang="ts">
import ProgressInfo from './ProgressInfo.vue'
import ProgressTracker from './ProgressTracker.vue'
import BaseButton from '../common/BaseButton.vue'

defineProps<{
  visibleCount: number
  totalCount: number
  seenCount: number
  progressPercent: number
}>()

defineEmits<{
  reset: []
  shuffle: []
  studyMode: []
}>()
</script>

<template>
  <div class="controls-bar">
    <div>
      <ProgressInfo :visible="visibleCount" :total="totalCount" />
      <ProgressTracker :percent="progressPercent" :seen-count="seenCount" />
    </div>
    <div class="btn-group">
      <BaseButton label="&#8634; Reiniciar" @click="$emit('reset')" />
      <BaseButton label="&#8644; Mezclar" @click="$emit('shuffle')" />
      <BaseButton label="&#9654; Modo estudio" variant="accent" @click="$emit('studyMode')" />
    </div>
  </div>
</template>

<style scoped>
.controls-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  position: relative;
  z-index: 10;
  flex-wrap: wrap;
  gap: 1rem;
}

.btn-group {
  display: flex;
  gap: 0.5rem;
}

@media (max-width: 600px) {
  .controls-bar {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
