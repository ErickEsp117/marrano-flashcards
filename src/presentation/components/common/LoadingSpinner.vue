<script setup lang="ts">
defineProps<{
  size?: 'sm' | 'md' | 'lg'
}>()
</script>

<template>
  <div class="spinner" :class="`spinner--${size ?? 'md'}`"></div>
</template>

<style scoped>
.spinner {
  border: 2px solid rgba(255,255,255,0.1);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.spinner--sm { width: 16px; height: 16px; }
.spinner--md { width: 32px; height: 32px; }
.spinner--lg { width: 48px; height: 48px; }

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
