import OpenAI from 'openai'
import type { AiGeneratorService, AiFlashcardResult } from '@/domain/services/AiGeneratorService'
import type { Category } from '@/domain/entities/Category'
import { DEFAULT_CATEGORY_COLORS } from '@/domain/entities/Category'
import { createCardId } from '@/domain/value-objects/CardId'
import { createHtmlContent } from '@/domain/value-objects/HtmlContent'
import { FLASHCARD_GENERATION_PROMPT } from './prompts'

interface RawCategory {
  id: string
  name: string
}

interface RawFlashcard {
  question: string
  answer: string
  categoryId: string
  sourcePageNumber: number
}

interface DeepSeekParsedResponse {
  title: string
  subtitle: string
  categories: RawCategory[]
  flashcards: RawFlashcard[]
}

export class DeepSeekAiGeneratorService implements AiGeneratorService {
  private client: OpenAI

  constructor(apiKey: string) {
    this.client = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey,
      dangerouslyAllowBrowser: true,
    })
  }

  async generateFromPages(
    pages: { pageNumber: number; text: string; imageDataUrl?: string }[],
    existingCategories?: Category[],
  ): Promise<AiFlashcardResult> {
    const combinedText = pages
      .map(p => `--- PAGINA ${p.pageNumber} ---\n${p.text}`)
      .join('\n\n')

    let prompt = FLASHCARD_GENERATION_PROMPT
    if (existingCategories && existingCategories.length > 0) {
      const catList = existingCategories
        .map(c => `- id: "${c.id}", nombre: "${c.name}"`)
        .join('\n')
      prompt += `\n\nCATEGORÍAS YA CREADAS EN LOTES ANTERIORES (reutiliza sus ids cuando el contenido corresponda, no crees duplicados):\n${catList}`
    }

    const userMessage = prompt + '\n\nCONTENIDO DEL PDF:\n' + combinedText

    const pageNums = pages.map(p => p.pageNumber).join(', ')
    console.debug(`[DeepSeek] Enviando lote — páginas: ${pageNums} | chars de entrada: ${userMessage.length}`)

    const completion = await this.client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: userMessage }],
      response_format: { type: 'json_object' },
      max_tokens: 8192,
    })

    const choice = completion.choices[0]!
    const finishReason = choice.finish_reason
    const responseText = choice.message?.content ?? ''

    console.debug(`[DeepSeek] Respuesta — finish_reason: ${finishReason} | chars: ${responseText.length} | usage:`, completion.usage)

    if (finishReason === 'length') {
      console.error('[DeepSeek] Respuesta truncada por límite de tokens. Considera reducir el tamaño del lote o el contenido.')
      throw new Error('La respuesta de la IA fue truncada (demasiado contenido por lote). Intenta con un PDF menos denso.')
    }

    let parsed: DeepSeekParsedResponse
    try {
      parsed = JSON.parse(responseText)
    } catch (parseError) {
      console.error('[DeepSeek] Error al parsear JSON:', parseError)
      console.error('[DeepSeek] Respuesta recibida (primeros 500 chars):', responseText.slice(0, 500))

      // Attempt repair: strip markdown fences, then replace unescaped double quotes
      // inside JSON string values with single quotes
      try {
        const stripped = responseText
          .replace(/^```json\s*/m, '')
          .replace(/^```\s*/m, '')
          .replace(/\s*```$/m, '')
          .trim()
        parsed = JSON.parse(stripped)
        console.debug('[DeepSeek] JSON reparado (stripping fences) — OK')
      } catch {
        throw new Error(`Error al procesar la respuesta de la IA: ${parseError instanceof Error ? parseError.message : 'JSON inválido'}`)
      }
    }

    const categories: Category[] = parsed.categories.map(
      (cat, index) => ({
        id: cat.id,
        name: cat.name,
        color: existingCategories?.find(ec => ec.id === cat.id)?.color
          ?? DEFAULT_CATEGORY_COLORS[index % DEFAULT_CATEGORY_COLORS.length]!,
      })
    )

    const flashcards = parsed.flashcards.map(fc => ({
      id: createCardId(),
      question: fc.question,
      answer: createHtmlContent(fc.answer),
      categoryId: fc.categoryId,
      sourcePageNumber: fc.sourcePageNumber,
    }))

    return {
      flashcards,
      categories,
      suggestedTitle: parsed.title,
      suggestedSubtitle: parsed.subtitle,
    }
  }
}
