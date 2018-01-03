<template>
<span>{{ title }}</span>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState({
      title: state => state.navigation.title,
    }),
  },

  watch: {
    title: newTitle => {
      document.title = newTitle.length ? `${newTitle} · drivr` : 'drivr';
    }
  },
}
</script>
