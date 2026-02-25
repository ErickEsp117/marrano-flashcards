import type { CardId } from '../value-objects/CardId'
import type { HtmlContent } from '../value-objects/HtmlContent'

export interface Flashcard {
  readonly id: CardId
  readonly question: string
  readonly answer: HtmlContent
  readonly categoryId: string
  readonly sourcePageNumber: number
}
