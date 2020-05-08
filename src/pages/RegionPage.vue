<template>
  <v-app class="auth px-4 py-4">
    <v-row class="d-flex justify-space-around">
      <v-col class="col-5">
        <v-card>
          <v-img
            :src="region.info.photo"
            class="white--text align-end"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
          >
            <!-- <v-card-title class="mb-3 ml-1 region-card" v-text="region.name"></v-card-title> -->
          </v-img>
        </v-card>
      </v-col>
      <v-col class="col-7 d-flex" style="flex-direction:column;">
        <v-card @click="mapZoom">
          <v-img :src="region.info.region_map" />
        </v-card>
        <div class="d-flex flex-grow-1 justify-center">
          <div class="d-flex justify-center" style="flex-direction:column;">
            <div class="region-name">{{region.name}}</div>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-item-group>
      <v-container>
        <v-row>
          <v-col v-for="(item,i) in itemsList" :key="i">
            <v-item v-slot:default="{ active,toggle }">
              <v-card
                :color="item===currentItem ? '#9826ac' : ''"
                class="d-flex justify-space-around"
                dark
                @click="toggle; itemDescription(i)"
              >
                <v-card-title class="ml-1" v-text="trueItemsList[i]"></v-card-title>
              </v-card>
            </v-item>
          </v-col>
        </v-row>
      </v-container>
    </v-item-group>
    <div>
      <p>{{itemDesc}}</p>
    </div>

    <v-dialog v-model="zoomDialog" max-width="80vw">
      <v-card>
        <v-img :src="region.info.region_map" />
      </v-card>
    </v-dialog>

    <v-card v-for="(area,i) in region.areas" :key="i" outlined @click="$router.push('/areas/'+area.name)">
      <v-row class="d-flex justify-space-around">
        <v-col class="ml-5 col-2">
          <v-img src="../assets/grapes.png" width="50" heigth="50" />
        </v-col>
        <v-col class="ma-2 col-6 d-flex justify-start">
          <h3 class="d-flex wine-name justify-center col-7">{{area.name}}</h3>
        </v-col>
        <v-col v-if="area.wines_nb!=undefined" class="ma-2 col-3 d-flex wine-name justify-center">
          <h4>Vous possédez {{area.wines_nb}} bouteille(s) de cette appellation</h4>
        </v-col>
        <v-col v-else class="ma-2 col-3 d-flex wine-name justify-center">
          <h4>Vous ne possédez pas de bouteille de cette appellation</h4>
        </v-col>
      </v-row>
    </v-card>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    currentCellar: undefined,
    region: undefined,
    zoomDialog: false,
    itemsList: ["description", "wine_style", "history", "weather_and_soil"],
    trueItemsList: [
      "Description",
      "Style de vin",
      "Histoire",
      "Climat et terroir"
    ],
    itemDesc: "",
    currentItem: ""
  }),
  methods: {
    getRegion() {
      const region_name = this.$route.params.region_name;
      axios
        .get("/regions/" + region_name, {
          headers: { current_cellar_id: this.currentCellar.id }
        })
        .then(res => {
          console.log(res.data);
          this.region = res.data;
        });
    },
    mapZoom() {
      this.zoomDialog = true;
    },
    itemDescription(index) {
      const item = this.itemsList[index];
      this.itemDesc = this.region.info[item];
      this.currentItem = item;
    }
  },
  created() {
    if (localStorage.getItem("current_cellar")) {
      try {
        this.currentCellar = JSON.parse(localStorage.getItem("current_cellar"));
      } catch (e) {
        localStorage.removeItem("current_cellar");
      }
    }
    this.getRegion();
  }
};
</script>

<style scoped>
.region-card {
  font-weight: 700;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  font-size: 3rem;
  font-weight: 700;
  letter-spacing: 0.0125em;
  line-height: 2rem;
  word-break: break-all;
}
.region-name {
  font-size: 3rem;
  font-weight: 700;
  letter-spacing: 0.0125em;
  line-height: 2rem;
  word-break: break-all;
}
.wine-name {
  flex-direction: column;
}
</style>