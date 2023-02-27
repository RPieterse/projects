<template>
  <main>
    <h1>Create a new profile</h1>
    <profile-form @onSubmit="createProfile" @onError="errorSnackBar = true" />
    <v-snackbar color="success" v-model="successSnackbar" :timeout="timeout">
      Profile Created!

      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="successSnackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar color="error" v-model="errorSnackBar" :timeout="timeout">
      Form is invalid!

      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="errorSnackBar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </main>
</template>

<script>
import ProfileForm from "@/components/ProfileForm.vue";
import { mapActions, mapGetters } from "vuex";
export default {
  components: { ProfileForm },
  data() {
    return {
      successSnackbar: false,
      errorSnackBar: false,
    };
  },
  computed: {
    ...mapGetters("users", ["getNewId"]),
  },
  methods: {
    ...mapActions("users", ["createUser"]),
    createProfile(profile) {
      const id = this.getNewId;
      this.createUser({
        ...profile,
        id,
      });
      this.successSnackbar = true;
      setTimeout(() => {
        return this.$router.push({ name: "Users" });
      }, 1000);
    },
  },
};
</script>
