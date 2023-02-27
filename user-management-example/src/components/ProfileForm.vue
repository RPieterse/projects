<template>
  <v-form
    :class="`pt-4 ${desktop ? 'px-16' : 'px-2'}`"
    ref="form"
    @submit="handleSubmit"
    lazy-validation
  >
    <div :class="`d-flex w-full align-center my-6 flex-${profilePictureFlexDirection} `">
      <v-avatar size="100" class="mr-6">
        <v-img
          cover
          @error="handleMock"
          width="100px"
          height="100px"
          style="border-radius: 100px"
          :src="
            data.profilePicture ||
            'https://beforeigosolutions.com/wp-content/uploads/2021/12/dummy-profile-pic-300x300-1.png'
          "
          alt="John"
        ></v-img>
      </v-avatar>
      <div :class="`d-flex align-center ${desktop ? '' : 'mt-4'}`">
        <v-btn
          color="primary"
          class="mr-2"
          @click="openFiles"
          append-icon="mdi-camera"
          >Upload Image</v-btn
        >

        <input
          ref="fileInput"
          accept="image/png, image/jpeg, image/bmp"
          type="file"
          hidden
          @change="handleImage"
        />
        <v-btn
          @click="data.profilePicture = ''"
          color="error"
          icon
          variant="text"
          ><v-icon>mdi-delete </v-icon
          ><v-tooltip activator="parent" location="top"
            >Remove Image</v-tooltip
          ></v-btn
        >
      </div>
    </div>
    <v-row>
      <v-col :cols="cols[0]">
        <v-text-field
          v-model="data.fName"
          :rules="nameRules"
          label="First Name"
          required
        ></v-text-field
      ></v-col>
      <v-col :cols="cols[1]"
        ><v-text-field
          v-model="data.lName"
          :rules="nameRules"
          label="Last Name"
          required
        ></v-text-field
      ></v-col>
    </v-row>
    <v-row>
      <v-col :cols="cols[0]">
        <v-text-field
          v-model="data.email"
          :rules="emailRules"
          label="E-mail"
          required
        ></v-text-field
      ></v-col>
      <v-col :cols="cols[1]"
        ><v-select
          v-model="data.status"
          :items="statusLabels"
          item-title="value"
          item-value="id"
          :rules="[(v) => !!v || 'Item is required']"
          label="Status"
          required
        ></v-select
      ></v-col>
    </v-row>

    <v-btn color="success" class="mt-6" type="submit">
      {{ data.id ? "Update Profile" : "Create Profile" }}
    </v-btn>
  </v-form>
</template>
<script>
import { statusLabels } from "@/constants/index";
import { isEmpty } from "lodash";
export default {
  emits: ["onSubmit", "onError"],
  props: {
    profile: {
      type: Object,
      default: () => ({
        fName: "",
        lName: "",
        createdAt: Date.now(),
        email: "",
        status: "",
        id: "",
        profilePicture: "",
      }),
    },
  },
  data() {
    return {
      data: this.profile,
      statusLabels: Object.values(statusLabels),
      valid: true,
      nameRules: [(v) => !!v || "Field is required"],
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
    };
  },
  computed: {
    cols() {
      const { mdAndUp } = this.$vuetify.display;
      return mdAndUp ? [6, 6] : [12, 12];
    },
    profilePictureFlexDirection() {
      const { mdAndUp } = this.$vuetify.display;
      return mdAndUp ? "row" : "column";
    },
  },
  methods: {
    openFiles() {
      this.$refs["fileInput"].click();
    },
    handleMock(el) {
      el.target.src =
        "https://beforeigosolutions.com/wp-content/uploads/2021/12/dummy-profile-pic-300x300-1.png";
    },
    handleImage(e) {
      if (!isEmpty(e.target.files)) {
        this.data.profilePicture = URL.createObjectURL(e.target.files[0]);
      }
    },
    async handleSubmit(e) {
      e.preventDefault();
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        return this.$emit("onSubmit", this.data);
      }
      return this.$emit("onError");
    },
  },
};
</script>
