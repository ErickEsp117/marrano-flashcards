<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  isDragging: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  fileSelected: [file: File]
  dragOver: []
  dragLeave: []
  drop: [event: DragEvent]
}>()

const fileInput = ref<HTMLInputElement>()

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) emit('fileSelected', file)
}

function triggerInput() {
  fileInput.value?.click()
}

function onDrop(event: DragEvent) {
  event.preventDefault()
  emit('drop', event)
}

function onDragOver(event: DragEvent) {
  event.preventDefault()
  emit('dragOver')
}
</script>

<template>
  <div
    class="upload-zone"
    :class="{ 'upload-zone--dragging': isDragging, 'upload-zone--disabled': disabled }"
    @drop="onDrop"
    @dragover="onDragOver"
    @dragleave="$emit('dragLeave')"
    @click="triggerInput"
  >
    <input
      ref="fileInput"
      type="file"
      accept="application/pdf"
      hidden
      @change="onFileChange"
    />
    <div class="upload-zone__icon">&#128196;</div>
    <div class="upload-zone__text">
      <span class="upload-zone__main">Arrastra un PDF aqui</span>
      <span class="upload-zone__sub">o haz clic para seleccionar archivo</span>
    </div>
  </div>
</template>

<style scoped>
.upload-zone {
  width: 100%;
  max-width: 500px;
  padding: 3rem 2rem;
  border: 2px dashed var(--border);
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: rgba(255,255,255,0.02);
}

.upload-zone:hover,
.upload-zone--dragging {
  border-color: var(--accent);
  background: rgba(0,229,160,0.03);
}

.upload-zone--disabled {
  opacity: 0.5;
  pointer-events: none;
}

.upload-zone__icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.6;
}

.upload-zone__main {
  display: block;
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 0.3rem;
}

.upload-zone__sub {
  display: block;
  font-size: 0.8rem;
  color: var(--muted);
}
</style>
