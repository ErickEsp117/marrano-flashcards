<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  modelValue: string
  hasKey: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  save: []
  clear: []
}>()

const showKey = ref(false)

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="api-key-input">
    <label class="api-key-label">DeepSeek API Key</label>
    <div class="api-key-row">
      <template v-if="hasKey">
        <input
          class="api-key-field"
          :type="showKey ? 'text' : 'password'"
          :value="modelValue"
          readonly
        />
        <button class="api-key-btn api-key-btn--show" @click="showKey = !showKey">
          {{ showKey ? 'Ocultar' : 'Mostrar' }}
        </button>
        <button class="api-key-btn api-key-btn--clear" @click="$emit('clear')">Borrar</button>
      </template>
      <template v-else>
        <input
          class="api-key-field"
          type="password"
          placeholder="sk-..."
          :value="modelValue"
          @input="onInput"
        />
        <button
          class="api-key-btn api-key-btn--save"
          :disabled="!props.modelValue"
          @click="$emit('save')"
        >
          Guardar
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.api-key-input {
  width: 100%;
  max-width: 500px;
}

.api-key-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--muted);
  display: block;
  margin-bottom: 0.5rem;
}

.api-key-row {
  display: flex;
  gap: 0.5rem;
}

.api-key-field {
  flex: 1;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 0.6rem 0.8rem;
  color: var(--text);
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.8rem;
  outline: none;
  transition: border-color 0.2s;
}

.api-key-field:focus {
  border-color: var(--accent);
}

.api-key-btn {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid;
  cursor: pointer;
  background: transparent;
  transition: all 0.2s;
}

.api-key-btn--save {
  border-color: var(--accent);
  color: var(--accent);
}

.api-key-btn--save:hover:not(:disabled) {
  background: rgba(0,229,160,0.1);
}

.api-key-btn--save:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.api-key-btn--show {
  border-color: var(--muted);
  color: var(--muted);
}

.api-key-btn--clear {
  border-color: var(--accent2);
  color: var(--accent2);
}

.api-key-btn--clear:hover {
  background: rgba(255,107,107,0.1);
}
</style>
