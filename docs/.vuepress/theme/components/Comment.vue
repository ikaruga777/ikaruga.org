<template>
  <div id="giscus-comment"></div>
</template>

<script>
export default {
  mounted() {
    let scriptEl = document.createElement('script');
    const attributes = {
      "src": "https://giscus.app/client.js",
      "data-repo": "ikaruga777/ikaruga.org",
      "data-repo-id": "MDEwOlJlcG9zaXRvcnkyMjIyMDE0NjE=",
      "data-category": "Comments",
      "data-category-id": "DIC_kwDODT6Gdc4CTdvt",
      "data-mapping": "pathname",
      "data-strict": "0",
      "data-reactions-enabled": "1",
      "data-emit-metadata": "0",
      "data-input-position": "top",
      "data-theme": "light",
      "data-lang": "ja",
      "data-loading": "lazy",
      "crossorigin": "anonymous",
      "async": "true"
    }
    Object.entries(attributes).forEach(attribute => {
      scriptEl.setAttribute(attribute[0], attribute[1]);
    });
    document.getElementById('giscus-comment').appendChild(scriptEl);
  }
}
</script>
