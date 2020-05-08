<template>
  <v-app class="auth px-4 py-4">
    <v-card>
      <v-toolbar elevation="0" color="#c84431d9">
        <v-toolbar-title>
          <b>Livret de Cave</b>
        </v-toolbar-title>
      </v-toolbar>
    </v-card>

    <v-col v-if="loading">
      <v-row class="d-flex justify-center">
        <h2>Your wines are loading ...</h2>
      </v-row>
      <v-row class="row-1 d-flex align-content-start flex-wrap">
        <v-col class="col-1" v-for="i in nbBottles" :key="i">
          <v-img src="../assets/bottles.png" contain width="45" height="45" />
        </v-col>
      </v-row>
    </v-col>

    <v-card
      v-if="regions===undefined && !loading"
      class="d-flex justify-center mt-5"
      elevation="0"
      color="#d05f4f40"
    >
      <v-banner color="#ffffff00">
        <v-col class="d-flex justify-center my-12" style="flex-direction: column;">
          <v-row class="d-flex justify-center">
            <h2>Looks like you don't have anything else to drink...</h2>
          </v-row>
          <v-row class="d-flex justify-center mt-12">
            <img src="../assets/empty_barrel.png" height="250" width="250" contain />
          </v-row>
          <v-row class="d-flex justify-center mr-9 mt-4">
            <h3>You'd better fill your cellar</h3>
          </v-row>
        </v-col>
      </v-banner>
    </v-card>
    <!-- <v-card v-else class="mt-5">
      <v-list color="#d05f4f40">
        <v-list-item
          v-for="(region,region_id,index) in regions"
          :key="`region-${index}`"
          @click="getMyAreas(region_id)"
        >
          <v-list-item-content>
            <v-list-item-title v-text="region.name"></v-list-item-title>
          </v-list-item-content>
          <v-card>
            <v-list>
              <v-list-item v-for="(area,area_id,index) in region.areas" :key="`area-${index}`">
                <v-list-item-content>
                  <v-list-item-title v-text="area.name"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-list-item>
      </v-list>
    </v-card>-->
    <v-card v-else class="mt-5">
      <v-list color="#d05f4f40">
        <template v-for="(region,region_id,index) in regions">
          <div class='d-flex' :key="`region-${index}`">
          <v-list-item :key="`region-${index}`"  class='justify-space-between'>
            <v-list-group class="grow" color="#bb3e2d" prepend-icon="mdi-fruit-grapes">
              <template v-slot:activator>
                <v-list-item-content class="region" @click="getMyAreas(region_id)">
                  <v-list-item-title v-text="region.name"></v-list-item-title>
                </v-list-item-content>
              </template>
              <div v-if="!renderAreas">
                <v-col>
                  <v-progress-linear color="deep-purple accent-4" indeterminate rounded height="6"></v-progress-linear>
                </v-col>
              </div>
              <div v-else>
                <template v-for="(area,area_id,index) in region.areas">
                  <div class='d-flex' :key="`area-${index}`">
                  <v-list-item :key="`area-${index}`">
                    <v-list-group class="grow area-width" prepend-icon="mdi-fruit-grapes" sub-group>
                      <template v-slot:activator>
                        <v-list-item-content @click="getMyWineries(area_id, region_id)">
                          <v-list-item-title v-text="area.name"></v-list-item-title>
                        </v-list-item-content>
                      </template>
                      <div v-if="!renderWineries">
                        <v-col>
                          <v-progress-linear
                            color="deep-purple accent-4"
                            indeterminate
                            rounded
                            height="6"
                          ></v-progress-linear>
                        </v-col>
                      </div>
                      <div v-else>
                        <template v-for="(winery,winery_id,index) in area.wineries">
                          <div class='d-flex' :key="`winery-${index}`">
                          <v-list-item
                            :key="`winery-${index}`"
                          >
                            <v-list-group class="grow winery-width" no-action sub-group>
                              <template v-slot:activator>
                                <v-list-item-content @click="getMyWines(winery_id, area_id, region_id)">
                                  <v-list-item-title v-text="winery.name"></v-list-item-title>
                                  <!-- <v-list-item-text v-text="winery.description" /> -->
                                </v-list-item-content>
                              </template>
                              <div v-if="!renderWines">
                                <v-col>
                                  <v-progress-linear
                                    color="deep-purple accent-4"
                                    indeterminate
                                    rounded
                                    height="6"
                                  ></v-progress-linear>
                                </v-col>
                              </div>
                              <div v-else >
                                <template v-for="(wine,value, index) in winery.wines">
                                  <v-list-item :key="`wine-${index}`">
                                    <v-list-item-content>
                                      <v-list-item-title v-text="value"></v-list-item-title>
                                      <v-list-item-subtitle
                                        v-for="(vintage,value,index) in wine"
                                        :key="`vintage-${index}`"
                                      >
                                        <v-row class="d-flex justify-space-around">
                                          <h5 class="mr-5">{{ value }}</h5>
                                          <h5>{{ vintage.number}} bouteilles restantes</h5>
                                          <v-btn small>Modify</v-btn>
                                        </v-row>
                                      </v-list-item-subtitle>
                                    </v-list-item-content>
                                  </v-list-item>
                                  <v-divider :key="value"></v-divider>
                                </template>
                              </div>
                            </v-list-group>
                          </v-list-item>
                          <v-btn class="mt-2 mr-5" @click="$router.push('/wineries/'+winery.id)"><h5>Voir le domaine</h5> </v-btn>
                          </div>
                          <v-divider :key="index"></v-divider>
                        </template>
                      </div>
                    </v-list-group>
                  </v-list-item>
                  <v-btn class="mt-2 mr-5" @click="$router.push('/areas/'+area.name)"><h5>Voir l'appellation</h5> </v-btn>
                  </div>
                  <v-divider :key="index"></v-divider>
                </template>
              </div>
            </v-list-group>
          </v-list-item>
            <v-btn class="mt-2 mr-5" @click="$router.push('/regions/'+region.name)"><h5>Voir la région</h5> </v-btn>
          </div>
          <v-divider :key="index"></v-divider>
        </template>
      </v-list>
    </v-card>

    <!-- <v-card max-width="1000" class="mx-auto">
    <v-toolbar color="teal" dark>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title>Topics</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-toolbar>

    <v-list>
      <v-list-group
        v-for="(area,i) in wines"
        :key="i"
        v-model="area.active"
        prepend-icon="mdi-fruit-grapes"
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title v-text="area.name"></v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-group
          v-for="(winery,j) in area.wineries"
          :key="j"
          v-model="winery.active"
          no-action
          sub-group
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title v-text="winery.name"></v-list-item-title>
              <v-list-item-text v-text="winery.description" />
            </v-list-item-content>
          </template>

          <v-list-item v-for="(wine,k) in winery.wines" :key="k">
            <v-list-item-content>
              <v-list-item-title v-text="wine.name"></v-list-item-title>
              <v-list-item-subtitle>{{ wine.number }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list-group>
    </v-list>
    </v-card>-->
  </v-app>
</template>
<script>
import axios from "axios";

export default {
  data: () => ({
    wines: undefined,
    currentCellar: undefined,
    nbBottles: 0,
    loading: true,
    interval: 0,
    regions: undefined,
    renderAreas: false,
    renderWineries: false,
    renderWines: false
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
    async getMyRegions() {
      const res = await axios.get("/myregions", {
        headers: { current_cellar_id: this.currentCellar.id }
      });
      console.log(res.data);
      this.regions = res.data;
      this.loading = false;
    },
    async getMyAreas(region_id) {
      if (this.regions[region_id]["areas"] === undefined) {
        this.renderAreas = false;
        const res = await axios.get("/myareas/" + region_id, {
          headers: { current_cellar_id: this.currentCellar.id }
        });
        console.log(res.data);
        this.regions[region_id]["areas"] = res.data;
        this.$nextTick(() => {
          this.renderAreas = true;
        });
      }
    },
    async getMyWineries(area_id, region_id) {
      if (this.regions[region_id]["areas"][area_id]["wineries"] === undefined) {
        this.renderWineries = false;
        const res = await axios.get("/mywineries/" + area_id, {
          headers: { current_cellar_id: this.currentCellar.id }
        });
        console.log(res.data);
        this.regions[region_id]["areas"][area_id]["wineries"] = res.data;
        this.$nextTick(() => {
          this.renderWineries = true;
        });
      }
    },
    async getMyWines(winery_id, area_id, region_id) {
      if (
        this.regions[region_id]["areas"][area_id]["wineries"][winery_id][
          "wines"
        ] === undefined
      ) {
        this.renderWines = false;
        const res = await axios.get("/mywines/" + winery_id, {
          headers: { current_cellar_id: this.currentCellar.id }
        });
        console.log(res.data);
        this.regions[region_id]["areas"][area_id]["wineries"][winery_id][
          "wines"
        ] = res.data;
        this.$nextTick(() => {
          this.renderWines = true;
        });
      }
    },
    // getMyWines() {
    //   axios
    //     .get("/mycellar", {
    //       headers: { current_cellar_id: this.currentCellar.id }
    //     })
    //     .then(res => {
    //       console.log(res.data.my_wines);
    //       this.wines = res.data.my_wines;
    //       this.loading = false;
    //       clearInterval(this.interval);
    //     });
    // },
    winesLoading() {
      this.interval = setInterval(() => {
        if (this.loading) {
          this.nbBottles += 1;
          console.log(this.nbBottles);
        }
      }, 700);
    }
  },
  watch: {
    currentCellar: function() {
      this.getMyRegions();
    }
  },
  created: function() {
    this.winesLoading();
  }
};
</script>
<style scoped>
.auth {
  background-color: #9e9e9e24 !important;
}
.grow {
  flex-grow: inherit;
  max-width: fit-content;
}
.shrink {
  flex-grow: initial;
}
.region {
  border-bottom: solid;
}
.area-width {
  min-width: 17vw;
}
.winery-width {
  min-width: 26vw;
}
</style>