<template>
  <section class="post-view">
    <div class="post-head">
      <h1 class="post-title">
        <a :href="$page.path">
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
}
</script>
