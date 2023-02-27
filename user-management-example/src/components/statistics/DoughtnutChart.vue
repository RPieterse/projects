<template>
  <v-card :max-height="maxHeight" class="mx-auto text-center" dark>
    <v-card-text>
      <v-sheet color="transparent">
        <doughnut-chart v-bind="doughnutChartProps" />
      </v-sheet>
    </v-card-text>

    <v-card-text>
      <div class="text-h4 font-weight-thin">
        {{ title }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { DoughnutChart, useDoughnutChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";
import { toRef } from "@vue/runtime-core";

Chart.register(...registerables);

export default {
  setup(props) {
    const data = toRef(props, "config");
    const options = {
      responsive: true,
      maintainAspectRatio: false,
    };

    const { doughnutChartProps } = useDoughnutChart({
      chartData: data.value,
      options,
    });

    return {
      doughnutChartProps,
    };
  },
  components: { DoughnutChart },
  props: {
    title: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "primary",
    },
    config: {
      default: () => {},
      type: Object,
    },
  },
};
</script>
