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
        :class="{ 'ps_gs-onboardingcard--disabled': !isEnabled }"
        id="product-feed-card"
      >
        <div class="d-flex flex-wrap align-items-center justify-content-between mb-3">
          <div class="d-flex align-items-center">
            <img
              class="mr-3"
              :src="
                isEnabled
                  ? require('@/assets/images/product-feed-icon.png')
                  : require('@/assets/images/product-feed-icon-grey.png')
              "
              width="40"
              height="40"
              alt=""
            >
            <b-card-text class="flex-grow-1 ps_gs-onboardingcard__title text-left mb-0">
              {{ $t("productFeedCard.title") }}
            </b-card-text>
          </div>
        </div>
        <p
          class="mb-1"
          v-if="!isEnabled"
        >
          {{ $t("productFeedCard.intro") }}
        </p>
        <BadgeListRequirements
          v-if="!isEnabled"
          :badges="['merchantCenterAccount']"
        />
        <div v-if="(isEnabled && toConfigure) || isErrorApi">
          <p>
            {{ $t("productFeedCard.introToConfigure") }}<br>
            <a
              class="ps_gs-fz-12 text-muted"
              :href="$options.googleUrl.productConfiguration"
              target="_blank"
            >
              {{ $t("cta.learnAboutProductConfiguration") }}
            </a>
          </p>
          <stepper
            class="mt-2"
            :steps="steps"
            :active-step="1"
          />
          <div
            class="d-flex justify-content-center justify-content-md-end mt-n1"
            v-if="isEnabled"
          >
            <b-button
              size="sm"
              variant="primary"
              @click="startConfiguration"
              :disabled="isErrorApi"
            >
              {{ $t("cta.configureAndExportProductFeed") }}
            </b-button>
          </div>
        </div>
        <div
          v-if="isEnabled && isErrorApi"
          class="mt-3"
        >
          <b-alert
            variant="warning"
            show
          >
            <VueShowdown
              :markdown="$t('productFeedCard.alertErrorApi')"
            />
            <div
              class="mt-1"
            >
              <b-button
                @click="refresh"
                variant="outline-secondary"
              >
                {{ $t("general.refreshPage") }}
              </b-button>
            </div>
          </b-alert>
        </div>
        <div v-if="isEnabled && !toConfigure && !isErrorApi">
          <b-alert
            :variant="alert === 'FeedSettingSubmissionSuccess' ? 'info' : 'warning'"
            :show="!!alert && alert !== 'ShippingSettingsMissing'"
          >
            <VueShowdown
              :markdown="$t(`productFeedCard.alert${alert}`, alertLink)"
              :extensions="['extended-link']"
            />
            <div
              v-if="alert === 'ProductFeedExists'"
              class="mt-1"
            >
              <b-button variant="outline-secondary">
                {{ $t("cta.overwrite") }}
              </b-button>
            </div>
          </b-alert>
          <h3 class="font-weight-600 ps_gs-fz-14 d-flex align-items-center">
            <i
              class="ps_gs-fz-20 mr-2"
              :class="[`text-${title.color}`, title.materialClass || 'material-icons']"
            >
              {{ title.icon }}
            </i>
            <span>{{ title.message }}</span>
          </h3>
          <div
            v-if="syncStatus !== 'warning'"
            class="d-sm-flex align-items-end mb-1"
          >
            <p class="ps_gs-fz-12 text-muted mb-0">
              {{ syncStatus === 'schedule'
                ? $t("productFeedPage.syncStatus.scheduleOn", [nextSyncTime])
                : $t("productFeedCard.nextSync", [nextSyncTime])
              }}
            </p>
            <b-button
              variant="invisible"
              class="bg-transparent p-0 border-0 font-weight-600 ps_gs-fz-13 ml-auto text-primary"
              @click="goToProductFeed()"
            >
              {{ $t("cta.trackProductStatus") }}
            </b-button>
          <!-- Not in free plan -->
          <!-- <b-button
          v-if="syncStatus === 'failed'"
          variant="primary"
          class="d-block mx-auto my-2 my-sm-0 ml-sm-3 mr-sm-0"
        >
          <span class="material-icons">
            autorenew
          </span>
          {{ $t('cta.forceSync') }}
        </b-button> -->
          </div>
          <!--  NOT IN BATCH 1 -->
          <!-- <b-container
        fluid
        class="p-0 mb-2"
      >
        <b-row
          no-gutters
          class="mx-n1"
        >
          <product-feed-card-report-products-card
            status="success"
            :title="$t('productFeedCard.productsReadyToBeSynced')"
            :nb-products="nbProductsReadyToSync"
            :sync-status="syncStatus"
          />
          <product-feed-card-report-products-card
            status="warning"
            :title="$t('productFeedCard.productsWithProblems')"
            :nb-products="nbProductsCantSync"
            :sync-status="syncStatus"
            :link="$t('cta.reviewProblems')"
            link-to="#"
          />
        </b-row>
      </b-container> -->
          <div class="d-flex justify-content-between align-items-center mb-3 mt-3 pt-2">
            <h3 class="font-weight-600 ps_gs-fz-14 mb-0">
              {{ $t("productFeedSettings.breadcrumb2") }}
            </h3>
          </div>
          <b-alert
            variant="warning"
            :show="!!alert && alert === 'ShippingSettingsMissing'"
          >
            <p class="mb-2">
              <VueShowdown
                tag="strong"
                class="font-weight-600"
                :markdown="$t('productFeedCard.alertShippingSettingsMissing')"
                :extensions="['extended-link', 'no-p-tag']"
              />
              <br>
              <span class="ps_gs-fz-12">
                {{ $t("productFeedCard.alertShippingSettingsMissingDescription") }}
              </span>
            </p>
            <div class="mt-1">
              <b-button
                variant="outline-secondary"
                @click="goToProductFeedSettings(1)"
              >
                {{ $t("cta.addShippingInfo") }}
              </b-button>
            </div>
          </b-alert>
          <b-container
            fluid
            class="p-0 mb-0 mt-n1"
          >
            <b-row
              no-gutters
              class="mx-n1"
            >
              <product-feed-card-report-card
                :status="targetCountriesStatus"
                :title="$t('productFeedSettings.shipping.targetCountries')"
                :description="targetCountries.join(', ')"
                :link="$t('cta.editCountries')"
                :link-to="{ type: 'routeStep', name: 'product-feed-settings', step: 1 }"
              />
              <product-feed-card-report-card
                :status="shippingSettingsStatus"
                :title="$t('productFeedSettings.shipping.shippingSettings')"
                :description="shippingSettings"
                :link="$t('cta.editSettings')"
                :link-to="{ type: 'routeStep', name: 'product-feed-settings', step: 1 }"
              />
              <product-feed-card-report-card
                v-if="isUS"
                :status="taxSettingsStatus"
                :title="$t('productFeedSettings.shipping.taxSettings')"
                :description="taxSettings"
                :link="$t('cta.editSettings')"
                :link-to="{ type: 'routeStep', name: 'product-feed-settings', step: 1 }"
              />
              <!--  NOT IN BATCH 1 -->
              <!-- <product-feed-card-report-card
            status="success"
            :title="$t('productFeedSettings.steps.syncRules')"
            :description="syncRules.join(', ')"
            :details="syncRulesDetails.join(', ')"
            :link="$t('cta.editRules')"
            link-to="#"
          />
           <product-feed-card-report-card
            status="success"
            :title="$t('productFeedCard.excludedProducts')"
            :description="`
              ${$t('productFeedCard.excludedProducts')} (${excludedProductsDetails.length})
            `"
            :details="excludedProductsDetails.join(', ')"
            :link="$t('cta.editRules')"
            link-to="#"
          /> -->
              <product-feed-card-report-card
                :status="attributeMappingStatus"
                :title="$t('productFeedSettings.steps.attributeMapping')"
                :description="attributeMapping.join(', ')"
                :link="$t('cta.editProductAttributes')"
                :link-to="{ type: 'routeStep', name: 'product-feed-settings', step: 3 }"
              />
            <!--  NOT IN BATCH 1 -->
            <!-- <product-feed-card-report-mapped-categories-card
            :has-mapping="hasMapping"
            :categories-mapped="categoriesMapped"
            :categories-total="categoriesTotal"
          /> -->
            </b-row>
          </b-container>
        </div>
      </b-card>
    </b-skeleton-wrapper>
  </section>
</template>

<script>
import {VueShowdown} from 'vue-showdown';
import googleUrl from '@/assets/json/googleUrl.json';
import Stepper from '../commons/stepper';
import ProductFeedCardReportCard from './product-feed-card-report-card';
//  eslint-disable-next-line
// import ProductFeedCardReportMappedCategoriesCard from './product-feed-card-report-mapped-categories-card';
// import ProductFeedCardReportProductsCard from './product-feed-card-report-products-card';
import BadgeListRequirements from '../commons/badge-list-requirements';
import SegmentGenericParams from '@/utils/SegmentGenericParams';

export default {
  name: 'ProductFeedCard',
  components: {
    Stepper,
    ProductFeedCardReportCard,
    // NOT IN BATCH 1
    BadgeListRequirements,
    VueShowdown,
    // ProductFeedCardReportMappedCategoriesCard,
    // ProductFeedCardReportProductsCard,
  },
  data() {
    return {
      steps: [
        {
          title: this.$i18n.t('productFeedSettings.steps.targetCountry'),
        },
        {
          title: this.$i18n.t('productFeedSettings.steps.shippingSettings'),
        },
        {
          title: this.$i18n.t('productFeedSettings.steps.attributeMapping'),
        },
        {
          title: this.$i18n.t('productFeedSettings.steps.syncSchedule'),
        },
        {
          title: this.$i18n.t('productFeedSettings.steps.summary'),
        },
      ],
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
    categoriesTotal: {
      type: Number,
    },
    categoriesMapped: {
      type: Number,
      default: 0,
    },
    syncRules: {
      type: Array,
    },
    syncRulesDetails: {
      type: Array,
    },
  },
  computed: {
    getProductFeedSettings() {
      return this.$store.getters['productFeed/GET_PRODUCT_FEED_SETTINGS'];
    },
    getProductFeedStatus() {
      return this.$store.getters['productFeed/GET_PRODUCT_FEED_STATUS'];
    },
    nextSyncTime() {
      return this.$options.filters.timeConverterToDate(
        this.getProductFeedStatus.nextJobAt,
      );
    },
    isUS() {
      return this.$store.getters['productFeed/GET_TARGET_COUNTRIES'].includes('US');
    },
    toConfigure() {
      return !this.$store.state.productFeed.isConfigured;
    },
    targetCountries() {
      return this.$options.filters.changeCountriesCodesToNames(
        this.$store.getters['productFeed/GET_TARGET_COUNTRIES'],
      );
    },
    shippingSettings() {
      if (this.getProductFeedSettings.autoImportShippingSettings === undefined) {
        return this.$t('productFeedCard.missingInformation');
      }
      return this.getProductFeedSettings.autoImportShippingSettings
        ? this.$t('productFeedSettings.shipping.automatically')
        : this.$t('productFeedSettings.shipping.manually');
    },
    shippingSettingsStatus() {
      return this.getProductFeedSettings.autoImportShippingSettings !== undefined
        ? 'success'
        : 'warning';
    },
    targetCountriesStatus() {
      return this.targetCountries.length ? 'success' : 'warning';
    },
    attributeMappingStatus() {
      return this.getProductFeedSettings.attributeMapping ? 'success' : 'warning';
    },
    taxSettings() {
      if (this.getProductFeedSettings.autoImportTaxSettings === undefined) {
        return this.$t('productFeedCard.missingInformation');
      }
      return this.getProductFeedSettings.autoImportTaxSettings
        ? this.$t('productFeedSettings.shipping.automatically')
        : this.$t('productFeedSettings.shipping.manually');
    },
    taxSettingsStatus() {
      // TODO BATCH 2
      // TODO retrieve tax settings from backend
      return 'success';
    },
    attributeMapping: {
      get() {
        const arr = [];
        const getMapping = this.getProductFeedSettings.attributeMapping;
        Object.keys(getMapping).forEach((key) => {
          if (getMapping[key]) {
            getMapping[key].forEach((item) => {
              arr.push(item.id);
            });
          }
        });
        return arr;
      },
    },
    lastSync() {
      return {
        day: this.$options.filters.timeConverterToDate(
          this.getProductFeedStatus?.lastUpdatedAt ?? this.getProductFeedStatus?.jobEndedAt,
        ),
        time: this.$options.filters.timeConverterToHour(
          this.getProductFeedStatus?.lastUpdatedAt ?? this.getProductFeedStatus?.jobEndedAt,
        ),
        totalProducts: this.getProductFeedSettings.totalProducts,
      };
    },
    title() {
      if (this.syncStatus === 'schedule') {
        return {
          icon: 'schedule',
          color: 'primary',
          message: this.$i18n.t('productFeedPage.syncStatus.readyForExport'),
        };
      }
      if (this.syncStatus === 'failed') {
        return {
          icon: 'info_outlined',
          color: 'danger',
          message: this.$i18n.t('productFeedCard.syncFailedAt', [
            this.lastSync.day,
            this.lastSync.time,
          ]),
        };
      }
      if (this.syncStatus === 'warning') {
        return {
          icon: 'warning',
          color: 'warning',
          materialClass: 'material-icons-round',
          message: this.$i18n.t('productFeedCard.syncCantPerform'),
        };
      }
      return {
        icon: 'check_circle',
        color: 'success',
        message: this.$i18n.tc('productFeedCard.syncSuccess',
          this.lastSync.totalProducts,
          [
            this.lastSync.totalProducts,
            this.lastSync.day,
            this.lastSync.time,
          ],
        ),
      };
    },
    alertLink() {
      if (this.alert === 'Failed') {
        return [this.$options.googleUrl.syncFailed];
      }
      return null;
    },
    hasMapping() {
      return this.categoriesMapped > 0;
    },
    alert() {
      if (this.getProductFeedStatus.success === false && this.getProductFeedStatus.jobEndedAt
      && this.getProductFeedStatus.lastUpdatedAt) {
        return 'Failed';
      }
      if (this.getProductFeedSettings.autoImportShippingSettings === undefined) {
        return 'ShippingSettingsMissing';
      }
      if (
        this.getProductFeedStatus.lastUpdatedAt === null
      && this.getProductFeedStatus.success === false
      ) {
        return 'FeedSettingSubmissionSuccess';
      }
      // TODO: ProductFeedExists > Overwrite needed
      // if (something) {
      //   return 'ProductFeedExists';
      // }
      return null;
    },
    syncStatus() {
      return this.$store.getters['productFeed/GET_SYNC_STATUS'];
    },
    isErrorApi() {
      return this.$store.state.productFeed.errorAPI;
    },
    allValidationSummary() {
      return this.$store.state.productFeed.validationSummary;
    },
    nbProductsCantSync() {
      return this.allValidationSummary.disapprovedItems;
    },
    nbProductsReadyToSync() {
      return this.allValidationSummary.activeItems;
    },
    excludedProductsDetails() {
      return this.allValidationSummary.disapprovedItems;
    },
  },
  methods: {
    startConfiguration() {
      this.$router.push({
        name: 'product-feed-settings',
      });
      this.$segment.track('[GGL] Start Product feed configuration', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,
      });
    },
    goToProductFeedSettings(step) {
      this.$router.push({
        name: 'product-feed-settings',
      });
      this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', step);
    },
    refresh() {
      this.$router.go();
    },
    goToProductFeed() {
      this.$router.push({
        name: 'product-feed',
      });
    },
  },
  googleUrl,
};
</script>
