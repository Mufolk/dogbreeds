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
import axios from 'axios';
import BreedCard from '@/components/BreedCard.vue';
import BreedModal from '@/components/BreedModal.vue';

const favorites = ref<string[]>([]);
const modalShow = ref(false);
const modalBreed = ref('');
const modalImages = ref<string[]>([]);
const breedImageMap = ref<Record<string, string>>({});

const sortedFavorites = computed(() =>
  [...favorites.value].sort((a, b) => a.localeCompare(b))
);

const loadFavorites = () => {
  axios.get('/api/favorites').then(res => {
    favorites.value = res.data.map((fav: any) => fav.breed);
  });
};

const removeFavorite = (breed: string) => {
  axios.delete(`/api/favorites/${breed}`).then(loadFavorites);
};

const openModal = async (breed: string) => {
  modalBreed.value = breed;
  modalShow.value = true;
  modalImages.value = [];
  try {
    const res = await axios.get(`/api/breeds/${breed}/images`);
    modalImages.value = res.data;
  } catch {
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
        const res = await axios.get(`/api/breeds/${fav}/images`);
        if (res.data?.length) breedImageMap.value[fav] = res.data[0];
      } catch (err) {
        console.error("Image failed load: ", err);
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
