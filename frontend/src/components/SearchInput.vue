<template>
  <div class="relative max-w-md" ref="containerRef">
    <input
      v-model="inputValue"
      @input="onInput"
      @keydown.enter.prevent="onSearch"
      type="text"
      placeholder="Search breeds"
      class="mb-6 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-400 outline-none transition duration-200"
      autocomplete="off"
    />

    <ul
      v-if="showSuggestions && filteredSuggestions.length"
      class="absolute bg-white border border-gray-300 w-full rounded shadow max-h-48 overflow-auto z-20"
    >
      <li
        v-for="suggestion in filteredSuggestions"
        :key="suggestion"
        @click="selectSuggestion(suggestion)"
        class="px-4 py-2 cursor-pointer hover:bg-blue-200"
      >
        {{ suggestion }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps<{ breeds: string[] }>();
const emit = defineEmits(['filter']);

const inputValue = ref('');
const showSuggestions = ref(false);
const debouncedInput = ref('');
let debounceTimeout: number | null = null;
const containerRef = ref<HTMLElement | null>(null);

const onInput = () => {
  if (debounceTimeout) clearTimeout(debounceTimeout);
  debounceTimeout = window.setTimeout(() => {
    debouncedInput.value = inputValue.value;
    showSuggestions.value = inputValue.value.length > 0;
  }, 300);
};

const filteredSuggestions = computed(() => {
  const val = debouncedInput.value.toLowerCase();
  return props.breeds.filter(b => b.toLowerCase().includes(val));
});

const onSearch = () => {
  emit('filter', inputValue.value);
  showSuggestions.value = false;
};

const selectSuggestion = (suggestion: string) => {
  inputValue.value = suggestion;
  onSearch();
};

const onClickOutside = (event: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    inputValue.value = '';
    showSuggestions.value = false;
    debouncedInput.value = '';
  }
};

onMounted(() => {
  document.addEventListener('click', onClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside);
});
</script>
