<template>
  <div class="grid">
    <article-card :item="items[0]" />
    <most-viewed-card :item="items[1]" />
    <podcast-card :item="items[2]" />
    <youtube-card :item="items[4]" />
    <article-card :item="items[3]" />
    <article-card :item="items[5]" />
  </div>
</template>

<script>
import ArticleCard from "./cards/ArticleCard.vue";
import MostViewedCard from "./cards/MostViewedCard.vue";
import PodcastCard from "./cards/PodcastCard.vue";
import YoutubeCard from "./cards/YoutubeCard.vue";
export default {
  components: { ArticleCard, YoutubeCard, MostViewedCard, PodcastCard },
  data() {
    return {
      items: require("@/data/featured.json"),
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;
  margin: 0 auto;
  padding-inline: $app-padding;
  max-height: 1000px;
  @media only screen and (max-width: 756px) {
    grid-template-columns: repeat(1, 1fr);
  }
  @media only screen and (max-width: 1560px) {
    grid-template-columns: repeat(2, 1fr);
  }

  div:nth-child(1) {
    grid-row: 1 / 4;
  }
  div:nth-child(4) {
    grid-row-start: span 2;
  }

  div:nth-child(2) {
    grid-row-start: span 1;
  }
  div:nth-child(5) {
    grid-row: 2 / 6;
  }

  div:nth-child(3) {
    grid-row-start: span 2;
  }
  div:nth-child(6) {
    grid-row: 3 / 6;
  }
}
</style>
