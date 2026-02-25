export type HtmlContent = string & { readonly __brand: 'HtmlContent' }

export function createHtmlContent(raw: string): HtmlContent {
  const sanitized = raw.replace(/<\/?(?!(?:strong|em|ul|li|br)\b)[^>]*>/gi, '')
  return sanitized as HtmlContent
}
