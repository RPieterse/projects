<template>
  <v-chip data-testid="status-indicator" :color="color"  class="px-3">{{ title }}</v-chip>
</template>

<script>
import { statusLabels } from "@/constants/index";
export default {
  props: {
    status: {
      default: "",
      type: String,
    },
  },
  computed: {
    color() {
      return statusLabels[this.status]?.color || "primary";
    },
    title() {
      return statusLabels[this.status]?.value || "Unknown";
    },
  },
};
</script>

<style>
</style>