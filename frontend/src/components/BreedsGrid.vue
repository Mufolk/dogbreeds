<template>
  <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
    <BreedCard
      v-for="breed in breeds"
      :key="breed"
      :breed="breed"
      :image="breedImageMap[breed]"
      :isFavorite="isFavorite(breed)"
      @select="onSelect(breed)"
      @toggle-favorite="onToggleFavorite(breed)"
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
</template>

<script lang="ts" setup>
import BreedCard from './BreedCard.vue';

defineProps<{
  breeds: string[];
  breedImageMap: Record<string, string>;
  isFavorite: (breed: string) => boolean;
}>();

const emit = defineEmits<{
  select: [breed: string];
  toggleFavorite: [breed: string];
}>();

const onSelect = (breed: string) => {
  emit('select', breed);
};

const onToggleFavorite = (breed: string) => {
  emit('toggleFavorite', breed);
};
</script>
