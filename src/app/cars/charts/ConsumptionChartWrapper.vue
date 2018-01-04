<template>
<div>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12>
        <consumption-chart :refuels="refuels" :height="height" :attenuation="attenuation" />
      </v-flex>
      <v-flex xs3>
        <v-subheader>Smoothing</v-subheader>
      </v-flex>
      <v-flex xs9>
        <v-radio-group v-model="attenuation" row>
          <v-radio v-for="opt of attenuationOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
        </v-radio-group>
      </v-flex>
    </v-layout>
  </v-container>
</div>
</template>

<script>
import ConsumptionChart from './ConsumptionChart';

export default {
  components: { ConsumptionChart },

  props: {
    refuels: { required: true },
    height: { type: Number },
  },

  data() {
    return {
      attenuation: .5,
      attenuationOptions: [
        { value: 1, label: 'none' },
        { value: .5, label: 'some' },
        { value: .25, label: 'max' },
      ],
    };
  }
}
</script>
