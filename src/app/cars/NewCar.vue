<template>
<div>
  <spinner v-if="submitting" label="saving new car…" />

  <v-container v-else fluid>
    <v-layout row wrap>
      <v-flex xs12 md6 offset-md3>
        <v-card>
          <v-card-title primary-title>
            <h2 class="headline">
              <v-icon>directions_car</v-icon>
              New Car
            </h2>
          </v-card-title>
          <v-card-text>
            <form novalidate @submit.prevent="submit">
              <v-text-field
                label="Label"
                v-model="form.label"
                :error-messages="errorsFor('label')"
                @input="$v.form.label.$touch()"
                @blur="$v.form.label.$touch()"
                hint="For instance the license plate or make and model."
                persistent-hint
              />
              <div class="v-flex v-flex-small-100">
                <v-btn raised color="primary" @click="submit" :disabled="$v.form.$invalid">Save new car</v-btn>
                <v-btn flat to="/">Cancel</v-btn>
              </div>
            </form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>

  <v-snackbar v-if="error" v-position="center" :v-duration="Infinity" :v-active="true" v-persistent>
    <span><v-icon style="color: red">error</v-icon> Error: {{ error.message }}</span>
  </v-snackbar>
</div>
</template>

<script>
import { mapActions } from 'vuex';
import { validationMixin } from 'vuelidate';
import required from 'vuelidate/lib/validators/required';
import minLength from 'vuelidate/lib/validators/minLength';

import Spinner from '../Spinner';

export default {
  mixins: [validationMixin],

  components: { Spinner },

  data() {
    return {
      form: { label: null },
      submitting: false,
      error: null,
    };
  },

  validations() {
    return {
      form: {
        label: {
          required,
          minLength: minLength(3),
        },
      },
    };
  },

  methods: {
    ...mapActions(['createCar']),
    setPageTitle() {
      this.$store.dispatch('setPageTitle', { title: 'Register new car' });
    },
    errorsFor(fieldName) {
      const field = this.$v.form[fieldName];
      if (!field || !field.$dirty || !field.$invalid) return [];
      const errors = [];
      if (!field.required) errors.push('This field is required.');
      if (!field.minLength) errors.push(`Must have a minimum length of ${field.$params.minLength.min}`);
      return errors;
    },
    submit() {
      this.$v.$touch();
      if (!this.$v.form.$invalid) {
        this.submitting = true;
        this.error = null;

        this.createCar(this.form)
          .then(car => {
            this.submitting = false;
            this.$router.push(`/cars/${car.id}`);
          })
          .catch(error => {
            console.error('Error:', error);
            this.error = error;
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
