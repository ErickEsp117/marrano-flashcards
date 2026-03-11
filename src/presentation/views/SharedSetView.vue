<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { FlashcardSet } from '@/domain/entities/FlashcardSet'
import type { CardId } from '@/domain/value-objects/CardId'
import { useCases } from '@/di/container'
import FlashcardGrid from '@/presentation/components/cards/FlashcardGrid.vue'
import LoadingSpinner from '@/presentation/components/common/LoadingSpinner.vue'
import FloatingPigs from '@/presentation/components/common/FloatingPigs.vue'

const route = useRoute()
const set = ref<FlashcardSet | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)
const flippedCardIds = ref<Set<CardId>>(new Set())

function toggleFlip(cardId: CardId) {
  const next = new Set(flippedCardIds.value)
  if (next.has(cardId)) next.delete(cardId)
  else next.add(cardId)
  flippedCardIds.value = next
}

onMounted(async () => {
  const token = route.params.token as string
  try {
    set.value = await useCases.getSharedFlashcardSet().execute(token)
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'No se pudo cargar el set compartido'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <FloatingPigs />
  <div class="shared-page">
    <div v-if="isLoading" class="shared-loading">
      <LoadingSpinner />
      <p>Cargando set compartido...</p>
    </div>

    <div v-else-if="error" class="shared-error">
      <p>{{ error }}</p>
      <router-link :to="{ name: 'login' }" class="shared-link">
        Ir al inicio
      </router-link>
    </div>

    <template v-else-if="set">
      <header class="shared-header">
        <h1 class="shared-title">{{ set.title }}</h1>
        <p v-if="set.subtitle" class="shared-subtitle">{{ set.subtitle }}</p>
        <p class="shared-meta">
          {{ set.flashcards.length }} flashcards · Compartido públicamente
        </p>
      </header>

      <FlashcardGrid
        :cards="set.flashcards"
        :categories="set.categories"
        :flipped-card-ids="flippedCardIds"
        @card-flip="toggleFlip"
      />
    </template>
  </div>
</template>

<style scoped>
.shared-page {
  min-height: 100vh;
  padding: 2rem;
}

.shared-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 1rem;
  color: var(--muted);
}

.shared-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 1rem;
  color: var(--accent2);
}

.shared-link {
  color: var(--accent);
  text-decoration: none;
  font-size: 0.85rem;
}

.shared-header {
  text-align: center;
  margin-bottom: 2rem;
}

.shared-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  font-weight: 900;
  color: var(--text);
}

.shared-subtitle {
  font-size: 0.85rem;
  color: var(--muted);
  margin-top: 0.3rem;
}

.shared-meta {
  font-size: 0.75rem;
  color: var(--muted);
  font-family: 'IBM Plex Mono', monospace;
  margin-top: 0.5rem;
}
</style>
