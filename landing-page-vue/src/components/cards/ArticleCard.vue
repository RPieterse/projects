<template>
  <div
    :class="{
      card: true,
      dark: dark,
    }"
  >
    <div class="card__image" :style="imgStyle">
      <img :src="item.img" alt="" />
    </div>
    <div class="card__content">
      <div>
        <h3>{{ item.tag }}</h3>
        <h1>{{ item.title }}</h1>
      </div>
      <div class="card__content__description">{{ item.description }}</div>
      <button class="btn btn--secondary">Read more</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {
        return {
          img: "",
          tag: "",
          title: "",
          description: "",
          createdAt: "",
        };
      },
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
.card {
  background: rgb(245, 245, 245);
  &__image {
    width: 100%;
    height: 200px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &__content {
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: space-around;
    padding: 1rem;
    &__description {
      color: $text-dark;
      margin-bottom: 1rem;
    }
    button {
      width: 100%;
    }
  }
}
</style>
