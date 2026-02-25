<script setup lang="ts">
defineProps<{
  categoryName: string
  question: string
}>()
</script>

<template>
  <div class="deck-front">
    <div class="deck-cat-label">{{ categoryName }}</div>
    <div class="deck-q">{{ question }}</div>
    <div class="deck-flip-hint">Clic para ver respuesta</div>
  </div>
</template>

<style scoped>
.deck-front {
  position: absolute;
  inset: 0;
  border-radius: 10px;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  background: #141e2e;
  border: 1px solid var(--border);
  align-items: center;
  justify-content: center;
  text-align: center;
}

.deck-cat-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 1.2rem;
}

.deck-q {
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  line-height: 1.5;
  font-weight: 700;
}

.deck-flip-hint {
  margin-top: 2rem;
  font-size: 0.7rem;
  color: var(--muted);
  font-style: italic;
}
</style>
