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
      <li v-for="page of filteredList"
        :key="page.key"
        class="list-item"
      >
        <router-link
          :to="page.path"
          class="item-title"
        >
          {{ page.title }}
        </router-link>
        <br>
        <time-ago
          :last-updated="page.frontmatter.date || page.lastUpdated"
          class="item-date"
        />
      </li>
    </ol>
  <router-link v-if=hasPrev :to=prevLink>prev</router-link>

  <router-link v-if=hasNext :to=nextLink>next</router-link>
  </div>
</template>

<script>
import TimeAgo from '../components/TimeAgo';

export default {
  components: {
    TimeAgo
  },
  computed: {
    filteredList() {
      // Order by publish date, desc
      if (this.$pagination === null) {
        return []
      }
      return this.$pagination.pages
    },
    nextLink() {
      return this.$pagination.nextLink
    },
    hasNext() {
      return this.$pagination.hasNext
    },
    prevLink() {
      return this.$pagination.prevLink
    },
    hasPrev() {
      return this.$pagination.hasPrev
    }
  }
}
</script>
