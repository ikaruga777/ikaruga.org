import { defineConfig } from 'vitepress'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// VuePress（@vuepress/shared-utils）のslugifyの移植。
// 旧サイトの記事URL（/:year/:month/:day/:slug/）を維持するため、同じ規則でスラグを生成する
const rControl = /[\u0000-\u001f]/g
const rSpecial = /[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'\u201c\u201d\u2018\u2019\u2013\u2014<>,.?/]+/g
const rCombining = /[\u0300-\u036f]/g
function slugify(str) {
  return str
    .normalize('NFKD')
    .replace(rCombining, '')
    .replace(rControl, '')
    .replace(rSpecial, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/^(\d)/, '_$1')
    .toLowerCase()
}

// 旧VuePressブログプラグインのpermalink（/:year/:month/:day/:slug/）を再現する。
// 旧サイトはUTC環境でビルドされており、URLの日付は「frontmatterのdateをUTCに変換した日付」になる。
// ビルド環境のタイムゾーンに依存しないよう、オフセットを自前で解釈してUTCの日付を求める。
// タイムゾーン表記がない場合はYAML 1.1の規定どおりUTCとして扱う（旧ビルドのjs-yamlと同じ）
function postPermalink(fileName, content) {
  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!frontmatterMatch) return null
  const dateMatch = frontmatterMatch[1].match(
    /^date:\s*(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ](\d{1,2}):(\d{2})(?::(\d{2}))?)?\s*(?:([+-]\d{2}):?(\d{2}))?/m
  )
  if (!dateMatch) return null
  const [, year, month, day, hour = '0', minute = '0', second = '0', offsetHour, offsetMinute] = dateMatch
  let time = Date.UTC(+year, +month - 1, +day, +hour, +minute, +second)
  if (offsetHour !== undefined) {
    const sign = offsetHour.startsWith('-') ? -1 : 1
    time -= sign * (Math.abs(+offsetHour) * 60 + +offsetMinute) * 60000
  }
  const utc = new Date(time)
  const pad = (n) => String(n).padStart(2, '0')
  // 旧VuePressはJekyll形式の日付プレフィックス（YYYY-MM-DD-）をスラグから除去していた
  const name = fileName.replace(/^\d{4}-\d{1,2}(?:-\d{1,2})?-/, '')
  return `/${utc.getUTCFullYear()}/${pad(utc.getUTCMonth() + 1)}/${pad(utc.getUTCDate())}/${slugify(name)}/`
}

async function getAllPosts() {
  const postsDir = resolve(__dirname, '../_posts')
  const posts = []
  
  function traverseDir(dir, basePath = '') {
    const entries = readdirSync(dir)
    
    for (const entry of entries) {
      const fullPath = join(dir, entry)
      const stat = statSync(fullPath)
      
      if (stat.isDirectory()) {
        // URL用のパスなので、常にスラッシュで結合
        const newBasePath = basePath ? `${basePath}/${entry}` : entry
        traverseDir(fullPath, newBasePath)
      } else if (entry.endsWith('.md')) {
        const content = readFileSync(fullPath, 'utf-8')
        const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
        
        if (frontmatterMatch) {
          const frontmatterStr = frontmatterMatch[1]
          const frontmatter = {}
          
          frontmatterStr.split(/\r?\n/).forEach(line => {
            const match = line.match(/^(\w+):\s*(.+)$/)
            if (match) {
              const key = match[1]
              let value = match[2].trim()
              
              if (key === 'date') {
                value = new Date(value)
              }
              
              frontmatter[key] = value
            }
          })
          
          const fileName = entry.replace('.md', '')
          // 旧サイトと同じpermalink形式のURLを使う（rewritesと同じ規則）
          const urlPath = postPermalink(fileName, content)
          if (!urlPath) continue
          posts.push({
            url: urlPath,
            title: frontmatter.title || fileName,
            frontmatter,
            lastUpdated: frontmatter.date || new Date(),
            relativePath: basePath ? `_posts/${basePath}/${entry}` : `_posts/${entry}`
          })
        }
      }
    }
  }
  
  traverseDir(postsDir)
  
  posts.sort((a, b) => {
    const dateA = a.frontmatter?.date ? new Date(a.frontmatter.date) : new Date(a.lastUpdated || 0)
    const dateB = b.frontmatter?.date ? new Date(b.frontmatter.date) : new Date(b.lastUpdated || 0)
    return dateB - dateA
  })
  
  return posts
}

async function generatePostsData() {
  const posts = await getAllPosts()
  
  const postsData = {
    posts: posts.map(post => ({
      url: post.url,
      title: post.title,
      frontmatter: post.frontmatter,
      lastUpdated: post.lastUpdated ? post.lastUpdated.toISOString() : null,
      relativePath: post.relativePath
    }))
  }
  
  // VitePressでは、publicディレクトリはdocs/publicに配置
  const publicDir = resolve(__dirname, '../public')
  try {
    mkdirSync(publicDir, { recursive: true })
    console.log('Created public directory:', publicDir)
  } catch (e) {
    // ディレクトリが既に存在する場合は無視
    console.log('Public directory already exists:', publicDir)
  }
  
  const outputPath = resolve(publicDir, 'posts-data.json')
  console.log('Writing posts-data.json to:', outputPath)
  writeFileSync(outputPath, JSON.stringify(postsData, null, 2))
  console.log('Successfully wrote posts-data.json, posts count:', postsData.posts.length)
}

