import { STORAGE_KEYS } from '../persistence/storage-keys'

export function getStoredApiKey(): string | null {
  return localStorage.getItem(STORAGE_KEYS.API_KEY)
}

export function setStoredApiKey(key: string): void {
  localStorage.setItem(STORAGE_KEYS.API_KEY, key)
}

export function clearStoredApiKey(): void {
  localStorage.removeItem(STORAGE_KEYS.API_KEY)
}
