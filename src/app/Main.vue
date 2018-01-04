<template>
<div>
  <v-navigation-drawer app fixed clipped v-model="drawerVisible">
    <Nav />
  </v-navigation-drawer>
  <app-bar @toggleDrawer="toggleDrawer" />
  <v-content>
    <router-view></router-view>
  </v-content>
</div>
</template>

<script>
import { mapActions } from 'vuex';

import Nav from './nav/Nav';
import AppBar from './AppBar';

export default {
  components: { Nav, AppBar },

  data: () => ({
    drawerVisible: null,
  }),

  methods: {
    toggleDrawer() {
      this.drawerVisible = !this.drawerVisible;
    },
  },

  created() {
    this.$store.dispatch('loadCars');
  },
};
</script>
