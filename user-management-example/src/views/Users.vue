<template>
  <main class="d-flex flex-column">
    <h1>All users</h1>

    <v-card class="w-full pa-4 mt-4">
      <div class="d-flex justify-end">
        <searchbar v-model="searchValue" />
      </div>
      <custom-table
        v-if="desktop"
        :headers="headers"
        @handleSort="applySorting"
      >
        <template #rows>
          <tr v-for="item in filteredRows.results" :key="item.id">
            <td class="text-left">{{ item.id }}</td>
            <td class="text-center">
              <v-avatar color="primary"
                ><v-img
                  cover
                  @error="handleMock(item)"
                  :src="
                    item.profilePicture ||
                    'https://beforeigosolutions.com/wp-content/uploads/2021/12/dummy-profile-pic-300x300-1.png'
                  "
              /></v-avatar>
            </td>
            <td class="text-center">
              {{ (item.fName || "") + " " + (item.lName || "") }}
            </td>

            <td class="text-center">{{ item.email }}</td>

            <td class="d-flex justify-center align-center">
              <status-indicator :status="item.status" />
            </td>
            <td class="text-center">
              {{ moment(item.createdAt).format("DD/MM/YYYY") }}
            </td>

            <td class="text-center">
              <div class="d-flex justify-center align-center">
                <v-btn
                  variant="outlined"
                  color="primary"
                  icon
                  @click="goToProfile(item.id)"
                  size="x-small"
                  class="mr-4"
                >
                  <v-tooltip activator="parent" location="top">Edit</v-tooltip>
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>

                <dialog-button
                  :icon="true"
                  :message="`You are about to permanently delete ${
                    (item.fName || '') + ' ' + (item.lName || '')
                  }`"
                  color="error"
                  @onSuccess="handleDelete(item.id)"
                >
                  <template #btn-content>
                    <v-icon>mdi-delete</v-icon>
                    <v-tooltip activator="parent" location="top"
                      >Delete</v-tooltip
                    >
                  </template>
                </dialog-button>
              </div>
            </td>
          </tr>
        </template>
      </custom-table>
      <div v-else>
        <profile-card
          v-for="profile in filteredRows.results"
          :key="profile.id"
          :profile="profile"
          @handleMock="handleMock(profile)"
          @goToProfile="goToProfile(profile.id)"
          @handleDelete="handleDelete(profile.id)"
        />
      </div>
    </v-card>
    <div>
      <v-pagination
        v-model="page"
        class="my-4"
        :length="totalPages"
        :total-visible="desktop ? 7 : 5"
      ></v-pagination>
    </div>
  </main>
</template>

<script>
import CustomTable from "@/components/CustomTable.vue";
import Searchbar from "@/components/Searchbar.vue";
import { mapActions, mapGetters } from "vuex";
import DialogButton from "@/components/DialogButton.vue";
import StatusIndicator from "@/components/StatusIndicator.vue";
import moment from "moment";
import ProfileCard from '@/components/ProfileCard.vue'
const PAGE_SIZE = 10;

export default {
  components: { CustomTable, Searchbar, DialogButton, StatusIndicator, ProfileCard },
  data() {
    return {
      headers: [
        { title: "#ID", sortId: "id", sortDirection: "" },
        { title: "Profile Picture", sortId: "", sortDirection: "" },
        { title: "Name", sortId: "fName", sortDirection: "" },
        { title: "Email Address", sortId: "email", sortDirection: "" },
        { title: "Status", sortId: "status", sortDirection: "" },
        { title: "Created", sortId: "createdAt", sortDirection: "asc" },
        { title: "Actions", sortId: "", sortDirection: "" },
      ],
      sortingDetails: { id: "createdAt", direction: "asc" },
      searchValue: "",
      page: 1,
    };
  },
  methods: {
    moment,
    handleMock(profile) {
      this.updateUser({ ...profile, profilePicture: "" });
    },
    getInitials(fName, lName) {
      return fName.split("")[0] + lName.split("")[0];
    },
    applySorting(id) {
      this.headers = this.headers.map((item) => {
        if (item.sortId == id) {
          if (item.sortDirection == "") {
            this.sortingDetails = { id, direction: "desc" };
            return {
              ...item,
              sortDirection: "desc",
            };
          }
          if (item.sortDirection == "desc") {
            this.sortingDetails = { id, direction: "asc" };
            return {
              ...item,
              sortDirection: "asc",
            };
          }
          if (item.sortDirection == "asc") {
            this.sortingDetails = { id, direction: "desc" };
            return {
              ...item,
              sortDirection: "desc",
            };
          }
        }
        return {
          ...item,
          sortDirection: "",
        };
      });
    },
    ...mapActions("users", ["deleteUser", "updateUser"]),
    handleDelete(id) {
      this.deleteUser(id);
    },
    goToProfile(id) {
      return this.$router.push({ name: "Profile", params: { id } });
    },
  },
  computed: {
    desktop() {
      const { mdAndUp } = this.$vuetify.display;
      return mdAndUp;
    },
    ...mapGetters("users", [
      "getFilteredUsers",
      "getTotalUsers",
      "getUserById",
    ]),
    filteredRows() {
      return this.getFilteredUsers(
        this.searchValue,
        this.page,
        PAGE_SIZE,
        this.sortingDetails
      );
    },
    totalPages() {
      return Math.ceil(this.filteredRows.total / PAGE_SIZE);
    },
  },
};
</script>
