<template>
<md-list>
  <md-list-item @click.prevent="refreshStatistics" :disabled="refreshingStatistics">
    <md-icon>refresh</md-icon>
    <span class="md-list-item-text">
      {{ refreshingStatistics ? 'Refreshing statistics' : 'Refresh statistics' }}
    </span>
  </md-list-item>
  <md-list-item @click.prevent="createInvite">
    <md-icon>share</md-icon>
    <span class="md-list-item-text">Create collaboration invite</span>
  </md-list-item>
</md-list>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data: () => ({
    refreshingStatistics: false,
  }),

  computed: mapState({
    car(state) {
      return state.cars.items[this.$route.params.id];
    },
  }),

  methods: {
    ...mapActions(['refreshCarStatistics', 'createCarInvite']),
    async refreshStatistics() {
      this.refreshingStatistics = true;
      await this.refreshCarStatistics({ carId: this.car.id });
      this.refreshingStatistics = false;
    },
    async createInvite() {
      const invite = await this.createCarInvite({ carId: this.car.id });
      console.log('created invite:', invite);
    },
  },
};
</script>
