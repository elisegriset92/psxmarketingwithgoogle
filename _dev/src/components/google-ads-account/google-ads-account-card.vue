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
        :class="{ 'ps_gs-onboardingcard--disabled-grey' : !isEnabled }"
      >
        <template
          v-if="!isEnabled"
        >
          <div
            class="d-flex align-items-center"
          >
            <img
              class="mr-3"
              src="@/assets/images/Google-Commercial-icon-grey.svg"
              width="40"
              height="40"
              alt=""
            >
            <b-card-text class="text-left mb-0">
              {{ $t('googleAdsAccountCard.intro') }}
            </b-card-text>
          </div>
        </template>
        <template
          v-else
        >
          <div
            class="d-flex align-items-center"
          >
            <img
              class="mr-3"
              src="@/assets/images/Google-Commercial-icon.svg"
              width="40"
              height="40"
              alt=""
            >
            <b-card-text class="ps_gs-onboardingcard__title  text-left mb-0">
              {{ $t('googleAdsAccountCard.title') }}
            </b-card-text>
            <i
              v-if="googleAdsAccountConfigured && !error"
              class="material-icons ps_gs-fz-22 ml-2 mr-3 mb-0 text-success align-bottom"
            >
              check_circle
            </i>
          </div>
          <div v-if="isEnabled && !googleAdsAccountConfigured">
            <b-form class="mt-3 mb-2">
              <legend
                class="mb-1 h4 font-weight-600 border-0 bg-transparent"
              >
                {{ $t('googleAdsAccountCard.labelSelect') }}
              </legend>
              <div class="d-md-flex text-center">
                <b-dropdown
                  :disabled="error === GoogleAdsErrorReason.CantConnect"
                  id="googleAdsAccountSelection"
                  ref="googleAdsAccountSelection"
                  :text="googleAdsLabel(selectedIndex) || $t('cta.selectAccount')"
                  variant=" "
                  class="flex-grow-1 ps-dropdown psxmarketingwithgoogle-dropdown bordered"
                  :toggle-class="{'ps-dropdown__placeholder' : selectedIndex === null}"
                  menu-class="ps-dropdown"

                  size="sm"
                >
                  <!-- START > SPINNER -->
                  <b-dropdown-item
                    link-class="px-3"
                    :disabled="true"
                    v-if="listLoading"
                  >
                    <i class="icon-busy icon-busy--dark" />
                  </b-dropdown-item>
                  <!-- END > SPINNED -->
                  <!-- START > NO EXISTING ACCOUNT -->
                  <b-dropdown-item
                    v-if="!listLoading && googleAdsAccountSelectionOptions.length === 0"
                    :disabled="true"
                    variant="dark"
                    link-class="d-flex flex-wrap flex-md-nowrap align-items-center px-3"
                    data-test-id="message-empty-list"
                  >
                    <span class="mr-2">
                      {{ $t('mcaCard.noExistingAccount') }}
                    </span>
                  </b-dropdown-item>
                  <!-- END > NO EXISTING ACCOUNT -->
                  <!-- START > REGULAR LIST -->
                  <b-dropdown-item
                    v-for="(option, index) in googleAdsAccountSelectionOptions"
                    :key="option.id"
                    @click="selectedIndex = index"
                    :disabled="isShownAsDisabled(option)"
                    variant="dark"
                    link-class="d-flex flex-wrap flex-md-nowrap align-items-center px-3"
                  >
                    <span class="mr-2">
                      {{ displayIdName(option) }}
                    </span>
                    <span
                      v-if="isAccountCancelled(option) || isAccountSuspended(option)"
                      class="ps_gs-fz-12 ml-auto"
                    >
                      {{ $t('mcaCard.alertSuspended') }}
                    </span>
                    <span
                      v-else-if="!isAdmin(option)"
                      class="ps_gs-fz-12 ml-auto"
                    >
                      {{ $t('mcaCard.userIsNotAdmin') }}
                    </span>
                    <span
                      v-if="isTestAccount(option)"
                      class="ps_gs-fz-12 ml-auto"
                    >
                      {{ $t('mcaCard.userIsTestAccount') }}
                    </span>
                  </b-dropdown-item>
                <!-- END > REGULAR LIST -->
                </b-dropdown>
                <b-button
                  size="sm"
                  variant="primary"
                  :disabled="selectedIndex === null"
                  class="mt-3 mt-md-0 ml-md-3"
                  @click="selectGoogleAdsAccount"
                >
                  <template v-if="!isConnecting">
                    {{ $t('cta.connectAccount') }}
                  </template>
                  <template v-else>
                    {{ $t('cta.connecting') }}
                    <span class="ml-1 icon-busy" />
                  </template>
                </b-button>
              </div>
              <VueShowdown
                class="text-muted ps_gs-fz-12 mt-3 mt-md-0"
                :markdown="$t('googleAdsAccountCard.toUseGAdsNeedsAdminAccess')"
              />
            </b-form>
            <GoogleAdsAccountAlert
              v-if="error === GoogleAdsErrorReason.CantConnect"
              :error="error"
            />
            <div
              class="mt-3"
            >
              <p class="mb-1">
                {{ $t('general.legendCreateNewAccount') }}
              </p>
              <b-button
                variant="outline-primary"
                class="mb-0"
                size="sm"
                @click="openPopinNewAccount"
              >
                <i
                  class="left material-icons mr-2 ps_gs-fz-24"
                  aria-hidden="true"
                >person_add</i>
                <span class="align-middle text-wrap">
                  {{ $t('cta.createNewGoogleAdsAccount') }}
                </span>
              </b-button>
            </div>
          </div>
          <div
            v-if="googleAdsAccountConfigured && isGoogleAdsAccountFullyFetched"
            class="d-flex flex-wrap flex-md-nowrap justify-content-between mt-3"
          >
            <div class="d-flex align-items-center">
              <strong>{{ displayIdName(accountChosen) }}</strong>
              <b-badge
                v-if="gAdsAccountStatusBadge !== null"
                :variant="gAdsAccountStatusBadge.color"
                class="mx-3"
              >
                {{ $t(`badge.${gAdsAccountStatusBadge.text}`) }}
              </b-badge>
              <b-badge
                v-if="testAccountBadge !== null"
                :variant="testAccountBadge.color"
                class="mx-1"
              >
                {{ $t(`badge.${testAccountBadge.text}`) }}
              </b-badge>
            </div>
            <div
              v-if="!googleAdsAccountConfigured"
              class="flex-grow-1 d-flex-md flex-md-grow-0 flex-shrink-0 text-center"
            >
              <b-button
                size="sm"
                variant="primary"
                class="mx-1 mt-3 mt-md-0 mr-md-0"
                target="_blank"
              >
                <template v-if="!isConnecting">
                  {{ $t('cta.connectAccount') }}
                </template>
                <template v-else>
                  {{ $t('cta.connecting') }}
                  <span class="ml-1 icon-busy" />
                </template>
              </b-button>
            </div>
            <div
              v-else
              class="mx-auto d-flex-md mr-md-0 flex-md-shrink-0 text-center align-self-end"
            >
              <b-button
                size="sm"
                variant="outline-secondary"
                class="mt-3 mt-md-0"
                target="_blank"
                data-test-id="btn-disconnect"
                :disabled="accountAwaitsValidation()"
                @click="disconnectGoogleAdsAccount()"
              >
                {{ $t('cta.disconnect') }}
              </b-button>
            </div>
          </div>
          <p
            v-if="!googleAdsAccountConfigured"
            class="mt-3 mb-0 ps_gs-fz-12 text-muted"
          >
            {{ $t('googleAdsAccountCard.text') }}
          </p>
        </template>
        <GoogleAdsAccountAlert
          v-if="error !== 'CantConnect'"
          :error="error"
        />
      </b-card>
    </b-skeleton-wrapper>
  </section>
