<template>
<div>
  <template v-if="car">
    <v-btn fab bottom right dark fixed color="accent" :to="`/cars/${car.id}/refuels/_new`">
      <v-icon>local_gas_station</v-icon>
    </v-btn>

    <v-tabs fixed icons centered>
      <v-tabs-bar grow>
        <v-tabs-slider color="accent"></v-tabs-slider>
        <v-tabs-item :to="`/cars/${car.id}`" router>
          <v-icon>dashboard</v-icon>
          Statistics
        </v-tabs-item>
        <v-tabs-item :to="`/cars/${car.id}/refuels`" router>
          <v-icon>local_gas_station</v-icon>
          Refuels
        </v-tabs-item>
        <v-tabs-item :to="`/cars/${car.id}/charts`" router>
          <v-icon>show_chart</v-icon>
          Charts
        </v-tabs-item>
        <v-tabs-item :to="`/cars/${car.id}/settings`" router>
          <v-icon>settings</v-icon>
          Settings
        </v-tabs-item>
      </v-tabs-bar>
    </v-tabs>

    <router-view></router-view>
  </template>

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
