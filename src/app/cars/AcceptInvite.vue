<template>
<div>
  <spinner v-if="!invite || invite.loading" />

  <md-snackbar v-else-if="invite.error" md-position="center" :md-duration="Infinity" :md-active="true" md-persistent>
    <span>Error loading the invite: {{ invite.error.message }}</span>
  </md-snackbar>

  <div v-else style="text-align: center">
    <p class="md-display-1">{{ invite.entity.inviter.label }}</p>
    <p>has invited you to record refuels for the car</p>
    <p class="md-display-1">{{ invite.entity.car.label }}</p>

    <template v-if="acceptance">
      <spinner v-if="acceptance.loading" label="accepting invitation" />

      <md-snackbar v-else-if="acceptance.error" md-position="center" :md-duration="Infinity" :md-active="true" md-persistent>
        <span>Error: {{ acceptance.error.message }}</span>
      </md-snackbar>

      <template v-else>
        <div>
          <md-button :to="`/cars/${invite.entity.car.id}`" class="md-raised md-primary">
            Go to car
          </md-button>
        </div>

        <md-snackbar md-position="center" :md-duration="Infinity" :md-active="true" md-persistent>
          <span>The invitation was accepted!</span>
        </md-snackbar>
      </template>
    </template>

    <template v-else-if="invite.entity.acceptedAt">
      <div v-if="invite.entity.invitee.id === userId">
        <p>You have already accepted on {{ invite.entity.acceptedAt | moment('ll') }}.</p>
        <md-button :to="`/cars/${invite.entity.car.id}`" class="md-raised md-primary">
          Go to car
        </md-button>
      </div>

      <p v-else>
        This invite was already accepted on {{ invite.entity.acceptedAt | moment('ll') }}.
      </p>
    </template>

    <md-snackbar v-else-if="userId === invite.entity.inviter.id" md-position="center" :md-duration="Infinity" :md-active="true" md-persistent>
      <span>You can not accept your own invitation.</span>
    </md-snackbar>

    <div v-else>
      <md-button class="md-raised md-primary" @click="accept">
        Accept invitation
      </md-button>
    </div>
  </div>
</div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';
import Spinner from '../Spinner';

export default {
  components: { Spinner },

  computed: {
    ...mapState({
      invite({ invites }) {
        return invites.invites[this.$route.params.id];
      },
      acceptance({ invites }) {
        return invites.accepts[this.$route.params.id];
      },
    }),
    ...mapGetters({ userId: 'userId' }),
  },

  methods: {
    ...mapActions(['loadCarInvite', 'acceptCarInvite']),
    accept() {
      this.acceptCarInvite({ inviteId: this.$route.params.id });
    },
  },

  beforeMount() {
    this.$store.dispatch('setPageTitle', { title: 'Accept invite' });
    this.loadCarInvite({ inviteId: this.$route.params.id });
  },
};
</script>
