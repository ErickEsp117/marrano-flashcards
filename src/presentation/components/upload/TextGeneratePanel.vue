<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFlashcardSetStore } from '@/presentation/stores/flashcardSetStore'
import { useCases } from '@/di/container'
import type { GenerateProgress } from '@/domain/services/TextGeneratorService'

const router = useRouter()
const flashcardSetStore = useFlashcardSetStore()

const text = ref('')
const isGenerating = ref(false)
const error = ref<string | null>(null)
const progress = ref('')
const charCount = ref(0)

function updateCharCount() {
  charCount.value = text.value.length
}

async function handleGenerate() {
  if (text.value.length < 50) {
    error.value = 'El texto debe tener al menos 50 caracteres'
    return
  }

  isGenerating.value = true
  error.value = null
  progress.value = 'Conectando con el servidor...'

  try {
    const set = await useCases.generateFlashcardsFromText().execute(
      text.value,
      (event: GenerateProgress) => {
        if (event.type === 'batch-complete') {
          progress.value = `Procesando lote ${(event.batchIndex ?? 0) + 1} de ${event.totalBatches}...`
        } else if (event.type === 'complete') {
          progress.value = '¡Generación completada!'
        }
      },
    )

    flashcardSetStore.setCurrentSet(set)
    router.push({ name: 'flashcard-set', params: { id: set.id } })
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Error al generar flashcards'
  } finally {
    isGenerating.value = false
  }
}
</script>

<template>
  <div class="text-panel">
    <div class="text-panel__area-wrap">
      <textarea
        v-model="text"
        class="text-panel__textarea"
        placeholder="Pega aquí el texto del que quieres generar flashcards (mínimo 50 caracteres)..."
        rows="10"
        :disabled="isGenerating"
        @input="updateCharCount"
      />
      <span class="text-panel__counter" :class="{ 'text-panel__counter--warn': charCount > 0 && charCount < 50 }">
        {{ charCount.toLocaleString() }} / 100,000
      </span>
    </div>

    <div v-if="error" class="text-panel__error">
      {{ error }}
    </div>

    <div v-if="isGenerating" class="text-panel__progress">
      <span class="text-panel__spinner">⏳</span>
      {{ progress }}
    </div>

    <button
      class="text-panel__btn"
      :disabled="isGenerating || text.length < 50"
      @click="handleGenerate"
    >
      {{ isGenerating ? 'Generando...' : '🚀 Generar flashcards' }}
    </button>
  </div>
</template>

<style scoped>
.text-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 600px;
}

.text-panel__area-wrap {
  position: relative;
}

.text-panel__textarea {
  width: 100%;
  min-height: 200px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 1rem;
  color: var(--text);
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.82rem;
  line-height: 1.6;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.text-panel__textarea:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 2px var(--glow);
}

.text-panel__textarea::placeholder {
  color: var(--muted);
  opacity: 0.5;
}

.text-panel__counter {
  position: absolute;
  bottom: 0.5rem;
  right: 0.8rem;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.65rem;
  color: var(--muted);
}

.text-panel__counter--warn {
  color: var(--accent2);
}

.text-panel__error {
  font-size: 0.78rem;
  color: var(--accent2);
  font-family: 'IBM Plex Mono', monospace;
  text-align: center;
  padding: 0.5rem;
  background: var(--danger-glow);
  border-radius: 4px;
}

.text-panel__progress {
  font-size: 0.78rem;
  color: var(--accent);
  font-family: 'IBM Plex Mono', monospace;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
}

.text-panel__spinner {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.text-panel__btn {
  width: 100%;
  padding: 0.75rem;
  background: var(--accent);
  color: var(--bg);
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
}

.text-panel__btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.text-panel__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
