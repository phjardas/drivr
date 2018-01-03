<template>
<div>
  <v-btn fab bottom right dark fixed color="accent" :to="`/cars/_new`">
    <v-icon>directions_car</v-icon>
  </v-btn>

  <spinner v-if="cars.loading" />

  <p v-if="cars.failed">Error: {{ cars.error.message }}</p>

  <template if="cars.loaded">
    <v-container v-if="items.length" fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex xs12 md6 offset-md3 v-for="car of items" :key="car.id">
          <v-card :to="`/cars/${car.id}`">
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">{{ car.label }}</h3>

                <div v-if="car.stats">
                  {{ car.stats.refuelCount }} refuels,
                  {{ car.stats.totalDistance }} km
                </div>
                <div v-else>No refuels yet</div>

                <div v-if="car.stats && car.stats.averageConsumption">
                  <formatted-number :value="car.stats.averageConsumption * 100" unit="cl/km" />
                </div>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <empty-state
      v-else
      rounded
      icon="directions_car"
      label="No cars yet">
      <v-btn color="primary" raised to="/cars/_new">Register your car</v-btn>
    </empty-state>
  </template>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import EmptyState from '../EmptyState';
import FormattedNumber from '../FormattedNumber';
import Spinner from '../Spinner';

export default {
  components: { EmptyState, FormattedNumber, Spinner },

  computed: {
    ...mapGetters(['cars']),
    items() {
      return Object.keys(this.cars.items)
        .map(id => this.cars.items[id])
        .sort((a, b) => a.label.localeCompare(b.label));
    },
  },

  created() {
    this.$store.dispatch('setPageTitle', { title: 'Your cars' });
  },
};
</script>
