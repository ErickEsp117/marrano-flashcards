import type { FlashcardSetRepository } from '@/domain/repositories/FlashcardSetRepository'
import type { FlashcardSet } from '@/domain/entities/FlashcardSet'
import type { SetId } from '@/domain/value-objects/SetId'
import { httpClient } from '@/infrastructure/http/ApiHttpClient'
import { apiConfig } from '@/infrastructure/http/api-endpoints'

/** Maps backend FlashcardSet shape to frontend FlashcardSet shape */
function mapBackendSet(raw: BackendFlashcardSet): FlashcardSet {
  return {
    id: raw.id as SetId,
    title: raw.title,
    subtitle: raw.subtitle ?? '',
    sourceFileName: '',
    categories: (raw.categories ?? []).map(c => ({
      id: c.id,
      name: c.name,
      color: {
        primary: c.color,
        gradient: `linear-gradient(90deg, ${c.color}, ${c.color}dd)`,
        border: `${c.color}33`,
      },
    })),
    flashcards: (raw.flashcards ?? []).map((f, i) => ({
      id: f.id as string & { readonly __brand: 'CardId' },
      question: f.question,
      answer: f.answer as string & { readonly __brand: 'HtmlContent' },
      categoryId: f.categoryId,
      sourcePageNumber: i + 1,
    })),
    quizQuestions: (raw.quizQuestions ?? []).map((q, i) => ({
      id: q.id as string & { readonly __brand: 'QuestionId' },
      question: q.question,
      options: mapQuizOptions(q.options, q.correctAnswer),
      correctOptionLabel: (['A', 'B', 'C', 'D'] as const)[q.correctAnswer] ?? 'A',
      categoryId: '',
      sourcePageNumber: i + 1,
    })),
    createdAt: raw.createdAt ?? new Date().toISOString(),
    totalPages: 0,
  }
}

function mapQuizOptions(
  options: string[],
  _correctAnswer: number,
): [
  { label: 'A'; text: string },
  { label: 'B'; text: string },
  { label: 'C'; text: string },
  { label: 'D'; text: string },
] {
  const labels = ['A', 'B', 'C', 'D'] as const
  return labels.map((label, i) => ({
    label,
    text: options[i] ?? '',
  })) as [
    { label: 'A'; text: string },
    { label: 'B'; text: string },
    { label: 'C'; text: string },
    { label: 'D'; text: string },
  ]
}

interface BackendFlashcardSet {
  id: string
  title: string
  subtitle: string | null
  userId: string
  isPublic: boolean
  shareToken: string | null
  flashcards: { id: string; question: string; answer: string; categoryId: string }[]
  categories: { id: string; name: string; color: string }[]
  quizQuestions: { id: string; question: string; options: string[]; correctAnswer: number }[]
  createdAt: string
  updatedAt: string
}

/** Maps frontend FlashcardSet to backend CreateFlashcardSetDto */
function mapToCreateDto(set: FlashcardSet) {
  return {
    title: set.title,
    subtitle: set.subtitle || undefined,
    flashcards: set.flashcards.map(f => ({
      question: f.question,
      answer: f.answer,
      categoryId: f.categoryId,
    })),
    categories: set.categories.map(c => ({
      id: c.id,
      name: c.name,
      color: c.color.primary,
    })),
    quizQuestions: (set.quizQuestions ?? []).map(q => ({
      question: q.question,
      options: q.options.map(o => o.text),
      correctAnswer: ['A', 'B', 'C', 'D'].indexOf(q.correctOptionLabel),
    })),
  }
}

export class ApiFlashcardSetRepository implements FlashcardSetRepository {
  async save(set: FlashcardSet): Promise<FlashcardSet> {
    const dto = mapToCreateDto(set)
    const raw = await httpClient.post<BackendFlashcardSet>(apiConfig.endpoints.flashcardSets, dto)
    return mapBackendSet(raw)
  }

  async getById(id: SetId): Promise<FlashcardSet | null> {
    try {
      const raw = await httpClient.get<BackendFlashcardSet>(
        apiConfig.endpoints.flashcardSet(id),
      )
      return mapBackendSet(raw)
    } catch {
      return null
    }
  }

  async getAll(): Promise<FlashcardSet[]> {
    const rawSets = await httpClient.get<BackendFlashcardSet[]>(
      apiConfig.endpoints.flashcardSets,
    )
    return rawSets.map(mapBackendSet)
  }

  async delete(id: SetId): Promise<void> {
    await httpClient.delete(apiConfig.endpoints.flashcardSet(id))
  }
}

export { mapBackendSet, type BackendFlashcardSet }
