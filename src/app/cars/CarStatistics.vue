<template>
<md-list class="md-double-line">
  <template v-if="car.stats">
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
  </template>
</md-list>
</template>

<script>
import { mapState } from 'vuex';
import FormattedNumber from '../FormattedNumber';

export default {
  components: { FormattedNumber },

  computed: mapState({
    car(state) {
      return state.cars.items[this.$route.params.id];
    },
  }),
};
</script>
