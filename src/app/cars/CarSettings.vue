<template>
<v-container fluid grid-list-md>
  <v-layout row wrap>
    <v-flex xs12 md6 offset-md3>
      <v-card>
        <v-card-text primary-title>
          <v-list>
            <v-list-tile @click.prevent="refreshStatistics" :disabled="refreshingStatistics">
              <v-list-tile-action>
                <v-progress-circular indeterminate v-if="refreshingStatistics" />
                <v-icon v-else>refresh</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Refresh statistics</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile @click.prevent="createInvite">
              <v-list-tile-action>
                <v-icon>share</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Create collaboration invite</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data: () => ({
    refreshingStatistics: false,
  }),

  computed: {
    ...mapGetters(['getCar']),
    car() {
      return this.getCar(this.$route.params.id);
    },
  },

  methods: {
    ...mapActions(['refreshCarStatistics', 'createCarInvite']),
    async refreshStatistics() {
      this.refreshingStatistics = true;
      await this.refreshCarStatistics({ carId: this.car.id });
      this.refreshingStatistics = false;
    },
    async createInvite() {
      const invite = await this.createCarInvite({ carId: this.car.id });
      this.$router.push(`/invite/${invite.id}`);
    },
  },
};
</script>
