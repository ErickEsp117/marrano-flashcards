<script setup lang="ts">
import { onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { toSetId } from '@/domain/value-objects/SetId'
import { useFlashcardSetStore } from '@/presentation/stores/flashcardSetStore'
import { useStudySessionStore } from '@/presentation/stores/studySessionStore'
import { useQuizSessionStore } from '@/presentation/stores/quizSessionStore'
import { useUploadStore } from '@/presentation/stores/uploadStore'
import { ref } from 'vue'
import AppHeader from '@/presentation/components/header/AppHeader.vue'
import CategoryNav from '@/presentation/components/categories/CategoryNav.vue'
import ControlsBar from '@/presentation/components/controls/ControlsBar.vue'
import FlashcardGrid from '@/presentation/components/cards/FlashcardGrid.vue'
import DeckModeOverlay from '@/presentation/components/deck/DeckModeOverlay.vue'
import QuizModeOverlay from '@/presentation/components/quiz/QuizModeOverlay.vue'
import LoadingSpinner from '@/presentation/components/common/LoadingSpinner.vue'
import PdfExportModal from '@/presentation/components/export/PdfExportModal.vue'

const route = useRoute()
const store = useFlashcardSetStore()
const studyStore = useStudySessionStore()
const quizStore = useQuizSessionStore()
const uploadStore = useUploadStore()

const hasQuiz = computed(() =>
  (store.currentSet?.quizQuestions?.length ?? 0) > 0
)

const isGeneratingMore = computed(() => uploadStore.isGeneratingMore)

onMounted(async () => {
  const id = route.params.id as string
  // If the set is already loaded (navigated from upload), don't reload from storage
  if (!store.currentSet || store.currentSet.id !== id) {
    await store.loadSet(toSetId(id))
  }
})

watch(() => route.params.id, async (newId) => {
  if (newId) {
    await store.loadSet(toSetId(newId as string))
  }
})

function handleFilter(categoryId: string) {
  store.applyFilter(categoryId)
}

function handleReset() {
  store.resetAll()
}

function handleShuffle() {
  store.shuffleVisible()
}

function handleStudyMode() {
  studyStore.start(store.filteredCards)
}

function handleQuizMode() {
  if (store.currentSet?.quizQuestions) {
    quizStore.start(store.currentSet.quizQuestions)
  }
}

function handleCardFlip(cardId: Parameters<typeof store.toggleFlip>[0]) {
  store.toggleFlip(cardId)
}

const showPdfExport = ref(false)

function handleExportPdf() {
  showPdfExport.value = true
}
</script>

<template>
  <div v-if="store.isLoading" class="loading-state">
    <LoadingSpinner size="lg" />
  </div>

  <template v-else-if="store.currentSet">
    <AppHeader
      :tag="store.currentSet.subtitle"
      :title="store.currentSet.title"
      :accent-word="store.currentSet.title.split(' ').pop() ?? ''"
      subtitle="Flashcards para estudio — haz clic en cada tarjeta para revelar la respuesta"
    />

    <!-- Banner: generating more flashcards in background -->
    <div v-if="isGeneratingMore" class="generating-banner">
      <div class="generating-banner-content">
        <span class="generating-spinner" />
        <span>Generando más flashcards en segundo plano… {{ store.totalCards }} tarjetas listas</span>
      </div>
    </div>

    <CategoryNav
      :categories="store.categories"
      :active-filter="store.activeFilter"
      @filter-change="handleFilter"
    />

    <ControlsBar
      :visible-count="store.visibleCards"
      :total-count="store.totalCards"
      :seen-count="store.seenCards"
      :progress-percent="store.progressPercent"
      :has-quiz="hasQuiz"
      @reset="handleReset"
      @shuffle="handleShuffle"
      @study-mode="handleStudyMode"
      @quiz-mode="handleQuizMode"
      @export-pdf="handleExportPdf"
    />

    <FlashcardGrid
      :cards="store.filteredCards"
      :categories="store.categories"
      :flipped-card-ids="store.flippedCardIds"
      @card-flip="handleCardFlip"
    />

    <DeckModeOverlay :categories="store.categories" />
    <QuizModeOverlay :categories="store.categories" />

    <PdfExportModal
      v-if="showPdfExport"
      :cards="store.filteredCards"
      :categories="store.categories"
      :set="store.currentSet"
      :quiz-questions="store.currentSet.quizQuestions"
      @close="showPdfExport = false"
    />
  </template>
</template>

<style scoped>
.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.generating-banner {
  position: sticky;
  top: 0;
  z-index: 50;
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%);
  color: white;
  padding: 0.6rem 1.5rem;
  text-align: center;
  font-size: 0.85rem;
  font-family: 'IBM Plex Mono', monospace;
  animation: banner-pulse 2s ease-in-out infinite;
}

.generating-banner-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.generating-spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes banner-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.85; }
}
</style>
