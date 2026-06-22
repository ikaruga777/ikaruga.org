<template>
  <section class="post-view">
    <div class="post-head">
      <h1 class="post-title">
        {{ pageTitle }}
      </h1>
      <time-ago
        :last-updated="pageDate"
        class="post-date"
      />
    </div>
    <Content />
    <nav
      v-if="prevPost || nextPost"
      class="post-nav"
    >
      <a
        v-if="prevPost"
        :href="prevPost.url"
        class="post-nav-item post-nav-prev"
      >
        <span class="post-nav-label">前の記事</span>
        <span class="post-nav-title">{{ prevPost.title }}</span>
      </a>
      <a
        v-if="nextPost"
        :href="nextPost.url"
        class="post-nav-item post-nav-next"
      >
        <span class="post-nav-label">次の記事</span>
        <span class="post-nav-title">{{ nextPost.title }}</span>
      </a>
    </nav>
    <Comment />
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'
import TimeAgo from '../components/TimeAgo.vue'
import Comment from '../components/Comment.vue'
import { data as allPosts } from '../posts.data.js'

const { page } = useData()
const pageTitle = computed(() => page.value.title)
const pageDate = computed(() => page.value.frontmatter?.date || page.value.lastUpdated)

const currentIndex = computed(() => {
  const url = '/' + (page.value.relativePath || '').replace(/index\.md$/, '')
  return allPosts.findIndex(p => p.url === url)
})

// allPosts は日付降順。index+1 が前の記事（古い）、index-1 が次の記事（新しい）
const prevPost = computed(() => {
  const i = currentIndex.value
  return i >= 0 && i < allPosts.length - 1 ? allPosts[i + 1] : null
})
const nextPost = computed(() => {
  const i = currentIndex.value
  return i > 0 ? allPosts[i - 1] : null
})
</script>
