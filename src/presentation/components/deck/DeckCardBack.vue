<script setup lang="ts">
import type { HtmlContent } from '@/domain/value-objects/HtmlContent'

defineProps<{
  answer: HtmlContent
}>()
</script>

<template>
  <div class="deck-back">
    <div class="deck-a-label">Respuesta</div>
    <div class="deck-answer" v-html="answer"></div>
  </div>
</template>

<style scoped>
.deck-back {
  position: absolute;
  inset: 0;
  border-radius: 10px;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  background: var(--card-back);
  border: 1px solid var(--border);
  transform: rotateY(180deg);
  overflow-y: auto;
}

.deck-a-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 1rem;
}

.deck-answer {
  font-size: 0.92rem;
  line-height: 1.7;
  color: var(--text);
  flex: 1;
}

.deck-answer :deep(strong) { color: var(--accent); }
.deck-answer :deep(em) { color: var(--accent3); }
.deck-answer :deep(ul) { list-style: none; padding-left: 0; }
.deck-answer :deep(ul li::before) { content: '\2192 '; color: var(--accent); font-family: 'IBM Plex Mono', monospace; }

.deck-back::-webkit-scrollbar { width: 3px; }
.deck-back::-webkit-scrollbar-track { background: transparent; }
.deck-back::-webkit-scrollbar-thumb { background: var(--accent); }
</style>
