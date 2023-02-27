<template>
  <v-card rounded="12" style="width: -webkit-fill-available" class=" mx-1 pa-6">
    <div class="d-flex align-center">
      <slot name="icon-left"></slot>
      <div>
        <v-card-title class="text-h4">{{ amount }}</v-card-title>

        <v-card-subtitle>{{ subtitle }}</v-card-subtitle>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  props: {
    title: {
      default: "Statistic",
      type: String,
    },
    subtitle: {
      default: "Description about statistic",
      type: String,
    },
    amount: {
      default: 50,
      type: Number,
    },
  },
};
</script>

<style></style>