<template>
<div>
  <v-navigation-drawer app fixed clipped v-model="drawerVisible">
    <Nav />
  </v-navigation-drawer>
  <v-toolbar app dark clipped-left fixed color="primary">
    <v-toolbar-title>
      <v-toolbar-side-icon @click.stop="toggleDrawer" />
      <app-title />
    </v-toolbar-title>
  </v-toolbar>
  <v-content>
    <router-view></router-view>
  </v-content>
</div>
</template>

<script>
import { mapActions } from 'vuex';

import Nav from './nav/Nav';
import AppTitle from './AppTitle';

export default {
  components: { Nav, AppTitle },

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
