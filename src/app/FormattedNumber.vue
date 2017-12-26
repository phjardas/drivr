<template>
  <span class="formatted-number">
    <span class="formatted-number-value">{{ formattedValue }}</span>
    <span v-if="unit" class="formatted-number-unit">{{ unit }}</span>
  </span>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
    },
    fractionDigits: {
      type: Number,
      default: 2,
    },
  },

  computed: {
    formattedValue() {
      return this.value.toLocaleString(undefined, {
        minimumFractionDigits: this.fractionDigits,
        maximumFractionDigits: this.fractionDigits,
      });
    },
  },
};
</script>

<style lang="scss">
.formatted-number-unit {
  font-size: 80%;
  color: #999;
}
</style>

