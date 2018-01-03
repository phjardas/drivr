<template>
<div>
  <spinner v-if="refuels.loading" />

  <p v-if="refuels.failed">Error: {{ refuels.error.message }}</p>

  <template v-if="refuels.loaded">
    <v-container v-if="items.length" fluid grid-list-md>
      <v-layout row wrap>
        <v-flex xs12 md6 offset-md3 v-for="(refuel, index) of items" :key="refuel.id">
          <v-card>
            <v-card-title primary-title>
              <span class="headline">{{ refuel.date | moment('ll') }}</span>
              <v-spacer />
              <v-menu bottom left v-if="index === 0">
                <v-btn icon slot="activator">
                  <v-icon>more_vert</v-icon>
                </v-btn>
                <v-list>
                  <v-list-tile avatar @click="doDeleteRefuel(refuel.id)">
                    <v-list-tile-avatar><v-icon>delete</v-icon></v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title>Delete</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </v-card-title>
            <v-card-text>
              <div>
                <formatted-number :value="refuel.fuelAmount" :fraction-digits="2" unit="liters" />
                <small>for</small>
                <formatted-number :value="refuel.totalPrice" :fraction-digits="2" unit="€" />
              </div>
              <div>Mileage: <formatted-number :value="refuel.mileage" :fraction-digits="0" unit="km" /></div>
              <div v-if="refuel.consumption">
                Consumption: <formatted-number :value="refuel.consumption * 100" :fraction-digits="2" unit="cl/km" />
              </div>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <empty-state
      v-else
      rounded
      icon="local_gas_station"
      label="No refuels yet"
      class="mt-3">
      <v-btn raised color="primary" :to="`/cars/${this.$route.params.id}/refuels/_new`">Record your first refuel</v-btn>
    </empty-state>
  </template>
</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import EmptyState from '../EmptyState';
import FormattedNumber from '../FormattedNumber';
import Spinner from '../Spinner';

export default {
  components: { EmptyState, FormattedNumber, Spinner },

  data() {
    return {
      unsubscribe: null,
    };
  },

  computed: {
    ...mapGetters(['getCar', 'getCarRefuels']),
    car() {
      return this.getCar(this.$route.params.id);
    },
    refuels() {
      return this.getCarRefuels(this.car.id);
    },
    items() {
      return Object.keys(this.refuels.items)
        .map(id => this.refuels.items[id])
        .sort((a, b) => b.date.getTime() - a.date.getTime());
    },
  },

  methods: {
    ...mapActions(['deleteRefuel']),
    doDeleteRefuel(refuelId) {
      this.deleteRefuel({ carId: this.car.id, refuelId });
    },
  },

  created() {
    this.unsubscribe = this.$store.dispatch('loadCarRefuels', {
      carId: this.car.id,
    });
  },

  beforeDestroy() {
    this.unsubscribe && this.unsubscribe.then(u => u());
  },
};
</script>
