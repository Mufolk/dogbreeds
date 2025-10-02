<template>
  <li
    class="flex flex-col sm:flex-row items-center p-4 bg-white rounded-xl shadow group cursor-pointer hover:bg-blue-100 transition"
    @click="$emit('select')"
  >
    <!-- Image above title on mobile, left on desktop -->
    <img
      v-if="image"
      :src="image"
      alt="breed"
      class="w-full sm:w-28 h-28 object-cover rounded mb-3 sm:mb-0 sm:mr-4 flex-shrink-0"
    />
    <div class="flex-1 flex justify-between items-center w-full min-w-0">
      <span class="capitalize font-semibold text-lg truncate">{{ breed }}</span>
      <button @click.stop="$emit('toggle-favorite')" class="text-2xl flex-shrink-0">
        <slot name="icon" :isFavorite="isFavorite">
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
