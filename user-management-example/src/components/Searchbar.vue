<template>
  <v-text-field
    @input="updateValue"
    v-model="message"
    label="Search Profiles"
    type="text"
    density="comfortable"
    style="max-width: 400px"
    variant="outlined"
  >
    <template v-slot:append-inner>
      <v-fade-transition leave-absolute>
        <v-progress-circular
          v-if="loading"
          color="info"
          indeterminate
          size="24"
        ></v-progress-circular>

        <v-icon
          v-else-if="!loading && message == ''"
          icon="mdi-text-search-variant"
        ></v-icon>
        <v-icon @click="clearSearch" v-else icon="mdi-close-circle"></v-icon>
      </v-fade-transition>
    </template>
  </v-text-field>
</template>

<script>
export default {
  prop: {
    modelValue: {
      default: "",
      type: String,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      loading: false,
      message: "",
    };
  },
  methods: {
    clearSearch() {
      this.message = "";
      this.$emit("update:modelValue", "");
    },
    updateValue(e) {
      this.$emit("update:modelValue", e.target.value);
    },
  },
};
</script>

<style>
</style>