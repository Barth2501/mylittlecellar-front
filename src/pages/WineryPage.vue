<template>
  <v-app class="auth px-4 py-4">
    <v-card class="mb-4">
      <v-row class="d-flex justify-space-around">
        <v-col class="d-flex justify-center col-6 mr-4" style="flex-direction: column;">
          <v-card outlined class="d-flex justify-center">
            <v-card-title v-text="winery.name" />
          </v-card>
        </v-col>
        <v-col class="d-flex justify-center" style="flex-direction: column;">
          <a class="area" href="'/'">
            <h2 class="d-flex justify-center" :to="'/'">{{winery.area.name}}</h2>
          </a>
          <a class="region" href="'/'">
            <h3 class="d-flex justify-center">{{winery.region.name}}</h3>
          </a>
        </v-col>
      </v-row>
    </v-card>
    <v-card v-for="(wine,i) in winery.wines" :key="i" outlined>
      <v-row class="d-flex justify-space-between">
        <v-col class="ma-2 col-4 wine-name d-flex justify-center">{{wine.name}}</v-col>
        <v-col class="ma-2 col-1 small-text d-flex justify-center">{{wine.vintage}}</v-col>
        <v-col
          class="ma-2 col-2 small-text d-flex justify-center"
        >{{wine.number}} bottle(s) remaining</v-col>
        <v-col class="ma-2 col-3 chart-area d-flex justify-center">
          <v-card elevation="0">
            <smallWineChart :wineData="wineData" />
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-app>
</template>
<script>
import axios from "axios";
import smallWineChart from "../components/SmallWineChart.vue";

export default {
  data: () => ({
    winery: [],
    currentCellar: undefined,
    wineData: {
      year: [2020, 2021, 2022, 2023, 2024, 2025, 2026],
      value: [2, 4, 5, 6, 9, 10, 6]
    }
  }),
  components: { smallWineChart },
  methods: {
    getWinery() {
      const winery_id = parseInt(this.$route.params.winery_id);
      axios
        .get("/wineries/" + winery_id, {
          headers: { current_cellar_id: this.currentCellar.id }
        })
        .then(res => {
          console.log(res.data);
          this.winery = res.data;
        });
    }
  },
  mounted() {
    if (localStorage.getItem("current_cellar")) {
      try {
        this.currentCellar = JSON.parse(localStorage.getItem("current_cellar"));
      } catch (e) {
        localStorage.removeItem("current_cellar");
      }
    }
    this.getWinery();
  }
};
</script>
<style scoped>
.small-text {
  flex: 15%;
  flex-direction: column;
}
.wine-name {
  flex: 40%;
  flex-direction: column;
}
.chart-area {
  flex: 30%;
  flex-direction: column;
}
a.area {
  text-decoration: none;
  color: #bb3e2d;
}
a.region {
  text-decoration: none;
  color: #bd9363;
}
</style>