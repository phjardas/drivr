<template>
<v-toolbar app dark clipped-left fixed color="primary">
  <v-toolbar-side-icon @click.stop="toggleDrawer" />
  <v-toolbar-title>
    <app-title />
  </v-toolbar-title>
  <v-spacer />
  <v-menu bottom left offset-y>
    <v-avatar slot="activator" size="32px" class="primaryLight" style="margin-right: 16px">
      <img v-if="user.photoURL" :src="user.photoURL">
      <v-icon light v-else>person</v-icon>
    </v-avatar>
    <v-card>
      <v-container fluid>
        <v-layout row>
          <v-flex>
            <v-avatar size="96px" class="primaryLight">
              <img v-if="user.photoURL" :src="user.photoURL">
              <v-icon v-else>person</v-icon>
            </v-avatar>
          </v-flex>
          <v-flex style="margin-left: 16px">
            <div class="subheading">{{ user.displayName }}</div>
            <div>{{ user.email }}</div>
            <v-btn flat small @click="signOut">Sign out</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-menu>
</v-toolbar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import AppTitle from './AppTitle';

export default {
  components: { AppTitle },
  computed: mapGetters(['user']),
  methods: {
    ...mapActions(['signOut']),
    toggleDrawer() {
      this.$emit('toggleDrawer');
    },
  },
}
</script>
