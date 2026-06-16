import { readdirSync, readFileSync, statSync } from 'fs'
import { resolve, dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function countPosts() {
  const postsDir = resolve(__dirname, '../_posts')
  let count = 0
  
  function traverseDir(dir) {
    const entries = readdirSync(dir)
    
    for (const entry of entries) {
      const fullPath = join(dir, entry)
      const stat = statSync(fullPath)
      
      if (stat.isDirectory()) {
        traverseDir(fullPath)
      } else if (entry.endsWith('.md')) {
        count++
      }
    }
  }
  
  traverseDir(postsDir)
  return count
}

export default {
  paths() {
    const postsCount = countPosts()
    const postsPerPage = 6
    const totalPages = Math.ceil(postsCount / postsPerPage)
    
    // ページ2以降を生成（ページ1はトップページ）
    const pages = []
    for (let i = 2; i <= totalPages; i++) {
      pages.push({ params: { num: String(i) } })
    }
    
    return pages
  }
}
