path = require('path')

module.exports = {
  title: 'ikaruga.org',
  description: 'ikaruga.org',
  dest: path.resolve(__dirname, '../../dist'),
  evergreen: true,
  locales: {
    '/': { lang: 'ja' },
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
  head: [
    ['script', { src: 'https://kit.fontawesome.com/b829815f0b.js', crossorigin: 'anonymous' }]
  ],
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
