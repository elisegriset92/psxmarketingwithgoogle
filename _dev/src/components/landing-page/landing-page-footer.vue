<template>
  <footer class="ps_gs-landingpage-footer text-center">
    <b-row class="flex-column flex-sm-row">
      <b-col>
        <p class="ps_gs-landingpage-footer__text mb-3">
          {{ $t('landingPage.footer.text') }}
        </p>
        <b-button
          size="sm"
          variant="primary"
          @click="hideLandingPage"
          data-test-id="lp-footer-cta"
        >
          {{ $t('cta.startConfiguring') }}
        </b-button>
      </b-col>
    </b-row>
  </footer>
</template>

<script>
import SegmentGenericParams from '@/utils/SegmentGenericParams';

export default {
  name: 'LandingPageFooter',
  data() {
    return {
    };
  },
  methods: {
    hideLandingPage() {
      this.$root.$emit('onHideLanding');
      this.$segment.track('[GGL] Start Configuration', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,
      });
    },
  },
};
</script>
