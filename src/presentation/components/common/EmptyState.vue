<script setup lang="ts">
defineProps<{
  icon?: string
  title: string
  description?: string
}>()
</script>

<template>
  <div class="empty-state">
    <div v-if="icon" class="empty-state__icon">{{ icon }}</div>
    <h3 class="empty-state__title">{{ title }}</h3>
    <p v-if="description" class="empty-state__desc">{{ description }}</p>
    <div class="empty-state__actions">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.empty-state {
  text-align: center;
  padding: 3rem 2rem;
}

.empty-state__icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state__title {
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  color: var(--text);
  margin-bottom: 0.5rem;
}

.empty-state__desc {
  font-size: 0.85rem;
  color: var(--muted);
  margin-bottom: 1.5rem;
}

.empty-state__actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}
</style>
