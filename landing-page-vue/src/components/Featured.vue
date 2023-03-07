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
  grid-gap: 1rem;
  padding-inline: $app-padding;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(4, 1fr);

  div:nth-child(1) {
    grid-row: 1/8;
  }
  div:nth-child(4) {
    grid-row: 8/9;
  }

  div:nth-child(2) {
    grid-row: 1/4;
  }
  div:nth-child(5) {
    grid-row: 4/9;
  }

  div:nth-child(3) {
    grid-row: 1/5;
  }
  div:nth-child(6) {
    grid-row: 5/9;
  }

  @media (max-width: 1290px) {
    grid-template-columns: repeat(2, 1fr);

    div:nth-child(1) {
      grid-row: span 4;
    }
    div:nth-child(4) {
      grid-row: 6/8;
      grid-column: 1/-1;
    }

    div:nth-child(2) {
      grid-row: span 2;
    }
    div:nth-child(5) {
      grid-row: auto;
    }

    div:nth-child(3) {
      grid-row: span 2;
    }
    div:nth-child(6) {
      grid-row: auto;
    }
  }

  @media (max-width: 859px) {
    grid-template-columns: repeat(1, 1fr);
    div:nth-child(1) {
      grid-row: span 4;
    }
    div:nth-child(4) {
      grid-row: auto;
    }

    div:nth-child(2) {
      grid-row: span 2;
    }
    div:nth-child(5) {
      grid-row: auto;
    }

    div:nth-child(3) {
      grid-row: span 2;
    }
    div:nth-child(6) {
      grid-row: auto;
    }
  }
}
</style>
