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
    <Comment />
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'
import TimeAgo from '../components/TimeAgo.vue'
import Comment from '../components/Comment.vue'

const { page } = useData()
const pageTitle = computed(() => page.value.title)
const pageDate = computed(() => page.value.frontmatter?.date || page.value.lastUpdated)
</script>
