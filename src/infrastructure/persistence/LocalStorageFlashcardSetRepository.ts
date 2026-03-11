import type { FlashcardSetRepository } from '@/domain/repositories/FlashcardSetRepository'
import type { FlashcardSet } from '@/domain/entities/FlashcardSet'
import type { SetId } from '@/domain/value-objects/SetId'
import { STORAGE_KEYS } from './storage-keys'

export class LocalStorageFlashcardSetRepository implements FlashcardSetRepository {
  private getStore(): FlashcardSet[] {
    const raw = localStorage.getItem(STORAGE_KEYS.FLASHCARD_SETS)
    return raw ? JSON.parse(raw) : []
  }

  private setStore(sets: FlashcardSet[]): void {
    localStorage.setItem(STORAGE_KEYS.FLASHCARD_SETS, JSON.stringify(sets))
  }

  async save(set: FlashcardSet): Promise<FlashcardSet> {
    const sets = this.getStore()
    const index = sets.findIndex(s => s.id === set.id)
    if (index >= 0) {
      sets[index] = set
    } else {
      sets.push(set)
    }
    this.setStore(sets)
    return set
  }

  async getById(id: SetId): Promise<FlashcardSet | null> {
    const sets = this.getStore()
    return sets.find(s => s.id === id) ?? null
  }

  async getAll(): Promise<FlashcardSet[]> {
    return this.getStore()
  }

  async delete(id: SetId): Promise<void> {
    const sets = this.getStore().filter(s => s.id !== id)
    this.setStore(sets)
  }
}
