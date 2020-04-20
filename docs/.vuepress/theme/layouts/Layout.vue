<template>
  <div>
    <li v-for="page of this.$pagination.pages"
        :key="page.key"
        class="list-item"
      >
        <router-link
          :to="page.path"
          class="item-title"
        >
          {{ page.title }} {{ page.id }}
        </router-link>
      <br>
    </li>
    <router-link v-if=hasPrev :to=prevLink>prev</router-link>

  <router-link v-if=hasNext :to=nextLink>next</router-link>
  </div>
</template>
<script>
export default {

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
