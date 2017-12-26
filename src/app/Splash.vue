<template>
<div id="splash">
  <spinner label="loading…" />
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

  .spinner {
    background: rgba(255, 255, 255, 0.5);
    padding: 16px 24px;
    border-radius: 8px;
  }
}
</style>
