<script setup lang="ts">
defineProps<{
  label: string
  disabled: boolean
}>()

defineEmits<{
  click: []
}>()
</script>

<template>
  <button class="nav-btn" :disabled="disabled" @click="$emit('click')">
    {{ label }}
  </button>
</template>

<style scoped>
.nav-btn {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  padding: 0.6rem 1.5rem;
  border: 1px solid var(--accent);
  background: transparent;
  color: var(--accent);
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-btn:hover:not(:disabled) {
  background: var(--glow);
}

.nav-btn:disabled {
  opacity: 0.25;
  cursor: not-allowed;
}
</style>
