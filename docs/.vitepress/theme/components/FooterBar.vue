<template>
  <footer class="footer">
    © {{ thisYear }}
    <i
      v-if="author"
      class="icon-user"
    />
    {{ author }}
    <br>
    Powered by
    <a
      href="https://vitepress.dev/"
      rel="noopener"
      target="_blank"
    >VitePress</a>
    | Theme
    <a
      href="https://github.com/viko16/vuepress-theme-simple"
      rel="noopener"
      target="_blank"
    >Simple</a>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

const { theme } = useData()
const thisYear = computed(() => new Date().getFullYear())
const author = computed(() => theme.value.author || '')
</script>
