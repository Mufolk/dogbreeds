<template>
  <div class="max-w-6xl mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">🐶 Dog Breeds Explorer</h1>
    <SearchInput :breeds="breeds" @filter="searchBreeds" />

    <div v-if="loading" class="text-center py-10 text-xl animate-pulse text-blue-600">Loading...</div>
    <div v-if="error" class="text-red-600 mb-4">{{ error }}</div>

    <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
import { ref, computed, onMounted, watch } from 'vue';
import BreedCard from '@/components/BreedCard.vue';
import BreedModal from '@/components/BreedModal.vue';
import SearchInput from '@/components/SearchInput.vue';
import apiService from '@/services/api';

const breeds = ref<string[]>([]);
const loading = ref(false);
const error = ref('');
const search = ref('');
const favorites = ref<string[]>([]);
const modalShow = ref(false);
const modalBreed = ref('');
const modalImages = ref<string[]>([]);
const searchTerm = ref('');
const breedImageMap = ref<Record<string, string>>({});

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

const loadBreeds = async () => {
  loading.value = true;
  error.value = '';
  try {
    breeds.value = await apiService.getAllBreeds();
  } catch (err) {
    error.value = 'Failed to load breeds';
    console.error('Error loading breeds:', err);
  } finally {
    loading.value = false;
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

const loadBreedImages = async () => {
  // Only load images for the first few breeds to avoid overwhelming the API
  const breedsToLoad = breeds.value.slice(0, 10);
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

onMounted(() => {
  loadBreeds();
  loadFavorites();
});

watch(breeds, (newBreeds) => {
  if (newBreeds.length) loadBreedImages();
});

watch(modalShow, (open) => {
  if (open) {
    document.body.classList.add('overflow-hidden');
  } else {
    document.body.classList.remove('overflow-hidden');
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
