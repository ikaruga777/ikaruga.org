<template>
  <section class="post-view">
    <div class="post-head">
      <h1 class="post-title">
        <a :href="url">
          {{ $page.title }}
        </a>
      </h1>
      <time-ago
        :last-updated="$page.frontmatter.date || $page.lastUpdated"
        class="post-date"
      />
    </div>
    <Content />
    <social-share :networks="['twitter', 'facebook']" is-plain/>
    <Comment />
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
    <div class="hatena-star"></div>
  </section>
</template>

<script>
import TimeAgo from '../components/TimeAgo';
import Comment from '../components/Comment';

export default {
  components: {
    TimeAgo,
    Comment,
  },
  computed: {
    url() {
      return this.$themeConfig.domain + this.$page.path;
    }
  }
}
</script>
