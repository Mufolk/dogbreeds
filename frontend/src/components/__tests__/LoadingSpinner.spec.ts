import { mount } from '@vue/test-utils';
import LoadingSpinner from '../LoadingSpinner.vue';
import { describe, expect, it } from 'vitest';

describe('LoadingSpinner', () => {
  it('renders spinner with default props', () => {
    const wrapper = mount(LoadingSpinner);
    
    expect(wrapper.find('.spinner').exists()).toBe(true);
    expect(wrapper.find('.loading-spinner').exists()).toBe(true);
  });

  it('renders spinner with custom text', () => {
    const wrapper = mount(LoadingSpinner, {
      props: {
        text: 'Loading breeds...'
      }
    });
    
    expect(wrapper.text()).toContain('Loading breeds...');
  });

  it('renders spinner with empty text', () => {
    const wrapper = mount(LoadingSpinner, {
      props: {
        text: ''
      }
    });
    
    expect(wrapper.find('p').exists()).toBe(false);
  });

  it('applies correct CSS classes', () => {
    const wrapper = mount(LoadingSpinner);
    
    const spinner = wrapper.find('.spinner');
    expect(spinner.classes()).toContain('border-blue-600');
    // Check that the spinner has the correct base classes
    expect(spinner.classes()).toContain('spinner');
  });

  it('renders with different sizes', () => {
    const wrapper = mount(LoadingSpinner, {
      props: {
        size: 'lg'
      }
    });
    
    const container = wrapper.find('.loading-spinner');
    expect(container.classes()).toContain('w-12');
    expect(container.classes()).toContain('h-12');
  });

  it('renders with small size', () => {
    const wrapper = mount(LoadingSpinner, {
      props: {
        size: 'sm'
      }
    });
    
    const container = wrapper.find('.loading-spinner');
    expect(container.classes()).toContain('w-4');
    expect(container.classes()).toContain('h-4');
  });

  it('renders with custom color', () => {
    const wrapper = mount(LoadingSpinner, {
      props: {
        color: 'gray'
      }
    });
    
    const spinner = wrapper.find('.spinner');
    expect(spinner.classes()).toContain('border-gray-600');
  });

  it('renders with default color when no color specified', () => {
    const wrapper = mount(LoadingSpinner);
    
    const spinner = wrapper.find('.spinner');
    expect(spinner.classes()).toContain('border-blue-600');
  });

  it('shows text below spinner when provided', () => {
    const wrapper = mount(LoadingSpinner, {
      props: {
        text: 'Please wait...'
      }
    });
    
    const message = wrapper.find('p');
    expect(message.exists()).toBe(true);
    expect(message.text()).toBe('Please wait...');
    expect(message.classes()).toContain('mt-2');
    expect(message.classes()).toContain('text-sm');
    expect(message.classes()).toContain('text-gray-600');
  });

  it('handles undefined text prop', () => {
    const wrapper = mount(LoadingSpinner, {
      props: {
        text: undefined
      }
    });
    
    expect(wrapper.find('p').exists()).toBe(false);
  });

  it('handles null text prop', () => {
    const wrapper = mount(LoadingSpinner, {
      props: {
        text: null
      }
    });
    
    expect(wrapper.find('p').exists()).toBe(false);
  });

  it('renders with medium size by default', () => {
    const wrapper = mount(LoadingSpinner);
    
    const container = wrapper.find('.loading-spinner');
    expect(container.classes()).toContain('w-8');
    expect(container.classes()).toContain('h-8');
  });

  it('renders with white color', () => {
    const wrapper = mount(LoadingSpinner, {
      props: {
        color: 'white'
      }
    });
    
    const spinner = wrapper.find('.spinner');
    expect(spinner.classes()).toContain('border-white');
  });
});
