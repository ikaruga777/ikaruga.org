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
    <div>
       <router-link v-if="hasPrev" :to=prevPost.path>{{ prevPost.title }}</router-link> |
       <router-link v-if="hasNext" :to=nextPost.path> {{ nextPost.title }}</router-link>
    </div>
    <div v-for="(post ,index)  in this.posts()">
      {{ index }} - {{ post.title }}
    </div>
    <div class="comment">
      <Vssue :title="$title" />
    </div>
  </section>
</template>

<script>
import TimeAgo from '../components/TimeAgo';

export default {
  name: "post",
  components: {
    TimeAgo
  },
  computed: {
    hasPrev() {
      console.log('hasprev:' , this.posts().findIndex(post => post.key === this.$page.key) > 0)
      return this.posts().findIndex(post => post.key === this.$page.key) > 0
    },
    hasNext() {
      console.log('hasnext:' , this.posts().findIndex(post => post.key === this.$page.key) < this.posts().length - 1)

      return this.posts().findIndex(post => post.key === this.$page.key) < this.posts().length - 1
    },
    prevPost() {
      console.log("prev",this.posts()[this.posts().findIndex(post => post.key === this.$page.key)-1])

      return this.posts()[this.posts().findIndex(post => post.key === this.$page.key)-1]
    },
    nextPost() {
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
      const posts = this.$site.pages.filter( (page) => {
        return /^_posts/.test(page.relativePath)
      })

      const sortedPosts = posts.sort( (a,b) => {
        const dateA = a.frontmatter.date;
        const dateB = b.frontmatter.date;
        if (dateA < dateB) {
          return 1;
        }
        if (dateA > dateB) {
          return -1;
        }
        return 0;
      })
      return sortedPosts;
    },
    transitionPage(e){
      if (e.code === "ArrowRight") {
        if (this.hasNext) {
          this.transitionNextPost()
        }
      }else if(e.code === "ArrowLeft") {
        if (this.hasPrev) {
          this.transitionPrevPost()
        }
      }
    },
    transitionNextPost() {
      this.$router.push( {path: this.nextPost.path })
    },
    transitionPrevPost() {
      this.$router.push( {path: this.prevPost.path }).catch(err => {})
    }
  }

}
</script>
