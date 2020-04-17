<template>
  <v-app class="auth px-4 py-4">
    <v-card>
      <v-toolbar elevation="0" color="#c84431d9">
        <v-toolbar-title>Wine Shopping</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card class="d-flex justify-center" elevation="0" color="#d05f4f40">
        <v-banner color="#ffffff00">
          <v-row class="d-flex mx-auto ml-5">
            <img src="../assets/crate.png" height="100" width="100" contain />
            <v-col class="d-flex flex-column ml-5">
              <div>
                <h3>Which wine do you own?</h3>
              </div>
              <div>
                <v-row class="d-flex align-center ml-1">
                  <v-text-field class="max-auto" v-model.lazy="query" label="Wines" @change="test"></v-text-field>
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

    <v-card v-if="query===''" class="d-flex justify-center mt-5" elevation="0" color="#d05f4f40">
      <v-banner color="#ffffff00">
        <v-col class="d-flex justify-center my-12" style="flex-direction: column;">
          <v-row class="d-flex justify-center">
            <h2>Type the information on your wine on the search bar above...</h2>
          </v-row>
          <v-row class="d-flex justify-center mt-12">
            <img src="../assets/grape_and_barrel.png" height="250" width="250" contain />
          </v-row>
          <v-row class="d-flex justify-center mt-4">
            <h3>We will do our best to find it whereever it is</h3>
          </v-row>
        </v-col>
      </v-banner>
    </v-card>

    <v-card v-else class="mt-5">
      <v-list two-line color="#d05f4f40">
        <v-list-item-group mandatory>
          <template v-for="(wine, index) in wines">
            <v-list-item :key="`wine-${index}`" :value="wine">
              <template>
                <v-list-item-content>
                  <v-row class="d-flex justify-center justify-space-between">
                    <v-col class="col-6 mr-auto">
                      <v-list-item-title v-text="wine.wine_name"></v-list-item-title>
                      <v-list-item-subtitle
                        class="text--primary font-italic ml-2"
                      >{{ wine.winery_name }}</v-list-item-subtitle>
                    </v-col>
                    <v-col class="col-2">
                      <v-list-item-title class="mb-2" v-text="wine.vintage"></v-list-item-title>
                      <v-list-item-subtitle v-if="wine.mark">Mark : {{wine.mark}}</v-list-item-subtitle>
                    </v-col>
                    <v-col class="col-3">
                      <v-alert
                        v-if="added_list[index] && !is_check_list[index]"
                        dense
                        text
                        type="success"
                      >{{ number_list[index] }} bottle(s) added</v-alert>
                    </v-col>
                  </v-row>
                </v-list-item-content>

                <v-list-item-action>
                  <v-row class="d-flex justify-center">
                    <v-col>
                      <v-checkbox v-model="is_check_list[index]" color="deep-purple accent-4"></v-checkbox>
                    </v-col>
                    <v-col v-if="is_check_list[index]" class="col-4">
                      <v-text-field
                        v-model="number_list[index]"
                        type="number"
                        label="How many?"
                        @click:append-outer="increment"
                        @click:prepend="decrement"
                      ></v-text-field>
                    </v-col>
                    <v-col v-if="is_check_list[index]">
                      <v-btn color="green darken-1" text @click="selectWine(wine,index)">Add</v-btn>
                    </v-col>
                    <v-icon v-if="!is_check_list[index]" color="grey lighten-1"></v-icon>
                  </v-row>
                </v-list-item-action>
              </template>
            </v-list-item>

            <v-divider v-if="index + 1 < wines.length" :key="index"></v-divider>
          </template>
        </v-list-item-group>
      </v-list>
      <v-snackbar
        v-model="snackbar.value"
        :bottom="true"
        :right="true"
        :timeout="5000"
        :multi-line="true"
      >
        <p>
          <b>{{ snackbar.number }}</b> bottle(s) of
          <b>{{snackbar.wine}}</b> have been added to your cellar
          <b>{{currentCellar.name}}</b>
          <v-btn dark text @click="snackbar.value = false">Close</v-btn>
        </p>
      </v-snackbar>
    </v-card>
    <v-btn @click="test" />
  </v-app>
</template>

<script>
import axios from "axios";
import _ from "lodash";

export default {
  data: () => ({
    query: "",
    last_update: 0,
    wines: [],
    currentCellar: undefined,
    number_list: [],
    is_check_list: [],
    added_list: [],
    snackbar: {
      value: false,
      wine: "",
      number: 0
    }
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
        query: this.query
      };
      this.sendQuery(payload);
    },
    SearchForWines() {
      this.wines = [];
      this.number_list = [];
      this.is_check_list = [];
      this.added_list = [];
      let path = "";
      if (process.env.VUE_APP_USE_NGROK === "true") {
        path = process.env.VUE_APP_NGROK_SCRAP + "/wine_decider";
      } else {
        path = "http://localhost:8001/wine_decider";
      }
      let time_init = Date.now();
      this.axiosLoop(path, { query: this.query }, time_init);
    },
    async axiosLoop(path, payload, start_time) {
      const time = Date.now();
      if (time - start_time < 5000) {
        console.log("yes");
        const res = await axios.post(path, payload);
        console.log(res);
        this.wines.push(...res.data.wines);
        const len = res.data.wines.length;
        const a = new Array(len).fill(0);
        this.number_list.push(...a);
        this.is_check_list.push(...a);
        this.added_list.push(...a);
        this.axiosLoop(path, payload, start_time);
      } else {
        console.log("timeout");
      }
    },
    sendQuery(payload) {
      let path = "";
      if (process.env.VUE_APP_USE_NGROK === "true") {
        path = process.env.VUE_APP_NGROK_SCRAP;
      } else {
        path = "http://localhost:8001";
      }
      path = path + "/wine_decider";
      axios.post(path, payload).then(res => {
        console.log(res.data.wines);
        this.wines = res.data.wines;
        this.number_list = new Array(res.data.wines.length).fill(0);
        this.is_check_list = new Array(res.data.wines.length).fill(false);
        this.added_list = new Array(res.data.wines.length).fill(false);
      });
    },
    selectWine(wine, index) {
      const payload = wine;
      payload["number"] = this.number_list[index];
      payload["cellar_id"] = this.currentCellar.id;
      axios.post("/mycellar", payload).then(res => {
        console.log(res);
        this.added_list[index] = true;
        this.is_check_list[index] = false;
        this.snackbar.wine = wine.wine_name;
        this.snackbar.number = this.number_list[index];
        this.snackbar.value = true;
        console.log(this.snackbar);
      });
      this.numberDialog = false;
    },
    increment() {
      this.foo = parseInt(this.foo, 10) + 1;
    },
    decrement() {
      this.foo = parseInt(this.foo, 10) - 1;
    },
    test() {
      console.log(0);
    }
  },
  created: function() {
    this.debounceWines = _.debounce(this.SearchForWines, 500);
  },
  watch: {
    query: function(val) {
      if (val!='') {
      this.debounceWines();
      }
    }
  }
};
</script>
