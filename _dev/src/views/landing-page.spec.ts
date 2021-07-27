/**
 * @jest-environment jsdom
 */

// Import this file first to init mock on window
import config from '@/../tests/init';

import {shallowMount} from '@vue/test-utils';
import LandingPage from '@/views/landing-page.vue';

describe('landing-page.vue', () => {
  it('shows all the onboarding details', () => {
    const wrapper = shallowMount(LandingPage, {
      ...config,
    });

    expect(wrapper.find('.ps_gs-landingpage').isVisible()).toBe(true);
  });
});