const DOMAIN = 'https://ikaruga.org'

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

async function generateRssFeed(outDir) {
  const posts = (await getAllPosts()).slice(0, 20)
  const items = posts.map(post => {
    const url = `${DOMAIN}${post.url}`
    const pubDate = post.lastUpdated ? new Date(post.lastUpdated).toUTCString() : ''
    return [
      '    <item>',
      `      <title>${escapeXml(post.title)}</title>`,
      `      <link>${escapeXml(url)}</link>`,
      `      <guid>${escapeXml(url)}</guid>`,
      pubDate ? `      <pubDate>${pubDate}</pubDate>` : null,
      '    </item>'
    ].filter(Boolean).join('\n')
  }).join('\n')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>ikaruga.org</title>
    <link>${DOMAIN}</link>
    <description>だぶんをつらねます</description>
    <language>ja</language>
${items}
  </channel>
</rss>
`
  writeFileSync(resolve(outDir, 'rss.xml'), rss)
}

// 出力URL（rewrites適用後）をソースの相対パスから求める
function pageUrl(relativePath) {
  return '/' + relativePath.replace(/^_posts\//, '').replace(/\.md$/, '.html').replace(/(^|\/)index\.html$/, '$1')
}

export default defineConfig({
  title: 'ikaruga.org',
  description: 'だぶんをつらねます',
  lang: 'ja-JP',

  // 旧VuePress構成と同じくリポジトリルートのdist/に出力する
  outDir: '../dist',

  head: [
    ['link', { rel: 'icon', type: 'image/jpeg', href: '/icon.jpg' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=M+PLUS+Rounded+1c&display=swap' }],
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: 'ikaruga.org', href: `${DOMAIN}/rss.xml` }],
    ['script', {}, `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-5C26B9M');`]
  ],

  sitemap: {
    hostname: DOMAIN
  },

  markdown: {
    config(md) {
      // 記事に貼られた埋め込みコード（X・Flickr等）の<script>タグはVueコンパイラが
      // 受け付けないため、レンダリング時に除去する。スクリプト本体はテーマ側
      // （theme/composables/useEmbeds.js）でロードする。<script setup>はSFCブロックなので残す
      const stripScriptTags = (html) =>
        html
          .replace(/<script\b(?![^>]*\bsetup\b)[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<script\b(?![^>]*\bsetup\b)[^>]*>/gi, '')
          .replace(/<\/script>/gi, '')
      for (const rule of ['html_block', 'html_inline']) {
        const original = md.renderer.rules[rule] ?? ((tokens, idx) => tokens[idx].content)
        md.renderer.rules[rule] = (...args) => stripScriptTags(original(...args))
      }
    }
  },

  // _posts/配下の記事を旧サイトと同じpermalink（/:year/:month/:day/:slug/）に配置する
  rewrites(id) {
    // ページネーションも旧サイトと同じ /page/N/ 形式にする
    const pageMatch = id.match(/^page\/((\[num\])|\d+)\.md$/)
    if (pageMatch) return `page/${pageMatch[1]}/index.md`
    const match = id.match(/^_posts\/(?:old\/)?\d{4}\/\d{2}\/(.+)\.md$/)
    if (!match) return id
    const content = readFileSync(resolve(__dirname, '..', id), 'utf-8')
    const permalink = postPermalink(match[1], content)
    if (!permalink) return id
    return `${permalink.slice(1)}index.md`
  },

  themeConfig: {
    author: 'ikaruga',
    domain: DOMAIN,
    navbar: {
      'About me': '/me'
    }
  },

  transformHead({ pageData }) {
    // relativePathはrewrites適用後のパス（_posts/プレフィックスなし）になる
    const isPost = /^(old\/)?\d{4}\/\d{2}\//.test(pageData.relativePath) || pageData.frontmatter?.layout === 'post'
    const url = DOMAIN + pageUrl(pageData.relativePath)
    const title = pageData.title || 'ikaruga.org'
    const description = pageData.frontmatter?.description || 'だぶんをつらねます'
    const head = [
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:type', content: isPost ? 'article' : 'website' }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:image', content: `${DOMAIN}/icon.jpg` }],
      ['meta', { name: 'twitter:card', content: 'summary' }]
    ]
    if (pageData.frontmatter?.date) {
      head.push(['meta', { property: 'article:published_time', content: new Date(pageData.frontmatter.date).toISOString() }])
    }
    return head
  },

  async transformPageData(pageData) {
    // 開発サーバーでもposts-data.jsonを生成
    // 最初のページ読み込み時に生成
    try {
      await generatePostsData()
    } catch (e) {
      console.error('Failed to generate posts-data.json in transformPageData:', e)
    }
    return pageData
  },

  async buildEnd(siteConfig) {
    // ビルド時にposts-data.jsonを生成
    await generatePostsData()
    await generateRssFeed(siteConfig.outDir)
  }
})
