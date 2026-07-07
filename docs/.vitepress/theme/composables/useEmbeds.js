import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'

// markdownレンダリング時に本文中の<script>タグを除去している（config.jsのmarkdown.config）ため、
// 埋め込みに必要なスクリプトはここで一括ロードする

// ロード済みならAPIでDOMを再スキャンできるスクリプト
const RESCAN_SCRIPTS = [
  {
    src: 'https://platform.twitter.com/widgets.js',
    selector: 'blockquote.twitter-tweet',
    rescan: () => window.twttr?.widgets?.load()
  },
  {
    src: 'https://www.instagram.com/embed.js',
    selector: 'blockquote.instagram-media',
    rescan: () => window.instgrm?.Embeds?.process()
  }
]

// 再スキャンAPIがなく、実行時の一度だけDOMを処理するスクリプト。遷移ごとに再実行する
const RELOAD_SCRIPTS = [
  { src: 'https://embedr.flickr.com/assets/client-code.js', selector: 'a[data-flickr-embed]' }
]

function appendScript(src) {
  const el = document.createElement('script')
  el.src = src
  el.async = true
  document.body.appendChild(el)
}

function processEmbeds() {
  for (const { src, selector, rescan } of RESCAN_SCRIPTS) {
    if (!document.querySelector(selector)) continue
    if (document.querySelector(`script[src="${src}"]`)) {
      rescan()
    } else {
      appendScript(src)
    }
  }
  for (const { src, selector } of RELOAD_SCRIPTS) {
    if (!document.querySelector(selector)) continue
    document.querySelector(`script[src="${src}"]`)?.remove()
    appendScript(src)
  }
}

export function useEmbeds() {
  const route = useRoute()
  onMounted(() => {
    processEmbeds()
    watch(
      () => route.path,
      async () => {
        await nextTick()
        processEmbeds()
      }
    )
  })
}
