<script setup lang="ts">
import HeaderTag from './HeaderTag.vue'
import HeaderTitle from './HeaderTitle.vue'
import HeaderSubtitle from './HeaderSubtitle.vue'

defineProps<{
  tag: string
  title: string
  accentWord: string
  subtitle: string
}>()
</script>

<template>
  <header class="app-header">
    <HeaderTag :text="tag" />
    <HeaderTitle :text="title" :accent-word="accentWord" />
    <HeaderSubtitle :text="subtitle" />
  </header>
</template>

<style scoped>
.app-header {
  position: relative;
  z-index: 10;
  padding: 3rem 2rem 2rem;
  text-align: center;
  border-bottom: 1px solid var(--border);
}
</style>
