<template>
<md-list>
  <md-subheader>Cars</md-subheader>
  <md-list-item
    v-for="car of sortedCars"
    :key="car.id"
    :to="`/cars/${car.id}`"
    @click="emitNavigation"
  >
    <md-icon>directions_car</md-icon>
    <span class="md-list-item-text">{{ car.licensePlate }}</span>
  </md-list-item>

  <md-divider />
  <md-list-item @click="signOut">
    <md-icon>exit_to_app</md-icon>
    <span class="md-list-item-text">Sign out</span>
  </md-list-item>
</md-list>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState(['cars']),
    sortedCars: function() {
      return Object.keys(this.cars.items)
        .map(id => this.cars.items[id])
        .sort((a, b) => a.licensePlate.localeCompare(b.licensePlate));
    },
  },

  methods: {
    ...mapActions(['signOut']),
    emitNavigation() {
      this.$emit('navigation');
    },
  },
};
</script>
