<script setup lang="ts">
import type { Category } from '@/domain/entities/Category'
import CategoryButton from './CategoryButton.vue'

defineProps<{
  categories: Category[]
  activeFilter: string
}>()

defineEmits<{
  filterChange: [categoryId: string]
}>()
</script>

<template>
  <nav class="categories">
    <CategoryButton
      category-id="all"
      label="Todas"
      color="var(--accent)"
      :is-active="activeFilter === 'all'"
      @click="$emit('filterChange', 'all')"
    />
    <CategoryButton
      v-for="cat in categories"
      :key="cat.id"
      :category-id="cat.id"
      :label="cat.name"
      :color="cat.color.primary"
      :is-active="activeFilter === cat.id"
      @click="$emit('filterChange', cat.id)"
    />
  </nav>
</template>

<style scoped>
.categories {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  padding: 1.5rem 2rem;
  position: relative;
  z-index: 10;
  border-bottom: 1px solid var(--border);
}
</style>
