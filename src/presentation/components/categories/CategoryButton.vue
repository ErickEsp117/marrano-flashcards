<script setup lang="ts">
defineProps<{
  categoryId: string
  label: string
  color: string
  isActive: boolean
}>()

defineEmits<{
  click: [categoryId: string]
}>()
</script>

<template>
  <button
    class="cat-btn"
    :class="{ active: isActive }"
    :style="{ borderColor: color, color }"
    @click="$emit('click', categoryId)"
  >
    {{ label }}
  </button>
</template>

<style scoped>
.cat-btn {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.4rem 1rem;
  border-radius: 2px;
  border: 1px solid;
  cursor: pointer;
  transition: all 0.2s;
  background: transparent;
}

.cat-btn.active {
  opacity: 1;
  filter: brightness(1.5);
  box-shadow: 0 0 12px currentColor;
}

.cat-btn:not(.active) {
  opacity: 0.5;
}

.cat-btn:not(.active):hover {
  opacity: 0.8;
}
</style>
