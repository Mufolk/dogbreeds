<template>
  <transition name="modal-fade">
    <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <transition name="modal-popup">
        <div
          class="bg-white rounded-xl shadow-xl p-8 max-w-3xl w-full relative"
          v-if="show"
          @click.outside="close"
        >
          <button
            @click="close"
            class="absolute top-3 right-4 text-2xl text-gray-500 hover:text-red-500 transition transform hover:rotate-90"
            aria-label="Close"
          >
            &times;
          </button>

          <h2 class="text-2xl font-bold mb-6 capitalize text-center">{{ breed }}</h2>

          <div class="grid grid-cols-3 gap-6">
            <div
              v-for="img in images"
              :key="img"
              class="rounded overflow-hidden shadow-md hover:scale-105 transition-transform"
            >
              <img :src="img" :alt="breed" class="object-cover w-full h-48" />
            </div>
          </div>

          <div class="mt-6 flex justify-center space-x-6">
            <button
              @click="onToggleFavorite"
              class="rounded border px-6 py-2 font-semibold transition-colors duration-300"
              :class="isFavorite ? 'bg-yellow-400 text-white hover:bg-yellow-500' : 'bg-gray-200 hover:bg-gray-300'"
            >
              <span v-if="isFavorite">★ Remove Favorite</span>
              <span v-else>☆ Add Favorite</span>
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps } from 'vue';

const props = defineProps<{
  show: boolean;
  breed: string;
  images: string[];
  isFavorite: boolean;
}>();

const emit = defineEmits(['close', 'toggle-favorite']);

const close = () => emit('close');
const onToggleFavorite = () => emit('toggle-favorite');
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-popup-enter-active,
.modal-popup-leave-active {
  transition: transform 0.3s, opacity 0.2s;
}
.modal-popup-enter-from,
.modal-popup-leave-to {
  transform: scale(0.85);
  opacity: 0;
}
</style>
