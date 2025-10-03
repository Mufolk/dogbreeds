import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import apiService from '@/services/api';

export function useBreedsData() {
  // State
  const breeds = ref<string[]>([]);
  const allBreeds = ref<string[]>([]);
  const loading = ref(false);
  const loadingMore = ref(false);
  const loadingImages = ref(false);
  const error = ref('');
  const search = ref('');
  const favorites = ref<string[]>([]);
  const modalShow = ref(false);
  const modalBreed = ref('');
  const modalImages = ref<string[]>([]);
  const searchTerm = ref('');
  const breedImageMap = ref<Record<string, string>>({});
  
  // Ready to show breeds
  const readyToShowBreeds = ref<string[]>([]);

  // Pagination state
  const currentPage = ref(1);
  const hasMoreBreeds = ref(true);
  const totalBreeds = ref(0);
  const ITEMS_PER_PAGE = 50;

  // Loading states
  const isInitialLoad = ref(true);
  const scrollLoading = ref(false);
  const scrollThrottle = ref(false);

  // Visible dogs for display
  const visibleDogs = ref<string[]>([]);

  // Computed
  const filteredBreeds = computed(() => {
    return readyToShowBreeds.value;
  });

  // Methods

  const searchBreeds = async (search: string) => {
    searchTerm.value = search;
    visibleDogs.value = [];
    readyToShowBreeds.value = [];
    await loadBreeds(1);
  };

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
      const response = await apiService.getAllBreeds(1, 200);
      allBreeds.value = response.breeds;
    } catch (error) {
      console.error('Error loading breeds for suggestions:', error);
    }
  };

  const loadBreeds = async (page: number = 1, append: boolean = false) => {
    if (page === 1) {
      loading.value = true;
      isInitialLoad.value = true;
      visibleDogs.value = [];
      readyToShowBreeds.value = [];
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
      
      // Load images for the new breeds first
      if (response.breeds.length > 0) {
        await loadBreedImages(response.breeds);
      }
      
      // After images are loaded, add breeds to display
      readyToShowBreeds.value = [...readyToShowBreeds.value, ...response.breeds];
      
    } catch (err) {
      error.value = 'Failed to load breeds';
      console.error('Error loading breeds:', err);
    } finally {
      loading.value = false;
      loadingMore.value = false;
      isInitialLoad.value = false;
    }
  };


  const loadMoreBreeds = async () => {
    if (!hasMoreBreeds.value || scrollLoading.value) return;
    
    scrollLoading.value = true;
    
    try {
      const nextPage = currentPage.value + 1;
      await loadBreeds(nextPage, true);
    } catch (error) {
      console.error('Error in loadMoreBreeds:', error);
    } finally {
      scrollLoading.value = false;
    }
  };

  const isFavorite = (breed: string) => favorites.value.includes(breed);

  const toggleFavorite = async (breed: string) => {
    try {
      if (isFavorite(breed)) {
        await apiService.removeFavorite(breed);
      } else {
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
    // Load images for all breeds in parallel
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
    });
    
    // Wait for all images to load
    await Promise.all(imagePromises);
  };

  // Infinite scroll handler
  const handleScroll = () => {
    if (searchTerm.value || scrollThrottle.value) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Trigger loading when user is 500px from bottom (more responsive)
    if (scrollTop + windowHeight >= documentHeight - 500) {
      scrollThrottle.value = true;
      loadMoreBreeds();
      
      // Reset throttle after a short delay
      setTimeout(() => {
        scrollThrottle.value = false;
      }, 1000);
    }
  };

  // Lifecycle
  onMounted(() => {
    loadBreeds(1);
    loadFavorites();
    loadAllBreedsForSuggestions();
    window.addEventListener('scroll', handleScroll);
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });

  // Watchers
  watch(modalShow, (open) => {
    if (open) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  });

  watch(searchTerm, (newTerm) => {
    if (!newTerm) {
      visibleDogs.value = [];
      loadBreeds(1);
    }
  });

  return {
    // State
    allBreeds,
    loading,
    error,
    favorites,
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
    loadFavorites,
    loadAllBreedsForSuggestions,
    loadBreeds,
    loadMoreBreeds,
    isFavorite,
    toggleFavorite,
    onModalToggleFavorite,
    closeModal,
    loadBreedImages,
    handleScroll
  };
}
