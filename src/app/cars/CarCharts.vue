<template>
<div>
  <spinner v-if="refuelData.loading" />

  <v-container v-else-if="refuels.length > 1" fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card>
          <v-card-title primary-title>
            <h3 class="headline mb-3">Mileage over time</h3>
          </v-card-title>
          <v-card-text>
            <mileage-chart :refuels="refuels" :height="200" />
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12>
        <v-card>
          <v-card-title primary-title>
            <h3 class="headline mb-3">Consumption over time</h3>
          </v-card-title>
          <v-card-text>
            <consumption-chart :refuels="refuels" :height="200" />
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12>
        <v-card>
          <v-card-title primary-title>
            <h3 class="headline mb-3">Fuel price over time</h3>
          </v-card-title>
          <v-card-text>
            <fuel-price-chart :refuels="refuels" :height="200" />
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12>
        <v-card>
          <v-card-title primary-title>
            <h3 class="headline mb-3">Range per refuel</h3>
          </v-card-title>
          <v-card-text>
            <range-chart :refuels="refuels" :height="200" />
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>

  <empty-state
    v-else
    rounded
    icon="local_gas_station"
    label="No charts yet"
    description="Charts will become available once you've recorded two refuels"
    class="mt-3">
      <v-btn raised color="primary" :to="`/cars/${this.$route.params.id}/refuels/_new`">Record refuel</v-btn>
  </empty-state>
</div>
</template>

<script>
import { mapGetters } from 'vuex';
import MileageChart from './charts/MileageChart';
import ConsumptionChart from './charts/ConsumptionChart';
import FuelPriceChart from './charts/FuelPriceChart';
import RangeChart from './charts/RangeChart';
import EmptyState from '../EmptyState';
import Spinner from '../Spinner';

export default {
  components: { MileageChart, ConsumptionChart, FuelPriceChart, RangeChart, EmptyState, Spinner },

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
