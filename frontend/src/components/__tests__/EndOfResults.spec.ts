import { mount } from '@vue/test-utils';
import EndOfResults from '../EndOfResults.vue';
import { describe, expect, it } from 'vitest';

describe('EndOfResults', () => {
  it('renders end of results message when show is true', () => {
    const wrapper = mount(EndOfResults, {
      props: {
        show: true,
        totalBreeds: 50
      }
    });
    
    expect(wrapper.text()).toContain('You\'ve seen all the dog breeds!');
    expect(wrapper.text()).toContain('That\'s all 50 breeds in our collection');
  });

  it('renders nothing when show is false', () => {
    const wrapper = mount(EndOfResults, {
      props: {
        show: false,
        totalBreeds: 50
      }
    });
    
    expect(wrapper.html()).toBe('<!--v-if-->');
  });

  it('renders with correct CSS classes', () => {
    const wrapper = mount(EndOfResults, {
      props: {
        show: true,
        totalBreeds: 25
      }
    });
    
    const container = wrapper.find('.flex.justify-center.py-8');
    expect(container.exists()).toBe(true);
    
    const innerContainer = wrapper.find('.bg-gradient-to-r.from-green-50.to-blue-50.rounded-xl.shadow-lg.px-8.py-6.text-center.border.border-green-200');
    expect(innerContainer.exists()).toBe(true);
  });

  it('renders with correct icon and emojis', () => {
    const wrapper = mount(EndOfResults, {
      props: {
        show: true,
        totalBreeds: 10
      }
    });
    
    expect(wrapper.text()).toContain('🎉');
    expect(wrapper.text()).toContain('🐕');
    expect(wrapper.text()).toContain('🐶');
  });

  it('displays correct total breeds count', () => {
    const wrapper = mount(EndOfResults, {
      props: {
        show: true,
        totalBreeds: 100
      }
    });
    
    expect(wrapper.text()).toContain('That\'s all 100 breeds in our collection');
  });

  it('handles zero total breeds', () => {
    const wrapper = mount(EndOfResults, {
      props: {
        show: true,
        totalBreeds: 0
      }
    });
    
    expect(wrapper.text()).toContain('That\'s all 0 breeds in our collection');
  });

  it('handles large total breeds count', () => {
    const wrapper = mount(EndOfResults, {
      props: {
        show: true,
        totalBreeds: 1000
      }
    });
    
    expect(wrapper.text()).toContain('That\'s all 1000 breeds in our collection');
  });

  it('applies correct styling classes', () => {
    const wrapper = mount(EndOfResults, {
      props: {
        show: true,
        totalBreeds: 5
      }
    });
    
    const container = wrapper.find('.flex.justify-center.py-8');
    expect(container.classes()).toContain('flex');
    expect(container.classes()).toContain('justify-center');
    expect(container.classes()).toContain('py-8');
    
    const innerContainer = wrapper.find('.bg-gradient-to-r.from-green-50.to-blue-50.rounded-xl.shadow-lg.px-8.py-6.text-center.border.border-green-200');
    expect(innerContainer.classes()).toContain('bg-gradient-to-r');
    expect(innerContainer.classes()).toContain('from-green-50');
    expect(innerContainer.classes()).toContain('to-blue-50');
    expect(innerContainer.classes()).toContain('rounded-xl');
    expect(innerContainer.classes()).toContain('shadow-lg');
    expect(innerContainer.classes()).toContain('px-8');
    expect(innerContainer.classes()).toContain('py-6');
    expect(innerContainer.classes()).toContain('text-center');
    expect(innerContainer.classes()).toContain('border');
    expect(innerContainer.classes()).toContain('border-green-200');
  });

  it('renders with correct text styling', () => {
    const wrapper = mount(EndOfResults, {
      props: {
        show: true,
        totalBreeds: 15
      }
    });
    
    const title = wrapper.find('.text-lg.font-semibold.text-gray-800.mb-2');
    expect(title.exists()).toBe(true);
    expect(title.text()).toBe('You\'ve seen all the dog breeds!');
    
    const subtitle = wrapper.find('.text-gray-600.text-sm');
    expect(subtitle.exists()).toBe(true);
    expect(subtitle.text()).toBe('That\'s all 15 breeds in our collection');
  });

  it('renders emoji section correctly', () => {
    const wrapper = mount(EndOfResults, {
      props: {
        show: true,
        totalBreeds: 20
      }
    });
    
    const emojiSection = wrapper.find('.mt-4.flex.justify-center.space-x-2');
    expect(emojiSection.exists()).toBe(true);
    
    const emojis = wrapper.findAll('.text-2xl');
    expect(emojis).toHaveLength(3);
    expect(emojis[0].text()).toBe('🐕');
    expect(emojis[1].text()).toBe('🐶');
    expect(emojis[2].text()).toBe('🐕');
  });
});
