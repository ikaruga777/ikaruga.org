<template>
  <section class="post-view">
    <div class="post-head">
      <h1 class="post-title">
        {{ $page.title }}
      </h1>
      <time-ago
        :last-updated="$page.frontmatter.date || $page.lastUpdated"
        class="post-date"
      />
    </div>
    <Content />
    <social-share :networks="['twitter', 'facebook']" is-plain/>
    <div class="comment">
      <Vssue :title="$title" />
    </div>
  </section>
</template>

<script>
import TimeAgo from '../components/TimeAgo';
import InstagramEmbed from 'vue-instagram-embed';

export default {
  components: {
    TimeAgo
  },
}
</script>
