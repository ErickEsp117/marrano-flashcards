<script setup lang="ts">
import { computed } from 'vue'
import type { Flashcard } from '@/domain/entities/Flashcard'
import type { Category } from '@/domain/entities/Category'
import type { FlashcardSet } from '@/domain/entities/FlashcardSet'

const props = defineProps<{
  cards: Flashcard[]
  categories: Category[]
  set: FlashcardSet
}>()

defineEmits<{ close: [] }>()

const categoryMap = computed(() => {
  const map = new Map<string, Category>()
  props.categories.forEach(c => map.set(c.id, c))
  return map
})

function getCategory(id: string): Category | undefined {
  return categoryMap.value.get(id)
}

const totalCards = computed(() => props.cards.length)
const exportDate = computed(() => {
  return new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
})

function handlePrint() {
  window.print()
}
</script>

<template>
  <Teleport to="body">
  <div class="pdf-modal-overlay" role="dialog" aria-modal="true">
    <!-- Controls: ocultos al imprimir -->
    <div class="pdf-controls no-print">
      <div class="pdf-controls-left">
        <div class="pdf-meta">
          <span class="pdf-meta-title">{{ set.title }}</span>
          <span class="pdf-meta-count">{{ totalCards }} tarjetas</span>
        </div>
      </div>
      <div class="pdf-controls-right">
        <button class="pdf-btn pdf-btn-print" @click="handlePrint">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"/>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
            <rect x="6" y="14" width="12" height="8"/>
          </svg>
          Imprimir / Guardar PDF
        </button>
        <button class="pdf-btn pdf-btn-close" @click="$emit('close')" aria-label="Cerrar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          Cerrar
        </button>
      </div>
    </div>

    <!-- Preview hint: oculto al imprimir -->
    <div class="pdf-hint no-print">
      Vista previa del PDF · En el cuadro de impresión activa <strong>Más ajustes → Gráficos de fondo</strong> para mantener los colores
    </div>

    <!-- Área de impresión: el contenido real del PDF -->
    <div class="pdf-document">
      <!-- Portada -->
      <div class="pdf-cover no-print-break">
        <div class="pdf-cover-accent"></div>
        <div class="pdf-cover-body">
          <div class="pdf-cover-tag">{{ set.subtitle }}</div>
          <h1 class="pdf-cover-title">{{ set.title }}</h1>
          <div class="pdf-cover-stats">
            <span>{{ totalCards }} flashcards</span>
            <span class="pdf-cover-dot">·</span>
            <span>{{ categories.length }} categorías</span>
            <span class="pdf-cover-dot">·</span>
            <span>{{ exportDate }}</span>
          </div>
          <div class="pdf-cover-cats">
            <span
              v-for="cat in categories"
              :key="cat.id"
              class="pdf-cat-chip"
              :style="{ color: cat.color.primary, borderColor: cat.color.border, background: `${cat.color.primary}12` }"
            >{{ cat.name }}</span>
          </div>
        </div>
      </div>

      <!-- Grilla de tarjetas -->
      <div class="pdf-grid">
        <div
          v-for="(card, i) in cards"
          :key="card.id"
          class="pdf-card"
          :style="{ borderColor: getCategory(card.categoryId)?.color.border ?? 'rgba(0,229,160,0.15)' }"
        >
          <!-- Barra de color superior -->
          <div
            class="pdf-card-bar"
            :style="{ background: getCategory(card.categoryId)?.color.gradient ?? 'linear-gradient(90deg,#00e5a0,#00b8d9)' }"
          ></div>

          <!-- Header de la tarjeta -->
          <div class="pdf-card-header">
            <span
              class="pdf-card-cat"
              :style="{ color: getCategory(card.categoryId)?.color.primary ?? '#00e5a0' }"
            >{{ getCategory(card.categoryId)?.name ?? '—' }}</span>
            <span class="pdf-card-num">#{{ i + 1 }}</span>
          </div>

          <!-- Pregunta -->
          <div class="pdf-card-section pdf-card-question-section">
            <div class="pdf-card-section-label">PREGUNTA</div>
            <div class="pdf-card-question">{{ card.question }}</div>
          </div>

          <!-- Separador -->
          <div
            class="pdf-card-sep"
            :style="{ background: getCategory(card.categoryId)?.color.gradient ?? 'linear-gradient(90deg,#00e5a0,#00b8d9)' }"
          ></div>

          <!-- Respuesta -->
          <div class="pdf-card-section pdf-card-answer-section">
            <div class="pdf-card-section-label pdf-card-section-label--answer">RESPUESTA</div>
            <div class="pdf-card-answer" v-html="card.answer"></div>
          </div>
        </div>
      </div>

      <!-- Footer: oculto en vista previa, visible en impresión -->
      <div class="pdf-footer print-only">
        <span>{{ set.title }}</span>
        <span>{{ exportDate }}</span>
      </div>
    </div>
  </div>
  </Teleport>
