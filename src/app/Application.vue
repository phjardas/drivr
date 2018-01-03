<template>
<v-app light>
  <Splash v-if="!user" />
  <Login v-if="user && user.anonymous" />
  <Main v-if="user && user.authenticated" />
</v-app>
</template>

<script>
import { mapState } from 'vuex';
import router from './router';

import Login from './Login';
import Main from './Main';
import Splash from './Splash';

export default {
  name: 'app',
  router,
  components: { Login, Main, Splash },

  computed: mapState({
    user: state => state.auth.user,
  }),
};
</script>
