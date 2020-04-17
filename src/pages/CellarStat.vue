<template>
  <v-col>
    <RegionPie :region_agg="region_agg" :area_agg="area_agg" :vintage_agg="vintage_agg" :region_vint_agg="region_vint_agg" :area_vint_agg="area_vint_agg" />
  </v-col>
</template>
<script>
import axios from "axios";
import RegionPie from "../components/RegionPie.vue";

export default {
  data: () => ({
    region_agg: [],
    area_agg: [],
    vintage_agg: [],
    region_vint_agg: [],
    area_vint_agg: [],
    currentCellar: []
  }),
  components: { RegionPie },
  created() {
    if (localStorage.getItem("current_cellar")) {
      try {
        this.currentCellar = JSON.parse(localStorage.getItem("current_cellar"));
      } catch (e) {
        localStorage.removeItem("current_cellar");
      }
    }
    this.getRegionAgg();
    this.getAreaAgg();
    this.getVintageAgg();
  },
  methods: {
    getRegionAgg() {
      axios
        .get("/statistics/region_agg", {
          headers: { current_cellar_id: this.currentCellar.id }
        })
        .then(res => {
          this.region_agg = res.data.region_agg;
        });
    },
    getAreaAgg() {
      axios
        .get("/statistics/area_agg", {
          headers: { current_cellar_id: this.currentCellar.id }
        })
        .then(res => {
          this.area_agg = res.data.area_agg;
        });
    },
    getVintageAgg() {
      axios
        .get("/statistics/vintage_agg", {
          headers: { current_cellar_id: this.currentCellar.id }
        })
        .then(res => {
          this.vintage_agg = res.data.vintage_agg;
          this.region_vint_agg = res.data.region_vintage_agg;
          this.area_vint_agg = res.data.area_vintage_agg;
        });
    }
  }
};
</script>