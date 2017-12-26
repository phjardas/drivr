<template>
<div>
  <md-speed-dial class="md-top-right">
    <md-speed-dial-target class="md-accent" style="z-index: 100" :to="`/cars/_new`">
      <md-icon>directions_car</md-icon>
    </md-speed-dial-target>
  </md-speed-dial>

  <spinner v-if="cars.loading" />

  <b-alert v-if="cars.failed" variant="danger">Error: {{ cars.error.message }}</b-alert>

  <template v-if="cars.loaded">
    <md-list v-if="items.length" class="md-triple-line">
      <md-list-item v-for="car of items" :key="car.id" :to="`/cars/${car.id}`">
        <md-icon>directions_car</md-icon>
        <div class="md-list-item-text">
          <span>{{ car.licensePlate }}</span>

          <span v-if="car.stats">
            {{ car.stats.refuelCount }} refuels,
            {{ car.stats.totalDistance }} km
          </span>
          <span v-else>No refuels yet</span>

          <span v-if="car.stats && car.stats.averageConsumption">
            {{ (car.stats.averageConsumption * 100).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) }}
            cl/km
          </span>
        </div>
      </md-list-item>
    </md-list>

    <md-empty-state
      v-else
      md-rounded
      md-icon="directions_car"
      md-label="No cars yet">
      <md-button class="md-primary md-raised" to="/cars/_new">Register your car</md-button>
    </md-empty-state>
  </template>
</div>
</template>

<script>
import Spinner from '../Spinner';
import { mapState, mapActions } from 'vuex';

export default {
  components: { Spinner },

  computed: {
    ...mapState(['cars']),
    items: function() {
      return Object.keys(this.cars.items)
        .map(id => this.cars.items[id])
        .sort((a, b) => a.licensePlate.localeCompare(b.licensePlate));
    },
  },

  created() {
    this.$store.dispatch('setPageTitle', { title: 'Your cars' });
  },
};
</script>
