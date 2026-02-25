import { GoogleGenerativeAI } from '@google/generative-ai'
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

interface GeminiParsedResponse {
  title: string
  subtitle: string
  categories: RawCategory[]
  flashcards: RawFlashcard[]
}

export class GeminiAiGeneratorService implements AiGeneratorService {
  private genAI: GoogleGenerativeAI

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey)
  }

  async generateFromPages(
    pages: { pageNumber: number; text: string; imageDataUrl?: string }[],
    existingCategories?: Category[],
  ): Promise<AiFlashcardResult> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const combinedText = pages
      .map(p => `--- PAGINA ${p.pageNumber} ---\n${p.text}`)
      .join('\n\n')

    const prompt = FLASHCARD_GENERATION_PROMPT + '\n\nCONTENIDO DEL PDF:\n' + combinedText

    const imageParts = pages
      .filter((p): p is typeof p & { imageDataUrl: string } => !!p.imageDataUrl)
      .slice(0, 10)
      .map(p => ({
        inlineData: {
          data: p.imageDataUrl.split(',')[1] ?? '',
          mimeType: 'image/jpeg' as const,
        },
      }))

    const result = await model.generateContent([prompt, ...imageParts])
    const responseText = result.response.text()

    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)```/)
    const jsonStr = jsonMatch ? jsonMatch[1]!.trim() : responseText.trim()
    const parsed: GeminiParsedResponse = JSON.parse(jsonStr)

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
