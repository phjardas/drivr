<template>
  <div class="empty-state" :class="emptyStateClasses">
    <div class="empty-state-container">
      <template v-if="icon">
        <v-icon class="empty-state-icon">{{ icon }}</v-icon>
      </template>
      <strong class="empty-state-label" v-if="label">{{ label }}</strong>
      <p class="empty-state-description" v-if="description">{{ description }}</p>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    rounded: Boolean,
    icon: String,
    label: String,
    description: String,
  },

  computed: {
    emptyStateClasses() {
      return { rounded: this.rounded };
    },
  },
}
</script>

<style lang="scss">
@mixin empty-state-base() {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.empty-state {
  @include empty-state-base;
  max-width: 420px;
  padding: 36px;
  margin: 0 auto;
  position: relative;

  &.rounded {
    max-width: auto;
    border-radius: 50%;
    padding: 40px;
    background: #e0e0e0;
  }
}

.empty-state-container {
  @include empty-state-base;
}

.empty-state-icon {
  margin: 0;
  font-size: 12rem;
}

.empty-state-label {
  font-size: 26px;
  font-weight: 500;
  line-height: 40px;
}

.empty-state-description {
  margin: 1em 0;
  font-size: 16px;
  line-height: 24px;
}
</style>
