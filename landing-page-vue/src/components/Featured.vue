<template>
  <div class="grid">
    <div
      :style="{
        backgroundImage: `url(${items[0].img})`,
      }"
    ></div>
    <div
      :style="{
        backgroundImage: `url(${items[1].img})`,
      }"
    ></div>
    <div
      :style="{
        backgroundImage: `url(${items[2].img})`,
      }"
    ></div>
    <div
      :style="{
        backgroundImage: `url(${items[3].img})`,
      }"
    ></div>
    <div
      :style="{
        backgroundImage: `url(${items[4].img})`,
      }"
    ></div>
    <div
      :style="{
        backgroundImage: `url(${items[5].img})`,
      }"
    ></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          title: "",
          description: "",
          img: "https://cdn.pixabay.com/photo/2023/02/14/18/55/flowers-7790227_960_720.jpg",
          link: "",
          tag: "",
          createdAt: "",
          author: {
            name: "",
            profileImage: "",
          },
        },
        {
          title: "",
          description: "",
          img: "https://cdn.pixabay.com/photo/2013/08/20/15/47/poppies-174276_960_720.jpg",
          link: "",
          tag: "",
          createdAt: "",
          author: {
            name: "",
            profileImage: "",
          },
        },
        {
          title: "",
          description: "",
          img: "https://cdn.pixabay.com/photo/2014/09/27/17/35/dandelion-463928_960_720.jpg",
          link: "",
          tag: "",
          createdAt: "",
          author: {
            name: "",
            profileImage: "",
          },
        },
        {
          title: "",
          description: "",
          img: "https://cdn.pixabay.com/photo/2014/09/14/18/04/dandelion-445228_960_720.jpg",
          link: "",
          tag: "",
          createdAt: "",
          author: {
            name: "",
            profileImage: "",
          },
        },
        {
          title: "",
          description: "",
          img: "https://cdn.pixabay.com/photo/2013/08/11/19/46/coffee-171653_960_720.jpg",
          link: "",
          tag: "",
          createdAt: "",
          author: {
            name: "",
            profileImage: "",
          },
        },
        {
          title: "",
          description: "",
          img: "https://cdn.pixabay.com/photo/2015/06/24/01/15/coffee-819362_960_720.jpg",
          link: "",
          tag: "",
          createdAt: "",
          author: {
            name: "",
            profileImage: "",
          },
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
div.grid {
  position: relative;
  bottom: 200px;
  padding-inline: $app-padding;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(10, 1fr);
  gap: 20px; /* add gap between cells */
  height: 750px;

  div {
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
    background-position: center center;
    background: no-repeat;
    position: relative;
    background-size: cover;
  }

  /** Column 1 */
  div:nth-child(1) {
    grid-row: 1 / span 6;
  }
  div:nth-child(2) {
    grid-row: 7 / span 10;
  }

  /** Column 2 */
  div:nth-child(3) {
    grid-row: 1 / span 4;
  }
  div:nth-child(4) {
    grid-row: 5 / span 12;
  }

  /** Column 3 */
  div:nth-child(5) {
    grid-row: 1 / span 5;
  }
  div:nth-child(6) {
    grid-row: 6 / span 11;
  }
}
</style>
