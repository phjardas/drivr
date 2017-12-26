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
    </md-tabs>
    <router-view></router-view>
  </div>
  <spinner v-else />
</div>
</template>

<script>
import { mapState } from 'vuex';
import Spinner from '../Spinner';

export default {
  components: { Spinner },

  computed: mapState({
    car(state) {
      return state.cars.items[this.$route.params.id];
    },
  }),

  watch: {
    car(car) {
      this.setPageTitle();
    },
  },

  methods: {
    setPageTitle() {
      this.$store.dispatch('setPageTitle', { title: this.car ? this.car.licensePlate : 'loading…' });
    },
  },

  created() {
    this.setPageTitle();
  },
};
</script>
