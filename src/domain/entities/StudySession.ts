import type { CardId } from '../value-objects/CardId'
import type { Flashcard } from './Flashcard'

export interface StudySession {
  readonly cards: Flashcard[]
  currentIndex: number
  isFlipped: boolean
  knownCardIds: Set<CardId>
  reviewCardIds: Set<CardId>
}

export function createStudySession(cards: Flashcard[]): StudySession {
  return {
    cards: [...cards],
    currentIndex: 0,
    isFlipped: false,
    knownCardIds: new Set(),
    reviewCardIds: new Set(),
  }
}

export function getCurrentCard(session: StudySession): Flashcard | null {
  return session.cards[session.currentIndex] ?? null
}

export function isSessionComplete(session: StudySession): boolean {
  const lastCard = session.cards[session.currentIndex]
  if (!lastCard) return false
  return session.currentIndex >= session.cards.length - 1
    && (session.knownCardIds.has(lastCard.id) || session.reviewCardIds.has(lastCard.id))
}

export function getSessionScore(session: StudySession) {
  return {
    known: session.knownCardIds.size,
    review: session.reviewCardIds.size,
    total: session.cards.length,
  }
}
