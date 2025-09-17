<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-content">
      <h2>Something went wrong</h2>
      <p>{{ errorMessage }}</p>
      <button @click="retry" class="retry-button">
        Try Again
      </button>
    </div>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue';

const hasError = ref(false);
const errorMessage = ref('');

const emit = defineEmits<{
  error: [error: Error]
}>();

onErrorCaptured((error: Error) => {
  hasError.value = true;
  errorMessage.value = error.message || 'An unexpected error occurred';
  emit('error', error);
  console.error('Error caught by boundary:', error);
  return false;
});

const retry = () => {
  hasError.value = false;
  errorMessage.value = '';
};
</script>

<style scoped>
.error-boundary {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 2rem;
}

.error-content {
  text-align: center;
  max-width: 400px;
}

.error-content h2 {
  color: #ef4444;
  margin-bottom: 1rem;
}

.error-content p {
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.retry-button {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #2563eb;
}
</style>