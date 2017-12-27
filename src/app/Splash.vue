<template>
<div id="splash">
  <md-empty-state
    md-icon="directions_car"
    md-label="drivr"
  >
    <spinner />
  </md-empty-state>
</div>
</template>

<script>
import Spinner from './Spinner';

export default {
  components: { Spinner },
};
</script>

<style lang="scss">
#splash {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
