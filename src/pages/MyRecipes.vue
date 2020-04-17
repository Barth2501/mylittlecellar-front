<template>
  <v-app class="auth px-4 py-4">
    <v-card>
      <v-toolbar elevation="0" color="#c84431d9">
        <v-toolbar-title>My Recipes</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card class="d-flex justify-center" elevation="0" color="#d05f4f40">
        <v-banner color="#ffffff00">
          <v-row class="d-flex mx-auto ml-5">
            <img src="../assets/chef.png" height="100" width="100" contain />
            <v-col class="d-flex flex-column ml-5">
              <div>
                <h3>What would you like to cook?</h3>
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

    <v-card v-if="!searchMade" class="mt-5 d-flex justify-center" elevation="0" color="#d05f4f40">
    <v-banner color="#ffffff00">
        <v-col class="d-flex justify-center my-12" style="flex-direction: column;">
          <v-row class="d-flex justify-center">
            <h2>Type the ingrdients you want to cook with !</h2>
          </v-row>
          <v-row class="d-flex justify-center mt-12">
            <img src="../assets/recipe-book.png" height="250" width="250" contain />
          </v-row>
          <v-row class="d-flex justify-center mt-4">
            <h3>We are choosing the best match</h3>
          </v-row>
        </v-col>
      </v-banner>
    </v-card>

    <v-card v-if="searchMade" class="mt-5" elevation="0" color="#c84431d9">
      <v-toolbar color="#ffffff00">
        <v-toolbar-title>Here are the top 5 wine we would recommend</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card>
        <v-list color="#d05f4f40">
          <template v-for="(wine,_,i) in top_wines">
          <v-list-item :key="i">
            <v-list-item-content>
              <v-row class="d-flex justify-center justify-space-between">
                <v-col class="col-5">
                  <v-list-item-title v-text="wine.name"></v-list-item-title>
                  <v-list-item-subtitle
                    class="text--primary font-italic ml-2"
                  >{{ wine.winery_name }}</v-list-item-subtitle>
                </v-col>
                <v-col class="col-2">
                  <v-list-item-title v-if="wine.vintage" class="mb-2" v-text="wine.vintage"></v-list-item-title>
                  <v-list-item-subtitle v-if="wine.mark">Mark : {{wine.mark}}</v-list-item-subtitle>
                </v-col>
                <v-col class="col-2">
                  <v-list-item-title class="mb-2" v-text="wine.area_name"></v-list-item-title>
                  <v-list-item-subtitle class="font-italic">{{wine.region_name}}</v-list-item-subtitle>
                </v-col>
                <v-col class="col-3">
                  <v-list-item-title>{{wine.number}} bottle(s) remaining</v-list-item-title>
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
        <v-toolbar-title>Or find all the areas that also match</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card>
        <v-list>
          <v-list-group
            v-for="(area,value) in top_areas"
            :key="value"
            prepend-icon="mdi-fruit-grapes"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title v-text="value"></v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-group v-for="(winery,value) in area" :key="value" no-action sub-group>
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title v-text="value"></v-list-item-title>
                  <!-- <v-list-item-text v-text="winery.description" /> -->
                </v-list-item-content>
              </template>

              <v-list-item v-for="(wine,value) in winery" :key="value">
                <v-list-item-content>
                  <v-list-item-title v-text="value"></v-list-item-title>
                  <v-list-item-subtitle v-for="(vintage,value) in wine" :key="value">
                    <v-row class="d-flex justify-space-around">
                      <v-text-area class="mr-5">{{ value }}</v-text-area>
                      <v-text-area>{{ vintage.number}} bottle(s) remaining</v-text-area>
                    </v-row>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
          </v-list-group>
        </v-list>
      </v-card>
    </v-card>

    <!-- <v-list>
        <v-list-group v-for="(area,value) in wines" :key="value" prepend-icon="mdi-fruit-grapes">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title v-text="value"></v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-group v-for="(winery,value) in area" :key="value" no-action sub-group>
            <template v-slot:activator>
              <v-list-item-content>
    <v-list-item-title v-text="value"></v-list-item-title>-->
    <!-- <v-list-item-text v-text="winery.description" /> -->
    <!-- </v-list-item-content>
            </template>
            <v-list-item v-for="(wine,value) in winery" :key="value">
              <v-list-item-content>
                <v-list-item-title v-text="value"></v-list-item-title>
                <v-list-item-subtitle v-for="(vintage,value) in wine" :key="value">
                  <v-row class="d-flex justify-space-around">
                    <v-text-area class="mr-5">{{ value }}</v-text-area>
                    <v-text-area>{{ vintage.number}} bottle(s) remaining</v-text-area>
                    <v-btn small>Modify</v-btn>
                  </v-row>
                </v-list-item-subtitle>
              </v-list-item-content>
    </v-list-item>-->
    <!-- <v-card v-for="(wine,value) in winery" :key="value" class="mt-1">
            <v-row class="mx-auto ml-3">
              <v-row class="d-flex">
                <v-col
                  cols="5"
                  class="d-flex align-self-stretch justify-center"
                  style="flex-direction: column;"
                >
                  <v-list>
                    <v-list-item-title>{{value}}</v-list-item-title>
                    <v-list-item-subtitle>by {{wine.wine.winery.name}}</v-list-item-subtitle>
                  </v-list>
                </v-col>
                <v-col
                  cols="3"
                  class="d-flex align-self-stretch justify-center"
                  style="flex-direction: column;"
                >
                  <v-list>
                    <v-list-item-title>{{value.vintage}}</v-list-item-title>
                    <v-list-item-subtitle>region name - {{wine.wine.area.name}}</v-list-item-subtitle>
                  </v-list>
                </v-col>
                <v-col
                  cols="2"
                  class="d-flex align-self-stretch justify-center"
                  style="flex-direction: column;"
                >
                  <v-list
                    style="flex-direction: column;"
                    class="d-flex flex-shrink-1 justify-center"
                  >
                    <v-list-item class="d-flex justify-center">
                      <v-list-item-avatar size="30">
                        <v-img src="../assets/tick.png" />
                      </v-list-item-avatar>
                    </v-list-item>
                    <v-list-item class="d-flex flex-shrink-1 justify-center">
                      <v-list-item-content class="text-center">
                        <v-text-area>{{wine.wine.number}} bottle(s) remaining</v-text-area>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
              <v-col style="max-width:25%;">
                <v-img :src="wine.recipe.image" width="200" height="200" />
              </v-col>
            </v-row>
    </v-card>-->
    <!-- </v-list-group>
    </v-list-group>-->

    <!-- <v-list-group v-for="(wine,i) in wines" :key="i">
        <v-list-item-content>
          <v-row class="d-flex justify-space-between">
            <v-row class="d-flex justify-space-between">
              <v-col>
                <v-list-item-title v-text="wine.wine_name" />
                <v-list-item-subtitle>by {{ wine.winery_name }}</v-list-item-subtitle>
              </v-col>
              <v-col>
                <v-list-item-title v-text="wine.vintage"></v-list-item-title>
                <v-list-item-subtitle>{{ wine.region_name }} - {{ wine.area_name }}</v-list-item-subtitle>
              </v-col>
            </v-row>
            <v-img :src="wine.recipe.image" />
          </v-row>
        </v-list-item-content>
    </v-list-group>-->
    <!-- </v-list> -->
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
    searchMade: false
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
      evt.preventDefault();
      const payload = {
        query: this.query,
        cellar: this.currentCellar.id
      };
      this.sendQuery(payload);
    },
    sendQuery(payload) {
      axios.post("/myrecipes", payload).then(res => {
        console.log(res.data);
        this.top_wines = res.data.top_wines;
        this.top_areas = res.data.top_areas;
        this.searchMade = true;
      });
    }
  }
};
</script>
<style scoped>
.auth {
  background-color: #9e9e9e24 !important;
}
</style>