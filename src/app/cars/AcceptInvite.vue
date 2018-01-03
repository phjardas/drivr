<template>
<div>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 md6 offset-md3>
        <v-card>
          <v-card-title primary-title>
            <h2 class="headline">
              <v-icon>directions_car</v-icon>
              Invitation
            </h2>
          </v-card-title>
          <v-card-text>
            <spinner v-if="!invite || invite.loading" />

            <v-snackbar v-else-if="invite.error" color="error" :timeout="Infinity" v-model="showSnackbar">
              Error loading the invite: {{ invite.error.message }}
            </v-snackbar>

            <template v-else-if="userId === invite.entity.inviter.id">
              <template v-if="invite.entity.acceptedAt">
                <p>
                  Your invitation for the car
                  <strong>{{ invite.entity.car.label }}</strong>
                  was accepted by
                  <strong>{{ invite.entity.invitee.label }}</strong>
                  on {{ invite.entity.acceptedAt | moment('ll') }}.
                </p>
              </template>

              <template v-else>
                <p>
                  Send the following link to a person you want to invite to your car
                  <strong>{{ invite.entity.car.label }}</strong>.
                  They will then be able to record refuels for it.
                </p>

                <p v-if="shareAvailable">
                  <v-btn flat icon @click="share">
                    <v-icon>share</v-icon>
                  </v-btn>
                </p>
                <p v-else>
                  <v-text-field v-model="inviteUrl" @focus="copyInviteLink" readonly />
                  <small v-if="inviteLinkCopied" class="md-helper-text">
                    <v-icon>link</v-icon>
                    copied to clipboard
                  </small>
                </p>
              </template>
            </template>

            <div v-else>
              <p>
                <strong>{{ invite.entity.inviter.label }}</strong>
                has invited you to record refuels for the car
                <strong>{{ invite.entity.car.label }}</strong>
              </p>

              <template v-if="acceptance">
                <spinner v-if="acceptance.loading" label="accepting invitation" />

                <v-snackbar v-else-if="acceptance.error" :timeout="Infinity" color="error" v-model="showSnackbar">
                  <span>Error: {{ acceptance.error.message }}</span>
                </v-snackbar>

                <template v-else>
                  <div>
                    <v-btn raised primary :to="`/cars/${invite.entity.car.id}`">
                      Go to car
                    </v-btn>
                  </div>

                  <v-snackbar v-model="showSnackbar">
                    <span>You have accepted the invitation.</span>
                  </v-snackbar>
                </template>
              </template>

              <template v-else-if="invite.entity.acceptedAt">
                <div v-if="invite.entity.invitee.id === userId">
                  <p>You have already accepted on {{ invite.entity.acceptedAt | moment('ll') }}.</p>
                  <v-btn raised primary :to="`/cars/${invite.entity.car.id}`">
                    Go to car
                  </v-btn>
                </div>

                <p v-else>
                  This invite was already accepted on {{ invite.entity.acceptedAt | moment('ll') }}.
                </p>
              </template>

              <div v-else>
                <v-btn raised primary @click="accept">
                  Accept invitation
                </v-btn>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
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
    showSnackbar: true,
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
