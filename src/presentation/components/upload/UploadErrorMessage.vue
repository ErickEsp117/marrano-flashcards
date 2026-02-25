<script setup lang="ts">
import BaseButton from '../common/BaseButton.vue'

defineProps<{
  message: string
}>()

defineEmits<{
  retry: []
}>()
</script>

<template>
  <div class="upload-error">
    <div class="upload-error__msg">{{ message }}</div>
    <BaseButton label="Reintentar" variant="danger" @click="$emit('retry')" />
  </div>
</template>

<style scoped>
.upload-error {
  padding: 1rem 1.5rem;
  background: rgba(255,107,107,0.08);
  border: 1px solid rgba(255,107,107,0.3);
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.upload-error__msg {
  font-size: 0.8rem;
  color: var(--accent2);
}
</style>
