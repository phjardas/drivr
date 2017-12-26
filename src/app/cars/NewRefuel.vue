<template>
<div>
  <template v-if="car">
    <spinner v-if="submitting" label="saving new refuel…" />
    <form v-else novalidate class="md-layout-row md-layout-wrap md-gutter" @submit.prevent="submit">
      <div class="md-flex md-flex-small-100">
        <h2 class="md-title">
          <md-icon>local_gas_station</md-icon>
          New Refuel
        </h2>
      </div>
      <div class="md-flex md-flex-small-100">
        <md-datepicker name="date" id="date" v-model="form.date" @input="$v.$touch" :class="getValidationClass('date')" />
      </div>
      <div class="md-flex md-flex-small-100">
        <md-field :class="getValidationClass('mileage')">
          <label for="mileage">Mileage <small>(km)</small></label>
          <md-input name="mileage" id="mileage" type="number" v-model.number="form.mileage" @input="$v.$touch" autofocus />
          <span class="md-helper-text" v-if="distance">Distance travelled: <formatted-number :value="distance" :fraction-digits="0" unit="km" />.</span>
          <span class="md-helper-text" v-else>The total distance your car has traveled at this time.</span>
          <span class="md-error" v-if="!$v.form.mileage.required">This field is required.</span>
          <span class="md-error" v-else-if="!$v.form.mileage.numeric">Must be a number.</span>
          <span class="md-error" v-else-if="!$v.form.mileage.minValue">Must be at least {{ minMileage }} km.</span>
        </md-field>
      </div>
      <div class="md-flex md-flex-small-100">
        <md-field :class="getValidationClass('fuelAmount')">
          <label for="fuelAmount">Fuel <small>(liters)</small></label>
          <md-input name="fuelAmount" id="fuelAmount" type="number" step="0.01" v-model.number="form.fuelAmount" @input="$v.$touch" />
          <span class="md-helper-text" v-if="consumption">Consumption: <formatted-number :value="consumption * 100" unit="cl/km" />.</span>
          <span class="md-error" v-if="!$v.form.fuelAmount.required">This field is required.</span>
          <span class="md-error" v-else-if="!$v.form.fuelAmount.float">Must be a number.</span>
          <span class="md-error" v-else-if="!$v.form.fuelAmount.minValue">Must be a positive number.</span>
        </md-field>
      </div>
      <div class="md-flex md-flex-small-100">
        <md-field :class="getValidationClass('totalPrice')">
          <label for="totalPrice">Total price <small>(€)</small></label>
          <md-input name="totalPrice" id="totalPrice" type="number" step="0.01" v-model.number="form.totalPrice" @input="$v.$touch" />
          <span class="md-helper-text" v-if="price">Price: <formatted-number :value="price" unit="€/l" />.</span>
          <span class="md-error" v-if="!$v.form.totalPrice.required">This field is required.</span>
          <span class="md-error" v-else-if="!$v.form.totalPrice.float">Must be a number.</span>
          <span class="md-error" v-else-if="!$v.form.totalPrice.minValue">Must be a positive number.</span>
        </md-field>
      </div>
      <div class="md-flex md-flex-small-100">
        <md-button class="md-raised md-primary" @click="submit" :disabled="$v.form.$invalid">Save new refuel</md-button>
        <md-button :to="`/cars/${car.id}`">Cancel</md-button>
      </div>
    </form>
  </template>
  <spinner v-else label="loading…" />
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { validationMixin } from 'vuelidate';
import minValue from 'vuelidate/lib/validators/minValue';
import numeric from 'vuelidate/lib/validators/numeric';
import { regex } from 'vuelidate/lib/validators/common';
import required from 'vuelidate/lib/validators/required';

import FormattedNumber from '../FormattedNumber';
import Spinner from '../Spinner';

const float = regex('float', /^[0-9\.]*$/);

export default {
  mixins: [validationMixin],

  components: { FormattedNumber, Spinner },

  data() {
    return {
      form: { date: new Date(), mileage: null, fuelAmount: null, totalPrice: null },
      submitting: false,
    };
  },

  validations() {
    return {
      form: {
        date: {
          required,
        },
        mileage: {
          required,
          numeric,
          minValue: minValue(this.minMileage),
        },
        fuelAmount: {
          required,
          float,
          minValue: minValue(0),
        },
        totalPrice: {
          required,
          float,
          minValue: minValue(0),
        },
      },
    };
  },

  computed: mapState({
    car(state) {
      return state.cars.items[this.$route.params.id];
    },
    minMileage() {
      return this.car && this.car.lastRefuel && this.car.lastRefuel.mileage;
    },
    distance() {
      return (
        this.minMileage &&
        this.form.mileage &&
        this.form.mileage > this.minMileage &&
        this.form.mileage - this.minMileage
      );
    },
    consumption() {
      return this.distance && this.form.fuelAmount && this.form.fuelAmount / this.distance;
    },
    price() {
      return this.form.totalPrice && this.form.fuelAmount && this.form.totalPrice / this.form.fuelAmount;
    },
  }),

  watch: {
    car(car) {
      this.setPageTitle();
    },
  },

  methods: {
    ...mapActions(['createRefuel']),
    setPageTitle() {
      this.$store.dispatch('setPageTitle', { title: this.car ? this.car.licensePlate : 'loading…' });
    },
    getValidationClass(fieldName) {
      const field = this.$v.form[fieldName];

      return (
        field && {
          'md-invalid': field.$invalid && field.$dirty,
        }
      );
    },
    submit() {
      this.$v.$touch();
      if (!this.$v.form.$invalid) {
        this.submitting = true;
        this.createRefuel({ carId: this.car.id, ...this.form })
          .then(() => {
            this.submitting = false;
            this.$router.push(`/cars/${this.car.id}`);
          })
          .catch(err => {
            console.error('Error:', err);
            this.submitting = false;
          });
      }
    },
  },

  created() {
    this.setPageTitle();
  },
};
</script>
