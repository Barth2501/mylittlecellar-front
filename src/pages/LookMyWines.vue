<template>
  <v-app class="auth px-4 py-4">
    <div class="d-flex col-flex">
      <v-combobox
        v-model="wine"
        :items="wines"
        :search-input.sync="query"
        hide-selected
        clearable
        no-filter
        label="Nom du vin"
        chips
        solo
        @change="getWine"
        hide-details
      >
        <template v-slot:selection="{ attr, on, item, selected }">
          <v-chip
            v-bind="attr"
            :input-value="selected"
            color="blue-grey"
            class="white--text"
            v-on="on"
          >
            <v-icon left>mdi-grapes</v-icon>
            <span>{{item.winery_name}} - {{item.name}} - {{item.vintage}}</span>
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
                <v-card v-if="item.color==='Blanc'" color="#e6cfb5" class="wine-color" />
                <v-card v-if="item.color==='Rouge'" color="#701328" class="wine-color" />
                <v-card v-if="item.color==='Rose'" color="#ed5565" class="wine-color" />
                <v-card v-if="item.color==='Jaune'" color="#ffc107" class="wine-color" />
              </v-col>
              <v-col class="shrink">
                <v-list-item-title>{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ item.winery_name }}</v-list-item-subtitle>
              </v-col>
              <v-col class="shrink">
                <v-list-item-title>{{ item.vintage }}</v-list-item-title>
              </v-col>
            </v-row>
          </v-list-item-content>
        </template>
      </v-combobox>

      <div v-if="wines.length===0">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              Aucun résultats avec "
              <strong>{{ query }}</strong>".
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </div>
    </div>

    <div v-if="wineLoading" class="mt-4 pa-4 text-center">
      <v-progress-circular :size="100" color="primary" :width="20" indeterminate></v-progress-circular>
    </div>

    <v-card v-if="currentWine" class="mt-4 pa-4">
      <v-col class="d-flex" style="flex-direction:column">
        <v-row class="d-flex">
          <v-card @click="areaRedirect">
            <v-img
              :src="currentWine.area_info.photo"
              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              width="300px"
            >
              <v-card-title class="mb-3 ml-1" v-text="currentWine.area_name"></v-card-title>
            </v-img>
          </v-card>
          <v-col class="d-flex col-flex justify-center">
            <h2 class="wine-name">{{currentWine.name}}</h2>
            <h3 class="winery-name">
              <a
                class="winery-link"
                :href="'/wineries/'+currentWine.winery_id"
              >{{currentWine.winery_name}}</a>
            </h3>
          </v-col>
        </v-row>
        <div class="d-flex mt-4">
          <v-col class="wine-name d-flex justify-center">
            <v-card v-if="currentWine.color==='Blanc'" color="#e6cfb5" class="wine-color" />
            <v-card v-if="currentWine.color==='Rouge'" color="#701328" class="wine-color" />
            <v-card v-if="currentWine.color==='Rose'" color="#ed5565" class="wine-color" />
            <v-card v-if="currentWine.color==='Jaune'" color="#ffc107" class="wine-color" />
            <h5 class="align-self-center ml-3">{{currentWine.color}}</h5>
          </v-col>
          <v-col v-if="currentWine.vintage!=0" class="wine-name align-self-center">
            <h5>Millésime : {{currentWine.vintage}}</h5>
          </v-col>
          <v-col v-else class="wine-name align-self-center">
            <h5>Non Millésimé</h5>
          </v-col>
          <v-col class="wine-name align-self-center">
            <h5>Nombre de bouteilles dans la cave : {{currentWine.number}}</h5>
          </v-col>
        </div>

        <v-card v-if="wineTrend" elevation="0" class="mt-4">
          <h4>Courbe d'évolution de sa maturité dans le temps :</h4>
          <smallWineChart :wineData="wineTrend" label_size="5  " width="5" />
        </v-card>
        <div v-else class="mt-4 pa-4 text-center">
          <v-progress-circular :size="50" color="primary" :width="10" indeterminate></v-progress-circular>
        </div>

        <div class="mt-4 d-flex col-flex" v-if="otherVintage">
          <h4>Vos autres millésimes de ce vin :</h4>
          <div v-if="otherVintage.length!=0">
            <v-card
              class="d-flex justify-space-around my-1"
              v-for="(wine,i) in otherVintage"
              :key="i"
              @click="changeWine(wine)"
            >
              <v-col class="shrink align-self-center">
                <v-card v-if="wine.color==='Blanc'" color="#e6cfb5" class="wine-color" />
                <v-card v-if="wine.color==='Rouge'" color="#701328" class="wine-color" />
                <v-card v-if="wine.color==='Rose'" color="#ed5565" class="wine-color" />
                <v-card v-if="wine.color==='Jaune'" color="#ffc107" class="wine-color" />
              </v-col>
              <v-col class="wine-name d-flex col-flex wine-list justify-center">{{wine.name}}</v-col>
              <v-col
                v-if="wine.vintage!=0"
                class="small-text d-flex col-flex wine-list justify-center"
              >{{wine.vintage}}</v-col>
              <v-col
                v-else
                class="small-text d-flex col-flex wine-list justify-center"
              >Non Millésimé</v-col>
              <v-col
                class="small-text d-flex col-flex wine-list justify-center"
              >{{wine.number}} bottle(s) remaining</v-col>
              <v-col>
                <v-card elevation="0">
                  <smallWineChart :wineData="wine.trend" label_size="8" />
                </v-card>
              </v-col>
            </v-card>
          </div>
          <div v-else>
            <h5>Vous ne possédez pas d'autres millésimes de ce vin</h5>
          </div>
        </div>
        <div v-else class="mt-4 pa-4 text-center">
          <v-progress-circular :size="50" color="primary" :width="10" indeterminate></v-progress-circular>
        </div>

        <div class="mt-2 d-flex col-flex" v-if="otherWines">
          <h4>Vos autres vins de ce domaine :</h4>
          <div v-if="otherWines.length!=0">
            <v-card
              class="d-flex justify-space-around my-1"
              v-for="(wine,i) in otherWines"
              :key="i"
              @click="changeWine(wine)"
            >
              <v-col class="shrink align-self-center">
                <v-card v-if="wine.color==='Blanc'" color="#e6cfb5" class="wine-color" />
                <v-card v-if="wine.color==='Rouge'" color="#701328" class="wine-color" />
                <v-card v-if="wine.color==='Rose'" color="#ed5565" class="wine-color" />
                <v-card v-if="wine.color==='Jaune'" color="#ffc107" class="wine-color" />
              </v-col>
              <v-col class="wine-name d-flex col-flex wine-list justify-center">{{wine.name}}</v-col>
              <v-col
                v-if="wine.vintage!=0"
                class="small-text d-flex col-flex wine-list justify-center"
              >{{wine.vintage}}</v-col>
              <v-col
                v-else
                class="small-text d-flex col-flex wine-list justify-center"
              >Non Millésimé</v-col>
              <v-col
                class="small-text d-flex col-flex wine-list justify-center"
              >{{wine.number}} bottle(s) remaining</v-col>
              <v-col>
                <v-card elevation="0">
                  <smallWineChart :wineData="wine.trend" label_size="8" />
                </v-card>
              </v-col>
            </v-card>
          </div>
          <div v-else>
            <h5>Vous n'avez pas d'autres vins de ce domaines</h5>
          </div>
          </div>
          <div v-else class="mt-4 pa-4 text-center">
            <v-progress-circular :size="50" color="primary" :width="10" indeterminate></v-progress-circular>
          </div>
      </v-col>
    </v-card>
  </v-app>
