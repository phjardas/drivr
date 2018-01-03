<template>
<div class="spinner">
  <v-progress-circular indeterminate />
  <span v-if="label" class="spinner-label">{{ label }}</span>
</div>
</template>

<script>
export default {
  props: {
    label: String,
  },
};
</script>

<style lang="scss">
.spinner {
  margin-top: 48px;
  text-align: center;

  .spinner-label {
    display: block;
    margin-top: 16px;
  }
}
</style>
