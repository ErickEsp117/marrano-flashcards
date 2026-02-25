import type { Flashcard } from '@/domain/entities/Flashcard'
import { createStudySession, type StudySession } from '@/domain/entities/StudySession'

export class StartStudySession {
  execute(flashcards: Flashcard[]): StudySession {
    if (flashcards.length === 0) {
      throw new Error('No se puede iniciar sesion de estudio sin tarjetas')
    }
    return createStudySession(flashcards)
  }
}
