#!/usr/bin/env node
// Xの投稿URLからoEmbed APIで埋め込みHTMLを取得し、記事に貼れる<blockquote>だけを出力する。
// <script>タグは記事側では剥がされ、theme/composables/useEmbeds.jsが読み込むため不要。
// 使い方: node scripts/tweet-embed.js https://x.com/xxx/status/123456789

const url = process.argv[2]
if (!url) {
  console.error('使い方: node scripts/tweet-embed.js <tweet-url>')
  process.exit(1)
}

const endpoint = `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}&lang=ja&dnt=true`

const res = await fetch(endpoint)
if (!res.ok) {
  console.error(`oEmbed取得に失敗しました: ${res.status} ${res.statusText}`)
  process.exit(1)
}

const { html } = await res.json()
const blockquote = html.replace(/<script[\s\S]*?<\/script>\s*/g, '').trim()

console.log(blockquote)