</template>

<style scoped>
/* ── Variables de color (dark theme del sitio) ── */
.pdf-modal-overlay {
  --pdf-bg:         #0a0e1a;
  --pdf-surface:    #111827;
  --pdf-card-front: #141e2e;
  --pdf-card-back:  #0d1f1a;
  --pdf-accent:     #00e5a0;
  --pdf-text:       #e8edf5;
  --pdf-muted:      #6b7a99;
  --pdf-border:     rgba(0,229,160,0.15);
  --pdf-font:       'IBM Plex Mono', 'Courier New', monospace;
  --pdf-font-sans:  system-ui, -apple-system, sans-serif;

  position: fixed;
  inset: 0;
  background: var(--pdf-bg);
  z-index: 10001;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ── Controls bar ── */
.pdf-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  background: var(--pdf-surface);
  border-bottom: 1px solid var(--pdf-border);
  flex-shrink: 0;
  gap: 1rem;
}

.pdf-controls-left,
.pdf-controls-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.pdf-meta {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.pdf-meta-title {
  font-family: var(--pdf-font-sans);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--pdf-text);
}

.pdf-meta-count {
  font-family: var(--pdf-font);
  font-size: 0.72rem;
  color: var(--pdf-muted);
}

.pdf-hint {
  font-family: var(--pdf-font-sans);
  font-size: 0.72rem;
  color: var(--pdf-muted);
  background: rgba(255,209,102,0.06);
  border-bottom: 1px solid rgba(255,209,102,0.12);
  padding: 0.5rem 1.5rem;
  flex-shrink: 0;
}

.pdf-hint strong {
  color: #ffd166;
}

/* ── Buttons ── */
.pdf-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-family: var(--pdf-font-sans);
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background 0.15s, border-color 0.15s;
}

.pdf-btn-print {
  background: rgba(0,229,160,0.15);
  border-color: rgba(0,229,160,0.35);
  color: var(--pdf-accent);
}

.pdf-btn-print:hover {
  background: rgba(0,229,160,0.25);
}

.pdf-btn-close {
  background: rgba(107,122,153,0.12);
  border-color: rgba(107,122,153,0.25);
  color: var(--pdf-muted);
}

.pdf-btn-close:hover {
  background: rgba(107,122,153,0.22);
  color: var(--pdf-text);
}

/* ── Scroll del documento ── */
.pdf-document {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  scrollbar-width: thin;
  scrollbar-color: var(--pdf-accent) transparent;
}

/* ── Portada ── */
.pdf-cover {
  background: var(--pdf-card-front);
  border: 1px solid var(--pdf-border);
  border-radius: 8px;
  overflow: clip;
  flex-shrink: 0;
  max-width: 860px;
  margin: 0 auto;
  width: 100%;
  align-self: stretch;
}

.pdf-cover-accent {
  height: 4px;
  background: linear-gradient(90deg, #00e5a0, #00b8d9, #7eb8ff);
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
}

.pdf-cover-body {
  padding: 2.5rem 3rem;
}

.pdf-cover-tag {
  font-family: var(--pdf-font);
  font-size: 0.72rem;
  color: var(--pdf-accent);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.pdf-cover-title {
  font-family: var(--pdf-font-sans);
  font-size: 2rem;
  font-weight: 700;
  color: var(--pdf-text);
  line-height: 1.2;
  margin: 0 0 1.25rem;
}

.pdf-cover-stats {
  font-family: var(--pdf-font);
  font-size: 0.78rem;
  color: var(--pdf-muted);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.25rem;
}

.pdf-cover-dot { opacity: 0.4; }

.pdf-cover-cats {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.pdf-cat-chip {
  font-family: var(--pdf-font);
  font-size: 0.7rem;
  padding: 0.25rem 0.6rem;
  border-radius: 3px;
  border: 1px solid;
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
}

/* ── Grilla de tarjetas ── */
.pdf-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  max-width: 860px;
  margin: 0 auto;
  width: 100%;
}

/* ── Tarjeta individual ── */
.pdf-card {
  background: var(--pdf-card-front);
  border: 1px solid;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  break-inside: avoid;
  page-break-inside: avoid;
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
}

.pdf-card-bar {
  height: 3px;
  flex-shrink: 0;
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
}

.pdf-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0.9rem 0.4rem;
}

.pdf-card-cat {
  font-family: var(--pdf-font);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
}

.pdf-card-num {
  font-family: var(--pdf-font);
  font-size: 0.62rem;
  color: var(--pdf-muted);
  opacity: 0.6;
}

.pdf-card-section {
  padding: 0.4rem 0.9rem 0.7rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.pdf-card-section-label {
  font-family: var(--pdf-font);
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--pdf-muted);
  opacity: 0.7;
}

.pdf-card-section-label--answer {
  color: var(--pdf-accent);
  opacity: 0.8;
}

.pdf-card-question {
  font-family: var(--pdf-font-sans);
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--pdf-text);
  line-height: 1.5;
}

