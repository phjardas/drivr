<template>
<div class="spinner">
  <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
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
