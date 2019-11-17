path = require('path')

module.exports = {
  title: 'ikaruga.org',
  description: '普段の',
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
      "twitter": "https://twitter.com/UVB_76",
      "flickr": "https://www.flickr.com/photos/uvb_76/",
    }
  }
}
