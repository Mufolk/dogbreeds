<template>
  <div class="max-w-6xl mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">🐶 Dog Breeds Explorer</h1>
    <SearchInput :breeds="allBreeds" @filter="searchBreeds" />

    <!-- Error display -->
    <div v-if="error" class="max-w-md mx-auto mb-6">
      <div class="bg-red-50 border border-red-200 rounded-xl shadow-lg p-4">
        <div class="flex items-center space-x-3">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span class="text-red-600 text-lg">⚠️</span>
            </div>
          </div>
          <div class="flex-1">
            <p class="text-red-800 font-medium">{{ error }}</p>
          </div>
        </div>
      </div>
    </div>

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

    <!-- Breeds grid -->
    <ul v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <BreedCard
        v-for="breed in filteredBreeds"
        :key="breed"
        :breed="breed"
        :image="breedImageMap[breed]"
        :isFavorite="isFavorite(breed)"
        @select="openModal(breed)"
        @toggle-favorite="toggleFavorite(breed)"
        v-slot:icon="{ isFavorite }"
      >
        <span
          :class="[
            'cursor-pointer text-xl select-none transition-colors duration-200',
            isFavorite ? 'text-pink-600' : 'text-gray-400 hover:text-pink-600'
          ]"
        >
          ♥
        </span>
      </BreedCard>
    </ul>

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
    
    <!-- Preloading indicator -->
    <div v-if="isPreloading || isLoadingNextPage" class="flex justify-center py-4">
      <div class="bg-blue-50 rounded-lg px-4 py-2 flex items-center space-x-2 border border-blue-200">
        <div class="w-4 h-4 border-2 border-blue-300 rounded-full border-t-transparent animate-spin"></div>
        <span class="text-blue-700 text-sm font-medium">
          {{ isLoadingNextPage ? 'Preparing next page...' : 'Preloading next page...' }}
        </span>
        <span class="text-blue-500">🔄</span>
      </div>
    </div>

    <!-- End of results indicator -->
    <div v-if="!hasMoreBreeds && !loading && !scrollLoading && visibleDogs.length > 0 && visibleDogs.length >= totalBreeds" class="flex justify-center py-8">
      <div class="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-lg px-8 py-6 text-center border border-green-200">
        <div class="text-4xl mb-3">🎉</div>
        <h3 class="text-lg font-semibold text-gray-800 mb-2">You've seen all the dog breeds!</h3>
        <p class="text-gray-600 text-sm">That's all {{ totalBreeds }} breeds in our collection</p>
        <div class="mt-4 flex justify-center space-x-2">
          <span class="text-2xl">🐕</span>
          <span class="text-2xl">🐶</span>
          <span class="text-2xl">🐕</span>
        </div>
      </div>
    </div>

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
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import BreedCard from '@/components/BreedCard.vue';
import BreedModal from '@/components/BreedModal.vue';
import SearchInput from '@/components/SearchInput.vue';
import SkeletonLoader from '@/components/SkeletonLoader.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import apiService from '@/services/api';

const breeds = ref<string[]>([]);
const allBreeds = ref<string[]>([]); // For search suggestions
const loading = ref(false);
const loadingMore = ref(false);
const loadingImages = ref(false); // New state for image loading
const error = ref('');
const search = ref('');
const favorites = ref<string[]>([]);
const modalShow = ref(false);
const modalBreed = ref('');
const modalImages = ref<string[]>([]);
const searchTerm = ref('');
const breedImageMap = ref<Record<string, string>>({});

// Pagination state
const currentPage = ref(1);
const hasMoreBreeds = ref(true);
const totalBreeds = ref(0);
const ITEMS_PER_PAGE = 30;

// Loading states
const isInitialLoad = ref(true);
const imagesLoaded = ref(0);
const totalImagesToLoad = ref(0);

// Pagination with preloading
const displayedBreeds = ref<string[]>([]);
const preloadedBreeds = ref<string[]>([]);
const preloadedImages = ref<Record<string, string>>({});
const isPreloading = ref(false);
const scrollLoading = ref(false);

// New state for better scroll management
const visibleDogs = ref<string[]>([]);
const isLoadingNextPage = ref(false);
const nextPageReady = ref(false);

const searchBreeds = async (search: string) => {
  searchTerm.value = search;
  // Reset pagination system when searching
  displayedBreeds.value = [];
  preloadedBreeds.value = [];
  preloadedImages.value = {};
  visibleDogs.value = [];
  nextPageReady.value = false;
  isLoadingNextPage.value = false;
  await loadBreeds(1);
};