.pdf-card-sep {
  height: 1px;
  margin: 0 0.9rem;
  opacity: 0.4;
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
}

.pdf-card-answer {
  font-family: var(--pdf-font-sans);
  font-size: 0.78rem;
  line-height: 1.6;
  color: var(--pdf-text);
  opacity: 0.9;
}

/* Estilos del HTML de la respuesta */
.pdf-card-answer :deep(strong) {
  color: var(--pdf-accent);
  font-weight: 600;
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
}

.pdf-card-answer :deep(em) {
  color: #ffd166;
  font-style: italic;
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
}

.pdf-card-answer :deep(ul) {
  list-style: none;
  padding-left: 0;
  margin: 0.2rem 0 0;
}

.pdf-card-answer :deep(ul li) {
  padding-left: 1rem;
  position: relative;
  margin-bottom: 0.15rem;
}

.pdf-card-answer :deep(ul li::before) {
  content: '→ ';
  position: absolute;
  left: 0;
  color: var(--pdf-accent);
  font-family: var(--pdf-font);
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
}

.pdf-card-answer :deep(p) {
  margin: 0 0 0.2rem;
}

.pdf-card-answer :deep(code) {
  font-family: var(--pdf-font);
  font-size: 0.75rem;
  background: rgba(0,229,160,0.08);
  padding: 0.1rem 0.3rem;
  border-radius: 2px;
  color: var(--pdf-accent);
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
}

/* ── Footer ── */
.pdf-footer {
  font-family: var(--pdf-font);
  font-size: 0.65rem;
  color: var(--pdf-muted);
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-top: 1px solid var(--pdf-border);
  max-width: 860px;
  margin: 0 auto;
  width: 100%;
}

/* ── Elementos sólo visibles en impresión ── */
.print-only {
  display: none;
}
</style>

<!-- Estilos de impresión en bloque NO-SCOPED para que los selectores
     globales (body, html, body > *) funcionen correctamente al imprimir -->
<style>
@media print {
  /* Fondo oscuro en toda la página */
  html, body {
    background: #0a0e1a !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  /* Forzar colores de fondo en todo */
  * {
    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
  }

  /* El modal está teleportado como hijo directo de body.
     Ocultar todo lo demás con display:none evita páginas fantasma. */
  body > *:not(.pdf-modal-overlay) {
    display: none !important;
  }

  /* El overlay fluye normalmente — sin position fixed/absolute */
  .pdf-modal-overlay {
    position: static !important;
    display: flex !important;
    flex-direction: column !important;
    width: 100% !important;
    height: auto !important;
    overflow: visible !important;
    background: #0a0e1a !important;
  }

  /* Ocultar controles y hint */
  .no-print,
  .no-print * {
    display: none !important;
  }

  /* El documento ocupa toda la página sin scroll */
  .pdf-document {
    flex: none !important;
    overflow: visible !important;
    padding: 0.5cm 1cm !important;
    gap: 0.6rem !important;
    display: flex !important;
    flex-direction: column !important;
  }

  /* Sin salto de página forzado en la portada */
  .pdf-cover {
    break-after: auto !important;
    page-break-after: auto !important;
    margin: 0 auto 0.6rem !important;
    max-width: 100% !important;
    overflow: clip !important;
    flex-shrink: 0 !important;
    background: #141e2e !important;
    border-radius: 8px !important;
  }

  /* Grilla de tarjetas */
  .pdf-grid {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr) !important;
    max-width: 100% !important;
    gap: 0.5rem !important;
    padding: 0 !important;
  }

  /* Tarjetas: mantener colores de fondo */
  .pdf-card {
    break-inside: avoid !important;
    page-break-inside: avoid !important;
    background: #141e2e !important;
  }

  .pdf-card-answer-section .pdf-card-answer {
    background: transparent !important;
  }

  /* Footer visible */
  .print-only {
    display: flex !important;
    padding: 0.2cm 0 !important;
  }

  @page {
    size: A4;
    margin: 0;
    background: #0a0e1a;
  }
}
</style>
