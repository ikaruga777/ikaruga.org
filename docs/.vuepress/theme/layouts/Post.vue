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
    <span class="hatena-star" style="display:none;"></span>
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
      return this.$themeConfig.domain + this.$page.path
    },
  },
  mounted: function(){
    const script = document.createElement('script')
    script.src = 'https://s.hatena.ne.jp/js/HatenaStar.js'
    document.body.appendChild(script)
    Hatena.Star.SiteConfig = {
      entryNodes: {
        'section': {
          uri: 'post-title a',
          title: 'post-title',
          container: 'hatena-star'
        }
      }
    };
  },
};
</script>
