<template>
  <v-combobox
    v-model="regionArea"
    :items="regionsAreas"
    :search-input.sync="query"
    hide-selected
    clearable
    no-filter
    label="Chercher une région, une appellation..."
    chips
    solo
    @change="getAreaRegion"
    hide-details
  >
    <template v-slot:selection="{ attr, on, item, selected }">
      <v-chip v-bind="attr" :input-value="selected" color="blue-grey" class="white--text" v-on="on">
        <v-icon left>mdi-grapes</v-icon>
        <span>{{item.type}} - {{item.name}}</span>
      </v-chip>
    </template>
    <template v-slot:prepend-item v-if="loading">
      <v-col>
        <v-progress-linear color="deep-purple accent-4" indeterminate rounded height="6"></v-progress-linear>
      </v-col>
    </template>
    <template v-slot:item="{ item }">
      <v-list-item-content>
        <v-row>
          <v-col class="shrink">
            <h6 v-if="item.type==='region'">Region</h6>
            <h6 v-if="item.type==='area'">Appellation</h6>
          </v-col>
          <v-col class="shrink">
            <v-list-item-title>
                <a href="$router.push('/regions/'+item.name)" v-if="item.type==='region'"> {{item.name }}</a>
                <a href="$router.push('/areas/'+item.name)" v-if="item.type==='area'"> {{item.name }}</a>
                </v-list-item-title>
          </v-col>
        </v-row>
      </v-list-item-content>
    </template>
  </v-combobox>
</template>
<script>
import axios from "axios";
import _ from "lodash";

export default {
  data: () => ({
    regionArea: undefined,
    regionsAreas: undefined,
    query: "",
    loading: false
  }),
  methods: {
    async getAreasRegions() {
      if (this.query != "") {
        this.loading = true;
        const res = await axios.get("/regions_areas", {
          params: { query: this.query }
        });
        console.log(res.data);
        this.regionsAreas = res.data;
        this.loading = false;
      }
    },
    async getAreaRegion() {
        if (this.regionArea!=undefined) {
            if (this.regionArea.type==='region') {
                this.$router.push("/regions/" + this.regionArea.name);   
            } else if (this.regionArea.type==='area') {
                this.$router.push("/areas/" + this.regionArea.name);
            }
        }
    }
  },
  created: function() {
      this.debounceRegionsAreas = _.debounce(this.getAreasRegions, 700);
  },
  watch: {
      query: function() {
          if (this.query!=null) {
              this.debounceRegionsAreas();
          }
      }
  }
};
</script>
<style scoped>
</style>