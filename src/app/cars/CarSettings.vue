<template>
<v-container fluid grid-list-md>
  <v-layout row wrap>
    <v-flex xs12 md6 offset-md3>
      <v-card>
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
          <v-list-tile @click.prevent="createInvite" :disabled="inviting">
            <v-list-tile-action>
              <v-progress-circular indeterminate v-if="inviting" />
              <v-icon v-else>share</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Create collaboration invite</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-flex>

    <v-flex xs12 md6 offset-md3>
      <v-card class="error" dark>
        <v-card-title primary-title>Danger Zone</v-card-title>
        <v-list class="error">
          <v-list-tile @click.stop="deleteDialogVisible = true">
            <v-list-tile-action>
              <v-icon>delete</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Delete car</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-dialog v-model="deleteDialogVisible" max-width="290">
          <v-card>
            <v-card-title class="headline">Delete car</v-card-title>
            <v-card-text>Are you sure you want to delete the car {{ car.label }}? This action can not be undone.</v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn flat @click="deleteDialogVisible = false">Cancel</v-btn>
              <v-btn flat color="error" @click="doDeleteCar">Delete</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="deleting" persistent max-width="290">
          <v-card>
            <v-card-title class="headline">Delete car</v-card-title>
            <v-card-text>
              <spinner :label="`deleting ${car.label}`" />
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-card>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Spinner from '../Spinner';

export default {
  components: { Spinner },

  data: () => ({
    refreshingStatistics: false,
    inviting: false,
    deleteDialogVisible: false,
    deleting: false,
  }),

  computed: {
    ...mapGetters(['getCar']),
    car() {
      return this.getCar(this.$route.params.id);
    },
  },

  methods: {
    ...mapActions(['refreshCarStatistics', 'createCarInvite', 'deleteCar']),
    async refreshStatistics() {
      this.refreshingStatistics = true;
      await this.refreshCarStatistics({ carId: this.car.id });
      this.refreshingStatistics = false;
    },
    async createInvite() {
      this.inviting = true;
      const invite = await this.createCarInvite({ carId: this.car.id });
      this.$router.push(`/invite/${invite.id}`);
    },
    async doDeleteCar() {
      this.deleteDialogVisible = false;
      this.deleting = true;
      await this.deleteCar({ carId: this.car.id });
      this.$router.push('/');
    },
  },
};
</script>
