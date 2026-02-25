<script setup lang="ts">
defineProps<{
  icon: string
  ariaLabel: string
}>()

defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    class="icon-btn"
    :aria-label="ariaLabel"
    @click="$emit('click')"
  >
    {{ icon }}
  </button>
</template>

<style scoped>
.icon-btn {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.2);
  color: var(--muted);
  font-size: 1.2rem;
  width: 36px;
  height: 36px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.icon-btn:hover {
  border-color: var(--accent2);
  color: var(--accent2);
}
</style>
