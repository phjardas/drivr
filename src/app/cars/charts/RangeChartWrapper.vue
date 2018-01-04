<template>
<div>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12>
        <range-chart :refuels="refuels" :height="height" :bucket-size="bucketSize" />
      </v-flex>
      <v-flex xs3>
        <v-subheader>Grouping</v-subheader>
      </v-flex>
      <v-flex xs9>
        <v-radio-group v-model="bucketSize" row>
          <v-radio v-for="opt of bucketSizeOptions" :key="opt" :label="`${opt} km`" :value="opt" />
        </v-radio-group>
      </v-flex>
    </v-layout>
  </v-container>
</div>
</template>

<script>
import RangeChart from './RangeChart';

export default {
  components: { RangeChart },

  props: {
    refuels: { required: true },
    height: { type: Number },
  },

  data() {
    return {
      bucketSize: 50,
      bucketSizeOptions: [10, 25, 50, 100],
    };
  }
}
</script>
