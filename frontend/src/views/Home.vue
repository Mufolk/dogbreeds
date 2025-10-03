<template>
  <div class="max-w-6xl mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">🐶 Dog Breeds Explorer</h1>
    <SearchInput :breeds="allBreeds" @filter="searchBreeds" />

    <ErrorDisplay :error="error" />

    <!-- Loading skeleton - show exactly 6 cards while waiting for images -->
    <SkeletonLoader v-if="loading || (isInitialLoad && filteredBreeds.length === 0)" type="grid" :count="6" />

    <!-- Breeds grid -->
    <BreedsGrid
      v-if="!loading"
      :breeds="filteredBreeds"
      :breed-image-map="breedImageMap"
      :is-favorite="isFavorite"
      @select="openModal"
      @toggle-favorite="toggleFavorite"
    />

    <!-- Loading more indicator - appears at the bottom -->
    <div v-if="scrollLoading" class="flex justify-center py-8">
      <SkeletonLoader type="grid" :count="6" />
    </div>

    <EndOfResults
      :show="!hasMoreBreeds && !loading && !scrollLoading && visibleDogs.length > 0 && visibleDogs.length >= totalBreeds"
      :total-breeds="totalBreeds"
    />

    <BreedModal
      :show="modalShow"
      :breed="modalBreed"
      :images="modalImages"
      :isFavorite="isFavorite(modalBreed)"
      @close="closeModal"
      @toggle-favorite="onModalToggleFavorite"
    />
  </div>
</template>

<script lang="ts" setup>
import BreedModal from '@/components/BreedModal.vue';
import SearchInput from '@/components/SearchInput.vue';
import ErrorDisplay from '@/components/ErrorDisplay.vue';
import BreedsGrid from '@/components/BreedsGrid.vue';
import EndOfResults from '@/components/EndOfResults.vue';
import SkeletonLoader from '@/components/SkeletonLoader.vue';
import { useBreedsData } from '@/composables/useBreedsData';

// Use the composable to get all the data and methods
const {
  // State
  allBreeds,
  loading,
  error,
  modalShow,
  modalBreed,
  modalImages,
  breedImageMap,
  currentPage,
  hasMoreBreeds,
  totalBreeds,
  isInitialLoad,
  scrollLoading,
  visibleDogs,
  
  // Computed
  filteredBreeds,
  
  // Methods
  searchBreeds,
  openModal,
  isFavorite,
  toggleFavorite,
  onModalToggleFavorite,
  closeModal
} = useBreedsData();
</script>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.25s;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}
.modal-popup-enter-active, .modal-popup-leave-active {
  transition: transform 0.3s, opacity 0.2s;
}
.modal-popup-enter-from, .modal-popup-leave-to {
  transform: scale(0.85);
  opacity: 0;
}
</style>
