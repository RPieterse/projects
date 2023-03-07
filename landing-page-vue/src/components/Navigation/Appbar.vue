<template>
  <nav>
    <img :src="logo" alt="logo" />
    <ul>
      <li v-for="item in items" :key="item.id">
        <a class="btn" :href="item.link"
          >{{ item.title }}
          <i v-show="item.dropdown" class="fas fa-chevron-down"></i
        ></a>
      </li>

      <button class="btn btn--primary">Contact us</button>
    </ul>
    <span><i class="fas fa-bars"></i></span>
  </nav>
</template>

<script>
import Logo from "@/assets/img/logo-white.png";
export default {
  name: "Appbar",
  data() {
    return {
      logo: Logo,
      items: [
        { id: 1, title: "What we do", link: "#", dropdown: true },
        { id: 2, title: "Portfolio", link: "#" },
        { id: 3, title: "Resources", link: "#" },
        { id: 4, title: "About", link: "#", dropdown: true },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
@import "@/assets/scss/mixins.scss";
nav {
  height: $nav-height;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
img {
  height: $nav-height;
}
ul {
  display: flex;
  align-items: center;
  list-style: none;
  li,
  button {
    margin-inline: 20px;
  }
}

span {
  display: none;
  i {
    cursor: pointer;
    position: relative;
    color: white;

    &:hover {
      color: $primary;
      z-index: 1;
      &::after {
        content: "";
        @include absolute-center;
        width: 3rem;
        height: 3rem;
        background: white;
        transition: all 0.3s ease;
        border-radius: 50%;
        z-index: -1;
      }
    }
  }
}

@media screen and (max-width: 1100px) {
  ul {
    display: none;
  }
  span {
    display: block;
  }
}
</style>
