<template>
<div>
  <spinner v-if="refuelData.loading" />

  <div v-else-if="refuels.length" class="md-layout-row md-layout-wrap md-gutter">
    <div class="md-flex md-flex-small-100">
      <h3 class="md-subheading">Mileage over time</h3>
      <mileage-chart :refuels="refuels" :height="200" />
    </div>
    <div class="md-flex md-flex-small-100">
      <h3 class="md-subheading">Consumption over time</h3>
      <consumption-chart :refuels="refuels" :height="200" />
    </div>
    <div class="md-flex md-flex-small-100">
      <h3 class="md-subheading">Fuel price over time</h3>
      <fuel-price-chart :refuels="refuels" :height="200" />
    </div>
    <div class="md-flex md-flex-small-100">
      <h3 class="md-subheading">Range per refuel</h3>
      <range-chart :refuels="refuels" :height="200" />
    </div>
  </div>

  <md-empty-state
    v-else
    md-rounded
    md-icon="show_chart"
    md-label="No charts yet"
    md-description="Charts will become available once you've recorded two refuels">
    <md-button class="md-primary md-raised" :to="`/cars/${this.$route.params.id}/refuels/_new`">Record refuel</md-button>
  </md-empty-state>
</div>
</template>

<script>
import { mapGetters } from 'vuex';
import MileageChart from './charts/MileageChart';
import ConsumptionChart from './charts/ConsumptionChart';
import FuelPriceChart from './charts/FuelPriceChart';
import RangeChart from './charts/RangeChart';
import Spinner from '../Spinner';

export default {
  components: { MileageChart, ConsumptionChart, FuelPriceChart, RangeChart, Spinner },

  computed: {
    ...mapGetters(['getCarRefuels']),
    refuelData() {
      return this.getCarRefuels(this.carId);
    },
    carId() {
      return this.$route.params.id;
    },
    refuels() {
      return Object.keys(this.refuelData.items)
        .map(id => this.refuelData.items[id])
        .sort((a, b) => a.date.getTime() - b.date.getTime());
    },
  },

  created() {
    this.$store.dispatch('loadCarRefuels', { carId: this.carId });
  },
};
</script>
