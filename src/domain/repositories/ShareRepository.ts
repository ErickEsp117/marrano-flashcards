import type { FlashcardSet } from '../entities/FlashcardSet'

export interface ShareInfo {
  shareToken: string
  isPublic: boolean
}

export interface ShareRepository {
  generateShareToken(setId: string): Promise<ShareInfo>
  revokeShareToken(setId: string): Promise<void>
  getSharedSet(token: string): Promise<FlashcardSet>
}
