<template>
<div>
  <spinner v-if="refuels.loading" />

  <b-alert v-if="refuels.failed" variant="danger">Error: {{ refuels.error.message }}</b-alert>

  <md-list v-if="refuels.loaded" class="md-triple-line">
    <md-list-item v-for="refuel of items" :key="refuel.id">
      <div class="md-list-item-text">
        <span>
          {{ refuel.date | moment('ll') }}
          <small>at</small>
          <formatted-number :value="refuel.mileage" :fraction-digits="0" unit="km" />
        </span>
        <span>
          <formatted-number :value="refuel.fuelAmount" :fraction-digits="2" unit="liters" />
          <small>for</small>
          <formatted-number :value="refuel.totalPrice" :fraction-digits="2" unit="€" />
        </span>
        <span v-if="refuel.consumption">
          <formatted-number :value="refuel.consumption * 100" :fraction-digits="2" unit="cl/km" />
        </span>
      </div>
    </md-list-item>
  </md-list>
</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import FormattedNumber from '../FormattedNumber';
import Spinner from '../Spinner';

export default {
  components: { FormattedNumber, Spinner },

  data() {
    return {
      unsubscribe: null,
    };
  },

  computed: {
    ...mapGetters(['userId']),
    ...mapState(['refuels']),
    items: function() {
      return Object.keys(this.refuels.items)
        .map(id => this.refuels.items[id])
        .map(refuel => ({
          ...refuel,
          date: new Date(refuel.date),
          mileage: parseFloat(refuel.mileage),
          fuelAmount: parseFloat(refuel.fuelAmount),
          totalPrice: parseFloat(refuel.totalPrice),
          pricePerLiter: parseFloat(refuel.pricePerLiter),
          consumption: parseFloat(refuel.consumption),
        }))
        .sort((a, b) => b.date.getTime() - a.date.getTime());
    },
  },

  created() {
    this.unsubscribe = this.$store.dispatch('firestoreSyncCollection', {
      collection: `users/${this.userId}/cars/${this.$route.params.id}/refuels`,
      storePath: 'refuels',
    });
  },

  beforeDestroy() {
    this.unsubscribe && this.unsubscribe.then(u => u());
  },
};
</script>

<style lang="scss">
.table {
  th,
  td {
    white-space: nowrap;
  }
}
</style>
