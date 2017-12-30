<template>
<div>
  <md-list v-if="car.stats" class="md-double-line">
    <md-list-item>
      <div class="md-list-item-text">
        <div>Total distance</div>
        <formatted-number :value="car.stats.totalDistance" :fraction-digits="0" unit="km" />
      </div>
    </md-list-item>
    <md-list-item>
      <div class="md-list-item-text">
        <div>Number of refuels</div>
        <formatted-number :value="car.stats.refuelCount" :fraction-digits="0" />
      </div>
    </md-list-item>
    <md-list-item>
      <div class="md-list-item-text">
        <div>Total fuel amount</div>
        <formatted-number :value="car.stats.totalFuel" unit="liters" />
      </div>
    </md-list-item>
    <md-list-item>
      <div class="md-list-item-text">
        <div>Total spending</div>
        <formatted-number :value="car.stats.totalPrice" unit="€" />
      </div>
    </md-list-item>
    <md-list-item>
      <div class="md-list-item-text">
        <div>Average consumption</div>
        <formatted-number :value="car.stats.averageConsumption * 100" unit="cl/km" />
      </div>
    </md-list-item>
    <md-list-item>
      <div class="md-list-item-text">
        <div>Average spending</div>
        <formatted-number :value="car.stats.averagePricePerDistance * 100" unit="Ct/km" />
      </div>
    </md-list-item>
    <md-list-item>
      <div class="md-list-item-text">
        <div>Average fuel price</div>
        <formatted-number :value="car.stats.averagePricePerVolume" unit="€/l" />
      </div>
    </md-list-item>
  </md-list>

  <md-empty-state
    v-else
    md-rounded
    md-icon="dashboard"
    md-label="No statistics yet"
    md-description="Statistics will become available once you've recorded two refuels">
    <md-button class="md-primary md-raised" :to="`/cars/${this.$route.params.id}/refuels/_new`">Record refuel</md-button>
  </md-empty-state>
</div>
</template>

<script>
import { mapGetters } from 'vuex';
import FormattedNumber from '../FormattedNumber';

export default {
  components: { FormattedNumber },

  computed: {
    ...mapGetters(['getCar']),
    car() {
      return this.getCar(this.$route.params.id);
    },
  },
};
</script>
