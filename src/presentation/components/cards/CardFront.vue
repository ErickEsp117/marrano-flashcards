<script setup lang="ts">
import CardCategoryLabel from './CardCategoryLabel.vue'
import CardQuestion from './CardQuestion.vue'
import CardFlipHint from './CardFlipHint.vue'

defineProps<{
  categoryName: string
  categoryColor: string
  categoryGradient: string
  question: string
  borderColor: string
}>()
</script>

<template>
  <div class="card-front" :style="{ borderColor, '--bar-gradient': categoryGradient }">
    <CardCategoryLabel :name="categoryName" :color="categoryColor" />
    <CardQuestion :text="question" />
    <CardFlipHint />
  </div>
</template>

<style scoped>
.card-front {
  position: absolute;
  inset: 0;
  border-radius: 6px;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--card-front);
  border: 1px solid var(--border);
}

.card-front::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  border-radius: 6px 6px 0 0;
  background: var(--bar-gradient);
}
</style>
