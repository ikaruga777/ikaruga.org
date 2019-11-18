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
  }
}
