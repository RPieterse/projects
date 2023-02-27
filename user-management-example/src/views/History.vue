<template>
  <main class="d-flex flex-column">
    <h1>Activity History</h1>

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
            <td class="text-left">{{ item.profileId }}</td>
            <td class="text-center">{{ item.profileName }}</td>
            <td class="text-center">
              {{ item.action }}
            </td>
            <td class="text-center">
              {{ moment(item.createdAt).format("DD/MM/YYYY") }}
            </td>
          </tr>
        </template>
      </custom-table>
      <div v-else>
        <history-card
          v-for="item in filteredRows.results"
          :key="item.id"
          :item="item"
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
import { mapGetters } from "vuex";
import DialogButton from "@/components/DialogButton.vue";
import StatusIndicator from "@/components/StatusIndicator.vue";
import moment from "moment";
import HistoryCard from "@/components/HistoryCard.vue";
const PAGE_SIZE = 10;

export default {
  components: {
    CustomTable,
    Searchbar,
    DialogButton,
    StatusIndicator,
    HistoryCard,
  },
  data() {
    return {
      headers: [
        { title: "#Profile ID", sortId: "profileId", sortDirection: "" },
        { title: "Profile Name", sortId: "profileName", sortDirection: "" },
        { title: "Action", sortId: "action", sortDirection: "" },
        { title: "Created", sortId: "createdAt", sortDirection: "asc" },
      ],
      sortingDetails: { id: "createdAt", direction: "asc" },
      searchValue: "",
      page: 1,
    };
  },
  methods: {
    moment,
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
  },
  computed: {
    desktop() {
      const { mdAndUp } = this.$vuetify.display;
      return mdAndUp;
    },
    ...mapGetters("history", ["getFilteredHistory", "getTotalHistory"]),
    filteredRows() {
      return this.getFilteredHistory(
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
