<template>
  <div class="max-w-6xl mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">🐶 Dog Breeds Explorer</h1>
    <SearchInput :breeds="allBreeds" @filter="searchBreeds" />

    <!-- Error display -->
    <div v-if="error" class="max-w-md mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div class="flex items-center">
        <span class="text-red-500 mr-2">⚠️</span>
        <p class="text-red-700">{{ error }}</p>
      </div>
    </div>

    <!-- Initial loading skeleton -->
    <SkeletonLoader v-if="loading && currentPage === 1" type="grid" :count="6" />

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
    <div v-if="loadingMore" class="text-center py-6">
      <LoadingSpinner text="Loading more dogs..." />
    </div>

    <!-- End of results indicator -->
    <div v-if="!hasMoreBreeds && !loading && breeds.length > 0" class="text-center py-6 text-gray-500">
      🐕 You've seen all the dog breeds!
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
const allBreeds = ref<string[]>([]);
const loading = ref(false);
const loadingMore = ref(false);
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

const searchBreeds = (search: string) => {
  searchTerm.value = search;
};

const filteredBreeds = computed(() => {
  if (!searchTerm.value) return breeds.value;
  const term = searchTerm.value.toLowerCase();
  return breeds.value.filter(b => b.toLowerCase().includes(term));
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

const loadBreeds = async (page: number = 1, append: boolean = false) => {
  if (page === 1) {
    loading.value = true;
  } else {
    loadingMore.value = true;
  }
  
  error.value = '';
  
  try {
    const response = await apiService.getAllBreeds(page, ITEMS_PER_PAGE);
    
    if (append) {
      breeds.value = [...breeds.value, ...response.breeds];
    } else {
      breeds.value = response.breeds;
    }
    
    allBreeds.value = response.breeds; // For search functionality
    currentPage.value = response.pagination.currentPage;
    hasMoreBreeds.value = response.pagination.hasNextPage;
    totalBreeds.value = response.pagination.totalBreeds;
    
  } catch (err) {
    error.value = 'Failed to load breeds';
    console.error('Error loading breeds:', err);
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

const loadMoreBreeds = async () => {
  if (!hasMoreBreeds.value || loadingMore.value) return;
  
  await loadBreeds(currentPage.value + 1, true);
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
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

watch(breeds, (newBreeds) => {
  if (newBreeds.length) {
    // Load images for the newly added breeds
    const newBreedsToLoad = newBreeds.slice(-ITEMS_PER_PAGE);
    loadBreedImages(newBreedsToLoad);
  }
});

watch(modalShow, (open) => {
  if (open) {
    document.body.classList.add('overflow-hidden');
  } else {
    document.body.classList.remove('overflow-hidden');
  }
});

// Reset pagination when search changes
watch(searchTerm, (newTerm) => {
  if (newTerm) {
    // When searching, show all breeds that match
    const term = newTerm.toLowerCase();
    breeds.value = allBreeds.value.filter(b => b.toLowerCase().includes(term));
  } else {
    // When not searching, reset to paginated view
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
