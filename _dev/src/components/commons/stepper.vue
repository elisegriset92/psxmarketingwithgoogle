<template>
  <ol class="ps_gs-stepper position-relative justify-content-center p-0 mb-3">
    <li
      v-for="(step, index) in steps"
      :key="step.title"
      class="ps_gs-stepper-step col px-0"
      :class="{
        'active': isActive(index),
        'complete': isComplete(index)
      }"
      :aria-current="isActive(index) ? 'step' : null"
    >
      <component
        :is="isClickable(index, step.notClickable) ? 'a' : 'div'"
        :href="isClickable(index, step.notClickable) ? '#' : null"
        @click.prevent="isClickable(index, step.notClickable) ? handleStepClick(index) : null"
        class="ps_gs-stepper-step__link"
      >
        <div
          class="ps_gs-stepper-step__step d-flex align-items-center justify-content-center"
        >
          <b-icon-check
            v-if="isClickable(index, step.notClickable)"
            variant="white"
            font-scale="2"
          />
          <b-icon-slash
            v-else-if="step.notClickable && isComplete(index)"
            variant="white"
            font-scale="2"
          />
          <span
            v-else
            :data-stepperLength="steps.length"
          >
            {{ index + 1 }}
          </span>
          <ProgressRing
            v-if="isActive(index)"
            :radius="22"
            :progress="(index + 1) / (steps.length) * 100"
            :stroke="2"
          />
        </div>
        <div
          class="ps_gs-stepper-step__title px-2"
          :data-nextStep="nextStepMsg(index)"
          v-html="step.title"
        />
      </component>
    </li>
  </ol>
</template>

<script>
import {
  BIconCheck,
  BIconSlash,
} from 'bootstrap-vue';

import ProgressRing from '../commons/progress-ring';

export default {
  name: 'Stepper',
  components: {
    BIconCheck,
    BIconSlash,
    ProgressRing,
  },

  props: {
    steps: {
      type: Array,
      required: true,
    },
    activeStep: {
      type: Number,
      default: 1,
    },
  },
  methods: {
    isComplete(index) {
      return index < this.mutableActiveStep - 1;
    },
    isActive(index) {
      return index + 1 === this.mutableActiveStep;
    },
    isClickable(index, notClickable) {
      if (notClickable) {
        return false;
      }
      if (this.isComplete(index)) {
        return true;
      }
      return false;
    },
    handleStepClick(index) {
      this.mutableActiveStep = index + 1;
    },
    nextStepMsg(index) {
      if (index < (this.steps.length - 1)) {
        return this.$i18n.t('stepper.nextStep', [this.steps[index + 1].title]);
      }
      return this.$i18n.t('stepper.lastStep');
    },
  },
  computed: {
    mutableActiveStep: {
      get() {
        return this.activeStep;
      },
      set(value) {
        // might need refacto to be of general used instead of depending on the route ?
        if (this.mutableActiveStep >= value) {
          if (this.$route.name === 'product-feed-settings') {
            this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', value);
          } else {
            this.$emit('changeStep', value);
          }
        }
      },
    },
  },
};
</script>
