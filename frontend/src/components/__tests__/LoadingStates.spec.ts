import { mount } from '@vue/test-utils';
import LoadingStates from '../LoadingStates.vue';
import { describe, expect, it } from 'vitest';

describe('LoadingStates', () => {
  const defaultProps = {
    loading: false,
    currentPage: 1,
    loadingImages: false,
    isInitialLoad: false,
    imagesLoaded: 0,
    totalImagesToLoad: 0,
    scrollLoading: false
  };

  it('renders skeleton loader when loading and currentPage is 1', () => {
    const wrapper = mount(LoadingStates, {
      props: {
        ...defaultProps,
        loading: true,
        currentPage: 1
      }
    });

    expect(wrapper.findComponent({ name: 'SkeletonLoader' }).exists()).toBe(true);
  });

  it('renders image loading progress when loadingImages and isInitialLoad', () => {
    const wrapper = mount(LoadingStates, {
      props: {
        ...defaultProps,
        loadingImages: true,
        isInitialLoad: true,
        imagesLoaded: 5,
        totalImagesToLoad: 10
      }
    });

    expect(wrapper.find('.fixed.inset-0').exists()).toBe(true);
    expect(wrapper.text()).toContain('Loading Dog Images');
    expect(wrapper.text()).toContain('5/10');
  });

  it('renders scroll loading indicator when scrollLoading is true', () => {
    const wrapper = mount(LoadingStates, {
      props: {
        ...defaultProps,
        scrollLoading: true
      }
    });

    expect(wrapper.find('.flex.justify-center.py-8').exists()).toBe(true);
    expect(wrapper.text()).toContain('Loading more dogs...');
  });

  it('renders nothing when not loading and no special states', () => {
    const wrapper = mount(LoadingStates, {
      props: defaultProps
    });

    expect(wrapper.html()).toContain('<!--v-if-->');
  });

  it('shows correct progress percentage', () => {
    const wrapper = mount(LoadingStates, {
      props: {
        ...defaultProps,
        loadingImages: true,
        isInitialLoad: true,
        imagesLoaded: 3,
        totalImagesToLoad: 10
      }
    });

    expect(wrapper.text()).toContain('30% complete');
  });

  it('handles loading state changes', async () => {
    const wrapper = mount(LoadingStates, {
      props: defaultProps
    });

    expect(wrapper.findComponent({ name: 'SkeletonLoader' }).exists()).toBe(false);

    await wrapper.setProps({ loading: true, currentPage: 1 });

    expect(wrapper.findComponent({ name: 'SkeletonLoader' }).exists()).toBe(true);
  });

  it('handles scroll loading state changes', async () => {
    const wrapper = mount(LoadingStates, {
      props: defaultProps
    });

    expect(wrapper.find('.flex.justify-center.py-8').exists()).toBe(false);

    await wrapper.setProps({ scrollLoading: true });

    expect(wrapper.find('.flex.justify-center.py-8').exists()).toBe(true);
  });

  it('handles image loading state changes', async () => {
    const wrapper = mount(LoadingStates, {
      props: defaultProps
    });

    expect(wrapper.find('.fixed.inset-0').exists()).toBe(false);

    await wrapper.setProps({ 
      loadingImages: true, 
      isInitialLoad: true,
      imagesLoaded: 2,
      totalImagesToLoad: 5
    });

    expect(wrapper.find('.fixed.inset-0').exists()).toBe(true);
  });

  it('passes correct props to SkeletonLoader', () => {
    const wrapper = mount(LoadingStates, {
      props: {
        ...defaultProps,
        loading: true,
        currentPage: 1
      }
    });

    const skeletonLoader = wrapper.findComponent({ name: 'SkeletonLoader' });
    expect(skeletonLoader.props('type')).toBe('grid');
    expect(skeletonLoader.props('count')).toBe(6);
  });
});
