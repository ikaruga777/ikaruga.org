<template>
  <div
    class="list-view"
    v-on:keyup.right="transitionNextPage"
    v-on:keyup.left="transitionPrevPage"
    >
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
    <div>
      <router-link v-if=hasPrev :to=prevLink>prev</router-link>

      <router-link v-if=hasNext :to=nextLink>next</router-link>
    </div>
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
  },
  mounted: function(){
    document.addEventListener('keydown', this.transitionPage, false);
  },
  beforeDestroy: function() {
    document.removeEventListener('keydown', this.transitionPage, false);
  },
  methods: {
    transitionPage(e){
      if (e.code === "ArrowRight") {
        this.transitionNextPage()
      }else if(e.code === "ArrowLeft") {
        this.transitionPrevPage()
      }
    },
    transitionNextPage() {
      this.$router.push( {path: this.nextLink }).catch(err => {})
    },
    transitionPrevPage() {
      this.$router.push( {path: this.prevLink }).catch(err => {})
    }
  }
}
</script>
