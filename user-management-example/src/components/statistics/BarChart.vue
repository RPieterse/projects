<template>
  <v-card :max-height="maxHeight" class="mx-auto text-center" dark>
    <v-card-text>
      <v-sheet color="transparent">
        <bar-chart v-bind="barChartProps" />
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
import { BarChart, useBarChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";
import { toRef } from "@vue/runtime-core";

Chart.register(...registerables);

export default {
  setup(props) {
    const data = toRef(props, "config");
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
    };

    const { barChartProps } = useBarChart({
      chartData: data.value,
      options,
    });

    return {
      barChartProps,
    };
  },
  components: { BarChart },
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
