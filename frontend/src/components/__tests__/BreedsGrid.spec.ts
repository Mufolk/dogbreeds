import { mount } from '@vue/test-utils';
import BreedsGrid from '../BreedsGrid.vue';
import { describe, expect, it, vi } from 'vitest';

describe('BreedsGrid', () => {
  const defaultProps = {
    breeds: ['bulldog', 'retriever', 'husky'],
    breedImageMap: {
      bulldog: 'bulldog.jpg',
      retriever: 'retriever.jpg',
      husky: 'husky.jpg'
    },
    isFavorite: vi.fn((breed: string) => breed === 'bulldog')
  };

  it('renders all breeds in grid', () => {
    const wrapper = mount(BreedsGrid, {
      props: defaultProps
    });

    expect(wrapper.findAllComponents({ name: 'BreedCard' })).toHaveLength(3);
    expect(wrapper.text()).toContain('bulldog');
    expect(wrapper.text()).toContain('retriever');
    expect(wrapper.text()).toContain('husky');
  });

  it('renders empty grid when no breeds', () => {
    const wrapper = mount(BreedsGrid, {
      props: {
        ...defaultProps,
        breeds: []
      }
    });

    expect(wrapper.findAllComponents({ name: 'BreedCard' })).toHaveLength(0);
  });

  it('passes correct props to BreedCard components', () => {
    const wrapper = mount(BreedsGrid, {
      props: defaultProps
    });

    const breedCards = wrapper.findAllComponents({ name: 'BreedCard' });
    
    expect(breedCards[0].props()).toEqual({
      breed: 'bulldog',
      image: 'bulldog.jpg',
      isFavorite: true
    });
    
    expect(breedCards[1].props()).toEqual({
      breed: 'retriever',
      image: 'retriever.jpg',
      isFavorite: false
    });
  });

  it('emits select event when breed is selected', async () => {
    const wrapper = mount(BreedsGrid, {
      props: defaultProps
    });

    const breedCard = wrapper.findComponent({ name: 'BreedCard' });
    await breedCard.vm.$emit('select', 'bulldog');

    expect(wrapper.emitted('select')).toBeTruthy();
    expect(wrapper.emitted('select')![0]).toEqual(['bulldog']);
  });

  it('emits toggleFavorite event when favorite is toggled', async () => {
    const wrapper = mount(BreedsGrid, {
      props: defaultProps
    });

    const breedCard = wrapper.findComponent({ name: 'BreedCard' });
    await breedCard.vm.$emit('toggle-favorite');

    expect(wrapper.emitted('toggleFavorite')).toBeTruthy();
    expect(wrapper.emitted('toggleFavorite')![0]).toEqual(['bulldog']);
  });

  it('handles missing images in breedImageMap', () => {
    const wrapper = mount(BreedsGrid, {
      props: {
        ...defaultProps,
        breedImageMap: {
          bulldog: 'bulldog.jpg'
          // missing retriever and husky images
        }
      }
    });

    const breedCards = wrapper.findAllComponents({ name: 'BreedCard' });
    
    expect(breedCards[0].props('image')).toBe('bulldog.jpg');
    expect(breedCards[1].props('image')).toBeUndefined();
    expect(breedCards[2].props('image')).toBeUndefined();
  });

  it('handles empty breedImageMap', () => {
    const wrapper = mount(BreedsGrid, {
      props: {
        ...defaultProps,
        breedImageMap: {}
      }
    });

    const breedCards = wrapper.findAllComponents({ name: 'BreedCard' });
    
    breedCards.forEach(card => {
      expect(card.props('image')).toBeUndefined();
    });
  });

  it('renders with responsive grid classes', () => {
    const wrapper = mount(BreedsGrid, {
      props: defaultProps
    });

    const grid = wrapper.find('ul');
    expect(grid.classes()).toContain('grid');
    expect(grid.classes()).toContain('grid-cols-1');
    expect(grid.classes()).toContain('sm:grid-cols-2');
    expect(grid.classes()).toContain('lg:grid-cols-3');
  });

  it('handles isFavorite function that throws error', () => {
    const errorFn = vi.fn(() => {
      throw new Error('Test error');
    });

    // Wrap in try-catch to handle the error gracefully
    expect(() => {
      mount(BreedsGrid, {
        props: {
          ...defaultProps,
          isFavorite: errorFn
        }
      });
    }).toThrow('Test error');
  });

  it('handles large number of breeds', () => {
    const manyBreeds = Array.from({ length: 100 }, (_, i) => `breed${i}`);
    const breedImageMap = manyBreeds.reduce((acc, breed) => {
      acc[breed] = `${breed}.jpg`;
      return acc;
    }, {} as Record<string, string>);

    const wrapper = mount(BreedsGrid, {
      props: {
        breeds: manyBreeds,
        breedImageMap,
        isFavorite: vi.fn(() => false)
      }
    });

    expect(wrapper.findAllComponents({ name: 'BreedCard' })).toHaveLength(100);
  });
});
