<template>
  <v-app class="auth px-4 py-4">
    <v-row>
      <v-col>
        <v-card>
          <v-img
            :src="area.info.photo"
            class="white--text align-end"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            height="300px"
          >
            <v-card-title class="mb-3 ml-1" v-text="area.name"></v-card-title>
          </v-img>
        </v-card>
      </v-col>
      <v-col>
        <a class="region" href="'/'">
          <h2 class="d-flex justify-center" :to="'/'">{{area.region.name}}</h2>
        </a>
      </v-col>
    </v-row>
    <div>
      <p>{{area.info.description}}</p>
    </div>

    <v-item-group mandatory>
      <v-container>
        <v-row>
          <v-col v-for="(grape,i) in area.grapes" :key="i">
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
                <v-card-subtitle class="ml-1" v-text="grape.name"> </v-card-subtitle>
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
              <v-img src='../assets/vineyards.png' width="50" heigth="50"/>
          </v-col>
        <v-col class="ma-2 col-9 d-flex justify-start">
            <h3 class='d-flex wine-name justify-center col-7'>{{winery.name}}</h3>
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
    currentGrape: undefined
  }),
  methods: {
    getArea() {
      const area_name = this.$route.params.area_name;
      axios
        .get("/areas/" + area_name, {
          headers: { current_cellar_id: this.currentCellar.id }
        })
        .then(res => {
          console.log(res.data);
          this.area = res.data;
        });
    },
    grapeDescription(grape) {
      this.grapeDesc = grape.description;
      this.currentGrape = grape;
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
.v-card__subtitle, .v-card__text, .v-card__title {
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
</style>