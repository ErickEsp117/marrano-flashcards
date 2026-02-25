import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getStoredApiKey, setStoredApiKey, clearStoredApiKey } from '@/infrastructure/config/api-config'

export const useSettingsStore = defineStore('settings', () => {
  const apiKey = ref<string>(getStoredApiKey() ?? '')
  const hasApiKey = ref<boolean>(!!getStoredApiKey())

  function saveApiKey(key: string) {
    apiKey.value = key
    setStoredApiKey(key)
    hasApiKey.value = true
  }

  function removeApiKey() {
    apiKey.value = ''
    clearStoredApiKey()
    hasApiKey.value = false
  }

  return { apiKey, hasApiKey, saveApiKey, removeApiKey }
})
