<template>
<div id="login">
  <md-empty-state
    md-icon="directions_car"
    md-label="drivr"
    md-description="Please sign in"
  >
    <md-button v-for="provider of providers"
            :key="provider.id"
            @click="signInWithProvider({ providerId: provider.id })"
            class="md-raised md-primary">
      {{ provider.label }}
    </md-button>
  </md-empty-state>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
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
