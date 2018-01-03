<template>
<div id="login">
  <empty-state
    icon="directions_car"
    label="drivr">
    <spinner v-if="signin && signin.pending" label="Signing you in" />
    <template v-else>
      <p>Please sign in</p>
      <v-btn v-for="provider of providers" :key="provider.id" color="primary" @click="signInWithProvider({ providerId: provider.id })">
        {{ provider.label }}
      </v-btn>
    </template>
  </empty-state>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import EmptyState from './EmptyState';
import Spinner from './Spinner';

export default {
  components: { EmptyState, Spinner },
  computed: mapState({
    signin: state => state.auth.signin,
  }),
  data: () => ({
    providers: [{ id: 'google', label: 'Google' }, { id: 'github', label: 'GitHub' }],
  }),
  methods: mapActions(['signInWithProvider']),
};
</script>

<style lang="scss">
#login {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
