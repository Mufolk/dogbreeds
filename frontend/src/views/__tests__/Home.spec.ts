// src/views/__tests__/Home.spec.ts
import { mount } from '@vue/test-utils'
import Home from '../Home.vue'
import { describe, expect, it, vi } from 'vitest'
import axios from 'axios'

vi.mock('axios')
const mockedAxios = axios as any

mockedAxios.get.mockImplementation((url: string) => {
  if (url === '/api/breeds') {
    return Promise.resolve({ data: ['bulldog', 'husky'] })
  }
  if (url.startsWith('/api/breeds/')) {
    return Promise.resolve({ data: ['img1.jpg', 'img2.jpg', 'img3.jpg'] })
  }
  if (url === '/api/favorites') {
    return Promise.resolve({ data: [{ breed: 'bulldog' }] })
  }
  return Promise.resolve({ data: [] })
})

describe('Home.vue', () => {
  it('shows loading indicator', async () => {
    const wrapper = mount(Home)
    ;(wrapper.vm as any).loading = true
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Loading...')
  })

  it('shows error message', async () => {
    const wrapper = mount(Home)
    ;(wrapper.vm as any).error = 'Failed to load breeds'
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Failed to load breeds')
  })

  it('renders breed list', async () => {
    const wrapper = mount(Home)
    const vm = wrapper.vm as any
    await vm.loadBreeds()
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('bulldog')
    expect(wrapper.text()).toContain('husky')
  })
})
