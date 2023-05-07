<template>
  <div
    v-if="navbar"
    class="navbar"
  >
    <router-link class="navbar-item" to="/me">About me</router-link>
  </div>
</template>

<script>
export default {
  computed: {
    navbar() {
      return this.$themeConfig.navbar || null
    }
  }
}
</script>
