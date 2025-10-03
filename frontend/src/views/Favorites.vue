<template>
  <div class="max-w-4xl mx-auto p-6 mt-2">
    <h1 class="text-3xl font-bold mb-6">❤️ Favorite Breeds</h1>

    <div>
      <ul v-if="favorites.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
        <BreedCard
          v-for="breed in sortedFavorites"
          :key="breed"
          :breed="breed"
          :isFavorite="true"
          :image="breedImageMap[breed]"
          @select="openModal(breed)"
          @toggle-favorite="removeFavorite(breed)"
          v-slot:icon
        >
          <span class="text-pink-600">♥</span>
        </BreedCard>
      </ul>
      
      <p v-else class="text-gray-500 text-lg mt-8 text-center">No favorites selected yet.</p>
    </div>

    <BreedModal
      :show="modalShow"
      :breed="modalBreed"
      :images="modalImages"
      :isFavorite="true"
      @close="closeModal"
      @toggle-favorite="removeFavorite(modalBreed)"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, computed } from 'vue';
import BreedCard from '@/components/BreedCard.vue';
import BreedModal from '@/components/BreedModal.vue';
import apiService from '@/services/api';

const favorites = ref<string[]>([]);
const modalShow = ref(false);
const modalBreed = ref('');
const modalImages = ref<string[]>([]);
const breedImageMap = ref<Record<string, string>>({});

const sortedFavorites = computed(() =>
  [...favorites.value].sort((a, b) => a.localeCompare(b))
);

const loadFavorites = async () => {
  try {
    favorites.value = await apiService.getFavorites();
  } catch (error) {
    console.error('Error loading favorites:', error);
  }
};

const removeFavorite = async (breed: string) => {
  try {
    await apiService.removeFavorite(breed);
    await loadFavorites();
  } catch (error) {
    console.error('Error removing favorite:', error);
  }
};

const openModal = async (breed: string) => {
  modalBreed.value = breed;
  modalShow.value = true;
  modalImages.value = [];
  try {
    modalImages.value = await apiService.getBreedImages(breed);
  } catch (error) {
    console.error('Error loading breed images:', error);
    modalImages.value = [];
  }
};

const closeModal = () => {
  modalShow.value = false;
  modalBreed.value = '';
  modalImages.value = [];
};

const loadBreedImages = async () => {
  for (const fav of favorites.value) {
    // Avoid repeated fetches if already got one
    if (!breedImageMap.value[fav]) {
      try {
        const images = await apiService.getBreedImages(fav);
        if (images?.length) breedImageMap.value[fav] = images[0];
      } catch (error) {
        console.error(`Error loading images for ${fav}:`, error);
      }
    }
  }
};

onMounted(loadFavorites);
watch(favorites, (newBreeds) => {
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
