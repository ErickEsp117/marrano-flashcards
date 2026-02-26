<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import HistoryPanel from '@/presentation/components/history/HistoryPanel.vue'

const historyOpen = ref(false)
const theme = ref<'dark' | 'light'>((localStorage.getItem('theme') as 'dark' | 'light') ?? 'dark')

watchEffect(() => {
  document.documentElement.setAttribute('data-theme', theme.value)
})

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  localStorage.setItem('theme', theme.value)
}
</script>

<template>
  <RouterView />

  <button class="theme-toggle" :title="theme === 'dark' ? 'Modo claro' : 'Modo oscuro'" @click="toggleTheme">
    <span class="theme-toggle__icon">{{ theme === 'dark' ? '☀️' : '🌙' }}</span>
    <span class="theme-toggle__label">{{ theme === 'dark' ? 'Light' : 'Dark' }}</span>
  </button>

  <button class="history-toggle" title="Historial de PDFs" @click="historyOpen = true">
    <span class="history-toggle__icon">&#9776;</span>
    <span class="history-toggle__label">Historial</span>
  </button>

  <HistoryPanel :open="historyOpen" @close="historyOpen = false" />
</template>

<style scoped>
.theme-toggle,
.history-toggle {
  position: fixed;
  top: 1.25rem;
  z-index: 10000;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 0.45rem 0.8rem;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.3s;
  color: var(--muted);
}

.theme-toggle {
  right: 8.5rem;
}

.history-toggle {
  right: 1.25rem;
}

.theme-toggle:hover,
.history-toggle:hover {
  border-color: var(--accent);
  color: var(--accent);
  box-shadow: 0 0 10px var(--glow);
}

.theme-toggle__icon,
.history-toggle__icon {
  font-size: 0.9rem;
  line-height: 1;
}

.theme-toggle__label,
.history-toggle__label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
</style>
