<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '@/presentation/stores/settingsStore'
import { useUploadStore } from '@/presentation/stores/uploadStore'
import { useFlashcardSetStore } from '@/presentation/stores/flashcardSetStore'
import { usePdfUpload } from '@/presentation/composables/usePdfUpload'
import ApiKeyInput from '@/presentation/components/upload/ApiKeyInput.vue'
import PdfUploadZone from '@/presentation/components/upload/PdfUploadZone.vue'
import UploadProgress from '@/presentation/components/upload/UploadProgress.vue'
import UploadErrorMessage from '@/presentation/components/upload/UploadErrorMessage.vue'
import type { SetId } from '@/domain/value-objects/SetId'

const router = useRouter()
const settingsStore = useSettingsStore()
const uploadStore = useUploadStore()
const flashcardSetStore = useFlashcardSetStore()
const { isDragging, selectedFile, validationError, handleFile, handleDrop, handleDragOver, handleDragLeave } = usePdfUpload()

onMounted(async () => {
  await flashcardSetStore.loadAllSets()
})

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

function openSet(id: SetId) {
  router.push({ name: 'flashcard-set', params: { id } })
}

async function deleteSet(id: SetId) {
  await flashcardSetStore.deleteSet(id)
}
</script>

<template>
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
          Ingresa tu API key de Gemini para comenzar
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

    <div v-if="flashcardSetStore.allSets.length > 0" class="saved-sets">
      <h2 class="saved-sets__title">Sets guardados</h2>
      <div class="saved-sets__grid">
        <div
          v-for="set in flashcardSetStore.allSets"
          :key="set.id"
          class="set-card"
          @click="openSet(set.id)"
        >
          <div class="set-card__tag">{{ set.subtitle }}</div>
          <div class="set-card__title">{{ set.title }}</div>
          <div class="set-card__info">
            {{ set.flashcards.length }} tarjetas &middot; {{ set.categories.length }} categorias
          </div>
          <div class="set-card__meta">{{ set.sourceFileName }}</div>
          <button class="set-card__delete" @click.stop="deleteSet(set.id)">&#10007;</button>
        </div>
      </div>
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

.saved-sets {
  width: 100%;
  max-width: 900px;
  padding: 2rem;
}

.saved-sets__title {
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border);
}

.saved-sets__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.set-card {
  background: var(--card-front);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.set-card:hover {
  border-color: var(--accent);
  box-shadow: 0 0 20px var(--glow);
}

.set-card__tag {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 0.5rem;
}

.set-card__title {
  font-family: 'Playfair Display', serif;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 0.5rem;
}

.set-card__info {
  font-size: 0.75rem;
  color: var(--muted);
}

.set-card__meta {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.65rem;
  color: var(--muted);
  opacity: 0.6;
  margin-top: 0.5rem;
}

.set-card__delete {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: transparent;
  border: none;
  color: var(--muted);
  font-size: 0.8rem;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s;
  padding: 0.2rem 0.4rem;
}

.set-card:hover .set-card__delete {
  opacity: 1;
}

.set-card__delete:hover {
  color: var(--accent2);
}
</style>
