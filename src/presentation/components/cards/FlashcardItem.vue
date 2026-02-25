<script setup lang="ts">
import { computed } from 'vue'
import type { Flashcard } from '@/domain/entities/Flashcard'
import type { Category } from '@/domain/entities/Category'
import CardFront from './CardFront.vue'
import CardBack from './CardBack.vue'

const props = defineProps<{
  card: Flashcard
  category: Category
  isFlipped: boolean
  animationDelay?: number
}>()

defineEmits<{
  flip: []
}>()

const style = computed(() => ({
  animationDelay: `${props.animationDelay ?? 0}s`,
}))
</script>

<template>
  <div
    class="card-wrap"
    :class="{ flipped: isFlipped }"
    :style="style"
    @click="$emit('flip')"
  >
    <div class="card-inner">
      <CardFront
        :category-name="category.name"
        :category-color="category.color.primary"
        :category-gradient="category.color.gradient"
        :question="card.question"
        :border-color="category.color.border"
      />
      <CardBack :answer="card.answer" />
    </div>
  </div>
</template>

<style scoped>
.card-wrap {
  perspective: 1000px;
  height: 240px;
  cursor: pointer;
  animation: fadeUp 0.4s ease backwards;
}

.card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.55s cubic-bezier(0.23, 1, 0.32, 1);
}

.card-wrap.flipped .card-inner {
  transform: rotateY(180deg);
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
