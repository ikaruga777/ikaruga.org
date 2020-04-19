<template>
  <div class="theme-container vuepress-theme-simple">
    <header class="header">
      <router-link
        to="/"
        :title="$description"
        class="site-name"
      >
        {{ $site.title }}
      </router-link>
      <div style="clear: both" />
      <nav-bar />
    </header>
    <home-page />
    <footer-bar />
  </div>
</template>

<script>
import HomePage from "../components/Home";
import FooterBar from '../components/FooterBar';
import NavBar from '../components/NavBar';

export default {
  components: {
    HomePage,
    FooterBar,
    NavBar,
  },
  computed: {
    isHome() {
      return this.$page.path === '/';
    }
  }
};
</script>
