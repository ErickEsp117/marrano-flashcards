export type SetId = string & { readonly __brand: 'SetId' }

export function createSetId(): SetId {
  return crypto.randomUUID() as SetId
}

export function toSetId(value: string): SetId {
  return value as SetId
}
