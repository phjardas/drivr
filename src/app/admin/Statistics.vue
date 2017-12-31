<template>
<div>
  <spinner v-if="!statistics" />
  <md-list v-else class="md-double-line">
    <md-list-item>
      <md-icon>person</md-icon>
      <div class="md-list-item-text">
        <span>Number of users</span>
        <formatted-number :value="statistics.userCount" :fraction-digits="0" />
      </div>
    </md-list-item>
    <md-list-item>
      <md-icon>directions_car</md-icon>
      <div class="md-list-item-text">
        <span>Number of cars</span>
        <formatted-number :value="statistics.carCount" :fraction-digits="0" />
      </div>
    </md-list-item>
    <md-list-item>
      <md-icon>local_gas_station</md-icon>
      <div class="md-list-item-text">
        <span>Number of refuels</span>
        <formatted-number :value="statistics.refuelCount" :fraction-digits="0" />
      </div>
    </md-list-item>
    <md-list-item>
      <md-icon>navigation</md-icon>
      <div class="md-list-item-text">
        <span>Total distance</span>
        <formatted-number :value="statistics.totalDistance" :fraction-digits="0" unit="km" />
      </div>
    </md-list-item>
    <md-list-item>
      <md-icon>local_gas_station</md-icon>
      <div class="md-list-item-text">
        <span>Total fuel consumption</span>
        <formatted-number :value="statistics.totalFuel" :fraction-digits="2" unit="liters" />
      </div>
    </md-list-item>
    <md-list-item>
      <md-icon>euro_symbol</md-icon>
      <div class="md-list-item-text">
        <span>Total spending</span>
        <formatted-number :value="statistics.totalMoney" :fraction-digits="2" unit="€" />
      </div>
    </md-list-item>
    <md-list-item>
      <div class="md-list-item-text">
        <md-button class="md-raised" @click="calculateStatistics" :disabled="recalculating">
          Recalculate statistics
        </md-button>
      </div>
    </md-list-item>
  </md-list>
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
    this.loadStatistics();
  },

  destroyed() {
    this.unsubscribe && this.unsubscribe();
  },
};
</script>
