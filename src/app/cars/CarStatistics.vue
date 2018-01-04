<template>
<div>
  <v-container v-if="car.stats" fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex v-if="car.lastRefuel" xs6 sm4 md3>
        <v-card>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0"><formatted-number :value="car.lastRefuel.mileage" :fraction-digits="0" unit="km" /></h3>
              <div>Current mileage</div>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>

      <v-flex xs6 sm4 md3>
        <v-card>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0"><formatted-number :value="car.stats.totalDistance" :fraction-digits="0" unit="km" /></h3>
              <div>Total distance</div>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>

      <v-flex xs6 sm4 md3>
        <v-card>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0"><formatted-number :value="car.stats.refuelCount" :fraction-digits="0" /></h3>
              <div>Number of refuels</div>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>

      <v-flex xs6 sm4 md3>
        <v-card>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0"><formatted-number :value="car.stats.totalFuel" :fraction-digits="2" unit="liters" /></h3>
              <div>Total fuel consumption</div>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>

      <v-flex xs6 sm4 md3>
        <v-card>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0"><formatted-number :value="car.stats.totalPrice" :fraction-digits="2" unit="€" /></h3>
              <div>Total spending</div>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>

      <v-flex xs6 sm4 md3>
        <v-card>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0"><formatted-number :value="car.stats.averageConsumption * 100" :fraction-digits="2" unit="cl/km" /></h3>
              <div>Average consumption</div>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>

      <v-flex xs6 sm4 md3>
        <v-card>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0"><formatted-number :value="car.stats.averagePricePerDistance * 100" :fraction-digits="2" unit="Ct/km" /></h3>
              <div>Average operating costs</div>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>

      <v-flex xs6 sm4 md3>
        <v-card>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0"><formatted-number :value="car.stats.averagePricePerVolume" :fraction-digits="2" unit="€/l" /></h3>
              <div>Average fuel price</div>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>

  <empty-state
    v-else
    rounded
    icon="local_gas_station"
    label="No statistics yet"
    description="Statistics will become available once you've recorded two refuels"
    class="mt-3">
      <v-btn raised color="primary" :to="`/cars/${this.$route.params.id}/refuels/_new`">Record refuel</v-btn>
  </empty-state>
</div>
</template>

<script>
import { mapGetters } from 'vuex';
import EmptyState from '../EmptyState';
import FormattedNumber from '../FormattedNumber';

export default {
  components: { EmptyState, FormattedNumber },

  computed: {
    ...mapGetters(['getCar']),
    car() {
      return this.getCar(this.$route.params.id);
    },
  },
};
</script>
