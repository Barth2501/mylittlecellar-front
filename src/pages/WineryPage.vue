<template>
  <v-app v-if="winery!=undefined" class="auth px-4 py-4">
    <v-card class="mb-4">
      <v-row class="d-flex justify-space-around">
        <v-col class="d-flex justify-center col-6 mr-4" style="flex-direction: column;">
          <v-card outlined class="d-flex justify-center">
            <v-card-title v-text="winery.name" />
          </v-card>
        </v-col>
        <v-col class="d-flex justify-center" style="flex-direction: column;">
          <a class="area" href="'/'">
            <h2 class="d-flex justify-center" :to="'/'">{{winery.area_name}}</h2>
          </a>
          <a class="region" href="'/'">
            <h3 class="d-flex justify-center">{{winery.region_name}}</h3>
          </a>
        </v-col>
      </v-row>
    </v-card>
    <v-card v-for="(wine,i) in wines" :key="`wine-${i}`" outlined @click="$router.push('/wines/'+wine.id)">
      <v-row class="d-flex justify-space-between">
        <v-col class="shrink align-self-center ml-3">
          <v-card v-if="wine.color==='Blanc'" color="#e6cfb5" class="wine-color" />
          <v-card v-if="wine.color==='Rouge'" color="#701328" class="wine-color" />
          <v-card v-if="wine.color==='Rose'" color="#ed5565" class="wine-color" />
          <v-card v-if="wine.color==='Jaune'" color="#ffc107" class="wine-color" />
        </v-col>
        <v-col class="ma-2 col-4 wine-name d-flex justify-center">{{wine.name}}</v-col>
        <v-col class="ma-2 col-1 small-text d-flex justify-center">{{wine.vintage}}</v-col>
        <v-col
          class="ma-2 col-2 small-text d-flex justify-center"
        >{{wine.number}} bottle(s) remaining</v-col>
        <v-col class="ma-2 col-3 chart-area d-flex justify-center">
          <v-card elevation="0" :key="update">
            <smallWineChart  v-if="wine.trend!=undefined" :wineData="wine.trend" />
            <v-progress-circular v-else :size="50" color="primary" :width="10" indeterminate></v-progress-circular>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-app>
  <v-app v-else>
    <v-col class="text-center">
      <v-progress-circular color="deep-purple accent-4" indeterminate rounded height="20"></v-progress-circular>
    </v-col>
  </v-app>
</template>
<script>
import axios from "axios";
import smallWineChart from "../components/SmallWineChart.vue";

export default {
  data: () => ({
    update: 0,
    winery: [],
    wines: [],
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
          this.getWines();
        });
    },
    async getWines() {
      const res = await axios.get("/wineries/" + this.winery.id + "/wines", {
        headers: { current_cellar_id: this.currentCellar.id }
      });
      console.log(res.data);
      this.$nextTick(() => {
        this.wines = res.data;
        for (var i = 0; i < this.wines.length; i++) {
          this.getTrend(i);
        }
      });
    },
    async getTrend(index) {
      const wine_id = this.wines[index].id;
      const res = await axios.get("/wine_trend/" + wine_id, {
        headers: { current_cellar_id: this.currentCellar.id }
      });
      console.log(res.data);
      this.$nextTick(() => {
        this.wines[index]["trend"] = res.data.trend;
      });
      this.update++
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
.wine-color {
  border-radius: 10px;
  width: 40px;
  height: 40px;
  background-color: rgb(112, 19, 40);
  border-color: rgb(112, 19, 40);
}
</style>