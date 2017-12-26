<template>
<div id="login">
  <div>
    <p>Please sign in:</p>
    <div>
      <button v-for="provider of providers"
              :key="provider.id"
              @click="signInWithProvider({ providerId: provider.id })"
              class="btn btn-primary mr-1">
        {{provider.label}}
      </button>
    </div>
  </div>
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
