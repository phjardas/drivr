<template>
<div>
  <spinner v-if="statistics.loading" />

  <v-container v-if="statistics.loaded" fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12 md6 offset-md3>
        <v-card>
          <v-card-title primary-title>
            <span class="headline">
              <v-icon>person</v-icon>
              <formatted-number :value="statistics.item.userCount" :fraction-digits="0" />
              users
            </span>
          </v-card-title>
        </v-card>
      </v-flex>

      <v-flex xs12 md6 offset-md3>
        <v-card>
          <v-card-title primary-title>
            <span class="headline">
              <v-icon>directions_car</v-icon>
              <formatted-number :value="statistics.item.carCount" :fraction-digits="0" />
              cars
            </span>
          </v-card-title>
        </v-card>
      </v-flex>

      <v-flex xs12 md6 offset-md3>
        <v-card>
          <v-card-title primary-title>
            <span class="headline">
              <v-icon>local_gas_station</v-icon>
              <formatted-number :value="statistics.item.refuelCount" :fraction-digits="0" />
              refuels
            </span>
          </v-card-title>
        </v-card>
      </v-flex>

      <v-flex xs12 md6 offset-md3>
        <v-card>
          <v-card-title primary-title>
            <span class="headline">
              <v-icon>navigation</v-icon>
              <formatted-number :value="statistics.item.totalDistance" :fraction-digits="0" unit="km" />
            </span>
          </v-card-title>
          <v-card-text>Total distance</v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 md6 offset-md3>
        <v-card>
          <v-card-title primary-title>
            <span class="headline">
              <v-icon>local_gas_station</v-icon>
              <formatted-number :value="statistics.item.totalFuel" :fraction-digits="2" unit="liters" />
            </span>
          </v-card-title>
          <v-card-text>Total fuel consumption</v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 md6 offset-md3>
        <v-card>
          <v-card-title primary-title>
            <span class="headline">
              <v-icon>euro_symbol</v-icon>
              <formatted-number :value="statistics.item.totalMoney" :fraction-digits="2" unit="€" />
            </span>
          </v-card-title>
          <v-card-text>Total spending</v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 md6 offset-md3>
        <v-btn flat @click="calculateStatistics" :disabled="recalculating">
          <v-progress-circular indeterminate v-if="recalculating" class="mr-1" />
          Recalculate statistics
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</div>
</template>

<script>
import { mapState } from 'vuex';
import { firestore } from '../../firebase/firestore';
import Spinner from '../Spinner';
import FormattedNumber from '../FormattedNumber';

export default {
  components: { Spinner, FormattedNumber },

  data() {
    return {
      unsubscribe: null,
      recalculating: false,
    };
  },

  computed: mapState({
    statistics: state => state.admin.statistics,
  }),

  methods: {
    async calculateStatistics() {
      this.recalculating = true;
      const createdAt = new Date();

      const [userCount, carCount, refuelsSnapshot] = await Promise.all([
        (await firestore.collection('users').get()).size,
        (await firestore.collection('cars').get()).size,
        await firestore.collection('refuels').get(),
      ]);

      const refuelStats = refuelsSnapshot.docs.map(r => r.data()).reduce((s, r) => ({
        totalDistance: s.totalDistance + (r.distance || 0),
        totalFuel: s.totalFuel + r.fuelAmount,
        totalMoney: s.totalMoney + r.totalPrice,
      }),
      {
        totalDistance: 0,
        totalFuel: 0,
        totalMoney: 0,
      });

      const stats = {
        createdAt,
        userCount,
        carCount,
        refuelCount: refuelsSnapshot.size,
        ...refuelStats,
      };

      await firestore.doc('statistics/global').set(stats);
      this.recalculating = false;
    },
  },

  created() {
    this.$store.dispatch('setPageTitle', { title: 'Statistics' });
    this.unsubscribe = this.$store.dispatch('loadAdminStatistics');
  },

  destroyed() {
    this.unsubscribe && this.unsubscribe.then(u => u());
  },
};
</script>
