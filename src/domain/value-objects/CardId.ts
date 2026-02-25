export type CardId = string & { readonly __brand: 'CardId' }

export function createCardId(): CardId {
  return crypto.randomUUID() as CardId
}

export function toCardId(value: string): CardId {
  return value as CardId
}
