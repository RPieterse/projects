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
        <div class="card__content__tag">{{ item.tag }}</div>
        <div class="card__content__title">{{ item.title }}</div>
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
    dark: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
.card {
  background: $light;
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
    &__tag {
      font-size: 0.8rem;
      color: $primary;
      font-weight: 600;
      text-transform: uppercase;
    }
    &__title {
      font-size: 1.4rem;
      font-weight: 600;
      margin: 0.5rem 0;
    }
    &__description {
      font-size: 0.9rem;
      color: $text-secondary;
      margin-bottom: 1rem;
    }
    button {
      width: 100%;
    }
  }
}
</style>
