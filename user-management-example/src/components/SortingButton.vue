<template>
  <div class="cursor-pointer" @click="sort" v-if="visible">
    <v-icon  v-if="direction == 'desc'">mdi-sort-descending</v-icon>
    <v-icon v-else-if="direction == 'asc'">mdi-sort-ascending</v-icon>
    <v-icon v-else>mdi-sort-variant</v-icon>
  </div>
</template>

<script>
export default {
  emits: ["sort"],
  props: {
    direction: {
      default: "",
      type: String,
    },
    visible: {
      default: true,
      type: Boolean,
    },
  },
  methods: {
    sort() {
      this.$emit("sort");
    },
  },
};
</script>

<style>
</style>