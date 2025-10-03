<template>
  <div v-if="error" class="max-w-md mx-auto mb-6">
    <div class="bg-red-50 border border-red-200 rounded-xl shadow-lg p-4">
      <div class="flex items-center space-x-3">
        <div class="flex-shrink-0">
          <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <span class="text-red-600 text-lg">⚠️</span>
          </div>
        </div>
        <div class="flex-1">
          <p class="text-red-800 font-medium">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  error: string;
}>();
</script>
