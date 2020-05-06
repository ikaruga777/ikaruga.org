<template>
  <div class="layout-404">
    <h1>404</h1>
    <p>Seems nothing here.</p>
    <router-link to="/">
      Back to home.
    </router-link>
  </div>
</template>

<script>
import FooterBar from '../components/FooterBar';

export default {
  components: {
    FooterBar,
  },
};
</script>
