<template>
<div>
  <v-tabs fixed icons centered>
    <v-tabs-bar grow>
      <v-tabs-slider color="accent"></v-tabs-slider>
      <v-tabs-item to="/admin/statistics" router>
        <v-icon>dashboard</v-icon>
        Statistics
      </v-tabs-item>
    </v-tabs-bar>
  </v-tabs>

  <router-view></router-view>
</div>
</template>

<script>
export default {};
</script>
