<template>
  <v-app class="auth px-4 py-4">
    <v-card>
      <v-toolbar elevation="0" color="#c84431d9">
        <v-toolbar-title>
          <b>My Cellar</b>
        </v-toolbar-title>
      </v-toolbar>
      <v-card class="d-flex justify-center" elevation="0" color="#d05f4f40">
        <v-banner color="#ffffff00">
          <v-row class="d-flex mx-auto ml-5">
            <img src="../assets/wine.png" height="100" width="100" contain />
            <v-col class="d-flex flex-column ml-5">
              <div>
                <h3>What are you looking for?</h3>
              </div>
              <div>
                <v-row class="d-flex align-center ml-1">
                  <v-text-field class="max-auto" v-model="query" label="Area or Wine or..."></v-text-field>
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
      v-if="wines===undefined && !loading"
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

    <v-card v-else class="mt-5">
      <v-list color="#d05f4f40">
        <template v-for="(region,value,index) in wines">
          <v-list-item :key="`region-${index}`">
            <v-list-group color="#bb3e2d" prepend-icon="mdi-fruit-grapes">
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title v-text="value"></v-list-item-title>
                </v-list-item-content>
              </template>
              <template v-for="(area,value,index) in region">
                <v-list-item :key="`area-${index}`">
                  <v-list-group prepend-icon="mdi-fruit-grapes" sub-group>
                    <template v-slot:activator>
                      <v-list-item-content>
                        <v-list-item-title v-text="value"></v-list-item-title>
                      </v-list-item-content>
                    </template>
                    <template v-for="(winery,value,index) in area">
                      <v-list-item :key="`winery-${index}`">
                        <v-list-group no-action sub-group>
                          <template v-slot:activator>
                            <v-list-item-content>
                              <v-list-item-title v-text="value"></v-list-item-title>
                              <!-- <v-list-item-text v-text="winery.description" /> -->
                            </v-list-item-content>
                          </template>
                          <template v-for="(wine,value, index) in winery">
                            <v-list-item :key="`wine-${index}`">
                              <v-list-item-content>
                                <v-list-item-title v-text="value"></v-list-item-title>
                                <v-list-item-subtitle
                                  v-for="(vintage,value,index) in wine"
                                  :key="`vintage-${index}`"
                                >
                                  <v-row class="d-flex justify-space-around">
                                    <v-text-area class="mr-5">{{ value }}</v-text-area>
                                    <v-text-area>{{ vintage.number}} bottle(s) remaining</v-text-area>
                                    <v-btn small>Modify</v-btn>
                                  </v-row>
                                </v-list-item-subtitle>
                              </v-list-item-content>
                            </v-list-item>
                            <v-divider :key="value"></v-divider>
                          </template>
                        </v-list-group>
                      </v-list-item>
                      <v-divider :key="value"></v-divider>
                    </template>
                  </v-list-group>
                </v-list-item>
                <v-divider :key="value"></v-divider>
              </template>
            </v-list-group>
          </v-list-item>
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
    interval: 0
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
    getMyWines() {
      axios
        .get("/mycellar", {
          headers: { current_cellar_id: this.currentCellar.id }
        })
        .then(res => {
          console.log(res.data.my_wines);
          this.wines = res.data.my_wines;
          this.loading = false;
          clearInterval(this.interval);
        });
    },
    winesLoading() {
      if (this.loading) {
        this.interval = setInterval(() => {
          this.nbBottles += 1;
          console.log(this.nbBottles);
        }, 700);
      }
    }
  },
  watch: {
    currentCellar: function() {
      this.getMyWines();
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
</style>