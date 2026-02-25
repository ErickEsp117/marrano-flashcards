import { ref } from 'vue'

export function usePdfUpload() {
  const isDragging = ref(false)
  const selectedFile = ref<File | null>(null)
  const validationError = ref<string | null>(null)

  function validate(file: File): boolean {
    validationError.value = null
    if (file.type !== 'application/pdf') {
      validationError.value = 'Solo se aceptan archivos PDF'
      return false
    }
    if (file.size > 50 * 1024 * 1024) {
      validationError.value = 'El archivo no puede superar 50MB'
      return false
    }
    return true
  }

  function handleFile(file: File) {
    if (validate(file)) {
      selectedFile.value = file
    }
  }

  function handleDrop(event: DragEvent) {
    isDragging.value = false
    const file = event.dataTransfer?.files[0]
    if (file) handleFile(file)
  }

  function handleDragOver() { isDragging.value = true }
  function handleDragLeave() { isDragging.value = false }

  function clear() {
    selectedFile.value = null
    validationError.value = null
  }

  return {
    isDragging, selectedFile, validationError,
    handleFile, handleDrop, handleDragOver, handleDragLeave, clear,
  }
}
