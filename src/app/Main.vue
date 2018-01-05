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
import Vue from 'vue';
import VueAnalytics from 'vue-analytics';

import router from './router';
import Nav from './nav/Nav';
import AppBar from './AppBar';

const analyticsConfig = {
  id: 'UA-3900768-22',
  router,
  autoTracking: {
    exception: true,
  },
};

if (window.location.hostname === 'localhost') {
  analyticsConfig.debug = {
    enabled: true,
    sendHitTask: false,
  };
}

Vue.use(VueAnalytics, analyticsConfig);

export default {
  components: { Nav, AppBar },
  router,

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
