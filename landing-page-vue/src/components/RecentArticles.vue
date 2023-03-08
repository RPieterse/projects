<template>
  <div class="recent-articles">
    <div class="recent-articles__list">
      <h2>Recent Articles</h2>
      <div v-for="article in articles" :key="article.id">
        <article-summary />
      </div>
    </div>
    <div class="recent-articles__popular">
      <popular-articles />
    </div>
  </div>
</template>

<script>
import ArticleSummary from "./cards/ArticleSummary.vue";
import PopularArticles from "./widgets/PopularArticles.vue";
export default {
  components: { ArticleSummary, PopularArticles },
  name: "RecentArticles",
  data() {
    return {
      articles: [],
    };
  },
};
</script>

<style lang="scss" scoped>
.recent-articles {
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  &__list {
    grid-column: 1 / 3;
  }
  &__popular {
    grid-column: 3 / 4;
  }

  @media screen and (max-width: 859px) {
    grid-template-columns: 1fr;
    &__list {
      grid-column: 1 / 2;
    }
    &__popular {
      grid-column: 1 / 2;
    }
  }
}
</style>
