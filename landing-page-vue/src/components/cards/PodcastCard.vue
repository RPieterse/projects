<template>
  <div class="card">
    <div class="card__header">
      <div class="card__header__title">PD-03</div>
      <div class="card__header__tag">
        <span class="tag tag--light">podcast</span>
      </div>
    </div>
    <h2 class="card__content">{{ item.description }}</h2>
    <div class="card__footer">
      <div class="card__footer__author">
        <h3 class="card__footer__author__title">artist</h3>
        <h2 class="card__footer__author__name">{{ item.author.name }}</h2>
      </div>
      <div class="card__footer__author_image">
        <img :src="item.author.profileImage" alt="author image" />
      </div>
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
@import "@/assets/scss/mixins.scss";
.card {
  background: linear-gradient(
    to top right,
    $primary-light 50%,
    $accent 75%,
    $primary-light 100%
  );
  cursor: pointer;
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    &__title {
      font-size: 1.5rem;
      font-weight: 600;
      color: $text-light;
    }
  }
  &__content {
    padding: 1rem;
    color: $text-light;
  }
  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    &__author {
      display: flex;
      flex-direction: column;
      gap: 6px;
      &__title {
        color: rgba($color: $text-light, $alpha: 0.8);
      }
      &__name {
        color: $text-light;
      }
    }
    &__author_image {
      width: 4rem;
      height: 4rem;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}
</style>
