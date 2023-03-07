<template>
  <div class="bg-primary header-size">
    <appbar />
  </div>
</template>

<script>
import Appbar from "@/components/navigation/Appbar.vue";
export default {
  components: { Appbar },
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/variables.scss";

div:first-child {
  height: 400px;
  padding-inline: $app-padding;
}
</style>
