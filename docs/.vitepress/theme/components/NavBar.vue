<template>
  <div
    v-if="navbar"
    class="navbar"
  >
    <a class="navbar-item" href="/me">About me</a>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

const { theme } = useData()
const navbar = computed(() => theme.value.navbar || null)
</script>
