<template>
  <div
    class="card"
    :style="{
      backgroundImage: 'url(' + item.img + ')',
    }"
  >
    <div class="card__header">
      <div class="card__header__title">Created {{ createdDate }}</div>
      <div class="card__header__tag">
        <span class="tag tag--dark">most viewed news</span>
      </div>
    </div>
    <div class="card__body">
      <h3 class="card__body__tag">
        {{ item.tag }}
      </h3>
      <h1 class="card__body__title">
        {{ item.title }}
      </h1>
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
  computed: {
    createdDate() {
      return new Date(this.item.createdAt).toDateString();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
@import "@/assets/scss/mixins.scss";
.card {
  justify-content: space-between;
  position: relative;
  cursor: pointer;
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    background: linear-gradient(
      to top,
      rgba($dark, 1) 20%,
      rgba(0, 0, 0, 0) 100%
    );
  }
  &__header {
    z-index: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    &__title {
      font-weight: 600;
      color: $text-light;
    }
  }
  &__body {
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding-inline: 1rem;
    padding-bottom: 1rem;
    &__tag {
      color: $text-light;
    }
    &__title {
      @include truncate(2);
      color: $text-light;
    }
  }
}
</style>
