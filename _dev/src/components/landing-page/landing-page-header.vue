<template>
  <header class="ps_gs-landingpage-header d-flex flex-column flex-md-row">
    <figure
      class="ps_gs-landingpage-header__figure order-md-2 d-none d-md-block flex-shrink-0 ml-md-3"
    >
      <img
        src="@/assets/images/prestashop-google-img.png"
        width="276"
        height="178"
        class="img-fluid mx-auto d-block"
        alt=""
      >
    </figure>
    <div>
      <h2
        class="ps_gs-landingpage-header__title d-flex mr-3"
      >
        <img
          src="@/assets/images/prestashop-google-logo.svg"
          class="img-fluid mx-auto ml-md-0 mr-md-3 maxw-sm-420"
          alt="logo"
        >
        <span class="sr-only">{{ $t('landingPage.header.title') }}</span>
      </h2>
      <p class="ps_gs-landingpage-header__text w-100">
        {{ $t('landingPage.header.text') }}
      </p>
      <b-button
        size="sm"
        variant="primary"
        class="my-2"
        @click="hideLandingPage"
        data-test-id="lp-header-cta"
      >
        {{ $t('cta.startConfiguring') }}
      </b-button>

      <div class="ps_gs-landingpage-header__benefits text-muted">
        <VueShowdown
          :markdown="$t('landingPage.header.reinsurance')"
        />
      </div>
    </div>
  </header>
</template>

<script>
import {VueShowdown} from 'vue-showdown';
import SegmentGenericParams from '@/utils/SegmentGenericParams';

export default {
  name: 'LandingPageHeader',
  components: {
    VueShowdown,
  },
  data() {
    return {
    };
  },
  methods: {
    hideLandingPage() {
      this.$root.$emit('onHideLanding');
      localStorage.setItem('canDisplayLanding', false);
      this.$segment.track('[GGL] Start Configuration', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,
      });
    },
  },
};
</script>
