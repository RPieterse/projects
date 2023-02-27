<template>
  <v-card class="mx-auto mb-4" variant="outlined">
    <v-card-item>
      <div>
        <div class="text-overline mb-1">
          <status-indicator :status="profile.status" />
        </div>
        <div class="d-flex align-center">
          <v-avatar color="primary" class="mr-3"
            ><v-img
              cover
              @error="handleMock"
              :src="
                profile.profilePicture ||
                'https://beforeigosolutions.com/wp-content/uploads/2021/12/dummy-profile-pic-300x300-1.png'
              "
          /></v-avatar>
          <div>
            <div class="text-h6 mb-1">
              {{ profile.fName || "" }} {{ profile.lName || "" }}
            </div>
            <div class="text-caption">{{ profile.email }}</div>
          </div>
        </div>
      </div>
    </v-card-item>

    <v-card-actions>
        {{ moment(profile.createdAt).format("DD/MM/YYYY") }}<v-spacer></v-spacer>
      <v-btn
        variant="outlined"
        color="primary"
        icon
        @click="goToProfile"
        size="x-small"
        class="mr-4"
      >
        <v-tooltip activator="parent" location="top">Edit</v-tooltip>
        <v-icon>mdi-pencil</v-icon>
      </v-btn>

      <dialog-button
        :icon="true"
        :message="`You are about to permanently delete ${
          (profile.fName || '') + ' ' + (profile.lName || '')
        }`"
        color="error"
        @onSuccess="handleDelete"
      >
        <template #btn-content>
          <v-icon>mdi-delete</v-icon>
          <v-tooltip activator="parent" location="top">Delete</v-tooltip>
        </template>
      </dialog-button>
    </v-card-actions>
  </v-card>
</template>

<script>
import DialogButton from "./DialogButton.vue";
import StatusIndicator from "./StatusIndicator.vue";
import moment from 'moment'
export default {
  components: { StatusIndicator, DialogButton },
  emits: ["handleDelete", "goToProfile", 'handleMock'],
  props: {
    profile: {
      default: () => {},
      type: Object,
    },
  },
  methods: {
    moment,
    goToProfile() {
      this.$emit("goToProfile");
    },
    handleDelete() {
      this.$emit("handleDelete");
    },
    handleMock(){
        this.$emit('handleMock')
    }
  },
};
</script>
