<template>
  <time
    :datetime="formattedDate"
    :title="formattedDate"
    pubdate="pubdate"
  >
    {{ timeAgoText }}
  </time>
</template>

<script setup>
import { computed } from 'vue'
import { format } from 'timeago.js'

const props = defineProps({
  lastUpdated: {
    type: [String, Date, Number],
    default: ''
  }
})

const formattedDate = computed(() => {
  if (!props.lastUpdated) return ''
  return new Date(props.lastUpdated).toLocaleString()
})

const timeAgoText = computed(() => {
  if (!props.lastUpdated) return format()
  return format(new Date(props.lastUpdated), 'ja_JP')
})
</script>
