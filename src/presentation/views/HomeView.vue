<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUploadStore } from '@/presentation/stores/uploadStore'
import { useFlashcardSetStore } from '@/presentation/stores/flashcardSetStore'
import { usePdfUpload } from '@/presentation/composables/usePdfUpload'
import { useAuthStore } from '@/presentation/stores/authStore'
import PdfUploadZone from '@/presentation/components/upload/PdfUploadZone.vue'
import UploadProgress from '@/presentation/components/upload/UploadProgress.vue'
import UploadErrorMessage from '@/presentation/components/upload/UploadErrorMessage.vue'
import TextGeneratePanel from '@/presentation/components/upload/TextGeneratePanel.vue'
import FloatingPigs from '@/presentation/components/common/FloatingPigs.vue'

const router = useRouter()
const uploadStore = useUploadStore()
const flashcardSetStore = useFlashcardSetStore()
const authStore = useAuthStore()
const { isDragging, selectedFile, validationError, handleFile, handleDrop, handleDragOver, handleDragLeave } = usePdfUpload()

const activeTab = ref<'pdf' | 'text'>('text')
let hasNavigated = false

async function onFileSelected(file: File) {
  handleFile(file)
  if (validationError.value) return
  hasNavigated = false
  try {
    await uploadStore.processFile(file, {
      onFirstBatchReady: (set) => {
        if (!hasNavigated) {
          hasNavigated = true
          flashcardSetStore.setCurrentSet(set)
          router.push({ name: 'flashcard-set', params: { id: set.id } })
        }
      },
      onBatchUpdate: (set) => {
        flashcardSetStore.setCurrentSet(set)
      },
    })
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
      <p class="home-subtitle">
        Hola, {{ authStore.userName }} · Genera flashcards inteligentes
      </p>
    </header>

    <div class="home-content">
      <!-- Tab selector -->
      <div class="tab-bar">
        <button
          class="tab-btn"
          :class="{ 'tab-btn--active': activeTab === 'text' }"
          @click="activeTab = 'text'"
        >
          📝 Desde texto
        </button>
        <button
          class="tab-btn"
          :class="{ 'tab-btn--active': activeTab === 'pdf' }"
          @click="activeTab = 'pdf'"
        >
          📄 Desde PDF
        </button>
      </div>

      <!-- Text generation (backend AI) -->
      <TextGeneratePanel v-if="activeTab === 'text'" />

      <!-- PDF upload (local AI) -->
      <template v-if="activeTab === 'pdf'">
        <div v-if="validationError" class="validation-error">{{ validationError }}</div>

        <template v-if="!uploadStore.isUploading && uploadStore.currentStage !== 'error'">
          <PdfUploadZone
            :is-dragging="isDragging"
            :disabled="false"
            @file-selected="onFileSelected"
            @drag-over="handleDragOver"
            @drag-leave="handleDragLeave"
            @drop="onDrop"
          />
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
      </template>
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

.tab-bar {
  display: flex;
  gap: 0;
  border: 1px solid var(--border);
  border-radius: 6px;
  overflow: hidden;
  width: fit-content;
}

.tab-btn {
  padding: 0.55rem 1.2rem;
  background: transparent;
  border: none;
  color: var(--muted);
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn:not(:last-child) {
  border-right: 1px solid var(--border);
}

.tab-btn--active {
  background: var(--accent);
  color: var(--bg);
  font-weight: 700;
}

.tab-btn:hover:not(.tab-btn--active) {
  color: var(--accent);
  background: var(--glow);
}
</style>
