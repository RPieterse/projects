<template>
  <div class="grid">
    <div
      class="card"
      :style="{
        backgroundImage: `url(${items[0].img})`,
      }"
    >
      <div class="container">
        <div class="tag">{{ items[0].tag }}</div>
        <div class="title">{{ items[0].title }}</div>
        <div class="description">{{ items[0].description }}</div>
        <button class="btn btn--secondary">Read more</button>
      </div>
    </div>
    <div class="card">
      <div class="tag">
        <span>{{ items[1].tag }}</span>
      </div>
      <div class="img-container">
        <img :src="items[1].img" alt="preview" />

        <i class="fas fa-play-circle"></i>
      </div>
      <div class="description">{{ items[1].description }}</div>
    </div>
    <div
      class="card"
      :style="{
        backgroundImage: `url(${items[2].img})`,
      }"
    >
      <div class="tag-container">
        <span class="date">{{
          new Date(items[2].createdAt).toDateString()
        }}</span
        ><span class="tag">Most Viewed News</span>
      </div>
      <div class="title-container">
        <div class="title">{{ items[2].tag }}</div>
        <div class="description">{{ items[2].title }}</div>
      </div>
    </div>
    <div
      class="card"
      :style="{
        backgroundImage: `url(${items[3].img})`,
      }"
    ></div>
    <div class="card">
      <div class="tag">
        <span>{{ items[4].tag }}</span>
      </div>
      <div class="img-container">
        <img :src="items[4].img" alt="preview" />

        <i class="fas fa-play-circle"></i>
      </div>
      <div class="description">{{ items[4].description }}</div>
    </div>
    <div
      class="card"
      :style="{
        backgroundImage: `url(${items[5].img})`,
      }"
    >
      <div class="container">
        <div class="tag">{{ items[5].tag }}</div>
        <div class="title">{{ items[5].title }}</div>
        <div class="description">{{ items[5].description }}</div>
        <button class="btn btn--secondary">Read more</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          title: "Startup Success Stories and Lessons Learned",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut aliquam aliquam. Sed euismod, nunc ut aliquam aliquam, nunc nisl aliquet mauris. Sed euismod, nunc ut aliquam aliquam, nunc nisl aliquet mauris, ut aliquet nunc lorem quis nunc.",
          img: "https://cdn.pixabay.com/photo/2015/10/30/20/13/sunrise-1014712_960_720.jpg",
          link: "#",
          tag: "Startup stories",
          createdAt: new Date("2023-01-28"),
          author: {
            name: "John Wick",
            profileImage:
              "https://cdn.pixabay.com/photo/2016/11/18/19/07/happy-1836445_960_720.jpg",
          },
        },
        {
          title: "Startup Success Stories and Lessons Learned",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut aliquam aliquam, nunc nisl aliquet mauris, ut aliquet nunc lorem quis nunc. Sed euismod, nunc ut aliquam aliquam, nunc nisl aliquet mauris, ut aliquet nunc lorem quis nunc.",
          img: "https://cdn.pixabay.com/photo/2013/07/18/20/26/sea-164989_960_720.jpg",
          link: "#",
          tag: "Startup stories",
          createdAt: new Date("2023-01-28"),
          author: {
            name: "John Wick",
            profileImage:
              "https://cdn.pixabay.com/photo/2016/11/18/19/07/happy-1836445_960_720.jpg",
          },
        },
        {
          title: "Startup Success Stories and Lessons Learned",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut aliquam aliquam, nunc nisl aliquet mauris, ut aliquet nunc lorem quis nunc. Sed euismod, nunc ut aliquam aliquam, nunc nisl aliquet mauris, ut aliquet nunc lorem quis nunc.",
          img: "https://cdn.pixabay.com/photo/2015/01/08/18/28/startup-593344_960_720.jpg",
          link: "#",
          tag: "Startup stories",
          createdAt: new Date("2023-01-28"),
          author: {
            name: "John Wick",
            profileImage:
              "https://cdn.pixabay.com/photo/2016/11/18/19/07/happy-1836445_960_720.jpg",
          },
        },
        {
          title: "Startup Success Stories and Lessons Learned",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut aliquam aliquam, nunc nisl aliquet mauris, ut aliquet nunc lorem quis nunc. Sed euismod, nunc ut aliquam aliquam, nunc nisl aliquet mauris, ut aliquet nunc lorem quis nunc.",
          img: "https://cdn.pixabay.com/photo/2017/09/18/15/38/moon-2762111_960_720.jpg",
          link: "#",
          tag: "Startup stories",
          createdAt: new Date("2023-01-28"),
          author: {
            name: "John Wick",
            profileImage:
              "https://cdn.pixabay.com/photo/2016/11/18/19/07/happy-1836445_960_720.jpg",
          },
        },
        {
          title: "Startup Success Stories and Lessons Learned",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut aliquam aliquam, nunc nisl aliquet mauris, ut aliquet nunc lorem quis nunc. Sed euismod, nunc ut aliquam aliquam, nunc nisl aliquet mauris, ut aliquet nunc lorem quis nunc.",
          img: "https://cdn.pixabay.com/photo/2013/08/11/19/46/coffee-171653_960_720.jpg",
          link: "#",
          tag: "Startup stories",
          createdAt: new Date("2023-01-28"),
          author: {
            name: "John Wick",
            profileImage:
              "https://cdn.pixabay.com/photo/2016/11/18/19/07/happy-1836445_960_720.jpg",
          },
        },
        {
          title: "Startup Success Stories and Lessons Learned",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut aliquam aliquam, nunc nisl aliquet mauris, ut aliquet nunc lorem quis nunc. Sed euismod, nunc ut aliquam aliquam, nunc nisl aliquet mauris, ut aliquet nunc lorem quis nunc.",
          img: "https://cdn.pixabay.com/photo/2015/01/08/18/29/entrepreneur-593358_960_720.jpg",
          link: "#",
          tag: "Startup stories",
          createdAt: new Date("2023-01-28"),
          author: {
            name: "John Wick",
            profileImage:
              "https://cdn.pixabay.com/photo/2016/11/18/19/07/happy-1836445_960_720.jpg",
          },
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
@import "@/assets/scss/mixins.scss";
div.grid {
  position: relative;
  bottom: 200px;
  padding-inline: $app-padding;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(10, 1fr);
  gap: 20px; /* add gap between cells */
  height: 900px;

  div.card {
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
    background: no-repeat;
    position: relative;
    background-position: center bottom;
    background-size: cover;

    /** Column 1 */
    &:nth-child(1) {
      grid-row: 1 / span 7;
      position: relative;

      .container {
        @include SpaceAround;
        position: absolute;
        bottom: 0;
        left: 0;
        border-radius: 0;
        right: 0;
        height: 55.5%;
        background-color: rgb(249, 249, 249);
        color: #f1f1f1;
        padding: 20px;
        color: #000;
        .tag {
          text-transform: uppercase;
          border-radius: 5px;
          font-size: 16px;
        }
        .title {
          font-size: 26px;
          font-weight: 600;
          margin: 10px 0;
        }
        .description {
          font-size: 16px;
          margin: 10px 0;
        }
        button {
          width: 100%;
        }
      }
    }
    &:nth-child(2) {
      grid-row: 8 / span 9;
      background: linear-gradient(to top right, $primary-light 75%, $primary);
      color: white;
      padding-inline: 26px;
      padding-block: 16px;
      @include SpaceAround;
      .img-container {
        height: 60%;
        width: 100%;
        position: relative;
        img {
          border-radius: 16px;
          border: 3px solid white;
          height: 100%;
          width: 100%;
          object-fit: cover;
          align-self: center;
        }
        i {
          position: absolute;
          top: 50%;
          left: 50%;
          font-size: 3rem;
          cursor: pointer;
          transform: translate(-50%, -50%);
        }
      }

      .tag {
        display: flex;
        justify-content: end;
        span {
          text-transform: uppercase;
          border-radius: 5px;
          font-size: 12px;
          text-align: right;
          position: relative;
          background: rgba(255, 255, 255, 0.25);
          padding: 0.2rem 0.4rem;
        }
      }
      .description {
        @include LineClamp2;
      }
    }

    /** Column 2 */
    &:nth-child(3) {
      grid-row: 1 / span 4;
      @include SpaceAround;
      justify-content: space-between;
      padding: 18px;
      color: white;
      .tag-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .date {
          font-size: 12px;
        }
        .tag {
          text-transform: uppercase;
          border-radius: 5px;
          font-size: 12px;
          text-align: right;
          position: relative;
          background: rgba(0, 0, 0, 0.25);
          padding: 0.2rem 0.4rem;
        }
      }
      .title-container {
        .title {
          font-size: 14px;
          margin: 10px 0;
        }
        .description {
          @include LineClamp2;
          font-size: 2rem;
        }
      }
    }
    &:nth-child(4) {
      grid-row: 5 / span 12;
    }

    /** Column 3 */
    &:nth-child(5) {
      grid-row: 1 / span 5;
      background: $primary-light;
      background: linear-gradient(to top right, $primary, $primary-light 75%);
      color: white;
      padding-inline: 26px;
      padding-block: 16px;
      @include SpaceAround;
      .img-container {
        height: 60%;
        width: 100%;
        position: relative;
        img {
          border-radius: 16px;
          border: 3px solid white;
          height: 100%;
          width: 100%;
          object-fit: cover;
          align-self: center;
        }
        i {
          position: absolute;
          top: 50%;
          left: 50%;
          font-size: 3rem;
          cursor: pointer;
          transform: translate(-50%, -50%);
        }
      }

      .tag {
        display: flex;
        justify-content: end;
        span {
          text-transform: uppercase;
          border-radius: 5px;
          font-size: 12px;
          text-align: right;
          position: relative;
          background: rgba(255, 255, 255, 0.25);
          padding: 0.2rem 0.4rem;
        }
      }
      .description {
        @include LineClamp2;
      }
    }
    &:nth-child(6) {
      grid-row: 6 / span 11;
      position: relative;
      background-position: bottom center;

      .container {
        @include SpaceAround;
        position: absolute;
        bottom: 0;
        left: 0;
        border-radius: 0;
        right: 0;
        height: 55.5%;
        background-color: rgb(243, 243, 243);
        color: #f1f1f1;
        padding: 20px;
        color: black;
        .tag {
          text-transform: uppercase;
          border-radius: 5px;
          font-size: 16px;
        }
        .title {
          font-size: 26px;
          font-weight: 600;
          margin: 10px 0;
        }
        .description {
          font-size: 16px;
          margin: 10px 0;
        }
      }
    }
  }
}
</style>
