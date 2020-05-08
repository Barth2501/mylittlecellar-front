<template>
  <v-app class="auth px-4 py-4">
    <v-card>
      <v-toolbar elevation="0" color="#c84431d9">
        <v-toolbar-title>Des recettes aux vins</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card class="d-flex justify-center" elevation="0" color="#d05f4f40">
        <v-banner color="#ffffff00">
          <v-row class="d-flex mx-auto ml-5">
            <img src="../assets/chef.png" height="100" width="100" contain />
            <v-col class="d-flex flex-column ml-5">
              <div>
                <h3>Que souhaitez-vous cuisiner ?</h3>
              </div>
              <div>
                <v-row class="d-flex align-center ml-1">
                  <v-text-field class="max-auto" v-model="query" label="Ingredients"></v-text-field>
                  <v-btn @click="onSend" icon>
                    <v-icon>mdi-magnify</v-icon>
                  </v-btn>
                </v-row>
              </div>
            </v-col>
          </v-row>
        </v-banner>
      </v-card>
    </v-card>

    <v-card
      v-if="!searchMade && !loading"
      class="mt-5 d-flex justify-center"
      elevation="0"
      color="#d05f4f40"
    >
      <v-banner color="#ffffff00">
        <v-col class="d-flex justify-center my-12" style="flex-direction: column;">
          <v-row class="d-flex justify-center">
            <h2>Dites nous les ingrédients que vous souhaitez utiliser !</h2>
          </v-row>
          <v-row class="d-flex justify-center mt-12">
            <img src="../assets/recipe-book.png" height="250" width="250" contain />
          </v-row>
          <v-row class="d-flex justify-center mt-4">
            <h3>Nous chercherons votre meilleur vin</h3>
          </v-row>
        </v-col>
      </v-banner>
    </v-card>

    <div v-if="loading" class="mt-4 pa-4 align-self-center">
      <lottie-player
        src="https://assets7.lottiefiles.com/temp/lf20_dRqSdi.json"
        background="transparent"
        speed="1"
        style="width: 300px; height: 300px;"
        loop
        autoplay
      ></lottie-player>
      <v-progress-linear :size="50" color="primary" :width="10" indeterminate></v-progress-linear>
    </div>

    <v-card v-if="searchMade" class="mt-5" elevation="0" color="#c84431d9">
      <v-toolbar color="#ffffff00">
        <v-toolbar-title>Nous vous conseillons ce(s) vin(s)</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card>
        <v-list color="#d05f4f40">
          <template v-for="(wine,_,i) in top_wines">
            <v-list-item :key="i">
              <v-list-item-content>
                <v-row class="d-flex justify-center justify-space-between">
                  <v-col class="col-color">
                    <v-card v-if="wine.color==='Blanc'" color="#e6cfb5" class="wine-color" />
                    <v-card v-if="wine.color==='Rouge'" color="#701328" class="wine-color" />
                    <v-card v-if="wine.color==='Rose'" color="#ed5565" class="wine-color" />
                    <v-card v-if="wine.color==='Jaune'" color="#ffc107" class="wine-color" />
                  </v-col>
                  <v-col class="col-color col-4">
                    <v-list-item-title v-text="wine.name"></v-list-item-title>
                    <v-list-item-subtitle
                      class="text--primary font-italic ml-2"
                    >{{ wine.winery_name }}</v-list-item-subtitle>
                  </v-col>
                  <v-col class="col-color col-1">
                    <v-list-item-title v-if="wine.vintage" class="mb-2" v-text="wine.vintage"></v-list-item-title>
                    <v-list-item-subtitle v-if="wine.mark">Mark : {{wine.mark}}</v-list-item-subtitle>
                  </v-col>
                  <v-col class="col-color col-2">
                    <v-list-item-title class="mb-2" v-text="wine.area_name"></v-list-item-title>
                    <v-list-item-subtitle class="font-italic">{{wine.region_name}}</v-list-item-subtitle>
                  </v-col>
                  <v-col class="col-color">
                    <v-list-item-title>{{wine.number}} bouteille(s) restante(s)</v-list-item-title>
                  </v-col>
                </v-row>
              </v-list-item-content>
            </v-list-item>
            <v-divider :key="wine"></v-divider>
          </template>
        </v-list>
      </v-card>
    </v-card>

    <v-card v-if="searchMade" class="mt-5" elevation="0" color="#c84431d9">
      <v-toolbar color="#ffffff00">
        <v-toolbar-title>Ou du moins ces appellations :</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card>
        <v-list color="#d05f4f40">
          <v-list-item v-for="(area,value) in top_areas" :key="value" class="area-style ">
            <v-list-item-content>
              <v-row class="d-flex justify-center justify-space-between">
                <v-col class="col-color">
                  <v-img src="../assets/vineyards.png" width="50" heigth="50" />
                </v-col>
                <v-col class="col-color col-3">
                  <v-list-item-title>
                    <a @click="$router.push('/regions/'+area.name)" class="page-link">
                      <h4>{{area.name}}</h4>
                    </a>
                  </v-list-item-title>
                </v-col>
                <v-col class="col-color col-3">
                  <v-list-item-title>
                    <a @click="$router.push('/regions/'+area.region_name)" class="page-link">
                      <h4>{{area.region_name}}</h4>
                    </a>
                  </v-list-item-title>
                </v-col>
                <v-col class="col-color">
                  <v-list-item-title>{{area.number}} bouteille(s) restante(s)</v-list-item-title>
                </v-col>
              </v-row>
            </v-list-item-content>
          </v-list-item>
          
        </v-list>
      </v-card>
    </v-card>
  </v-app>
</template>
<script>
import axios from "axios";

export default {
  data: () => ({
    top_wines: [],
    top_areas: [],
    query: "",
    currentCellar: undefined,
    searchMade: false,
    loading: false
  }),
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
    onSend(evt) {
      if (this.query != "") {
        evt.preventDefault();
        const payload = {
          query: this.query,
          cellar: this.currentCellar.id
        };
        this.sendQuery(payload);
      }
    },
    async sendQuery(payload) {
      this.loading = true;
      const res = await axios.post("/recipes_to_wines", payload);
      console.log(res.data);
      this.$nextTick(() => {
        this.top_wines = res.data.top_wines;
        this.top_areas = res.data.top_areas;
        this.searchMade = true;
        this.loading = false;
      });
    }
  }
};
</script>
<style scoped>
.auth {
  background-color: #9e9e9e24 !important;
}
.col-color {
  flex-grow: initial;
  align-self: center;
}
.wine-color {
  border-radius: 10px;
  width: 40px;
  height: 40px;
  background-color: rgb(112, 19, 40);
  border-color: rgb(112, 19, 40);
}
.area-style {
    border-bottom: solid;
    border-bottom-color: #d6bdb9;
    border-bottom-width: thin;
}
.page-link {
    color: #1e1b18;
    font-weight: 700;
}
</style>