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
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-5C26B9M');</script>
    <!-- HatenaStar -->
    <script type="text/javascript" src="https://s.hatena.ne.jp/js/HatenaStar.js"></script>
    <script type="text/javascript">
      Hatena.Star.SiteConfig = {
        entryNodes: {
          'section.post-view': {
            uri: 'h3 a',
            title: 'post-title',
            container: 'hatena-star'
          }
        }
      };
    </script>
    <!-- End Google Tag Manager -->
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
