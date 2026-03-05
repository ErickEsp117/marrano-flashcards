import { onMounted, onUnmounted } from 'vue'
import { useQuizSessionStore } from '../stores/quizSessionStore'

export function useQuizKeyboardShortcuts() {
  const store = useQuizSessionStore()

  function handler(e: KeyboardEvent) {
    if (!store.isActive) return

    switch (e.key) {
      case 'a': case 'A': case '1':
        store.selectAnswer('A')
        break
      case 'b': case 'B': case '2':
        store.selectAnswer('B')
        break
      case 'c': case 'C': case '3':
        store.selectAnswer('C')
        break
      case 'd': case 'D': case '4':
        store.selectAnswer('D')
        break
      case 'ArrowRight':
        store.goNext()
        break
      case 'ArrowLeft':
        store.goPrev()
        break
      case 'Escape':
        store.close()
        break
    }
  }

  onMounted(() => window.addEventListener('keydown', handler))
  onUnmounted(() => window.removeEventListener('keydown', handler))
}
