<script setup lang="ts">
import { ref, watchEffect, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/presentation/stores/authStore'
import HistoryPanel from '@/presentation/components/history/HistoryPanel.vue'

const router = useRouter()
const authStore = useAuthStore()
const historyOpen = ref(false)
const userMenuOpen = ref(false)
const theme = ref<'dark' | 'light'>((localStorage.getItem('theme') as 'dark' | 'light') ?? 'dark')

watchEffect(() => {
  document.documentElement.setAttribute('data-theme', theme.value)
})

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  localStorage.setItem('theme', theme.value)
}

function handleLogout() {
  authStore.logout()
  userMenuOpen.value = false
  router.push({ name: 'login' })
}

onMounted(async () => {
  authStore.setupSessionListener()
  await authStore.fetchCurrentUser()

  // Listen for session expiry and redirect
  window.addEventListener('auth:session-expired', () => {
    router.push({ name: 'login' })
  })
})
</script>

<template>
  <RouterView />

  <template v-if="authStore.isAuthenticated">
    <button class="theme-toggle" :title="theme === 'dark' ? 'Modo claro' : 'Modo oscuro'" @click="toggleTheme">
      <span class="theme-toggle__icon">{{ theme === 'dark' ? '☀️' : '🌙' }}</span>
      <span class="theme-toggle__label">{{ theme === 'dark' ? 'Light' : 'Dark' }}</span>
    </button>

    <button class="history-toggle" title="Historial de PDFs" @click="historyOpen = true">
      <span class="history-toggle__icon">&#9776;</span>
      <span class="history-toggle__label">Historial</span>
    </button>

    <div class="user-menu-wrapper">
      <button class="user-toggle" @click="userMenuOpen = !userMenuOpen">
        <span class="user-toggle__avatar">{{ authStore.userName.charAt(0).toUpperCase() }}</span>
        <span class="user-toggle__name">{{ authStore.userName }}</span>
      </button>
      <div v-if="userMenuOpen" class="user-dropdown">
        <p class="user-dropdown__email">{{ authStore.user?.email }}</p>
        <button class="user-dropdown__btn" @click="handleLogout">
          Cerrar sesión
        </button>
      </div>
    </div>

    <HistoryPanel :open="historyOpen" @close="historyOpen = false" />
  </template>
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

/* ── User menu ── */
.user-menu-wrapper {
  position: fixed;
  top: 1.25rem;
  right: 16rem;
  z-index: 10000;
}

.user-toggle {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 0.35rem 0.7rem;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.3s;
  color: var(--muted);
}

.user-toggle:hover {
  border-color: var(--accent);
  color: var(--accent);
  box-shadow: 0 0 10px var(--glow);
}

.user-toggle__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.4rem;
  height: 1.4rem;
  border-radius: 50%;
  background: var(--accent);
  color: var(--bg);
  font-size: 0.7rem;
  font-weight: 700;
  font-family: 'IBM Plex Mono', monospace;
}

.user-toggle__name {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.08em;
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.8rem;
  min-width: 180px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.user-dropdown__email {
  font-size: 0.7rem;
  color: var(--muted);
  font-family: 'IBM Plex Mono', monospace;
  margin-bottom: 0.7rem;
  word-break: break-all;
}

.user-dropdown__btn {
  width: 100%;
  padding: 0.45rem 0.6rem;
  background: transparent;
  border: 1px solid var(--accent2);
  border-radius: 4px;
  color: var(--accent2);
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.2s;
}

.user-dropdown__btn:hover {
  background: var(--danger-glow);
}
</style>
