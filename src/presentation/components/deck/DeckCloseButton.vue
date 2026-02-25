<script setup lang="ts">
import IconButton from '../common/IconButton.vue'

defineEmits<{
  click: []
}>()
</script>

<template>
  <IconButton icon="✕" ariaLabel="Cerrar modo estudio" @click="$emit('click')" />
</template>
