<template>
  <div class="center">
    <div class="mb-6">Page does not exist</div>
    <v-btn color="secondary" size="x-large" @click="goTo('Dashboard')"
      ><span style="color: white">Go to dashboard</span></v-btn
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