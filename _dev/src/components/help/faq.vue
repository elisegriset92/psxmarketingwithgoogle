<!--**
 * 2007-2021 PrestaShop and Contributors
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Academic Free License 3.0 (AFL-3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/AFL-3.0
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * @author    PrestaShop SA <contact@prestashop.com>
 * @copyright 2007-2021 PrestaShop SA and Contributors
 * @license   https://opensource.org/licenses/AFL-3.0 Academic Free License 3.0 (AFL-3.0)
 * International Registered Trademark & Property of PrestaShop SA
 *-->
<template>
  <b-card
    no-body
    class="ps_gs-onboardingcard"
  >
    <template #header>
      <div class="d-flex align-items-center ps_gs-breadcrumb__item">
        <i class="material-icons mr-2 font-weight-normal">help_outline</i>
        <span>{{ $t("help.title") }}</span>
      </div>
    </template>

    <b-card-body
      class="p-3"
    >
      <b-row>
        <b-col
          cols="12"
          md="6"
        >
          <div class="module-desc d-flex mb-4">
            <div>
              <p>
                {{ $t("help.intro") }}
              </p>
              <strong class="font-weight-600">{{ $t("help.allowsYouTo.title") }}</strong>
              <ul class="mt-3">
                <li>{{ $t("help.allowsYouTo.easySync") }}</li>
                <li>{{ $t("help.allowsYouTo.freeListing") }}</li>
                <li>{{ $t("help.allowsYouTo.ssc") }}</li>
                <li>{{ $t("help.allowsYouTo.reporting") }}</li>
              </ul>
            </div>
          </div>
        </b-col>
        <b-col
          cols="12"
          md="6"
          class="text-center"
        >
          <div class="bg-light p-4">
            <strong class="text-muted font-weight-600">{{ $t("help.help.needHelp") }}</strong>
            <br>
            <b-button
              class="mt-3"
              variant="primary"
              @click="getDocumentation"
            >
              {{ $t("help.help.downloadPdf") }}
            </b-button>
          </div>
          <div class="contact mt-4">
            <div>{{ $t("help.help.couldntFindAnyAnswer") }}</div>
            <div class="mt-2">
              <b-button
                variant="link"
                :href="`mailto:` + informations.contactUs"
              >
                {{ $t("help.help.contactUs") }}
                <i class="material-icons">arrow_right_alt</i>
              </b-button>
            </div>
          </div>
        </b-col>
      </b-row>

      <div class="row">
        <div class="faq col">
          <h1 class="border-bottom pb-3 mb-3">
            {{ $t("faq.title") }}
          </h1>
          <div
            class="mt-3 text-center"
            v-if="loading"
          >
            <div
              class="spinner"
            />
          </div>
          <template v-else-if="informations.faq && informations.faq.categories">
            <div
              class="my-3 faq"
              v-for="(categorie, index) in informations.faq.categories"
              :key="index"
              :only-one-active="true"
            >
              <h3 class="categorie-title">
                {{ categorie.title }}
              </h3>
              <div
                :ref="index + '_' + i"
                v-for="(item, i) in categorie.blocks"
                :key="i"
                class="my-3 question"
              >
                <details
                  class="faq__details"
                  @click="onQuestionClick(index + '_' + i)"
                >
                  <summary class="faq__summary">
                    <i class="material-icons">keyboard_arrow_right</i>
                    {{ item.question }}
                  </summary>
                  <VueShowdown
                    class="faq__answer"
                    :markdown="item.answer"
                  />
                </details>
              </div>
            </div>
          </template>
          <template v-else>
            <b-alert
              class="mb-0"
              variant="warning"
              show
            >
              <p>{{ $t("faq.noFaq") }}</p>
            </b-alert>
          </template>
        </div>
      </div>
    </b-card-body>
  </b-card>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api';
import SegmentGenericParams from '@/utils/SegmentGenericParams';

export default defineComponent({
  props: ['informations', 'loading'],
  methods: {
    getDocumentation() {
      window.open(this.$props.informations.doc, '_blank');
    },
    onQuestionClick(ref) {
      this.$segment.track(`[GGL] Click on the question #${ref}`, {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,
      });
    },
  },
});
</script>