</template>
<script>
import axios from "axios";
import _ from "lodash";
import smallWineChart from "../components/SmallWineChart.vue";

export default {
  data: () => ({
    currentCellar: undefined,
    currentWine: undefined,
    wine: undefined,
    wines: [0],
    loading: false,
    query: "",
    wineTrend: undefined,
    otherVintage: undefined,
    otherWines: undefined,
    renderComboBox: true,
    wineLoading: false
  }),
  components: { smallWineChart },
  mounted() {
    if (localStorage.getItem("current_cellar")) {
      try {
        this.currentCellar = JSON.parse(localStorage.getItem("current_cellar"));
      } catch (e) {
        localStorage.removeItem("current_cellar");
      }
    }
  },
  methods: {
    async getWines() {
      if (this.query != "") {
        this.loading = true;
        const response = await axios.get("/wines", {
          headers: { current_cellar_id: this.currentCellar.id },
          params: { query: this.query }
        });
        console.log(response.data);
        this.wines = response.data.wines;
        this.loading = false;
      }
    },
    async getWine() {
      if (this.wine.id != undefined) {
        this.wineLoading = true;
        const resp = await axios.get("/wines/" + this.wine.id, {
          headers: { current_cellar_id: this.currentCellar.id }
        });
        console.log(resp.data);
        this.wineLoading = false;
        this.currentWine = resp.data.wine;
        this.getWineTrend();
        this.getOtherVintage();
        this.getOtherWines();
      }
    },
    changeWine(wine) {
      this.wine = wine;
      console.log(wine)
      this.$nextTick(()=>{this.getWine()})
    },
    areaRedirect() {
      this.$router.push("/areas/" + this.currentWine.area_name);
    },
    async getOtherVintage() {
      this.otherVintage = undefined;
      const resp = await axios.get("/wines/other_vintage/" + this.wine.id, {
        headers: { current_cellar_id: this.currentCellar.id }
      });
      console.log(resp.data);
      this.$nextTick(() => {
        this.otherVintage = resp.data.vintage;
      });
    },
    async getOtherWines() {
      this.otherWines = undefined;
      const resp = await axios.get("wines/other_wines/" + this.wine.id, {
        headers: { current_cellar_id: this.currentCellar.id }
      });
      console.log(resp.data);
      this.$nextTick(() => {
        this.otherWines = resp.data.wines;
      });
    },
    async getWineTrend() {
      this.wineTrend = undefined;
      const res = await axios.get("/wine_trend/" + this.wine.id);
      console.log(res.data);
      this.$nextTick(() => {
        this.wineTrend = res.data.trend;
      });
    }
  },
  created: function() {
    this.debounceWines = _.debounce(this.getWines, 1000);
  },
  watch: {
    query: function() {
      if (this.query != null) {
        this.debounceWines();
      }
    }
  }
};
</script>
<style scoped>
.col-flex {
  flex-direction: column;
}

.wine-name {
  text-align: center;
}

.winery-name {
  align-self: center;
  margin-top: 1vw;
}

.wine-list {
  flex-grow: inherit;
  white-space: nowrap;
}

.winery-link {
  text-decoration: none;
  font-weight: 800;
  color: #bd9363;
}

.wine-color {
  border-radius: 10px;
  width: 40px;
  height: 40px;
  background-color: rgb(112, 19, 40);
  border-color: rgb(112, 19, 40);
}

.shrink {
  flex-grow: initial;
}
</style>