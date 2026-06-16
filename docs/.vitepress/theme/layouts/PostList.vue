<template>
  <div class="list-view">
    <div
      v-if="filteredList.length === 0"
      class="empty-list"
    >
      Ooops! Nothing here..🙈
    </div>
    <ol
      v-else
      class="list">
      <li v-for="post of filteredList"
        :key="post.url"
        class="list-item"
      >
        <a
          :href="post.url"
          class="item-title"
        >
          {{ post.title }}
        </a>
        <br>
        <time-ago
          :last-updated="post.frontmatter?.date || post.lastUpdated"
          class="item-date"
        />
      </li>
    </ol>
    <div v-if="hasPagination" class="pagination">
      <a v-if="hasPrev" :href="prevLink">prev</a>
      <a v-if="hasNext" :href="nextLink">next</a>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useData } from 'vitepress'
import TimeAgo from '../components/TimeAgo.vue'
import { data as allPosts } from '../posts.data.js'

const { page } = useData()
const router = useRouter()

const postsPerPage = 6
// SSR時に正しいページ番号を得るため、relativePath（page/N/index.md）から算出する。
// ルートのrelativePathは 'index.md'（トップページ＝1ページ目）。
const currentPage = computed(() => {
  const relativePath = page.value.relativePath || ''
  const match = relativePath.match(/^page\/(\d+)\//)
  return match ? parseInt(match[1]) : 1
})

const totalPages = computed(() => Math.ceil(allPosts.length / postsPerPage))
const start = computed(() => (currentPage.value - 1) * postsPerPage)
const end = computed(() => start.value + postsPerPage)

const filteredList = computed(() => allPosts.slice(start.value, end.value))

const hasNext = computed(() => currentPage.value < totalPages.value)
const hasPrev = computed(() => currentPage.value > 1)
// 出力パス（/page/N/）と一致する末尾スラッシュ付きのリンクにする。
// スラッシュなし（/page/N）だとVitePressのrouterが一旦 .html を付与してpushStateし、
// 直後に実体パス（/page/N/）へreplaceStateするため、無駄なリダイレクトが発生する。
const nextLink = computed(() => {
  if (currentPage.value === 1) return '/page/2/'
  return `/page/${currentPage.value + 1}/`
})
const prevLink = computed(() => {
  if (currentPage.value === 2) return '/'
  return `/page/${currentPage.value - 1}/`
})
const hasPagination = computed(() => totalPages.value > 1)

const goToPost = (url) => {
  router.go(url)
}

const transitionPage = (e) => {
  if (e.code === "ArrowRight" && hasNext.value) {
    router.go(nextLink.value)
  } else if (e.code === "ArrowLeft" && hasPrev.value) {
    router.go(prevLink.value)
  }
}

onMounted(() => {
  document.addEventListener('keydown', transitionPage, false)
})

onUnmounted(() => {
  document.removeEventListener('keydown', transitionPage, false)
})
</script>
