<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useFlashcardSetStore } from '@/presentation/stores/flashcardSetStore'
import { useUploadStore } from '@/presentation/stores/uploadStore'
import { useSettingsStore } from '@/presentation/stores/settingsStore'
import { usePdfUpload } from '@/presentation/composables/usePdfUpload'
import type { SetId } from '@/domain/value-objects/SetId'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const router = useRouter()
const store = useFlashcardSetStore()
const uploadStore = useUploadStore()
const settingsStore = useSettingsStore()
const { isDragging, selectedFile, validationError, handleFile, handleDrop, handleDragOver, handleDragLeave } = usePdfUpload()

const fileInput = ref<HTMLInputElement>()

watch(() => props.open, async (val) => {
  if (val) {
    await store.loadAllSets()
  } else {
    uploadStore.reset()
    validationError.value = null
  }
})

function openSet(id: SetId) {
  router.push({ name: 'flashcard-set', params: { id } })
  emit('close')
}

async function deleteSet(id: SetId) {
  await store.deleteSet(id)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

function triggerFileInput() {
  fileInput.value?.click()
}

async function onFileSelected(file: File) {
  handleFile(file)
  if (validationError.value) return
  try {
    const set = await uploadStore.processFile(file)
    await store.loadAllSets()
    router.push({ name: 'flashcard-set', params: { id: set.id } })
    emit('close')
  } catch {
    // Error shown inline
  }
}

function onFileInputChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) onFileSelected(file)
}

function onDrop(event: DragEvent) {
  event.preventDefault()
  handleDrop(event)
  if (selectedFile.value) onFileSelected(selectedFile.value)
}

function onRetry() {
  uploadStore.reset()
  validationError.value = null
  if (fileInput.value) fileInput.value.value = ''
}
</script>

<template>
  <Teleport to="body">
    <Transition name="backdrop">
      <div v-if="open" class="backdrop" @click="$emit('close')" />
    </Transition>

    <Transition name="panel">
      <aside
        v-if="open"
        class="history-panel"
        @dragover.prevent="handleDragOver"
        @dragleave="handleDragLeave"
        @drop="onDrop"
        :class="{ 'history-panel--dragging': isDragging }"
      >
        <div class="panel-header">
          <span class="panel-title">Historial de PDFs</span>
          <button class="panel-close" @click="$emit('close')">✕</button>
        </div>

        <!-- Upload section -->
        <div class="panel-upload">
          <input
            ref="fileInput"
            type="file"
            accept="application/pdf"
            hidden
            @change="onFileInputChange"
          />

          <!-- Idle state -->
          <template v-if="!uploadStore.isUploading && uploadStore.currentStage !== 'error' && uploadStore.currentStage !== 'complete'">
            <button
              class="upload-btn"
              :disabled="!settingsStore.hasApiKey"
              :title="!settingsStore.hasApiKey ? 'Configura tu API key de DeepSeek primero' : 'Seleccionar PDF'"
              @click="triggerFileInput"
            >
              <span class="upload-btn__icon">+</span>
              Cargar nuevo PDF
            </button>
            <p v-if="validationError" class="upload-error">{{ validationError }}</p>
            <p v-if="!settingsStore.hasApiKey" class="upload-hint">Configura tu API key primero</p>
            <p v-else class="upload-hint">Máx. 15 páginas · Arrastra aquí o haz clic</p>
          </template>

          <!-- Processing state -->
          <div v-else-if="uploadStore.isUploading || uploadStore.currentStage === 'complete'" class="upload-progress">
            <div class="upload-progress__spinner" v-if="uploadStore.currentStage !== 'complete'">
              <span class="spinner" />
            </div>
            <div v-else class="upload-progress__check">✓</div>
            <div class="upload-progress__info">
              <div class="upload-progress__stage">{{ uploadStore.currentStage }}</div>
              <div class="upload-progress__detail">{{ uploadStore.stageDetail }}</div>
            </div>
          </div>

          <!-- Error state -->
          <div v-else-if="uploadStore.currentStage === 'error'" class="upload-err">
            <p class="upload-err__msg">{{ uploadStore.error }}</p>
            <button class="upload-err__retry" @click="onRetry">Reintentar</button>
          </div>
        </div>

        <div class="panel-divider" />

        <!-- History list -->
        <div class="panel-body">
          <p v-if="store.allSets.length === 0" class="panel-empty">
            No hay sets guardados todavía.
          </p>

          <div
            v-for="set in store.allSets"
            :key="set.id"
            class="set-item"
            @click="openSet(set.id)"
          >
            <div class="set-item__source">{{ set.sourceFileName }}</div>
            <div class="set-item__title">{{ set.title }}</div>
            <div class="set-item__meta">
              {{ set.flashcards.length }} tarjetas
              &middot;
              {{ set.categories.length }} categorías
              &middot;
              {{ formatDate(set.createdAt) }}
            </div>
            <button
              class="set-item__delete"
              title="Eliminar set"
              @click.stop="deleteSet(set.id)"
            >✕</button>
          </div>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.history-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 340px;
  height: 100dvh;
  background: var(--surface);
  border-left: 1px solid var(--border);
  z-index: 101;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: border-color 0.2s;
}

