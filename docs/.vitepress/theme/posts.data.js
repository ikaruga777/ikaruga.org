import { getAllPosts } from '../utils/getAllPosts.js'

// VitePressのデータローダー。ビルド時に実行され、結果がページのバンドルに
// 静的にインライン化されるため、記事一覧をSSR（静的HTML）に含められる。
// クライアント側で /posts-data.json をfetchする必要がなくなる。
export default {
  watch: ['../../_posts/**/*.md'],
  async load() {
    const posts = await getAllPosts()
    return posts.map(post => ({
      url: post.url,
      title: post.title,
      // Dateはシリアライズできないのでframtmatter.dateはISO文字列に変換する
      frontmatter: {
        ...post.frontmatter,
        date: post.frontmatter?.date ? new Date(post.frontmatter.date).toISOString() : null
      },
      lastUpdated: post.lastUpdated ? new Date(post.lastUpdated).toISOString() : null
    }))
  }
}
