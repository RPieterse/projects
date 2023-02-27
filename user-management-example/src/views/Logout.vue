<template>
  <div class="center">
    <div class="mb-6">You are logged out</div>

    <v-btn size="x-large" color="primary" @click="goTo('Dashboard')"
      >Log in</v-btn
    >
  </div>
</template>

<script>
export default {
  methods: {
    goTo(name) {
      return this.$router.push({ name });
    },
  },
};
</script>

<style scoped>
.center {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>