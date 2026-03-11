import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/domain/entities/User'
import { useCases } from '@/di/container'
import { hasTokens, clearTokens } from '@/infrastructure/http/token-storage'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)
  const userName = computed(() => user.value?.name ?? '')

  async function register(email: string, password: string, name: string) {
    isLoading.value = true
    error.value = null
    try {
      const response = await useCases.registerUser().execute({ email, password, name })
      user.value = response.user
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Error al registrarse'
      error.value = message
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function login(email: string, password: string) {
    isLoading.value = true
    error.value = null
    try {
      const response = await useCases.loginUser().execute({ email, password })
      user.value = response.user
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Error al iniciar sesión'
      error.value = message
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    try {
      await useCases.logoutUser().execute()
    } catch {
      // Proceed with local cleanup even if backend call fails
    }
    user.value = null
  }

  async function fetchCurrentUser() {
    if (!hasTokens()) return
    isLoading.value = true
    try {
      user.value = await useCases.getCurrentUser().execute()
    } catch {
      // Token invalid or expired
      clearTokens()
      user.value = null
    } finally {
      isLoading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  /** Listen for session expired events from the HTTP client */
  function setupSessionListener() {
    window.addEventListener('auth:session-expired', () => {
      user.value = null
    })
  }

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    userName,
    register,
    login,
    logout,
    fetchCurrentUser,
    clearError,
    setupSessionListener,
  }
})
