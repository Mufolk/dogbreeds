<template>
  <li
    class="flex flex-col sm:flex-row items-center p-4 bg-white rounded-xl shadow group cursor-pointer hover:bg-blue-100 transition"
    @click="$emit('select')"
  >
    <img
      v-if="image"
      :src="image"
      alt="breed"
      class="w-full sm:w-24 h-24 object-cover rounded mb-3 sm:mb-0 sm:mr-3"
    />
    <div class="flex-1 flex justify-between items-center w-full">
      <span class="capitalize font-semibold">{{ breed }}</span>
      <button @click.stop="$emit('toggle-favorite')" class="text-2xl">
        <slot name="icon">
          <span v-if="isFavorite">★</span>
          <span v-else>☆</span>
        </slot>
      </button>
    </div>
  </li>
</template>

<script setup lang="ts">
defineProps<{
  breed: string;
  isFavorite: boolean;
  image?: string;
}>();
</script>