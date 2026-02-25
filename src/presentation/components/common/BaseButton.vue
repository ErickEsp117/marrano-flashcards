<script setup lang="ts">
defineProps<{
  label: string
  variant?: 'default' | 'accent' | 'danger'
  disabled?: boolean
}>()

defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    class="base-btn"
    :class="[`base-btn--${variant ?? 'default'}`]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    {{ label }}
  </button>
</template>

<style scoped>
.base-btn {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  padding: 0.4rem 0.9rem;
  border: 1px solid rgba(255,255,255,0.15);
  background: transparent;
  color: var(--muted);
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s;
}

.base-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.base-btn:disabled {
  opacity: 0.25;
  cursor: not-allowed;
}

.base-btn--accent {
  border-color: var(--accent);
  color: var(--accent);
}

.base-btn--accent:hover {
  background: rgba(0,229,160,0.1);
}

.base-btn--danger {
  border-color: var(--accent2);
  color: var(--accent2);
}

.base-btn--danger:hover {
  background: rgba(255,107,107,0.1);
}
</style>
