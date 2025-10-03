<template>
  <div v-if="show" class="flex justify-center py-8">
    <div class="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-lg px-8 py-6 text-center border border-green-200">
      <div class="text-4xl mb-3">🎉</div>
      <h3 class="text-lg font-semibold text-gray-800 mb-2">You've seen all the dog breeds!</h3>
      <p class="text-gray-600 text-sm">That's all {{ totalBreeds }} breeds in our collection</p>
      <div class="mt-4 flex justify-center space-x-2">
        <span class="text-2xl">🐕</span>
        <span class="text-2xl">🐶</span>
        <span class="text-2xl">🐕</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  show: boolean;
  totalBreeds: number;
}>();
</script>
