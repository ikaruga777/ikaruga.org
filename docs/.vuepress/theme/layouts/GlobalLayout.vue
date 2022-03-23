<template>
  <div class="theme-container vuepress-theme-simple">
    <header class="header">
      <a href="https://ikaruga.org" class="site-name">
        {{ $site.title }}
      </a>
      <div style="clear: both" />
      <nav-bar />
    </header>
    <DefaultGlobalLayout />
    <footer-bar />
  </div>
</template>

<script>
import GlobalLayout from "@app/components/GlobalLayout.vue";
import FooterBar from '../components/FooterBar';
import NavBar from '../components/NavBar';
export default {
  components: {
    DefaultGlobalLayout: GlobalLayout,
    FooterBar,
    NavBar,
  },
  created() {
    console.log();
  }
};
</script>
