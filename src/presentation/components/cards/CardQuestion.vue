<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>

<template>
  <div class="card-question">{{ text }}</div>
</template>

<style scoped>
.card-question {
  font-family: 'Playfair Display', serif;
  font-size: 1rem;
  line-height: 1.45;
  font-weight: 700;
  flex: 1;
  display: flex;
  align-items: center;
}
</style>
