import { readdirSync, readFileSync, statSync } from 'fs'
import { resolve, dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// VuePress（@vuepress/shared-utils）のslugifyの移植。
// 旧サイトの記事URL（/:year/:month/:day/:slug/）を維持するため、同じ規則でスラグを生成する
const rControl = /[\u0000-\u001f]/g
const rSpecial = /[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'“”‘’–—<>,.?/]+/g
const rCombining = /[̀-ͯ]/g
export function slugify(str) {
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
export function postPermalink(fileName, content) {
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

export async function getAllPosts() {
  const postsDir = resolve(__dirname, '../../_posts')
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
