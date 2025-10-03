// src/views/__tests__/Home.spec.ts
import { mount } from '@vue/test-utils'
import Home from '../Home.vue'
import { describe, expect, it, vi } from 'vitest'

// Mock the API service
vi.mock('@/services/api', () => ({
  default: {
    getFavorites: vi.fn().mockResolvedValue(['bulldog']),
    getBreedImages: vi.fn().mockResolvedValue(['img1.jpg', 'img2.jpg', 'img3.jpg']),
    addFavorite: vi.fn().mockResolvedValue({}),
    removeFavorite: vi.fn().mockResolvedValue({}),
    getAllBreeds: vi.fn().mockResolvedValue({ 
      breeds: ['bulldog', 'husky'], 
      pagination: { currentPage: 1, totalPages: 1, totalBreeds: 2, hasNextPage: false }
    })
  }
}))

describe('Home.vue', () => {
  it('shows loading indicator', async () => {
    const wrapper = mount(Home)
    // The component shows skeleton loader when loading
    expect(wrapper.findComponent({ name: 'SkeletonLoader' }).exists()).toBe(true)
  })

  it('shows error message', async () => {
    const wrapper = mount(Home)
    ;(wrapper.vm as any).error = 'Failed to load breeds'
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Failed to load breeds')
  })

  it('renders breed list', async () => {
    const wrapper = mount(Home)
    // Wait for the component to load
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))
    // The component should show breeds from the mocked API
    expect(wrapper.text()).toContain('bulldog')
    expect(wrapper.text()).toContain('husky')
  })
})
