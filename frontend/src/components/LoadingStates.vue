<template>
  <!-- Initial loading skeleton -->
  <SkeletonLoader v-if="loading && currentPage === 1" type="grid" :count="6" />

  <!-- Image loading progress -->
  <div v-else-if="loadingImages && isInitialLoad" class="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
    <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center">
      <div class="mb-6">
        <div class="w-16 h-16 mx-auto mb-4 relative">
          <div class="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
          <div class="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-2xl">🐕</span>
          </div>
        </div>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">Loading Dog Images</h3>
        <p class="text-gray-600">Preparing your furry friends...</p>
      </div>
      
      <div class="mb-4">
        <div class="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{{ imagesLoaded }}/{{ totalImagesToLoad }}</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            class="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out relative"
            :style="{ width: `${(imagesLoaded / totalImagesToLoad) * 100}%` }"
          >
            <div class="absolute inset-0 bg-white/30 animate-pulse"></div>
          </div>
        </div>
      </div>
      
      <div class="text-xs text-gray-500">
        {{ Math.round((imagesLoaded / totalImagesToLoad) * 100) }}% complete
      </div>
    </div>
  </div>

  <!-- Loading more indicator -->
  <div v-if="scrollLoading" class="flex justify-center py-8">
    <div class="bg-white rounded-xl shadow-lg px-6 py-4 flex items-center space-x-3 border border-gray-100">
      <div class="relative">
        <div class="w-6 h-6 border-2 border-blue-100 rounded-full"></div>
        <div class="absolute inset-0 w-6 h-6 border-2 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-lg">🐕</span>
        <span class="text-gray-700 font-medium">Loading more dogs...</span>
        <span class="text-lg animate-bounce">🐕</span>
      </div>
    </div>
  </div>
  
</template>

<script lang="ts" setup>
import SkeletonLoader from './SkeletonLoader.vue';

defineProps<{
  loading: boolean;
  currentPage: number;
  loadingImages: boolean;
  isInitialLoad: boolean;
  imagesLoaded: number;
  totalImagesToLoad: number;
  scrollLoading: boolean;
}>();
</script>
