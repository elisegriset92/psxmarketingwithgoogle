<template>
  <div class="mb-2">
    <b-alert
      v-if="errorModule"
      variant="warning"
      class="mb-0 mt-3"
      show
    >
      <VueShowdown
        tag="p"
        :extensions="['no-p-tag']"
        class="mb-0"
        :markdown="$t(`general.moduleUpdateNeeded.${moduleName}`)"
      />
      <div
        class="d-md-flex text-center align-items-center mt-2"
      >
        <b-button
          size="sm"
          class="mx-1 mt-3 mt-md-0 md-4 mr-md-1"
          variant="primary"
          target="_blank"
          @click="updateModule"
        >
          <span v-if="loading">
            <span class="icon-busy icon-busy--dark" />
          </span>
          <span
            v-else
          >
            {{ $t('cta.update') }}
          </span>
        </b-button>
      </div>
    </b-alert>
  </div>
</template>

<script>
const semver = require('semver');

export default {
  name: 'AlertUpdateModule',
  props: {
    moduleName: {
      type: String,
      default: null,
      required: true,
    },
    neededVersion: {
      type: String,
      default: null,
      required: true,
    },
  },

  data() {
    return {
      loading: false,
      errorModule: false,
      upgradeLink: null,
      installedVersion: null,
    };
  },

  methods: {
    async checkForInstalledVersion() {
      const res = await this.$store.dispatch('app/GET_MODULES_VERSIONS', this.moduleName);
      if (!res.version) {
        return;
      }
      // if module version >= version needed
      if (semver.gte(res.version, this.neededVersion)) {
        return;
      }
      this.upgradeLink = res.upgradeLink;
      this.installedVersion = res.version;
      this.errorModule = true;
    },
    async updateModule() {
      this.loading = true;
      try {
        await fetch(this.upgradeLink, {
          method: 'POST',
          headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        });
        this.checkForInstalledVersion();
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
  },
  created() {
    this.checkForInstalledVersion();
  },

};
</script>
