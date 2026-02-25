<script setup lang="ts">
import type { HtmlContent } from '@/domain/value-objects/HtmlContent'
import CardBackLabel from './CardBackLabel.vue'
import CardAnswer from './CardAnswer.vue'

defineProps<{
  answer: HtmlContent
}>()
</script>

<template>
  <div class="card-back">
    <CardBackLabel />
    <CardAnswer :html="answer" />
  </div>
</template>

<style scoped>
.card-back {
  position: absolute;
  inset: 0;
  border-radius: 6px;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--card-back);
  border: 1px solid rgba(0,229,160,0.2);
  transform: rotateY(180deg);
}
</style>
