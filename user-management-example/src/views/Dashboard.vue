<template>
  <main class="mt-6">
    <div
      :class="`d-flex flex-${statisticNumberCardDirection} justify-space-around`"
    >
      <statistic-number-card
        title="Users"
        subtitle="Total users"
        :amount="getTotalUsers"
      >
        <template #icon-left>
          <v-icon icon="mdi-account" color="primary" class="mx-2 text-h3" />
        </template>
      </statistic-number-card>
      <statistic-number-card
        title="Completed"
        subtitle="Completed users"
        :amount="getTotalCompletedUsers"
      >
        <template #icon-left>
          <v-icon icon="mdi-check-all" color="success" class="mx-2 text-h3" />
        </template>
      </statistic-number-card>
      <statistic-number-card
        title="Users"
        subtitle="Cancelled users"
        :amount="getTotalCancelledUsers"
      >
        <template #icon-left>
          <v-icon icon="mdi-cancel" color="error" class="mx-2 text-h3" />
        </template>
      </statistic-number-card>
    </div>

    <div class="mt-12">
      <v-row>
        <v-col :cols="cols[0]">
          <bar-chart
            :config="BarData"
            title="Users by Status"
            color="success"
          />
        </v-col>
        <v-col :cols="cols[1]">
          <doughtnut-chart
            :config="doughtnutData"
            title="Users by Status"
            color="primary"
          />
        </v-col>
      </v-row>
    </div>
  </main>
</template>

<script>
import StatisticNumberCard from "@/components/statistics/StatisticNumberCard.vue";
import { mapGetters } from "vuex";
import BarChart from "@/components/statistics/BarChart.vue";
import DoughtnutChart from "@/components/statistics/DoughtnutChart.vue";
export default {
  components: { StatisticNumberCard, BarChart, DoughtnutChart },
  computed: {
    ...mapGetters("users", [
      "getTotalCancelledUsers",
      "getTotalUsers",
      "getTotalCompletedUsers",
      "getTotalInProgressUsers",
    ]),
    doughtnutData() {
      return {
        labels: ["Completed", "In Progress", "Cancelled"],
        datasets: [
          {
            data: [
              this.getTotalCompletedUsers,
              this.getTotalInProgressUsers,
              this.getTotalCancelledUsers,
            ],
            backgroundColor: ["#4CAF50", "#FFA500", "#B00020"],
          },
        ],
      };
    },
    BarData() {
      return {
        labels: ["Completed", "In Progress", "Cancelled"],
        datasets: [
          {
            data: [
              this.getTotalCompletedUsers,
              this.getTotalInProgressUsers,
              this.getTotalCancelledUsers,
            ],
            backgroundColor: ["#4CAF50", "#FFA500", "#B00020"],
          },
        ],
      };
    },

    cols() {
      const { mdAndUp } = this.$vuetify.display;
      return mdAndUp ? [6, 6] : [12, 12];
    },
    statisticNumberCardDirection() {
      const { mdAndUp } = this.$vuetify.display;
      return mdAndUp ? "row" : "column";
    },
  },
};
</script>
