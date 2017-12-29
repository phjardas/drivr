<template>
<div>
  <div v-if="car">
    <md-speed-dial class="md-top-right">
      <md-speed-dial-target class="md-accent" style="z-index: 100" :to="`/cars/${car.id}/refuels/_new`">
        <md-icon>local_gas_station</md-icon>
      </md-speed-dial-target>
    </md-speed-dial>

    <md-tabs md-sync-route>
      <md-tab md-label="Statistics" md-icon="show_chart" :to="`/cars/${car.id}`" />
      <md-tab md-label="Refuels" md-icon="local_gas_station" :to="`/cars/${car.id}/refuels`" />
      <md-tab md-label="Settings" md-icon="settings" :to="`/cars/${car.id}/settings`" />
    </md-tabs>

    <router-view></router-view>
  </div>

  <spinner v-else />
</div>
</template>

<script>
import { mapGetters } from 'vuex';
import Spinner from '../Spinner';

export default {
  components: { Spinner },

  computed: {
    ...mapGetters(['getCar']),
    car() {
      return this.getCar(this.$route.params.id);
    },
  },

  watch: {
    car(car) {
      this.setPageTitle();
    },
  },

  methods: {
    setPageTitle() {
      this.$store.dispatch('setPageTitle', { title: this.car ? this.car.label : 'loading…' });
    },
  },

  created() {
    this.setPageTitle();
  },
};
</script>
