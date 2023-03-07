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

@media screen and (max-width: 1100px) {
  ul {
    display: none;
  }
}
</style>
