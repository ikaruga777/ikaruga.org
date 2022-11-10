const path = require('path')
const webpack = require('webpack')

module.exports = {
  configureWebpack: (config) => {
    return {
      plugins: [
        new webpack.EnvironmentPlugin({ ...process.env })
      ]
    }
  },
  title: 'ikaruga.org',
  description: 'だぶんをつらねます',
  dest: path.resolve(__dirname, '../../dist'),
  evergreen: true,
  locales: {
    '/': { lang: 'ja-JP' },
  },
  head: [
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=M+PLUS+Rounded+1c&display=swap' }]
  ],

  themeConfig: {
    author: 'ikaruga',
    domain: 'https://ikaruga.org',
    navbar: {
      "GitHub": 'https://github.com/ikaruga777',
      "Twitter": "https://twitter.com/UVB_76",
      "Flickr": "https://www.flickr.com/photos/uvb_76/",
    }
  },
  plugins: [
    [
      '@vuepress/blog',
      {
        directories: [
          {
            id: 'post',
            dirname: '_posts',
            path: '/',
            layout: 'PostList',
            itemLayout: 'Post',
            pagination: {
              lengthPerPage: 6,
            },
          }
        ]
      }
    ],
    [
      '@vuepress/google-analytics',
      {
        'ga': 'UA-152792685-1'
      }
    ],
    [
      'vuepress-plugin-google-tag-manager',
      {
        'gtm': 'GTM-5C26B9M'
      }
    ],
    [
      'feed', {
        canonical_base: 'https://ikaruga.org',
        posts_directories: ['/_posts/'],
        count: 20,
        sort: function(posts) {
          return posts.sort(function(a,b){
            return new Date(b.date) - new Date(a.date)
          })
        }
      }
    ],
    [
      'seo', {
        siteTitle: (_, $site) => $site.title,
        title: ($page, $site) => $page.title || $site.title,
        description: $page => $page.frontmatter.description,
        author: (_, $site) => $site.themeConfig.author,
        tags: $page => $page.frontmatter.tags,
        twitterCard: _ => 'summary',
        type: $page => ['articles', 'posts', 'blog'].some(folder => $page.regularPath.startsWith('/' + folder)) ? 'article' : 'website',
        url: (_, $site, path) => ($site.themeConfig.domain || '') + path,
        image: ($page, $site) => ($page.frontmatter.image && (($site.themeConfig.domain || '') + $page.frontmatter.image)) || ($site.themeConfig.domain || '') + "/icon.jpg",
        publishedAt: $page => $page.frontmatter.date && new Date($page.frontmatter.date),
        modifiedAt: $page => $page.lastUpdated && new Date($page.lastUpdated),
      }
    ],
    [
      'social-share', {
        noGlobalSocialShare: true,
      },
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
