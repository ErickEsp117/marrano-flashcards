<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  text: string
  accentWord: string
}>()

const parts = computed(() => {
  const idx = props.text.indexOf(props.accentWord)
  if (idx === -1) return { before: props.text, accent: '', after: '' }
  return {
    before: props.text.slice(0, idx),
    accent: props.accentWord,
    after: props.text.slice(idx + props.accentWord.length),
  }
})
</script>

<template>
  <h1 class="header-title">
    {{ parts.before }}<span>{{ parts.accent }}</span>{{ parts.after }}
  </h1>
</template>

<style scoped>
.header-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.8rem, 4vw, 3rem);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--text);
  margin-bottom: 0.5rem;
}

.header-title span {
  color: var(--accent);
}
</style>
