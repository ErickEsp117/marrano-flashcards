const API_BASE_URL = 'https://marrano-flashcards-backend.onrender.com/api'

export const apiConfig = {
  baseUrl: API_BASE_URL,
  endpoints: {
    // Auth
    register: '/auth/register',
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
    // Flashcard sets
    flashcardSets: '/flashcard-sets',
    flashcardSet: (id: string) => `/flashcard-sets/${id}`,
    // Share
    share: (id: string) => `/flashcard-sets/${id}/share`,
    sharedSet: (token: string) => `/shared/${token}`,
    // Generate
    generateFromText: '/generate/from-text',
    generateFromPdf: '/generate/from-pdf',
    // Quiz results
    quizResults: '/quiz-results',
    quizResultsBySet: (setId: string) => `/quiz-results/set/${setId}`,
  },
} as const
