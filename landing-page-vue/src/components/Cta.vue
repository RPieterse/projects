<template>
  <div class="cta">
    <div class="cta__text">
      Join our resources and team by subscribing to out email list to get the
      latest updates!
    </div>
    <div class="cta__action">
      <span class="cta__action__input-container"
        ><input
          placeholder="Enter your email address here"
          type="text"
          class="cta__action__input"
        /><button class="cta__action__button btn btn--secondary">
          Subscribe
        </button></span
      >
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import "../assets/scss/variables.scss";
.cta {
  display: flex;
  align-items: center;
  padding-inline: $app-padding;
  justify-content: space-between;
  height: 100%;
  background-color: #f5f5f5;

  @media screen and (max-width: 859px) {
    flex-direction: column;
    justify-content: center;
  }
  .cta__text {
    font-size: 1.5rem;
    font-weight: 500;
    color: #333;
    text-align: left;
    margin-bottom: 1rem;
    flex: 1;
    @media screen and (max-width: 859px) {
      text-align: center;
    }
  }
  .cta__action {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: end;
    padding-left: 15%;
    @media screen and (max-width: 859px) {
      justify-content: center;
      padding-left: 0;
    }
    .cta__action__input-container {
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba($color: $dark, $alpha: 0.5);
      width: 100%;
      border-radius: 25px;
      padding: 3px;
      padding-left: 15px;
      overflow: hidden;
      .cta__action__input {
        width: 100%;
        height: 2.5rem;
        border: none;
        padding: 0 0.5rem;
        font-size: 1rem;
        font-weight: 400;
        color: #333;
        outline: none;
      }
    }
  }
}
</style>
