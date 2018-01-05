<template>
<v-app light>
  <Splash v-if="!user" />
  <Login v-if="user && user.anonymous" />
  <Main v-if="user && user.authenticated" />
</v-app>
</template>

<script>
import { mapState } from 'vuex';

import Login from './Login';
import Splash from './Splash';
const Main = () => import(/* webpackChunkName: "main" */ './Main');

export default {
  name: 'app',
  components: { Login, Main, Splash },

  computed: mapState({
    user: state => state.auth.user,
  }),
};
</script>
