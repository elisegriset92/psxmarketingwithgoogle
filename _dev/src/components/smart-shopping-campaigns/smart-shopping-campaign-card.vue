<template>
  <section>
    <b-skeleton-wrapper
      :loading="loading"
      class="mb-3"
    >
      <template #loading>
        <b-card>
          <b-skeleton width="85%" />
          <b-skeleton width="55%" />
          <b-skeleton width="70%" />
        </b-card>
      </template>
      <b-card
        no-body
        class="ps_gs-onboardingcard p-3"
        :class="{ 'ps_gs-onboardingcard--disabled' : !isEnabled }"
      >
        <div
          class="d-md-flex flex-wrap align-items-center justify-content-between mb-3"
        >
          <div class="d-flex align-items-center">
            <img
              class="mr-3"
              :src="isEnabled
                ? require('@/assets/images/Google-Commercial-icon.svg')
                : require('@/assets/images/Google-Commercial-icon-grey.svg')"
              width="40"
              height="40"
              alt=""
            >
            <b-card-text class="flex-grow-1 ps_gs-onboardingcard__title text-left mb-0">
              {{ $t('smartShoppingCampaignCard.title') }}
            </b-card-text>
          </div>
        </div>

        <div class="d-flex flex-wrap flex-md-nowrap justify-content-between mt-3">
          <VueShowdown
            tag="p"
            :markdown="$t('smartShoppingCampaignCard.intro')"
            :class="isEnabled ? 'mb-0' : 'mb-1'"
            :extensions="['no-p-tag']"
          />
          <div
            v-if="isEnabled"
            class="flex-grow-1 d-flex-md flex-md-grow-0 flex-shrink-0 text-center align-self-end"
          >
            <b-button
              @click="openPopinActivateTracking"
              size="sm"
              variant="primary"
              class="mx-1 mt-3 mt-md-0 mr-md-0 ml-md-3"
              data-test-id="btn-create-campaign"
            >
              {{ $t('cta.createCampaign') }}
            </b-button>
          </div>
        </div>
        <template v-if="isEnabled && statusTrackingTag !== null && SSCExist">
          <hr>
          <b-form-checkbox
            switch
            size="lg"
            class="ps_gs-switch"
            v-model="statusTrackingTag"
          >
            <span class="ps_gs-fz-14">
              {{ toggleTag }}
            </span>
          </b-form-checkbox>
          <b-alert
            v-if="alertTag !== null"
            variant="warning"
            show
            class="mb-0 mt-3"
          >
            <div>
              <VueShowdown
                tag="p"
                class="d-inline"
                :markdown="alertTag.text"
                :extensions="['no-p-tag']"
              />
              <div
                v-if="alertTag.button"
                class="mt-2 text-center d-md-flex align-items-center"
              >
                <b-button
                  @click="alertTag.button.onclick"
                  size="sm"
                  variant="primary"
                  class="text-wrap btn mx-1 mt-3 mt-md-0
                  ml-md-0 mr-md-1 btn-outline-secondary btn-sm"
                  data-test-id="btn-create-campaign"
                >
                  {{ alertTag.button.cta }}
                </b-button>
              </div>
            </div>
          </b-alert>
        </template>
        <BadgeListRequirements
          v-if="!isEnabled"
          :badges="['productFeed', 'googleAdsAccount']"
        />
      </b-card>
    </b-skeleton-wrapper>
  </section>
</template>

<script>
import SegmentGenericParams from '@/utils/SegmentGenericParams';
import BadgeListRequirements from '../commons/badge-list-requirements';

export default {
  name: 'SmartShoppingCampaignCard',
  components: {
    BadgeListRequirements,
  },
  data() {
    return {
      selected: null,
    };
  },
  props: {
    isEnabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    statusTrackingTag: {
      get() {
        return this.$store.getters['smartShoppingCampaigns/GET_REMARKETING_TRACKING_TAG_IS_SET'];
      },
      set(value) {
        this.$segment.track('[GGL] Disable Google SSC', {
          module: 'psxmarketingwithgoogle',
          smart_shopping_campaign_activation_value: value,
          params: SegmentGenericParams,
        });
        this.$store.dispatch(
          'smartShoppingCampaigns/SAVE_STATUS_REMARKETING_TRACKING_TAG', value,
        );
      },
    },
    alertTag() {
      if (this.statusTrackingTag === false) {
        return {
          text: this.$i18n.t('smartShoppingCampaignCreation.alerts.noTag'),
        };
      }
      if (!this.conversionActions.length) {
        return {
          text: this.$i18n.t('smartShoppingCampaignCreation.alerts.noConversionActions'),
          button: {
            cta: this.$i18n.t('smartShoppingCampaignCreation.toggleNewConversionTag'),
            onclick: () => this.$store.dispatch(
              'smartShoppingCampaigns/CREATE_REMARKETING_DEFAULT_CONVERSION_ACTIONS',
            ),
          },
        };
      }
      return null;
    },

    toggleTag() {
      if (this.statusTrackingTag === false) {
        return this.$i18n.t('smartShoppingCampaignCreation.toggleCreationRemarketingTag');
      }
      return this.$i18n.t('smartShoppingCampaignCreation.enableCreationRemarketingTag');
    },
    SSCExist() {
      return !!this.$store.getters['smartShoppingCampaigns/GET_ALL_SSC']?.length;
    },
    conversionActions() {
      return this.$store.getters['smartShoppingCampaigns/GET_REMARKETING_CONVERSION_ACTIONS_ASSOCIATED'];
    },
  },
  methods: {
    openPopinActivateTracking() {
      this.$segment.track('[GGL] Create SSC Config tab', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,

      });
      // Prevent popin for opening if tracking is a campaign exists
      if (this.SSCExist) {
        this.$router.push({
          name: 'campaign-creation',
        });
      } else {
        this.$emit('openPopin');
      }
    },
  },
};
</script>
