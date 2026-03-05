export type QuestionId = string & { readonly __brand: 'QuestionId' }

export function createQuestionId(): QuestionId {
  return crypto.randomUUID() as QuestionId
}

export function toQuestionId(value: string): QuestionId {
  return value as QuestionId
}