</template>

<script>
import googleUrl from '@/assets/json/googleUrl.json';
import GoogleAdsAccountAlert from './google-ads-account-alert.vue';
import {
  GoogleAdsErrorReason,
} from '../../store/modules/google-ads/state';
import SegmentGenericParams from '@/utils/SegmentGenericParams';

export default {
  name: 'GoogleAdsAccountCard',
  components: {
    GoogleAdsAccountAlert,
  },
  data() {
    return {
      selectedIndex: null,
      GoogleAdsErrorReason,
      isConnecting: false,
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

  methods: {
    async selectGoogleAdsAccount() {
      this.$segment.track('[GGL] Connect GAds', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,
      });
      this.isConnecting = true;
      try {
        await this.$store.dispatch('googleAds/SAVE_SELECTED_GOOGLE_ADS_ACCOUNT', this.googleAdsAccountSelectionOptions[this.selectedIndex]);
        await new Promise((resolve) => setTimeout(resolve, 4000));
        await this.$store.dispatch('googleAds/GET_GOOGLE_ADS_ACCOUNT');
        if (this.accountChosen) {
          this.$emit('selectGoogleAdsAccount');
        }
      } catch (err) {
        this.$store.commit('googleAds/SET_GOOGLE_ADS_STATUS', 'CantConnect');
        console.error(err);
      } finally {
        this.isConnecting = false;
      }
    },
    googleAdsLabel(index) {
      if (this.googleAdsAccountSelectionOptions && this.googleAdsAccountSelectionOptions[index]) {
        const ga = this.googleAdsAccountSelectionOptions[index];
        const name = ga.name || '';
        return name ? `${ga.id} - ${name}` : ga.id;
      }
      return null;
    },
    isShownAsDisabled(account) {
      return !this.isAdmin(account)
        || this.isAccountCancelled(account)
        || this.isAccountSuspended(account);
    },
    isAdmin(account) {
      // !! MIGHT NEED REFACTO if no isAdmin is sent by the API
      // !! CF merchand center account card isGmcUserAdmin
      return account.isAdmin === true;
    },
    isAccountCancelled(account) {
      return account.isAccountCancelled === true;
    },
    isAccountSuspended(account) {
      return account.isAccountSuspended === true;
    },
    isTestAccount(account) {
      return account.isTestAccount === true;
    },
    refresh() {
      this.$router.go();
    },
    disconnectGoogleAdsAccount() {
      this.$segment.track('[GGL] Disconnect GAds Account', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,

      });
      this.$emit('disconnectionGoogleAdsAccount');
    },
    openPopinNewAccount() {
      this.$segment.track('[GGL] Create GAds', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,

      });
      this.$emit('creationGoogleAdsAccount');
    },
    displayIdName(option) {
      return option.name
        ? `${option.id} - ${option.name}` : option.id;
    },
    accountAwaitsValidation() {
      return this.error === GoogleAdsErrorReason.NeedValidationFromEmail
       || this.error === GoogleAdsErrorReason.NeedRefreshAfterInvitationLink;
    },
  },
  computed: {
    accountChosen() {
      return this.$store.getters['googleAds/GET_GOOGLE_ADS_ACCOUNT_CHOSEN'];
    },
    googleAdsAccountConfigured() {
      return this.accountChosen !== null;
    },
    googleAdsAccountSelectionOptions() {
      return this.$store.getters['googleAds/GET_GOOGLE_ADS_LIST_OPTIONS'];
    },
    listLoading() {
      return this.googleAdsAccountSelectionOptions === null;
    },
    error() {
      return this.$store.getters['googleAds/GET_GOOGLE_ADS_STATUS'];
    },
    gAdsAccountStatusBadge() {
      switch (this.error) {
        case GoogleAdsErrorReason.Suspended:
          return {
            color: 'danger',
            text: 'suspended',
          };
        case GoogleAdsErrorReason.Cancelled:
          return {
            color: 'danger',
            text: 'canceled',
          };
        case GoogleAdsErrorReason.CantConnect:
        case GoogleAdsErrorReason.NeedValidationFromEmail:
        case GoogleAdsErrorReason.BillingSettingsMissing:
        case GoogleAdsErrorReason.NeedRefreshAfterBilling:
        case GoogleAdsErrorReason.NeedRefreshAfterInvitationLink:
          return null;
        default:
          return {
            color: 'success',
            text: 'active',
          };
      }
    },
    testAccountBadge() {
      if (this.accountChosen && this.isTestAccount(this.accountChosen)) {
        return {
          color: 'warning',
          text: 'testAccount',
        };
      }
      return null;
    },
    isGoogleAdsAccountFullyFetched() {
      return this.isEnabled
        && !this.listLoading
        && this.accountChosen.id !== null
        && this.accountChosen.id !== undefined;
    },

  },

  googleUrl,
};
</script>
