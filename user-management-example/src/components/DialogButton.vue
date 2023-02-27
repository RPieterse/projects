<template>
  <div class="text-center">
    <v-btn :icon="icon" :color="color" :variant="variant" :size="size">
      <slot name="btn-content"></slot>

      <v-dialog width="600px" v-model="dialog" activator="parent">
        <v-card>
          <v-card-text class="text-center">
            {{ message }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" variant="outlined" @click="success">{{ buttonPositive }}</v-btn>
            <v-btn color="primary"  variant="outlined" @click="closeDialog">Close</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-btn>
  </div>
</template>

<script>
export default {
  emits: ["onSuccess", "onCancel"],
  props: {
    color: {
      default: "primary",
      type: String,
    },
    variant: {
      default: "outlined",
      type: String,
    },
    size: {
      default: "x-small",
      type: String,
    },
    message: {
      default: "",
      type: String,
    },
    buttonPositive: {
      default: "I understand",
      type: String,
    },
    icon: {
      default: true,
      type: Boolean,
    },
  },
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    closeDialog() {
      this.dialog = false;
      this.$emit("onCancel");
    },
    success() {
      this.dialog = false;
      this.$emit("onSuccess");
    },
  },
};
</script>

<style>
</style>