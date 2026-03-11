<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/presentation/stores/authStore'
import FloatingPigs from '@/presentation/components/common/FloatingPigs.vue'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isSubmitting = ref(false)
const localError = ref<string | null>(null)

async function handleRegister() {
  localError.value = null
  authStore.clearError()

  if (password.value !== confirmPassword.value) {
    localError.value = 'Las contraseñas no coinciden'
    return
  }
  if (password.value.length < 8) {
    localError.value = 'La contraseña debe tener al menos 8 caracteres'
    return
  }

  isSubmitting.value = true
  try {
    await authStore.register(email.value, password.value, name.value)
    router.push({ name: 'home' })
  } catch {
    // Error is handled in the store
  } finally {
    isSubmitting.value = false
  }
}

const displayError = ref('')
import { watchEffect } from 'vue'
watchEffect(() => {
  displayError.value = localError.value || authStore.error || ''
})
</script>

<template>
  <FloatingPigs />
  <div class="auth-page">
    <div class="auth-card">
      <header class="auth-header">
        <h1 class="auth-title">
          Marrano <span>Flashcards</span>
        </h1>
        <p class="auth-subtitle">Crea tu cuenta para comenzar</p>
      </header>

      <form class="auth-form" @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="name" class="form-label">Nombre</label>
          <input
            id="name"
            v-model="name"
            type="text"
            class="form-input"
            placeholder="Tu nombre"
            required
            autocomplete="name"
          />
        </div>

        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="form-input"
            placeholder="tu@email.com"
            required
            autocomplete="email"
          />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Contraseña</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="form-input"
            placeholder="Mínimo 8 caracteres"
            required
            autocomplete="new-password"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword" class="form-label">Confirmar contraseña</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            class="form-input"
            placeholder="Repite tu contraseña"
            required
            autocomplete="new-password"
          />
        </div>

        <div v-if="displayError" class="auth-error">
          {{ displayError }}
        </div>

        <button
          type="submit"
          class="auth-btn"
          :disabled="isSubmitting || !name || !email || !password || !confirmPassword"
        >
          <span v-if="isSubmitting" class="auth-btn__spinner">⏳</span>
          {{ isSubmitting ? 'Registrando...' : 'Crear cuenta' }}
        </button>
      </form>

      <p class="auth-footer">
        ¿Ya tienes cuenta?
        <router-link :to="{ name: 'login' }" class="auth-link">
          Inicia sesión
        </router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.auth-card {
  width: 100%;
  max-width: 400px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 2.5rem;
  position: relative;
  z-index: 1;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  font-weight: 900;
  color: var(--text);
  margin-bottom: 0.3rem;
}

.auth-title span {
  color: var(--accent);
}

.auth-subtitle {
  font-size: 0.8rem;
  color: var(--muted);
  font-style: italic;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.form-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}

.form-input {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 0.65rem 0.8rem;
  color: var(--text);
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.85rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}

.form-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 2px var(--glow);
}

.form-input::placeholder {
  color: var(--muted);
  opacity: 0.5;
}

.auth-error {
  font-size: 0.78rem;
  color: var(--accent2);
  font-family: 'IBM Plex Mono', monospace;
  text-align: center;
  padding: 0.5rem;
  background: var(--danger-glow);
  border-radius: 4px;
}

.auth-btn {
  width: 100%;
  padding: 0.7rem;
  background: var(--accent);
  color: var(--bg);
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
}

.auth-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.auth-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.auth-footer {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.78rem;
  color: var(--muted);
}

.auth-link {
  color: var(--accent);
  text-decoration: none;
  font-weight: 600;
}

.auth-link:hover {
  text-decoration: underline;
}
</style>
