<template>
<div>
  <spinner v-if="submitting" label="saving new car…" />
  <form v-else novalidate class="md-layout-row md-layout-wrap md-gutter" @submit.prevent="submit">
    <div class="md-flex md-flex-small-100">
      <md-field :class="getValidationClass('label')">
        <label for="label">Label</label>
        <md-input name="label" id="label" v-model="form.label" @input="$v.$touch" autofocus />
        <span class="md-helper-text">For instance the license plate or make and model.</span>
        <span class="md-error" v-if="!$v.form.label.required">This field is required.</span>
      </md-field>
    </div>
    <div class="md-flex md-flex-small-100">
      <md-button class="md-raised md-primary" @click="submit" :disabled="$v.form.$invalid">Save new car</md-button>
      <md-button to="/">Cancel</md-button>
    </div>
  </form>

  <md-snackbar v-if="error" md-position="center" :md-duration="Infinity" :md-active="true" md-persistent>
    <span><md-icon style="color: red">error</md-icon> Error: {{ error.message }}</span>
  </md-snackbar>
</div>
</template>

<script>
import { mapActions } from 'vuex';
import { validationMixin } from 'vuelidate';
import required from 'vuelidate/lib/validators/required';

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
        },
      },
    };
  },

  methods: {
    ...mapActions(['createCar']),
    setPageTitle() {
      this.$store.dispatch('setPageTitle', { title: 'Register new car' });
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
