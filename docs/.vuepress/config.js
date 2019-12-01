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
      "Me": './me',
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
  ]
}
