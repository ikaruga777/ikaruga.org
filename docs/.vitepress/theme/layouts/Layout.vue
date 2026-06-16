<template>
  <div class="theme-container vuepress-theme-simple">
    <header class="header">
      <a href="/" class="site-name">
        {{ siteTitle }}
      </a>
      <div style="clear: both" />
      <nav-bar />
    </header>
    <main class="main">
      <Post v-if="isPost" />
      <PostList v-else-if="isHome" />
      <Content v-else />
    </main>
    <footer-bar />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'
import NavBar from '../components/NavBar.vue'
import FooterBar from '../components/FooterBar.vue'
import PostList from './PostList.vue'
import Post from './Post.vue'
import { useEmbeds } from '../composables/useEmbeds.js'

const { site, page } = useData()
useEmbeds()
const siteTitle = computed(() => site.value.title)
// relativePathはrewrites適用後のパス（_posts/プレフィックスなし）になる
const isHome = computed(() => {
  const relativePath = page.value.relativePath || ''
  // 404ページ（relativePathなし）と /page/N も記事一覧を表示
  return !relativePath || relativePath === 'index.md' || relativePath.startsWith('page/')
})
const isPost = computed(() => {
  const relativePath = page.value.relativePath || ''
  return /^(old\/)?\d{4}\/\d{2}\//.test(relativePath) || page.value.frontmatter?.layout === 'post'
})
</script>
