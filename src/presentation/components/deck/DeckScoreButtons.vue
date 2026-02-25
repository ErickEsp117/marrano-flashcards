<script setup lang="ts">
defineProps<{
  visible: boolean
}>()

defineEmits<{
  known: []
  review: []
}>()
</script>

<template>
  <div class="know-btns" v-show="visible">
    <button class="know-btn know-yes" @click="$emit('known')">&#10003; Lo se</button>
    <button class="know-btn know-no" @click="$emit('review')">&#10007; Repasar</button>
  </div>
</template>

<style scoped>
.know-btns {
  display: flex;
  gap: 0.8rem;
  margin-top: 1rem;
}

.know-btn {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
  padding: 0.5rem 1.2rem;
  border-radius: 3px;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  letter-spacing: 0.08em;
}

.know-yes {
  background: rgba(0,229,160,0.15);
  color: var(--accent);
  border: 1px solid var(--accent);
}

.know-yes:hover {
  background: rgba(0,229,160,0.25);
}

.know-no {
  background: rgba(255,107,107,0.15);
  color: var(--accent2);
  border: 1px solid var(--accent2);
}

.know-no:hover {
  background: rgba(255,107,107,0.25);
}
</style>
