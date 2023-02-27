<template>
  <div class="pa-12">
    <div v-if="!showMappings">
      <h2>Import Users</h2>
      <v-file-input
        class="my-12"
        accept=".csv"
        @change="handleFileUpload"
        label="Upload your CSV file"
      ></v-file-input>
      <a download :href="exampleFileUrl">Download an example file here</a>
    </div>
    <div v-else>
      <h2 class="mb-6">Map fields</h2>
      <v-row class="border-b">
        <v-col class="bold"> Our Field </v-col>
        <v-col class="bold"> Your Field </v-col>
      </v-row>
      <v-row v-for="(item, i) in fields" :key="item.key" class="border-b">
        <v-col class="self-center" :cols="cols[0]">
          {{ item.title }}
        </v-col>
        <v-col :cols="cols[1]">
          <v-select
            class="relative-t"
            :label="item.title"
            variant="solo"
            v-model="fieldMappings[i]['column']"
            :items="availableCols"
          ></v-select>
        </v-col>
      </v-row>

      <div class="d-flex mt-12">
        <v-spacer></v-spacer
        ><v-btn @click="handleImport" :loading="loading">Import Now</v-btn>
        <v-spacer></v-spacer>
      </div>
    </div>
  </div>
</template>

<script>
import { isEmpty } from "lodash";
export default {
  emits: ["import"],
  data() {
    return {
      csv: [],
      mappings: {},
      fieldMappings: this.fields,
      loading: false,
    };
  },
  props: {
    fields: {
      type: Array,
      default: () => [],
    },
    exampleFileUrl: {
      default: '/example.csv',
      type: String
    },
    loading: {
      default: false,
      type: Boolean
    }
  },
  computed: {
    cols() {
      const { mdAndUp } = this.$vuetify.display;
      return mdAndUp ? [6, 6] : [12, 12];
    },
    showMappings() {
      return this.csv.length > 0;
    },
    availableCols() {
      const cols = Object.keys(this.csv[0] || {});
      this.fieldMappings.forEach((map) => {
        if (map.column) {
          const index = cols.findIndex((el) => el == map.column);
          if (index > -1) {
            cols.splice(index, 1);
          }
        }
      });
      return cols;
    },
  },
  methods: {
    handleImport(){
      this.$emit('import', {csv: this.csv, mappings: this.fieldMappings})
    },
    isEmpty,
    handleFileUpload(e) {
      const input = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const lines = text.split("\n");
        const header = lines[0].split(";").map((h) => h.trim());
        const output = lines.slice(1).map((line) => {
          const fields = line.split(";");
          return Object.fromEntries(
            header.map((h, i) => [h, fields[i]?.replace("\r", "")])
          );
        });
        this.csv = output;
      };
      reader.readAsText(input);
    },
  },
};
</script>

<style scoped>
.border-b {
  border-bottom: 1px solid #e3e3e3
}
.relative-t {
  position: relative; top: 12px
}
</style>
