import { defineConfig } from 'vitepress'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
        
        if (frontmatterMatch) {
          const frontmatterStr = frontmatterMatch[1]
          const frontmatter = {}
          
          frontmatterStr.split('\n').forEach(line => {
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
          // VitePressでは、ファイルパスから直接URLを生成
          // basePathは'2026/01'のような形式なので、スラッシュで結合
          // rewritesで_posts/を削除しているので、URLも/_posts/なしで生成
          const urlPath = basePath 
            ? `/${basePath}/${fileName}.html`
            : `/${fileName}.html`
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

  // _posts/ プレフィックスを削除するための rewrites
  rewrites: {
    '_posts/old/:year/:month/:slug': 'old/:year/:month/:slug',
    '_posts/:year/:month/:slug': ':year/:month/:slug'
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
