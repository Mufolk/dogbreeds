import { mount } from '@vue/test-utils'
import BreedModal from '../BreedModal.vue'
import { describe, it, expect, vi } from 'vitest'

describe('BreedModal.vue', () => {
  const props = {
    show: true,
    breed: 'bulldog',
    images: ['img1.jpg', 'img2.jpg', 'img3.jpg'],
    isFavorite: false,
  }

  it('renders when show is true', () => {
    const wrapper = mount(BreedModal, {
      props,
    })
    expect(wrapper.text()).toContain('bulldog')
    expect(wrapper.findAll('img')).toHaveLength(3)
  })

  it('does not render modal content when show is false', () => {
    const wrapper = mount(BreedModal, {
      props: { ...props, show: false },
    })
    expect(wrapper.html()).not.toContain('bulldog')
  })

  it('emits close event when close button clicked', async () => {
    const wrapper = mount(BreedModal, { props })
    await wrapper.find('button[aria-label="Close"]').trigger('click')
    expect(wrapper.emitted()).toHaveProperty('close')
  })
  
  it('displays correct favorite button text based on isFavorite prop', () => {
    const wrapperFalse = mount(BreedModal, {
      props: {
        ...props,
        isFavorite: false,
      },
    })
    expect(wrapperFalse.text()).toContain('☆ Add Favorite')

    const wrapperTrue = mount(BreedModal, {
      props: {
        ...props,
        isFavorite: true,
      },
    })
    expect(wrapperTrue.text()).toContain('★ Remove Favorite')
  })
})
