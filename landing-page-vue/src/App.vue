<template>
  <div>
    <header>
      <app-header />
    </header>
    <main>
      <section id="featured">
        <featured />
      </section>
      <section id="cta">
        <cta />
      </section>
      <section id="recent-articles">
        <recent-articles />
      </section>
      <section id="all-articles">
        <all-articles />
      </section>
      <section id="authors">
        <authors />
      </section>
    </main>
    <footer>
      <app-footer />
    </footer>
  </div>
</template>

<script>
import AllArticles from "./components/AllArticles.vue";
import AppFooter from "./components/AppFooter.vue";
import AppHeader from "./components/AppHeader.vue";
import Authors from "./components/Authors.vue";
import Cta from "./components/Cta.vue";
import Featured from "./components/Featured.vue";
import RecentArticles from "./components/RecentArticles.vue";
export default {
  name: "App",
  components: {
    AppHeader,
    Featured,
    Cta,
    AllArticles,
    Authors,
    AppFooter,
    RecentArticles,
  },
};
</script>

<style lang="scss">
@import "./assets/scss/utils.scss";
@import "./assets/scss/global.scss";
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Cabin", sans-serif;
  font-size: 0.9rem;
}
section {
  position: relative;
}

#featured {
  bottom: 200px;
}
#cta {
  bottom: 100px;
}
</style>
