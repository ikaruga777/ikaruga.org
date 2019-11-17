module.exports = {
  title: 'Re:醤油の一升瓶じゃあ戦えない',
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
      YOUR_SITE_NAME: 'https://ikaruga.org',            
    }    
  }
}
