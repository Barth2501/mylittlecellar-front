<template>
  <v-app class="auth px-4 py-4">
    <v-card>
      <v-toolbar elevation="0" color="#c84431d9">
        <v-toolbar-title>My Recipes</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card class="d-flex justify-center py-3" elevation="0" color="#d05f4f40">
        <v-row class="d-flex mx-auto ml-5">
          <img src="../assets/chef.png" height="100" width="100" contain />
          <v-col class="col-8 ml-5">
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
              @change="getRecipes"
              :menu-props="{maxHeight:'700px'}"
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
                  <v-row class='d-flex justify-space-between'>
                    <v-col class="shrink ml-3">
                      <v-card v-if="item.color==='Blanc'" color="#e6cfb5" class="wine-color" />
                      <v-card v-if="item.color==='Rouge'" color="#701328" class="wine-color" />
                      <v-card v-if="item.color==='Rose'" color="#ed5565" class="wine-color" />
                      <v-card v-if="item.color==='Jaune'" color="#ffc107" class="wine-color" />
                    </v-col>
                    <v-col class="shrink col-7">
                      <v-list-item-title>{{ item.name }}</v-list-item-title>
                      <v-list-item-subtitle>{{ item.winery_name }}</v-list-item-subtitle>
                    </v-col>
                    <v-col class="shrink mr-3">
                      <v-list-item-title>{{ item.vintage }}</v-list-item-title>
                    </v-col>
                  </v-row>
                </v-list-item-content>
              </template>
            </v-combobox>
          </v-col>
        </v-row>
      </v-card>
      <v-card v-if="wine">
        <v-card-title v-text="wine.name" />
        <v-card-subtitle v-text="wine.winery_name" />
      </v-card>
      <v-card v-if="showRecipe" class="mt-5" elevation="0" color="#c84431d9">
        <v-toolbar color="#ffffff00">
          <v-toolbar-title>Voici les recettes que nous vous recommandons</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card>
          <v-carousel hide-delimiters>
            <v-carousel-item v-for="(recipe,i) in recipes" :key="i">
              <v-card class="d-flex">
                <v-col class="col-4">
                  <v-img
                    :src="recipe.image"
                    class="white--text align-end"
                    gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                  >
                    <v-card-title class="mb-3 ml-1" v-text="recipe.name"></v-card-title>
                  </v-img>
                </v-col>
                <v-col class="col-6">
                  <v-item-group>
                    <v-row>
                      <v-item v-slot:default="{ active,toggle }">
                        <v-card
                          :color="currentItem==='description' ? '#9826ac' : ''"
                          class="d-flex justify-space-around"
                          dark
                          @click="toggle;itemDesc('desc')"
                        >
                          <v-card-title class="ml-1">Description</v-card-title>
                        </v-card>
                      </v-item>
                      <v-item v-slot:default="{ active,toggle }">
                        <v-card
                          :color="currentItem==='preparation' ? '#9826ac' : ''"
                          class="d-flex justify-space-around"
                          dark
                          @click="toggle; itemDesc('prepa')"
                        >
                          <v-card-title class="ml-1">Preparation</v-card-title>
                        </v-card>
                      </v-item>
                    </v-row>
                    <v-row v-if="currentItem==='desc'">
                      <p>{{recipe.description}}</p>
                    </v-row>
                    <v-row v-if="currentItem==='prepa'">
                      <v-col class="col-8">
                        <v-row>Etapes</v-row>
                        <v-row>
                          <VuePerfectScrollbar
                            ref="ps"
                            class="scroll-area"
                            :settings="settings"
                            tagname="div"
                          >
                            <v-list>
                              <v-list-item
                                class="mb-1"
                                v-for="(step,i) in recipe.preparation"
                                :key="i"
                              >- {{step}}</v-list-item>
                            </v-list>
                          </VuePerfectScrollbar>
                        </v-row>
                      </v-col>
                      <v-col class="col-4">
                        <v-row>Ingrédients</v-row>
                        <v-row>
                          <VuePerfectScrollbar
                            ref="ps"
                            class="scroll-area"
                            :settings="settings"
                            tagname="div"
                          >
                            <v-list>
                              <v-list-item v-for="(step,i) in recipe.ingredients" :key="i">{{step}}</v-list-item>
                            </v-list>
                          </VuePerfectScrollbar>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-item-group>
                </v-col>
                <v-col class="d-flex" style="flex-direction: column">
                  <div class="d-flex ma-2" style="flex-direction: column">
                    <div>Nbre de personnes:</div>
                    <div class="mt-1 d-flex justify-center">{{recipe.proportion}}</div>
                  </div>
                  <div class="d-flex ma-2" style="flex-direction: column">
                    <div>Temps de préparation:</div>
                    <div class="mt-1 d-flex justify-center">{{recipe.time_prep}}</div>
                  </div>
                  <div class="d-flex ma-2" style="flex-direction: column">
                    <div>Temps de cuisson:</div>
                    <div class="mt-1 d-flex justify-center">{{recipe.time_cook}}</div>
                  </div>
                </v-col>
              </v-card>
            </v-carousel-item>
          </v-carousel>
        </v-card>
      </v-card>
    </v-card>
  </v-app>
</template>
<script>
import axios from "axios";
import _ from "lodash";
import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
  data: () => ({
    wine: undefined,
    wines: [],
    currentCellar: undefined,
    loading: false,
    query: "",
    showRecipe: false,
    recipes: [],
    currentItem: undefined,
    settings: {
      maxScrollbarLength: 100
    }
  }),
  components: { VuePerfectScrollbar },
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
      const response = await axios.get("/wines", {
        headers: { current_cellar_id: this.currentCellar.id },
        params: { query: this.query }
      });
      this.wines = response.data.wines;
      console.log(this.wines);
    },
    async getRecipes() {
      const resp = await axios.get("/wines_to_recipes/" + this.wine.id);
      console.log(resp.data);
      this.recipes = resp.data.top_recipes;
      this.showRecipe = true;
    },
    itemDesc(text) {
      this.currentItem = text;
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
.scroll-area {
  position: relative;
  margin: auto;
  height: 400px;
}
.bigger {
  width: 1280px * 2;
  height: 720px * 2;
}
.shrink {
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
.combobox {
  max-height: 700px;
}
</style>