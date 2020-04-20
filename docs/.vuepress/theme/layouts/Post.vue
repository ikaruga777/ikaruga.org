<template>
  <div>
    aaaaaaaaaaaaaaaaaaaaaaa
    <Content />
    <div
    v-if="prev || next"
    class="page-nav"
    >
      <span
        v-if="prev"
        class="prev"
      >
        <router-link
          class="prev"
          :to="prev.path"
        >
          {{ prev.title || prev.path }}
        </router-link>
      </span>
      <span
        v-if="next"
        class="next"
      >
        <router-link
          :to="next.path"
        >
          {{ next.title || next.path }}
        </router-link>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Post',
  computed: {
        // 新規メソッド
    sortedPosts() {
      return this.$site.pages
           // dateに設定した日付の降順にソートする
          .sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date))
    },
    // 新規メソッド
    pageIdx() {
      return this.sortedPosts
          .findIndex(page => page.path == this.$page.path)
    },

    // 既存のprev()メソッドに上書きしてください
    prev() {
      const prev = this.$page.frontmatter.prev
      if (prev === false) {
        return
      } else if (typeof prev === "undefined"
      && this.pageIdx > 0
      && this.pageIdx < this.sortedPosts.length - 1 ) {
        return {
          title: this.sortedPosts[this.pageIdx - 1].title,
          path: this.sortedPosts[this.pageIdx - 1].path
        }
      }
      return null
    },

    // 既存のnext()メソッドに上書きしてください
    next() {
      const next = this.$page.frontmatter.next
      if (next === false) {
        return

      } else if (typeof next === "undefined"
      && this.pageIdx >= 0
      && this.pageIdx < this.sortedPosts.length - 2) {
        return {
          title: this.sortedPosts[this.pageIdx + 1].title,
          path: this.sortedPosts[this.pageIdx + 1].path
        }
      } else {
        return null
      }
    }
  }
}
function resolvePrev (page, items) {
  return find(page, items, -1)
}
function resolveNext (page, items) {
  return find(page, items, 1)
}
const LINK_TYPES = {
  NEXT: {
    resolveLink: resolveNext,
    getThemeLinkConfig: ({ nextLinks }) => nextLinks,
    getPageLinkConfig: ({ frontmatter }) => frontmatter.next
  },
  PREV: {
    resolveLink: resolvePrev,
    getThemeLinkConfig: ({ prevLinks }) => prevLinks,
    getPageLinkConfig: ({ frontmatter }) => frontmatter.prev
  }
}
</script>

<style>

</style>