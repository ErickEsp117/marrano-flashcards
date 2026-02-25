import { onMounted, onUnmounted } from 'vue'
import { useStudySessionStore } from '../stores/studySessionStore'

export function useKeyboardShortcuts() {
  const studyStore = useStudySessionStore()

  function handler(e: KeyboardEvent) {
    if (!studyStore.isActive) return

    switch (e.key) {
      case ' ':
      case 'Enter':
        e.preventDefault()
        studyStore.flipCurrent()
        break
      case 'ArrowRight':
        studyStore.goNext()
        break
      case 'ArrowLeft':
        studyStore.goPrev()
        break
      case '1':
        if (studyStore.isFlipped) studyStore.scoreCurrentCard('known')
        break
      case '2':
        if (studyStore.isFlipped) studyStore.scoreCurrentCard('review')
        break
      case 'Escape':
        studyStore.close()
        break
    }
  }

  onMounted(() => window.addEventListener('keydown', handler))
  onUnmounted(() => window.removeEventListener('keydown', handler))
}
