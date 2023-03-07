<template>
  <div class="card">
    <div class="card__header">
      <div class="card__header__title"></div>
      <div class="card__header__tag">
        <span class="tag tag--light">Youtube channel</span>
      </div>
    </div>
    <div class="card__body">
      <div class="card__body__image">
        <img :src="item.img" alt="youtube preview image" />
        <i class="fas fa-play-circle"></i>
      </div>
      <div class="card__body__text">
        {{ item.description }}
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
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    &__title {
      font-size: 1.5rem;
      font-weight: 600;
    }
  }
  &__body {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    gap: 16px;
    padding-inline: 1rem;
    padding-bottom: 1rem;
    &__image {
      position: relative;
      width: 100%;
      height: 180px;
      overflow: hidden;
      border-radius: 10px;
      border: 3px solid $light;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      i {
        @include absolute-center;
        font-size: 3rem;
        color: $primary;
        transition: all 0.3s ease-in-out;
        color: $text-light;
        cursor: pointer;
        &::after {
          content: "";
          @include absolute-center;
          width: 60px;
          height: 60px;
          border-radius: 100%;
          border: 1px solid $light;
        }
      }
    }
    &__text {
      @include truncate(2);
      font-size: 1.2rem;
      font-weight: 400;
      color: $text-light;
    }
  }
}
</style>
