<script setup lang="ts">
import { ref } from 'vue'
import HistoryPanel from '@/presentation/components/history/HistoryPanel.vue'

const historyOpen = ref(false)
</script>

<template>
  <RouterView />

  <button class="history-toggle" title="Historial de PDFs" @click="historyOpen = true">
    <span class="history-toggle__icon">&#9776;</span>
    <span class="history-toggle__label">Historial</span>
  </button>

  <HistoryPanel :open="historyOpen" @close="historyOpen = false" />
</template>

<style scoped>
.history-toggle {
  position: fixed;
  top: 1.25rem;
  right: 1.25rem;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 0.45rem 0.8rem;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
  color: var(--muted);
}

.history-toggle:hover {
  border-color: var(--accent);
  color: var(--accent);
  box-shadow: 0 0 10px var(--glow);
}

.history-toggle__icon {
  font-size: 0.9rem;
  line-height: 1;
}

.history-toggle__label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
</style>
