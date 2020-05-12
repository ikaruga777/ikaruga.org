<template>
  <section class="post-view">
    <div class="post-head">
      <h1 class="post-title">
        {{ $page.title }}
      </h1>
      <time-ago
        :last-updated="$page.frontmatter.date || $page.lastUpdated"
        class="post-date"
      />
    </div>
    <Content />
    <social-share :networks="['twitter', 'facebook']" is-plain/>
    <div class="comment">
      <Vssue :title="$title" />
    </div>
    <div>
       <router-link v-if=hasPrev :to=prevPost.path>{{ prevPost.title }}</router-link> |
        <router-link v-if=hasPrev :to=nextPost.path> {{ nextPost.title }}</router-link>
        {{prevPost.title}} -
        {{currentPost.title}} -
        {{nextPost.title}}
    </div>
    <div v-for="(post ,index)  in this.posts()">
      {{index }} - {{ post.title }}
    </div>
  </section>
</template>

<script>
import TimeAgo from '../components/TimeAgo';

export default {
  components: {
    TimeAgo
  },
  computed: {
    hasPrev() {
      return this.posts().findIndex(post => post.key === this.$page.key) > 0
    },
    hasNext() {
      return this.posts().findIndex(post => post.key === this.$page.key) < this.posts().length - 1
    },
    prevPost() {
      // console.log(this.posts())
      // console.log(this.posts().findIndex(post => post.key === this.$page.key))
      console.log("prev",this.posts()[this.posts().findIndex(post => post.key === this.$page.key)-1])

      return this.posts()[this.posts().findIndex(post => post.key === this.$page.key)-1]
    },
    nextPost() {
//       console.log(this.posts())
//       console.log(this.posts().findIndex(post => post.key === this.$page.key))
      console.log("next",this.posts()[this.posts().findIndex(post => post.key === this.$page.key)+1])

      return this.posts()[this.posts().findIndex(post => post.key === this.$page.key)+1]
    },
    currentPost(){
       console.log("current",this.posts()[this.posts().findIndex(post => post.key === this.$page.key)])

      return this.posts()[this.posts().findIndex(post => post.key === this.$page.key)]
    }
  },
  mounted: function(){
    console.log(this.posts())
    document.addEventListener('keydown', this.transitionPage, false);
  },
  beforeDestroy: function() {
    document.removeEventListener('keydown', this.transitionPa, false);
  },
  methods: {
    posts() {
      const postReg = /^_posts\//
      return this.$site.pages.filter( (page) => {
        return /^_posts/.test(page.relativePath)
      })
    },
    transitionPage(e){
      if (e.code === "ArrowRight") {
        this.transitionNextPost()
      }else if(e.code === "ArrowLeft") {
        this.transitionPrevPost()
      }
    },
    transitionNextPost() {
      this.$router.push( {path: this.nextPost.link })
    },
    transitionPrevPost() {
      this.$router.push( {path: this.prevPost.link }).catch(err => {})
    }
  }

}
</script>
