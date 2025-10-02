import { mount } from '@vue/test-utils'
import SearchInput from '../SearchInput.vue'
import { describe, it, expect, vi } from 'vitest'

describe('SearchInput.vue', () => {
  const breeds = ['bulldog', 'husky', 'beagle']

  it('renders input and no suggestions initially', () => {
    const wrapper = mount(SearchInput, {
      props: { breeds }
    })
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.findAll('li').length).toBe(0)
  })

  it('shows suggestions on input and filters correctly', async () => {
    const wrapper = mount(SearchInput, {
      props: { breeds }
    })
    const input = wrapper.find('input')

    await input.setValue('b')
    // Wait for debounce timeout (300ms)
    await new Promise(r => setTimeout(r, 350))
    expect(wrapper.findAll('li').length).toBe(2)
    expect(wrapper.text()).toContain('bulldog')
    expect(wrapper.text()).toContain('beagle')

    await input.setValue('hu')
    await new Promise(r => setTimeout(r, 350))
    expect(wrapper.findAll('li').length).toBe(1)
    expect(wrapper.text()).toContain('husky')
  })

  it('emits filter event on enter key', async () => {
    const wrapper = mount(SearchInput, {
      props: { breeds }
    })
    const input = wrapper.find('input')

    await input.setValue('bulldog')
    await input.trigger('keydown.enter')
    expect(wrapper.emitted('filter')).toBeTruthy()
    expect(wrapper.emitted('filter')![0]).toEqual(['bulldog'])
  })

  it('selecting suggestion updates input and emits filter', async () => {
    const wrapper = mount(SearchInput, {
      props: { breeds }
    })
    const input = wrapper.find('input')
    await input.setValue('b')
    await new Promise(r => setTimeout(r, 350))

    const firstSuggestion = wrapper.findAll('li')[0]
    expect(firstSuggestion?.exists()).toBe(true)
    await firstSuggestion?.trigger('click')

    expect(wrapper.emitted('filter')).toBeTruthy()
    expect(wrapper.emitted('filter')![0]).toEqual([breeds[0]])
    expect(input.element.value).toBe(breeds[0])
  })

  it('clears input and suggestions when clicking outside', async () => {
    const wrapper = mount(SearchInput, {
      props: { breeds },
      attachTo: document.body, // Required to test click outside
    })
    const input = wrapper.find('input')
    await input.setValue('bu')
    await new Promise(r => setTimeout(r, 350))

    expect(wrapper.findAll('li').length).toBeGreaterThan(0)

    await document.body.click() // simulate click outside component

    expect(wrapper.findAll('li').length).toBe(0)
    expect(input.element.value).toBe('')
  })
})
