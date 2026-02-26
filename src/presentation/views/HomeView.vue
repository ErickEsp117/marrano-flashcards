<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSettingsStore } from '@/presentation/stores/settingsStore'
import { useUploadStore } from '@/presentation/stores/uploadStore'
import { usePdfUpload } from '@/presentation/composables/usePdfUpload'
import ApiKeyInput from '@/presentation/components/upload/ApiKeyInput.vue'
import PdfUploadZone from '@/presentation/components/upload/PdfUploadZone.vue'
import UploadProgress from '@/presentation/components/upload/UploadProgress.vue'
import UploadErrorMessage from '@/presentation/components/upload/UploadErrorMessage.vue'
import FloatingPigs from '@/presentation/components/common/FloatingPigs.vue'

const router = useRouter()
const settingsStore = useSettingsStore()
const uploadStore = useUploadStore()
const { isDragging, selectedFile, validationError, handleFile, handleDrop, handleDragOver, handleDragLeave } = usePdfUpload()

async function onFileSelected(file: File) {
  handleFile(file)
  if (validationError.value) return
  try {
    const set = await uploadStore.processFile(file)
    router.push({ name: 'flashcard-set', params: { id: set.id } })
  } catch {
    // Error is handled in uploadStore
  }
}

function onDrop(event: DragEvent) {
  handleDrop(event)
  if (selectedFile.value) {
    onFileSelected(selectedFile.value)
  }
}

function onRetry() {
  uploadStore.reset()
}
</script>

<template>
  <FloatingPigs />
  <div class="home">
    <header class="home-header">
      <h1 class="home-title">
        Marrano <span>Flashcards</span>
      </h1>
      <p class="home-subtitle">Genera flashcards inteligentes desde cualquier PDF</p>
    </header>

    <div class="home-content">
      <ApiKeyInput
        :model-value="settingsStore.apiKey"
        :has-key="settingsStore.hasApiKey"
        @update:model-value="settingsStore.apiKey = $event"
        @save="settingsStore.saveApiKey(settingsStore.apiKey)"
        @clear="settingsStore.removeApiKey()"
      />

      <div v-if="validationError" class="validation-error">{{ validationError }}</div>

      <template v-if="!uploadStore.isUploading && uploadStore.currentStage !== 'error'">
        <PdfUploadZone
          :is-dragging="isDragging"
          :disabled="!settingsStore.hasApiKey"
          @file-selected="onFileSelected"
          @drag-over="handleDragOver"
          @drag-leave="handleDragLeave"
          @drop="onDrop"
        />
        <p v-if="!settingsStore.hasApiKey" class="key-hint">
          Ingresa tu API key de DeepSeek para comenzar
        </p>
      </template>

      <UploadProgress
        v-if="uploadStore.currentStage && uploadStore.currentStage !== 'error'"
        :stage="uploadStore.currentStage"
        :detail="uploadStore.stageDetail"
      />

      <UploadErrorMessage
        v-if="uploadStore.error"
        :message="uploadStore.error"
        @retry="onRetry"
      />
    </div>
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.home-header {
  padding: 4rem 2rem 2rem;
  text-align: center;
}

.home-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 900;
  line-height: 1.1;
  color: var(--text);
  margin-bottom: 0.5rem;
}

.home-title span {
  color: var(--accent);
}

.home-subtitle {
  font-size: 0.9rem;
  color: var(--muted);
  font-style: italic;
}

.home-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  width: 100%;
}

.validation-error {
  font-size: 0.8rem;
  color: var(--accent2);
  font-family: 'IBM Plex Mono', monospace;
}

.key-hint {
  font-size: 0.75rem;
  color: var(--muted);
  font-style: italic;
}
</style>
