<template>
  <div id="app">
    <div id="nav">
      <sitemap/>
    </div>
    <router-view/>
  </div>
</template>

<script>
import Sitemap from './components/Sitemap.vue'

export default {
  components: {
    Sitemap
  }

}
</script>