const filteredBreeds = computed(() => {
  return visibleDogs.value; // Show only visible dogs
});

const openModal = async (breed: string) => {
  modalBreed.value = breed;
  modalShow.value = true;
  modalImages.value = [];
  try {
    modalImages.value = await apiService.getBreedImages(breed);
  } catch {
    modalImages.value = [];
  }
};

const loadFavorites = async () => {
  try {
    favorites.value = await apiService.getFavorites();
  } catch (error) {
    console.error('Error loading favorites:', error);
  }
};

const loadAllBreedsForSuggestions = async () => {
  try {
    // Load a large number of breeds for search suggestions
    const response = await apiService.getAllBreeds(1, 200);
    allBreeds.value = response.breeds;
  } catch (error) {
    console.error('Error loading breeds for suggestions:', error);
  }
};

const loadBreeds = async (page: number = 1, append: boolean = false) => {
  if (page === 1) {
    loading.value = true;
    loadingImages.value = true;
    isInitialLoad.value = true;
    imagesLoaded.value = 0;
    displayedBreeds.value = [];
    preloadedBreeds.value = [];
    preloadedImages.value = {};
    visibleDogs.value = [];
    nextPageReady.value = false;
  }
  
  error.value = '';
  
  try {
    const response = await apiService.getAllBreeds(page, ITEMS_PER_PAGE, searchTerm.value);
    
    if (append) {
      breeds.value = [...breeds.value, ...response.breeds];
    } else {
      breeds.value = response.breeds;
    }
    currentPage.value = response.pagination.currentPage;
    hasMoreBreeds.value = response.pagination.hasNextPage;
    totalBreeds.value = response.pagination.totalBreeds;
    
    // If it's the first page, preload all images before showing
    if (page === 1) {
      await preloadAllImages(response.breeds);
      // After preloading, show the first 30 breeds
      visibleDogs.value = response.breeds;
      displayedBreeds.value = response.breeds;
      // Preload the next page in background
      if (hasMoreBreeds.value) {
        loadNextPageForPreloading();
      }
    }
    
  } catch (err) {
    error.value = 'Failed to load breeds';
    console.error('Error loading breeds:', err);
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

const loadNextPageForPreloading = async () => {
  if (isPreloading.value || !hasMoreBreeds.value || isLoadingNextPage.value) return;
  
  isLoadingNextPage.value = true;
  nextPageReady.value = false;
  
  try {
    const nextPage = currentPage.value + 1;
    const response = await apiService.getAllBreeds(nextPage, ITEMS_PER_PAGE, searchTerm.value);
    
    if (response.breeds.length > 0) {
      await preloadNextPage(response.breeds);
      nextPageReady.value = true;
    }
  } catch (error) {
    console.error('Error loading next page for preloading:', error);
  } finally {
    isLoadingNextPage.value = false;
  }
};

const preloadNextPage = async (breedsToPreload: string[]) => {
  if (isPreloading.value) return;
  
  isPreloading.value = true;
  preloadedBreeds.value = breedsToPreload;
  
  // Preload images for the next page
  for (const breed of breedsToPreload) {
    if (!preloadedImages.value[breed]) {
      try {
        const images = await apiService.getBreedImages(breed);
        if (images?.length) {
          preloadedImages.value[breed] = images[0];
        }
      } catch (error) {
        console.error(`Error preloading images for ${breed}:`, error);
      }
    }
  }
  
  isPreloading.value = false;
};

const loadMoreBreeds = async () => {
  // Prevent multiple simultaneous calls
  if (!hasMoreBreeds.value || scrollLoading.value || isLoadingNextPage.value) return;
  
  scrollLoading.value = true;
  
  try {
    // If we have preloaded breeds ready, show them immediately
    if (nextPageReady.value && preloadedBreeds.value.length > 0) {
      // Simulate 3s delay for better UX
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Add preloaded breeds to visible dogs
      visibleDogs.value = [...visibleDogs.value, ...preloadedBreeds.value];
      
      // Merge preloaded images into main image map
      breedImageMap.value = { ...breedImageMap.value, ...preloadedImages.value };
      
      // Update pagination
      currentPage.value = currentPage.value + 1;
      
      // Clear preloaded data
      preloadedBreeds.value = [];
      preloadedImages.value = {};
      nextPageReady.value = false;
      
      // Start preloading the next page in background
      if (hasMoreBreeds.value) {
        loadNextPageForPreloading();
      }
    } else {
      // If no preloaded data, wait for it to be ready
      console.log('Waiting for next page to be ready...');
      
      // Wait for the next page to be ready (with timeout)
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max wait
      
      while (!nextPageReady.value && attempts < maxAttempts && hasMoreBreeds.value) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      
      // If we have data ready after waiting, show it
      if (nextPageReady.value && preloadedBreeds.value.length > 0) {
        // Simulate 3s delay
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Add preloaded breeds to visible dogs
        visibleDogs.value = [...visibleDogs.value, ...preloadedBreeds.value];
        
        // Merge preloaded images into main image map
        breedImageMap.value = { ...breedImageMap.value, ...preloadedImages.value };
        
        // Update pagination
        currentPage.value = currentPage.value + 1;
        
        // Clear preloaded data
        preloadedBreeds.value = [];
        preloadedImages.value = {};
        nextPageReady.value = false;
        
        // Start preloading the next page in background
        if (hasMoreBreeds.value) {
          loadNextPageForPreloading();
        }
      } else {
        console.log('Next page not ready, skipping this scroll trigger');
      }
    }
  } catch (error) {
    console.error('Error in loadMoreBreeds:', error);
  } finally {
    scrollLoading.value = false;
  }
};

const isFavorite = (breed: string) => favorites.value.includes(breed);

const toggleFavorite = async (breed: string) => {
  console.log('toggleFavorite called with breed:', breed);
  try {
    if (isFavorite(breed)) {
      console.log('Removing favorite:', breed);
      await apiService.removeFavorite(breed);
    } else {
      console.log('Adding favorite:', breed);
      await apiService.addFavorite(breed);
    }
    await loadFavorites();
  } catch (error) {
    console.error('Error toggling favorite:', error);
  }
};

const onModalToggleFavorite = () => {
  toggleFavorite(modalBreed.value);
};

const closeModal = () => {
  modalShow.value = false;
  modalBreed.value = '';
  modalImages.value = [];
};

const preloadAllImages = async (breedsToLoad: string[]) => {
  const startTime = Date.now();
  totalImagesToLoad.value = breedsToLoad.length;
  imagesLoaded.value = 0;
  
  // Create promises for all image loads
  const imagePromises = breedsToLoad.map(async (breed) => {
    if (!breedImageMap.value[breed]) {
      try {
        const images = await apiService.getBreedImages(breed);
        if (images?.length) {
          breedImageMap.value[breed] = images[0];
        }
      } catch (error) {
        console.error(`Error loading images for ${breed}:`, error);
      }
    }
    imagesLoaded.value++;
  });
  
  // Wait for all images to load
  await Promise.all(imagePromises);
  
  // Ensure minimum loading time of 4 seconds
  const elapsedTime = Date.now() - startTime;
  const minLoadingTime = 4000; // 4 seconds
  
  if (elapsedTime < minLoadingTime) {
    await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime));
  }
  
  // Hide loading states
  loadingImages.value = false;
  isInitialLoad.value = false;
};

