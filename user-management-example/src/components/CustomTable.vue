<template>
  <v-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th v-for="(header, index) in headers" :key="index">
            <div :class="headerAlignment(index)">
              <p>{{ header.title }}</p>
              <sorting-button
                class="ml-2"
                @sort="sort(header.sortId)"
                :visible="header.sortId ? true : false"
                :direction="header.sortDirection"
              />
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <slot name="rows"></slot>
      </tbody>
    </template>
  </v-table>
</template>

<script>
import SortingButton from "@/components/SortingButton.vue";
export default {
  emits: ["handleSort"],
  components: { SortingButton },
  props: {
    headers: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    sort(sortId) {
      this.$emit("handleSort", sortId);
    },
    headerAlignment(index) {
      return `d-flex ${index == 0 ? "" : "justify-center align-center"}`;
    },
  },
};
</script>
<style scoped>
th {
  white-space: nowrap;
}
table {
  width: 100%;
  display: block;
  overflow-x: auto;
  white-space: nowrap;
}
</style>
