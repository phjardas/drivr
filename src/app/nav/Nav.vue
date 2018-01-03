<template>
<v-list dense>
  <nav-item text="Dashboard" icon="dashboard" to="/" />
  <nav-group text="Your cars" :open="true">
    <nav-item v-for="car of sortedCars" :key="car.id" :text="car.label" icon="directions_car" :to="`/cars/${car.id}`" />
    <nav-item text="Add new car" icon="add" to="/cars/_new" />
  </nav-group>
  <nav-item v-if="hasAnyRole('admin')" text="Administration" icon="settings" to="/admin" />
  <nav-item text="Sign out" icon="exit_to_app" @click="signOut" />
</v-list>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import NavGroup from './NavGroup';
import NavItem from './NavItem';

export default {
  components: { NavGroup, NavItem },

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
  },
};
</script>
