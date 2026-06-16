import { getPages } from 'vitepress'

export async function getAllPosts() {
  const pages = await getPages()
  
  // _postsディレクトリ内のページをフィルタリング
  const posts = pages.filter(page => {
    return page.url.startsWith('/_posts/')
  })
  
  // 日付でソート（新しい順）
  posts.sort((a, b) => {
    const dateA = a.frontmatter?.date ? new Date(a.frontmatter.date) : new Date(a.lastUpdated || 0)
    const dateB = b.frontmatter?.date ? new Date(b.frontmatter.date) : new Date(b.lastUpdated || 0)
    return dateB - dateA
  })
  
  return posts
}

export function getPagination(posts, currentPage = 1, postsPerPage = 6) {
  const totalPages = Math.ceil(posts.length / postsPerPage)
  const start = (currentPage - 1) * postsPerPage
  const end = start + postsPerPage
  
  return {
    posts: posts.slice(start, end),
    currentPage,
    totalPages,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
    nextLink: currentPage === 1 ? '/page/2' : `/page/${currentPage + 1}`,
    prevLink: currentPage === 2 ? '/' : `/page/${currentPage - 1}`
  }
}
