<script setup lang="ts">
import TagLabel from '../common/TagLabel.vue'

defineProps<{
  text: string
}>()
</script>

<template>
  <TagLabel :text="text" />
</template>
