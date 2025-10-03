import { mount } from '@vue/test-utils';
import ErrorDisplay from '../ErrorDisplay.vue';
import { describe, expect, it } from 'vitest';

describe('ErrorDisplay', () => {
  it('renders error message', () => {
    const wrapper = mount(ErrorDisplay, {
      props: {
        error: 'Something went wrong'
      }
    });
    
    expect(wrapper.text()).toContain('Something went wrong');
  });

  it('renders with correct CSS classes', () => {
    const wrapper = mount(ErrorDisplay, {
      props: {
        error: 'Test error'
      }
    });
    
    const container = wrapper.find('.max-w-md.mx-auto.mb-6');
    expect(container.exists()).toBe(true);
    
    const errorBox = wrapper.find('.bg-red-50.border.border-red-200.rounded-xl.shadow-lg.p-4');
    expect(errorBox.exists()).toBe(true);
    
    const errorText = wrapper.find('.text-red-800.font-medium');
    expect(errorText.exists()).toBe(true);
    expect(errorText.text()).toBe('Test error');
  });

  it('renders with warning icon', () => {
    const wrapper = mount(ErrorDisplay, {
      props: {
        error: 'Warning message'
      }
    });
    
    const iconContainer = wrapper.find('.w-8.h-8.bg-red-100.rounded-full.flex.items-center.justify-center');
    expect(iconContainer.exists()).toBe(true);
    
    const icon = wrapper.find('.text-red-600.text-lg');
    expect(icon.exists()).toBe(true);
    expect(icon.text()).toBe('⚠️');
  });

  it('renders with correct layout structure', () => {
    const wrapper = mount(ErrorDisplay, {
      props: {
        error: 'Test error'
      }
    });
    
    const flexContainer = wrapper.find('.flex.items-center.space-x-3');
    expect(flexContainer.exists()).toBe(true);
    
    const flexShrink = wrapper.find('.flex-shrink-0');
    expect(flexShrink.exists()).toBe(true);
    
    const flexOne = wrapper.find('.flex-1');
    expect(flexOne.exists()).toBe(true);
  });

  it('handles empty error message', () => {
    const wrapper = mount(ErrorDisplay, {
      props: {
        error: ''
      }
    });
    
    expect(wrapper.text()).toContain('');
  });

  it('handles undefined error message', () => {
    const wrapper = mount(ErrorDisplay, {
      props: {
        error: undefined
      }
    });
    
    expect(wrapper.html()).toBe('<!--v-if-->');
  });

  it('handles null error message', () => {
    const wrapper = mount(ErrorDisplay, {
      props: {
        error: null
      }
    });
    
    expect(wrapper.html()).toBe('<!--v-if-->');
  });

  it('handles long error messages', () => {
    const longError = 'This is a very long error message that should be handled properly by the component and should not break the layout or cause any issues with the display';
    
    const wrapper = mount(ErrorDisplay, {
      props: {
        error: longError
      }
    });
    
    expect(wrapper.text()).toContain(longError);
  });

  it('handles special characters in error message', () => {
    const specialError = 'Error with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?';
    
    const wrapper = mount(ErrorDisplay, {
      props: {
        error: specialError
      }
    });
    
    expect(wrapper.text()).toContain(specialError);
  });

  it('applies correct styling classes', () => {
    const wrapper = mount(ErrorDisplay, {
      props: {
        error: 'Test error'
      }
    });
    
    const container = wrapper.find('.max-w-md.mx-auto.mb-6');
    expect(container.classes()).toContain('max-w-md');
    expect(container.classes()).toContain('mx-auto');
    expect(container.classes()).toContain('mb-6');
    
    const errorBox = wrapper.find('.bg-red-50.border.border-red-200.rounded-xl.shadow-lg.p-4');
    expect(errorBox.classes()).toContain('bg-red-50');
    expect(errorBox.classes()).toContain('border');
    expect(errorBox.classes()).toContain('border-red-200');
    expect(errorBox.classes()).toContain('rounded-xl');
    expect(errorBox.classes()).toContain('shadow-lg');
    expect(errorBox.classes()).toContain('p-4');
  });

  it('renders only when error is truthy', () => {
    const wrapper = mount(ErrorDisplay, {
      props: {
        error: 'Test error'
      }
    });
    
    expect(wrapper.find('.max-w-md.mx-auto.mb-6').exists()).toBe(true);
    
    const emptyWrapper = mount(ErrorDisplay, {
      props: {
        error: ''
      }
    });
    
    expect(emptyWrapper.find('.max-w-md.mx-auto.mb-6').exists()).toBe(false);
  });
});
