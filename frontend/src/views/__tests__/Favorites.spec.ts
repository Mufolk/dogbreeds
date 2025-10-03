// src/views/__tests__/Favorites.spec.ts
import { mount } from '@vue/test-utils'
import Favorites from '../Favorites.vue'
import { describe, expect, it, vi } from 'vitest'

// Mock the API service
vi.mock('@/services/api', () => ({
  default: {
    getFavorites: vi.fn().mockResolvedValue(['bulldog', 'husky']),
    getBreedImages: vi.fn().mockResolvedValue(['img1.jpg', 'img2.jpg', 'img3.jpg']),
    addFavorite: vi.fn().mockResolvedValue({}),
    removeFavorite: vi.fn().mockResolvedValue({}),
    getAllBreeds: vi.fn().mockResolvedValue({ breeds: [], pagination: {} })
  }
}))

describe('Favorites.vue', () => {
  it('renders heading', () => {
    const wrapper = mount(Favorites)
    expect(wrapper.text()).toContain('Favorite Breeds')
  })

  it('shows no favorites message when empty', async () => {
    const wrapper = mount(Favorites)
    // Wait for the component to load and then set favorites to empty
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100)) // Wait for async operations
    ;(wrapper.vm as any).favorites = []
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('No favorites selected yet.')
  })

  it('renders favorite breeds list', async () => {
    const wrapper = mount(Favorites)
    const vm = wrapper.vm as any
    await vm.loadFavorites()
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('bulldog')
    expect(wrapper.text()).toContain('husky')
  })
})
