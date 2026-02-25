import type { StudySession } from '@/domain/entities/StudySession'
import type { CardId } from '@/domain/value-objects/CardId'
import type { StudyResultType } from '@/domain/entities/StudyResult'

export class ScoreCard {
  execute(session: StudySession, cardId: CardId, result: StudyResultType): StudySession {
    if (result === 'known') {
      session.knownCardIds.add(cardId)
      session.reviewCardIds.delete(cardId)
    } else {
      session.reviewCardIds.add(cardId)
      session.knownCardIds.delete(cardId)
    }
    return session
  }
}
