<template>
  <v-card class="mx-auto mb-4" variant="outlined">
    <v-card-item>
      <div>
        <div class="text-overline mb-1">{{ item.action }}</div>
        <div class="text-h6 mb-1">
          {{ item.profileName }}
        </div>
        <div class="text-caption">Profile ID: {{ item.profileId }}</div>
      </div>
      <v-card-actions>
        <v-spacer></v-spacer>
        {{ moment(item.createdAt).format("DD/MM/YYYY") }}
      </v-card-actions>
    </v-card-item>
  </v-card>
</template>

<script>
import moment from "moment";
export default {
  props: {
    item: {
      default: () => {},
      type: Object,
    },
  },
  methods: {
    moment,
  },
};
</script>
