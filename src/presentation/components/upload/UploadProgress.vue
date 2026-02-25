<script setup lang="ts">
import type { GenerationStage } from '@/application/use-cases/GenerateFlashcardsFromPdf'
import LoadingSpinner from '../common/LoadingSpinner.vue'

defineProps<{
  stage: GenerationStage | null
  detail: string
}>()

const stageLabels: Record<string, string> = {
  extracting: 'Extrayendo PDF...',
  analyzing: 'Analizando con IA...',
  generating: 'Generando flashcards...',
  saving: 'Guardando...',
  complete: 'Completado!',
  error: 'Error',
}
</script>

<template>
  <div v-if="stage" class="upload-progress">
    <LoadingSpinner v-if="stage !== 'complete' && stage !== 'error'" size="md" />
    <div v-else-if="stage === 'complete'" class="upload-progress__check">&#10003;</div>
    <div v-else class="upload-progress__error">&#10007;</div>
    <div class="upload-progress__info">
      <div class="upload-progress__stage">{{ stageLabels[stage] ?? stage }}</div>
      <div class="upload-progress__detail">{{ detail }}</div>
    </div>
  </div>
</template>

<style scoped>
.upload-progress {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
}

.upload-progress__check {
  font-size: 1.5rem;
  color: var(--accent);
}

.upload-progress__error {
  font-size: 1.5rem;
  color: var(--accent2);
}

.upload-progress__stage {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.8rem;
  color: var(--text);
  font-weight: 600;
}

.upload-progress__detail {
  font-size: 0.75rem;
  color: var(--muted);
  margin-top: 0.2rem;
}
</style>
