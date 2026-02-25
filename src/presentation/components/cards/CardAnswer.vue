<script setup lang="ts">
import type { HtmlContent } from '@/domain/value-objects/HtmlContent'

defineProps<{
  html: HtmlContent
}>()
</script>

<template>
  <div class="card-answer" v-html="html"></div>
</template>

<style scoped>
.card-answer {
  font-size: 0.88rem;
  line-height: 1.65;
  color: var(--text);
  flex: 1;
  overflow-y: auto;
}

.card-answer :deep(strong) {
  color: var(--accent);
  font-weight: 600;
}

.card-answer :deep(em) {
  color: var(--accent3);
  font-style: italic;
}

.card-answer :deep(ul) {
  list-style: none;
  padding-left: 0;
}

.card-answer :deep(ul li::before) {
  content: '\2192 ';
  color: var(--accent);
  font-family: 'IBM Plex Mono', monospace;
}

.card-answer::-webkit-scrollbar { width: 3px; }
.card-answer::-webkit-scrollbar-track { background: transparent; }
.card-answer::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 2px; }
</style>
