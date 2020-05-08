<template>
  <v-col>
    <RegionPie  :region_vint_agg="region_vint_agg" :area_vint_agg="area_vint_agg" />
  </v-col>
</template>
<script>
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
  },
  methods: {
  }
};
</script>