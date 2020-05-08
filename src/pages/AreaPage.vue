<template>
  <v-app class="auth px-4 py-4">
    <v-row class="shrink">
      <v-col class="col-7">
        <v-card>
          <v-img
            :src="area.info.photo"
            class="white--text align-end"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
          >
            <v-card-title class="mb-3 ml-1" v-text="area.name"></v-card-title>
          </v-img>
        </v-card>
      </v-col>
      <v-col class="col-5">
        <a class="region d-flex justify-center" @click="$router.push('/regions/'+area.region.name)">
          <h2 class>{{area.region.name}}</h2>
        </a>
        <v-card @click="mapZoom">
          <v-img :src="area.region.map" />
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="zoomDialog" max-width="80vw">
      <v-card>
        <v-img :src="area.region.map" />
      </v-card>
    </v-dialog>

    <v-item-group v-if="renderList">
      <v-container>
        <v-row class='justify-center'>
          <v-col class='item-col' v-for="(item,i) in itemsList" :key="i">
            <v-item v-slot:default="{ active,toggle }">
              <v-card
                :color="active ? '#9826ac' : ''"
                class="d-flex justify-space-around"
                dark
                @click="toggle; itemDescription(i)"
              >
                <v-card-title
                  class="ml-1"
                  style="
    font-size: inherit;
"
                  v-text="trueItemsList[i]"
                ></v-card-title>
              </v-card>
            </v-item>
          </v-col>
        </v-row>
      </v-container>
    </v-item-group>
    <div>
      <p>{{itemDesc}}</p>
    </div>

    <v-item-group>
      <v-container>
        <v-row class='justify-center'>
          <v-col class="grape-col" v-for="(grape,i) in area.grapes" :key="i">
            <v-item v-slot:default="{ active,toggle }">
              <v-card
                :color="grape===currentGrape ? '#9826ac' : ''"
                class="d-flex justify-space-around"
                dark
                height="150"
                @click="toggle; grapeDescription(grape)"
              >
                <v-img
                  src="../assets/grapes.png"
                  heigth="50"
                  width="50"
                  gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                  class="white--text align-end"
                >
                  <v-card-subtitle class="ml-1" v-text="grape.name"></v-card-subtitle>
                </v-img>
              </v-card>
            </v-item>
          </v-col>
        </v-row>
      </v-container>
    </v-item-group>
    <div>
      <p>{{grapeDesc}}</p>
    </div>
    <v-card v-for="(winery,i) in area.winery" :key="i" outlined>
      <v-row class="d-flex justify-space-around">
        <v-col class="ml-5 col-2">
          <v-img src="../assets/vineyards.png" width="50" heigth="50" />
        </v-col>
        <v-col class="ma-2 col-6 d-flex justify-start">
          <h3 class="d-flex wine-name justify-center col-7">{{winery.name}}</h3>
        </v-col>
        <v-col class="ma-2 col-3 d-flex wine-name justify-center">
          <h4>You have {{winery.wines_nb}} bottle(s) from this winery</h4>
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
    area: undefined,
    grapeDesc: "",
    currentGrape: undefined,
    zoomDialog: false,
    trueItemsList: [],
    itemsList: [],
    itemDesc: "",
    renderList: false
  }),
  methods: {
    getArea() {
      this.renderList=false;
      const area_name = this.$route.params.area_name;
      axios
        .get("/areas/" + area_name, {
          headers: { current_cellar_id: this.currentCellar.id }
        })
        .then(res => {
          console.log(res.data);
          this.area = res.data;
          if (res.data.info.description != "") {
            this.itemsList.push("description");
            this.trueItemsList.push("Description");
          }
          if (res.data.info.keep_advise != "") {
            this.itemsList.push("keep_advise");
            this.trueItemsList.push("Conseils de garde");
          }
          if (res.data.info.eye != "") {
            this.itemsList.push("eye");
            this.trueItemsList.push("Oeil");
          }
          if (res.data.info.nose != "") {
            this.itemsList.push("nose");
            this.trueItemsList.push("Nez");
          }
          if (res.data.info.mouth != "") {
            this.itemsList.push("mouth");
            this.trueItemsList.push("Bouche");
          }
          if (res.data.info.food != "") {
            this.itemsList.push("food");
            this.trueItemsList.push("Plats");
          }
          this.$nextTick(()=>{this.renderList=true;
          this.itemDesc=this.area.info.description})
        });
    },
    grapeDescription(grape) {
      this.grapeDesc = grape.description;
      this.currentGrape = grape;
    },
    mapZoom() {
      this.zoomDialog = true;
    },
    itemDescription(index) {
      const item = this.itemsList[index];
      this.itemDesc = this.area.info[item];
      this.currentItem = item;
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
    this.getArea();
  }
};
</script>
<style scoped>
.v-card__subtitle,
.v-card__text,
.v-card__title {
  padding: 8px;
}
.v-card__title {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  font-size: 3rem;
  font-weight: 500;
  letter-spacing: 0.0125em;
  line-height: 2rem;
  word-break: break-all;
}
a.region {
  text-decoration: none;
  color: #bd9363;
}
.wine-name {
  flex-direction: column;
}

.item-col {
    max-width: fit-content;
}
.shrink {
    flex-grow: initial;
}
.grape-col {
    max-width: 175px;
}
</style>