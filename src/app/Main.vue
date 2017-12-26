<template>
<md-app>
  <md-app-toolbar class="md-primary">
    <md-button class="md-icon-button" @click="showDrawer">
      <md-icon>menu</md-icon>
    </md-button>
    <span class="md-title">{{ title }}</span>
  </md-app-toolbar>

  <md-app-drawer md-permanent="full" :md-active.sync="drawerVisible">
    <md-app-toolbar class="md-primary">
      <span class="md-title">drivr</span>
    </md-app-toolbar>

    <Nav @navigation="hideDrawer" />
  </md-app-drawer>

  <md-app-content>
    <router-view></router-view>
  </md-app-content>
</md-app>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

import Nav from './Nav';

export default {
  components: { Nav },

  data: () => ({ drawerVisible: false }),

  computed: {
    ...mapState({
      title: state => state.navigation.title,
      appDrawerVisible: state => state.navigation.appDrawerVisible,
    }),
    ...mapGetters(['userId']),
  },

  watch: {
    appDrawerVisible(visible) {
      this.drawerVisible = visible;
    },
    drawerVisible(visible) {
      if (!visible) {
        this.hideDrawer();
      }
    },
  },

  methods: {
    ...mapActions(['setAppDrawerVisibility']),
    showDrawer() {
      this.setAppDrawerVisibility({ visible: true });
    },
    hideDrawer() {
      this.setAppDrawerVisibility({ visible: false });
    },
  },

  created() {
    this.$store.dispatch('firestoreSyncCollection', { collection: `users/${this.userId}/cars`, storePath: 'cars' });
  },
};
</script>

<style lang="scss">
.md-app {
  min-height: 100vh;
}
</style>

