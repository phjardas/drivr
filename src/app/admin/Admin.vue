<template>
<div>
  <md-tabs md-sync-route>
    <md-tab md-label="Statistics" md-icon="dashboard" to="/admin/statistics" />
  </md-tabs>
  <router-view></router-view>
</div>
</template>

<script>
export default {};
</script>
