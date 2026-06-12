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
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter, useData } from 'vitepress'
import TimeAgo from '../components/TimeAgo.vue'

const { site } = useData()
const router = useRouter()
const allPosts = ref([])

// ビルド時に生成されたデータを使用
onMounted(async () => {
  // 複数回試行してposts-data.jsonを読み込む
  let retries = 5
  while (retries > 0) {
    try {
      await new Promise(resolve => setTimeout(resolve, 200))
      const response = await fetch('/posts-data.json')
      
      if (response.ok) {
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          const text = await response.text()
          try {
            const data = JSON.parse(text)
            allPosts.value = data.posts || []
            console.log('Loaded posts:', allPosts.value.length)
            return
          } catch (parseError) {
            console.warn('Failed to parse JSON:', parseError, 'Response:', text.substring(0, 100))
          }
        } else {
          console.warn('posts-data.json is not JSON, content-type:', contentType)
        }
      } else if (response.status === 404) {
        // まだ生成されていない可能性があるので、リトライ
        retries--
        continue
      } else {
        console.warn('posts-data.json not found, status:', response.status)
        break
      }
    } catch (e) {
      console.error('Failed to load posts data (retry):', e)
      retries--
    }
  }
  
  console.warn('Failed to load posts-data.json after retries')
  allPosts.value = []
})

const postsPerPage = 6
const currentPage = computed(() => {
  const path = router.route.path
  if (path === '/') return 1
  const match = path.match(/^\/page\/(\d+)(?:\.html)?\/?$/)
  return match ? parseInt(match[1]) : 1
})

const totalPages = computed(() => Math.ceil(allPosts.value.length / postsPerPage))
const start = computed(() => (currentPage.value - 1) * postsPerPage)
const end = computed(() => start.value + postsPerPage)

const filteredList = computed(() => {
  if (allPosts.value.length === 0) return []
  return allPosts.value.slice(start.value, end.value)
})

const hasNext = computed(() => currentPage.value < totalPages.value)
const hasPrev = computed(() => currentPage.value > 1)
const nextLink = computed(() => {
  if (currentPage.value === 1) return '/page/2'
  return `/page/${currentPage.value + 1}`
})
const prevLink = computed(() => {
  if (currentPage.value === 2) return '/'
  return `/page/${currentPage.value - 1}`
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
