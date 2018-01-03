<template>
<div>
  <template v-if="car">
    <spinner v-if="submitting" label="saving new refuel…" />

    <v-container v-else fluid>
      <v-layout row wrap>
        <v-flex xs12 md6 offset-md3>
          <v-card>
            <v-card-title primary-title>
              <h2 class="headline">
                <v-icon>local_gas_station</v-icon>
                New Refuel
              </h2>
            </v-card-title>
            <v-card-text>
              <v-layout>
                <v-flex xs6>
                  <v-dialog persistent lazy full-width width="290px">
                    <v-text-field
                      slot="activator"
                      label="Date"
                      v-model="form.date"
                      prepend-icon="event"
                      readonly
                    />
                    <v-date-picker v-model="form.date" autosave />
                  </v-dialog>
                </v-flex>
                <v-spacer />
                <v-flex xs5>
                  <v-dialog persistent lazy full-width width="290px">
                    <v-text-field
                      slot="activator"
                      label="Time"
                      v-model="form.time"
                      prepend-icon="access_time"
                      readonly
                    />
                    <v-time-picker v-model="form.time" autosave format="24hr" />
                  </v-dialog>
                </v-flex>
              </v-layout>

              <v-text-field
                label="Mileage"
                type="number"
                v-model.number="form.mileage"
                prepend-icon="navigation"
                suffix="km"
                :error-messages="errorsFor('mileage')"
                @input="$v.form.mileage.$touch()"
                @blur="$v.form.mileage.$touch()"
                :hint="distance ? `Distance: ${distance} km` : 'The total distance your car has traveled at this time.'"
                persistent-hint
              />

              <v-text-field
                label="Fuel amount"
                type="fuelAmount"
                v-model.number="form.fuelAmount"
                prepend-icon="local_gas_station"
                suffix="liters"
                :error-messages="errorsFor('fuelAmount')"
                @input="$v.form.fuelAmount.$touch()"
                @blur="$v.form.fuelAmount.$touch()"
                :hint="consumption ? `Consumption: ${(consumption * 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} cl/km` : null"
                persistent-hint
              />

              <v-text-field
                label="Total price"
                type="totalPrice"
                v-model.number="form.totalPrice"
                prepend-icon="euro_symbol"
                suffix="€"
                :error-messages="errorsFor('totalPrice')"
                @input="$v.form.totalPrice.$touch()"
                @blur="$v.form.totalPrice.$touch()"
                :hint="price ? `Fuel price: ${price.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })} €/l` : null"
                persistent-hint
              />

              <div>
                <v-btn raised color="primary" @click="submit" :disabled="$v.form.$invalid">Save new refuel</v-btn>
                <v-btn flat :to="`/cars/${car.id}`">Cancel</v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </template>
  <spinner v-else label="loading…" />
</div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';
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
    const now = new Date().toISOString();
    const date = now.substr(0, 10);
    const time = now.substr(11, 5);
    return {
      form: { date, time, mileage: null, fuelAmount: null, totalPrice: null },
      submitting: false,
    };
  },

  validations() {
    return {
      form: {
        date: {
          required,
        },
        time: {
          required,
        },
        mileage: {
          required,
          numeric,
          minValue: minValue(this.minMileage ? this.minMileage : 0),
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

  computed: {
    ...mapGetters(['cars']),
    ...mapState({
      car() {
        return this.cars.items[this.$route.params.id];
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
  },

  watch: {
    car(car) {
      this.setPageTitle();
    },
  },

  methods: {
    ...mapActions(['createRefuel']),
    setPageTitle() {
      this.$store.dispatch('setPageTitle', { title: this.car ? this.car.label : 'loading…' });
    },
    errorsFor(fieldName) {
      const field = this.$v.form[fieldName];
      if (!field || !field.$dirty || !field.$invalid) return [];
      const errors = [];
      if ('required' in field && !field.required) errors.push('This field is required.');
      if ('numeric' in field && !field.numeric) errors.push('Must be a number.');
      if ('float' in field && !field.float) errors.push('Must be a number.');
      if ('minValue' in field && !field.minValue) errors.push(`Must be at least ${field.$params.minValue.min}.`);
      return errors;
    },
    submit() {
      this.$v.$touch();
      if (!this.$v.form.$invalid) {
        this.submitting = true;
        const value = { carId: this.car.id, ...this.form };
        value.date = new Date(`${value.date}T${value.time}:00`);
        delete value.time;

        this.createRefuel(value)
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
