<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { toSetId } from '@/domain/value-objects/SetId'
import { useFlashcardSetStore } from '@/presentation/stores/flashcardSetStore'
import { useStudySessionStore } from '@/presentation/stores/studySessionStore'
import { ref } from 'vue'
import AppHeader from '@/presentation/components/header/AppHeader.vue'
import CategoryNav from '@/presentation/components/categories/CategoryNav.vue'
import ControlsBar from '@/presentation/components/controls/ControlsBar.vue'
import FlashcardGrid from '@/presentation/components/cards/FlashcardGrid.vue'
import DeckModeOverlay from '@/presentation/components/deck/DeckModeOverlay.vue'
import LoadingSpinner from '@/presentation/components/common/LoadingSpinner.vue'
import PdfExportModal from '@/presentation/components/export/PdfExportModal.vue'

const route = useRoute()
const store = useFlashcardSetStore()
const studyStore = useStudySessionStore()

onMounted(async () => {
  const id = route.params.id as string
  await store.loadSet(toSetId(id))
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
      @reset="handleReset"
      @shuffle="handleShuffle"
      @study-mode="handleStudyMode"
      @export-pdf="handleExportPdf"
    />

    <FlashcardGrid
      :cards="store.filteredCards"
      :categories="store.categories"
      :flipped-card-ids="store.flippedCardIds"
      @card-flip="handleCardFlip"
    />

    <DeckModeOverlay :categories="store.categories" />

    <PdfExportModal
      v-if="showPdfExport"
      :cards="store.filteredCards"
      :categories="store.categories"
      :set="store.currentSet"
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
</style>
