// src/views/__tests__/Favorites.spec.ts
import { mount } from '@vue/test-utils'
import Favorites from '../Favorites.vue'
import { describe, expect, it, vi } from 'vitest'
import axios from 'axios'

vi.mock('axios')
const mockedAxios = axios as any

mockedAxios.get.mockImplementation((url: string) => {
  if (url === '/api/favorites') {
    return Promise.resolve({ data: [{ breed: 'bulldog' }, { breed: 'husky' }] })
  }
  if (url.startsWith('/api/breeds/')) {
    return Promise.resolve({ data: ['img1.jpg', 'img2.jpg', 'img3.jpg'] })
  }
  return Promise.resolve({ data: [] })
})

describe('Favorites.vue', () => {
  it('renders heading', () => {
    const wrapper = mount(Favorites)
    expect(wrapper.text()).toContain('Favorite Breeds')
  })

  it('shows no favorites message when empty', async () => {
    const wrapper = mount(Favorites)
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
