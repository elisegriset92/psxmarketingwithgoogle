<template>
  <div
    class="ps_gs-landingpage-content d-flex flex-column flex-md-row align-items-center mb-4"
  >
    <figure class="ps_gs-landingpage-content__figure flex-shrink-0 mr-md-3 mb-md-0">
      <img
        :src="require(`@/assets/images/${contentImage}`)"
        class="img-fluid d-block mx-auto"
        alt=""
        width="250"
        height="175"
      >
    </figure>
    <div>
      <h3 class="ps_gs-landingpage-content__title mb-3">
        {{ contentTitle }}
      </h3>
      <VueShowdown
        :markdown="contentText"
        class="ps_gs-landingpage-content__text"
      />
      <div
        class="ps_gs-landingpage-content__muted text-muted"
      >
        <VueShowdown
          :markdown="contentFooter"
          :extensions="['extended-link']"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LandingPageContent',
  data() {
    return {
    };
  },
  props: {
    contentImage: {
      type: String,
      required: true,
    },
    contentTitle: {
      type: String,
      required: true,
    },
    contentText: {
      type: String,
      required: true,
    },
    contentFooter: {
      type: String,
      required: true,
    },
  },
};
</script>
