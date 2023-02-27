<template>
  <main>
    <h1>Update profile</h1>

    <profile-form
      :profile="profile"
      @onError="errorSnackBar = true"
      @onSubmit="updateProfile"
    />
    <v-snackbar color="success" v-model="successSnackbar" :timeout="timeout">
      Profile Updated!

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
    ...mapGetters("users", ["getUserById"]),
    profile() {
      return this.getUserById(this.$route.params.id);
    },
  },
  methods: {
    ...mapActions("users", ["updateUser"]),
    updateProfile(profile) {
      this.updateUser({
        ...profile,
      });
      this.successSnackbar = true;
      setTimeout(() => {
        return this.$router.push({ name: "Users" });
      }, 1000);
    },
  },
};
</script>
