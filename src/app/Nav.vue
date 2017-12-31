<template>
<md-list>
  <md-list-item to="/" @click="emitNavigation">
    <md-icon>dashboard</md-icon>
    <span class="md-list-item-text">Dashboard</span>
  </md-list-item>

  <md-divider />
  <md-subheader>Cars</md-subheader>
  <md-list-item
    v-for="car of sortedCars"
    :key="car.id"
    :to="`/cars/${car.id}`"
    @click="emitNavigation"
  >
    <md-icon>directions_car</md-icon>
    <span class="md-list-item-text">{{ car.label }}</span>
  </md-list-item>
  <md-list-item to="/cars/_new" @click="emitNavigation">
    <md-icon>add</md-icon>
    <span class="md-list-item-text">Add new car</span>
  </md-list-item>

  <md-divider />
  <md-list-item v-if="hasAnyRole('admin')" to="/admin">
    <md-icon>settings</md-icon>
    <span class="md-list-item-text">Administration</span>
  </md-list-item>
  <md-list-item @click="signOut">
    <md-icon>exit_to_app</md-icon>
    <span class="md-list-item-text">Sign out</span>
  </md-list-item>
</md-list>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    ...mapGetters(['cars', 'hasAnyRole']),
    sortedCars() {
      return Object.keys(this.cars.items)
        .map(id => this.cars.items[id])
        .sort((a, b) => a.label.localeCompare(b.label));
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
