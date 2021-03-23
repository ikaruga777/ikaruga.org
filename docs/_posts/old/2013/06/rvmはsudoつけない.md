---
title: rvmはsudoつけない
date: 2013-06-27 22:55:00 +0900
feed:
  enable: true
layout: post
---
<p>逆に言えばsudoつけなければrvm内のgemは消せる。(すごくてきとう</p>    <h2>なにがおきたか</h2>    <p>      railsプロジェクトのディレクトリ内で$herokuうったらrvmディレクトリ内のherokuがお怒りになられた。      プロジェクトディレクトリ外で$heroku打つと普通にうごいた。    </p>    <h2>なんで</h2>    <p>herokuがrvm内とsystem(rvm外)であっちゃこっちゃしてた、と思う。</p>    <h2>どーした</h2>    <p>$gem uninstall heroku をプロジェクトディレクトリでいれた。</p>    <h2>どーなった</h2>    <p>無事プロジェクトディレクト内で$herokuが使えるようになった。</p>    <div id="footer">      <span id="timestamp"> June 27th, 2013 10:55pm </span>      <span class="tag">UVB_76noBenkyou</span>    </div>