.history-panel--dragging {
  border-left-color: var(--accent);
  box-shadow: inset -4px 0 20px rgba(0,229,160,0.08);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.panel-title {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--accent);
}

.panel-close {
  background: transparent;
  border: none;
  color: var(--muted);
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0.2rem 0.4rem;
  transition: color 0.2s;
}

.panel-close:hover {
  color: var(--text);
}

/* Upload section */
.panel-upload {
  padding: 1rem 1.25rem;
  flex-shrink: 0;
}

.upload-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: transparent;
  border: 1px dashed var(--border);
  border-radius: 6px;
  padding: 0.7rem 1rem;
  color: var(--muted);
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.72rem;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-btn:hover:not(:disabled) {
  border-color: var(--accent);
  color: var(--accent);
  background: rgba(0,229,160,0.04);
}

.upload-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.upload-btn__icon {
  font-size: 1rem;
  line-height: 1;
  font-weight: 300;
}

.upload-hint {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.6rem;
  color: var(--muted);
  opacity: 0.6;
  text-align: center;
  margin-top: 0.4rem;
}

.upload-error {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.65rem;
  color: var(--accent2);
  text-align: center;
  margin-top: 0.4rem;
}

.upload-progress {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--card-front);
}

.upload-progress__spinner {
  flex-shrink: 0;
}

.spinner {
  display: block;
  width: 16px;
  height: 16px;
  border: 2px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.upload-progress__check {
  font-size: 1rem;
  color: var(--accent);
  flex-shrink: 0;
}

.upload-progress__stage {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
  color: var(--text);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.upload-progress__detail {
  font-size: 0.65rem;
  color: var(--muted);
  margin-top: 0.15rem;
}

.upload-err__msg {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.65rem;
  color: var(--accent2);
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.upload-err__retry {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.65rem;
  background: transparent;
  border: 1px solid var(--accent);
  color: var(--accent);
  border-radius: 4px;
  padding: 0.3rem 0.7rem;
  cursor: pointer;
  transition: background 0.2s;
}

.upload-err__retry:hover {
  background: rgba(0,229,160,0.1);
}

.panel-divider {
  height: 1px;
  background: var(--border);
  flex-shrink: 0;
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.panel-empty {
  font-size: 0.8rem;
  color: var(--muted);
  font-style: italic;
  text-align: center;
  margin-top: 2rem;
}

.set-item {
  position: relative;
  background: var(--card-front);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.9rem 2.5rem 0.9rem 1rem;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.set-item:hover {
  border-color: var(--accent);
  box-shadow: 0 0 12px var(--glow);
}

.set-item__source {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.1em;
  color: var(--muted);
  opacity: 0.7;
  margin-bottom: 0.3rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.set-item__title {
  font-family: 'Playfair Display', serif;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 0.4rem;
  line-height: 1.3;
}

.set-item__meta {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.6rem;
  color: var(--muted);
}

.set-item__delete {
  position: absolute;
  top: 0.6rem;
  right: 0.6rem;
  background: transparent;
  border: none;
  color: var(--muted);
  font-size: 0.7rem;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s;
  padding: 0.2rem 0.4rem;
}

.set-item:hover .set-item__delete {
  opacity: 1;
}

.set-item__delete:hover {
  color: var(--accent2);
}

/* Transitions */
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.25s ease;
}
.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

.panel-enter-active,
.panel-leave-active {
  transition: transform 0.25s ease;
}
.panel-enter-from,
.panel-leave-to {
  transform: translateX(100%);
}
</style>
