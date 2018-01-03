<template>
<v-list-group v-model="opened" no-action>
  <v-list-tile slot="item">
    <v-list-tile-action>
      <v-icon>{{ icon }}</v-icon>
    </v-list-tile-action>
    <v-list-tile-content>
      <v-list-tile-title>{{ text }}</v-list-tile-title>
    </v-list-tile-content>
  </v-list-tile>

  <slot></slot>
</v-list-group>
</template>

<script>
import NavItem from './NavItem';

export default {
  components: { NavItem },
  props: {
    iconClosed: { type: String, default: 'keyboard_arrow_up' },
    iconOpened: { type: String, default: 'keyboard_arrow_down' },
    text: { type: String, required: true },
    open: { type: Boolean, default: false },
  },
  data() {
    return {
      opened: this.open,
    };
  },
  computed: {
    icon() {
      return this.opened ? this.iconOpened: this.iconClosed;
    },
  },
}
</script>
