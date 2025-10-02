import { mount } from '@vue/test-utils';
import BreedCard from '../BreedCard.vue';
import { describe, expect, it } from 'vitest';

describe('BreedCard', () => {
  it('renders breed prop text', () => {
    const wrapper = mount(BreedCard, {
      props: {
        breed: 'bulldog',
        isFavorite: false,
        image: 'http://example.com/dog.jpg',
      },
    });
    expect(wrapper.text()).toContain('bulldog');
  });

  it('shows star icon based on isFavorite', async () => {
    const wrapper = mount(BreedCard, {
      props: {
        breed: 'bulldog',
        isFavorite: true,
      },
    });
    expect(wrapper.html()).toContain('★');
    await wrapper.setProps({ isFavorite: false });
    expect(wrapper.html()).toContain('☆');
  });

  it('emits events when clicked', async () => {
    const wrapper = mount(BreedCard, {
      props: {
        breed: 'bulldog',
        isFavorite: false,
      },
    });

    await wrapper.trigger('click');
    expect(wrapper.emitted()).toHaveProperty('select');

    await wrapper.find('button').trigger('click');
    expect(wrapper.emitted()).toHaveProperty('toggle-favorite');
  });
});