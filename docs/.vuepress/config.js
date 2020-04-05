path = require('path')

module.exports = {
  title: 'ikaruga.org',
  description: 'ikaruga.org',
  dest: path.resolve(__dirname, '../../dist'),
  evergreen: true,
  locales: {
    '/': { lang: 'ja-JP' },
  },
  theme: 'simple',
  themeConfig: {
    author: 'ikaruga',
    navbar: {
      "GitHub": 'https://github.com/ikaruga777',
      "Twitter": "https://twitter.com/UVB_76",
      "Flickr": "https://www.flickr.com/photos/uvb_76/",
    }
  },
  plugins: [
    [
      '@vuepress/google-analytics',
      {
        'ga': 'UA-152792685-1'
      }
    ],
    [
      'feed', {
        canonical_base: 'https://ikaruga.org'
      }
    ],
    [
      'seo', {
        siteTitle: (_, $site) => $site.title,
        title: $page => $page.title,
        description: $page => $page.frontmatter.description,
        author: (_, $site) => $site.themeConfig.author,
        tags: $page => $page.frontmatter.tags,
        twitterCard: _ => 'summary',
        type: $page => ['articles', 'posts', 'blog'].some(folder => $page.regularPath.startsWith('/' + folder)) ? 'article' : 'website',
        url: (_, $site, path) => ($site.themeConfig.domain || '') + path,
        image: ($page, $site) => $page.frontmatter.image && (($site.themeConfig.domain || '') + $page.frontmatter.image),
        publishedAt: $page => $page.frontmatter.date && new Date($page.frontmatter.date),
        modifiedAt: $page => $page.lastUpdated && new Date($page.lastUpdated),
      }
    ],
  ],
  markdown: {
    plugins: {
      'markdown-it-fontawesome': {
      }
    },
    extendMarkdown: md => {
      md.use(require('markdown-it-fontawesome'))
    }
  }
}