const loadBreedImages = async (breedsToLoad: string[]) => {
  for (const breed of breedsToLoad) {
    // Avoid repeated fetches if already got one
    if (!breedImageMap.value[breed]) {
      try {
        const images = await apiService.getBreedImages(breed);
        if (images?.length) breedImageMap.value[breed] = images[0];
      } catch (error) {
        console.error(`Error loading images for ${breed}:`, error);
        // If error, don't set image
      }
    }
  }
};

// Infinite scroll handler
const handleScroll = () => {
  if (searchTerm.value) return; // Don't load more when searching
  
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  
  // Load more when user is 200px from bottom
  if (scrollTop + windowHeight >= documentHeight - 200) {
    loadMoreBreeds();
  }
};

onMounted(() => {
  loadBreeds(1);
  loadFavorites();
  loadAllBreedsForSuggestions();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

// Remove the old watcher as we now handle preloading manually

watch(modalShow, (open) => {
  if (open) {
    document.body.classList.add('overflow-hidden');
  } else {
    document.body.classList.remove('overflow-hidden');
  }
});

// Reset pagination when search changes
watch(searchTerm, (newTerm) => {
  if (!newTerm) {
    // When not searching, reset to paginated view
    displayedBreeds.value = [];
    preloadedBreeds.value = [];
    preloadedImages.value = {};
    visibleDogs.value = [];
    nextPageReady.value = false;
    isLoadingNextPage.value = false;
    loadBreeds(1);
  }
});
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
