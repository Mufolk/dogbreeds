<template>
  <div v-if="hasError" class="error-boundary">
    <div class="max-w-md mx-auto mt-8 p-6 bg-red-50 border border-red-200 rounded-lg shadow-sm">
      <div class="flex items-center mb-4">
        <div class="flex-shrink-0">
          <span class="text-2xl">⚠️</span>
        </div>
        <div class="ml-3">
          <h3 class="text-lg font-medium text-red-800">Something went wrong</h3>
        </div>
      </div>
      
      <div class="text-red-700 mb-4">
        <p>{{ errorMessage }}</p>
      </div>
      
      <div class="flex gap-3">
        <button
          @click="retry"
          class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
        >
          Try Again
        </button>
        <button
          @click="goHome"
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200 text-sm font-medium"
        >
          Go Home
        </button>
      </div>
    </div>
  </div>
  
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const hasError = ref(false);
const errorMessage = ref('');

const retry = () => {
  hasError.value = false;
  errorMessage.value = '';
  // Force a page refresh to reset the component state
  window.location.reload();
};

const goHome = () => {
  hasError.value = false;
  errorMessage.value = '';
  router.push('/');
};

onErrorCaptured((error: Error) => {
  console.error('Error caught by boundary:', error);
  hasError.value = true;
  errorMessage.value = error.message || 'An unexpected error occurred';
  return false; // Prevent the error from propagating further
});
</script>

<style scoped>
.error-boundary {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
