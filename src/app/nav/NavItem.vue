<template>
<v-list-tile :to="to" @click="click">
  <v-list-tile-action v-if="icon">
    <v-icon>{{ icon }}</v-icon>
  </v-list-tile-action>
  <v-list-tile-content>
    <v-list-tile-title>{{ text }}</v-list-tile-title>
  </v-list-tile-content>
</v-list-tile>
</template>

<script>
export default {
  props: {
    icon: { type: String },
    text: { type: String, required: true },
    to: { type: String },
  },
  methods: {
    click(event) {
      this.$emit('click', event);
    }
  },
}
</script>
