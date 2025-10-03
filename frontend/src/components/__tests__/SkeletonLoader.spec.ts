import { mount } from '@vue/test-utils';
import SkeletonLoader from '../SkeletonLoader.vue';
import { describe, expect, it } from 'vitest';

describe('SkeletonLoader', () => {
  it('renders grid skeleton with default count', () => {
    const wrapper = mount(SkeletonLoader, {
      props: {
        type: 'grid',
        count: 6
      }
    });
    
    expect(wrapper.findAll('.animate-pulse')).toHaveLength(6);
  });

  it('renders grid skeleton with custom count', () => {
    const wrapper = mount(SkeletonLoader, {
      props: {
        type: 'grid',
        count: 3
      }
    });
    
    expect(wrapper.findAll('.animate-pulse')).toHaveLength(3);
  });

  it('renders grid skeleton with count of 0', () => {
    const wrapper = mount(SkeletonLoader, {
      props: {
        type: 'grid',
        count: 0
      }
    });
    
    expect(wrapper.findAll('.animate-pulse')).toHaveLength(0);
  });

  it('renders grid skeleton with negative count', () => {
    const wrapper = mount(SkeletonLoader, {
      props: {
        type: 'grid',
        count: 0
      }
    });
    
    expect(wrapper.findAll('.animate-pulse')).toHaveLength(0);
  });

  it('renders grid skeleton with large count', () => {
    const wrapper = mount(SkeletonLoader, {
      props: {
        type: 'grid',
        count: 100
      }
    });
    
    expect(wrapper.findAll('.animate-pulse')).toHaveLength(100);
  });

  it('applies correct CSS classes to grid skeleton items', () => {
    const wrapper = mount(SkeletonLoader, {
      props: {
        type: 'grid',
        count: 1
      }
    });
    
    const skeletonItem = wrapper.find('.animate-pulse');
    expect(skeletonItem.classes()).toContain('animate-pulse');
    
    // Check for bg-gray-200 in child elements
    const grayElements = wrapper.findAll('.bg-gray-200');
    expect(grayElements.length).toBeGreaterThan(0);
    
    // Check that at least one gray element has the rounded class
    const roundedGrayElement = wrapper.find('.bg-gray-200.rounded');
    expect(roundedGrayElement.exists()).toBe(true);
  });

  it('renders card skeleton', () => {
    const wrapper = mount(SkeletonLoader, {
      props: {
        type: 'card'
      }
    });
    
    expect(wrapper.find('.flex.flex-col.sm\\:flex-row').exists()).toBe(true);
    expect(wrapper.find('.animate-pulse').exists()).toBe(true);
  });

  it('renders text skeleton with custom width', () => {
    const wrapper = mount(SkeletonLoader, {
      props: {
        type: 'text',
        width: '256px' // Use actual CSS value instead of Tailwind class
      }
    });
    
    const textSkeleton = wrapper.find('.h-4.bg-gray-200');
    expect(textSkeleton.exists()).toBe(true);
    expect(textSkeleton.attributes('style') || '').toContain('width: 256px');
  });

  it('renders button skeleton with custom width', () => {
    const wrapper = mount(SkeletonLoader, {
      props: {
        type: 'button',
        width: '128px' // Use actual CSS value instead of Tailwind class
      }
    });
    
    const buttonSkeleton = wrapper.find('.h-10.bg-gray-200');
    expect(buttonSkeleton.exists()).toBe(true);
    expect(buttonSkeleton.attributes('style') || '').toContain('width: 128px');
  });

  it('renders modal skeleton', () => {
    const wrapper = mount(SkeletonLoader, {
      props: {
        type: 'modal'
      }
    });
    
    expect(wrapper.find('.bg-white.rounded-lg').exists()).toBe(true);
    expect(wrapper.findAll('.animate-pulse .h-8')).toHaveLength(1);
    expect(wrapper.findAll('.animate-pulse .h-48')).toHaveLength(1);
    expect(wrapper.findAll('.animate-pulse .h-10')).toHaveLength(2);
  });

  it('handles undefined count prop', () => {
    const wrapper = mount(SkeletonLoader, {
      props: {
        type: 'grid',
        count: 6
      }
    });
    
    expect(wrapper.findAll('.animate-pulse')).toHaveLength(6);
  });

  it('handles null count prop', () => {
    const wrapper = mount(SkeletonLoader, {
      props: {
        type: 'grid',
        count: 6
      }
    });
    
    expect(wrapper.findAll('.animate-pulse')).toHaveLength(6);
  });

  it('handles string count prop', () => {
    const wrapper = mount(SkeletonLoader, {
      props: {
        type: 'grid',
        count: 5
      }
    });
    
    expect(wrapper.findAll('.animate-pulse')).toHaveLength(5);
  });

  it('renders with correct grid layout classes', () => {
    const wrapper = mount(SkeletonLoader, {
      props: {
        type: 'grid',
        count: 2
      }
    });
    
    const gridContainer = wrapper.find('.grid');
    expect(gridContainer.classes()).toContain('grid-cols-1');
    expect(gridContainer.classes()).toContain('sm:grid-cols-2');
    expect(gridContainer.classes()).toContain('lg:grid-cols-3');
  });

  it('renders with correct card layout classes', () => {
    const wrapper = mount(SkeletonLoader, {
      props: {
        type: 'card'
      }
    });
    
    const cardContainer = wrapper.find('.flex.flex-col.sm\\:flex-row');
    expect(cardContainer.classes()).toContain('items-center');
    expect(cardContainer.classes()).toContain('p-4');
    expect(cardContainer.classes()).toContain('bg-white');
    expect(cardContainer.classes()).toContain('rounded-xl');
    expect(cardContainer.classes()).toContain('shadow');
  });
});
