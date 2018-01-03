<template>
<div>
  <spinner v-if="!statistics" />
  <v-container v-else fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12 md6 offset-md3>
        <v-card>
          <v-card-title primary-title>
            <span class="headline">
              <v-icon>person</v-icon>
              <formatted-number :value="statistics.userCount" :fraction-digits="0" />
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
              <formatted-number :value="statistics.carCount" :fraction-digits="0" />
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
              <formatted-number :value="statistics.refuelCount" :fraction-digits="0" />
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
              <formatted-number :value="statistics.totalDistance" :fraction-digits="0" unit="km" />
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
              <formatted-number :value="statistics.totalFuel" :fraction-digits="2" unit="liters" />
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
              <formatted-number :value="statistics.totalMoney" :fraction-digits="2" unit="€" />
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
import { firestore } from '../../firebase/firestore';
import Spinner from '../Spinner';
import FormattedNumber from '../FormattedNumber';

export default {
  components: { Spinner, FormattedNumber },

  data() {
    return {
      statistics: null,
      unsubscribe: null,
      recalculating: false,
    };
  },

  methods: {
    loadStatistics() {
      this.unsubscribe = firestore.doc('statistics/global').onSnapshot(snapshot => (this.statistics = snapshot.data()));
    },
    async calculateStatistics() {
      console.log('recalculating statistics...');
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
    this.loadStatistics();
  },

  destroyed() {
    this.unsubscribe && this.unsubscribe();
  },
};
</script>
