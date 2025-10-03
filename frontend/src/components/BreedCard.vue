<template>
  <li
    class="flex flex-col sm:flex-row items-center p-4 bg-white rounded-xl shadow group cursor-pointer hover:bg-blue-100 transition"
    @click="$emit('select')"
  >
    <!-- Image container with consistent sizing -->
    <div 
      v-if="image"
      class="w-full sm:w-28 h-48 sm:h-28 mb-3 sm:mb-0 sm:mr-4 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center"
    >
      <img
        :src="image"
        :alt="breed"
        class="w-full h-full object-cover"
      />
    </div>
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

defineEmits<{
  select: [];
  'toggle-favorite': [];
}>();
</script>
