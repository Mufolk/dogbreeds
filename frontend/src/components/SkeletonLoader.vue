<template>
  <div class="skeleton-loader">
    <!-- Breed Card Skeleton -->
    <div v-if="type === 'card'" class="flex flex-col sm:flex-row items-center p-4 bg-white rounded-xl shadow animate-pulse">
      <!-- Image skeleton -->
      <div class="w-full sm:w-28 h-48 sm:h-28 mb-3 sm:mb-0 sm:mr-4 flex-shrink-0 rounded-lg bg-gray-200"></div>
      
      <!-- Content skeleton -->
      <div class="flex-1 flex justify-between items-center w-full min-w-0">
        <div class="h-6 bg-gray-200 rounded w-3/4"></div>
        <div class="w-6 h-6 bg-gray-200 rounded"></div>
      </div>
    </div>

    <!-- Grid Skeleton -->
    <div v-else-if="type === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <div v-for="i in count" :key="i" class="flex flex-col sm:flex-row items-center p-4 bg-white rounded-xl shadow animate-pulse group cursor-pointer hover:bg-blue-100 transition">
        <div class="w-full sm:w-28 h-48 sm:h-28 mb-3 sm:mb-0 sm:mr-4 flex-shrink-0 rounded-lg bg-gray-200"></div>
        <div class="flex-1 flex justify-between items-center w-full min-w-0">
          <div class="h-6 bg-gray-200 rounded w-3/4"></div>
          <div class="w-6 h-6 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Text Skeleton -->
    <div v-else-if="type === 'text'" class="animate-pulse">
      <div class="h-4 bg-gray-200 rounded mb-2" :style="{ width: width }"></div>
    </div>

    <!-- Button Skeleton -->
    <div v-else-if="type === 'button'" class="animate-pulse">
      <div class="h-10 bg-gray-200 rounded" :style="{ width: width }"></div>
    </div>

    <!-- Modal Skeleton -->
    <div v-else-if="type === 'modal'" class="animate-pulse">
      <div class="bg-white rounded-lg p-6 max-w-md mx-auto">
        <div class="h-8 bg-gray-200 rounded mb-4"></div>
        <div class="h-48 bg-gray-200 rounded mb-4"></div>
        <div class="flex gap-3">
          <div class="h-10 bg-gray-200 rounded flex-1"></div>
          <div class="h-10 bg-gray-200 rounded flex-1"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  type: 'card' | 'grid' | 'text' | 'button' | 'modal';
  count?: number;
  width?: string;
}>();
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
