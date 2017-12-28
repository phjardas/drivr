<template>
<div>
  <spinner v-if="!invite || invite.loading" />

  <md-snackbar v-else-if="invite.error" md-position="center" :md-duration="Infinity" :md-active="true" md-persistent>
    <span>Error loading the invite: {{ invite.error.message }}</span>
  </md-snackbar>

  <template v-else-if="userId === invite.entity.inviter.id">
    <template v-if="invite.entity.acceptedAt">
      <p>Your invitation for car</p>
      <p class="md-display-1">{{ invite.entity.car.label }}</p>
      <p>was accepted by</p>
      <p class="md-display-1">{{ invite.entity.invitee.label }}</p>
      <p>on {{ invite.entity.acceptedAt | moment('ll') }}.</p>
    </template>

    <template v-else>
      <p class="md-display-1">{{ invite.entity.car.label }}</p>
      <p>
        Send this link to the person you want to share the car with.
        They will then be able to record refuels for it.
      </p>

      <p v-if="shareAvailable">
        <md-button class="md-icon-button md-primary" @click="share">
          <md-icon>share</md-icon>
        </md-button>
      </p>
      <p v-else>
        <md-field>
          <md-input v-model="inviteUrl" @focus="copyInviteLink" readonly />
          <span v-if="inviteLinkCopied" class="md-helper-text">
            <md-icon>link</md-icon>
            copied to clipboard
          </span>
        </md-field>
      </p>
    </template>
  </template>

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

  data: () => ({
    shareAvailable: !!navigator.share,
    inviteUrl: document.location.href,
    inviteLinkCopied: false,
  }),

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
    share() {
      navigator.share({
        title: `drivr`,
        text: `Please help me record refuels for my car ${this.invite.entity.car.label} on drivr`,
        url: this.inviteUrl,
      });
    },
    copyInviteLink($event) {
      $event.target.select();
      document.execCommand('copy');
      this.inviteLinkCopied = true;
    },
  },

  created() {
    this.$store.dispatch('setPageTitle', { title: 'Accept invite' });
    this.loadCarInvite({ inviteId: this.$route.params.id });
  },
};
</script>
