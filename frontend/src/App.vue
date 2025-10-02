<template>
  <div>
    <nav class="bg-blue-600 p-4 text-white shadow fixed inset-x-0 top-0 z-40">
      <div class="max-w-6xl mx-auto flex items-center gap-8">
        <router-link
          to="/"
          class="flex items-center gap-2 hover:bg-blue-700 px-5 py-2 rounded-lg font-semibold transition-colors duration-200"
          active-class="bg-blue-900"
          exact
        >
          <span>🐾</span>
          <span>All Breeds</span>
        </router-link>
        <router-link
          to="/favorites"
          class="flex items-center gap-2 hover:bg-blue-700 px-5 py-2 rounded-lg font-semibold transition-colors duration-200"
          active-class="bg-blue-900"
        >
          <span>❤️</span>
          <span>Favorites</span>
        </router-link>
      </div>
    </nav>
    <main class="pt-24 px-4 max-w-6xl mx-auto">
      <router-view />
    </main>
  </div>
</template>
