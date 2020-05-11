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
                <h3>Quel(s) vin(s) voulez-vous ajouter à votre cave ?</h3>
              </div>
              <div class="d-flex">
                <v-col>
                  <v-text-field class="max-auto" v-model.lazy="winery_name" label="Nom du domaine"></v-text-field>
                  <v-text-field class="max-auto" v-model.lazy="wine_name" label="Nom du vin"></v-text-field>
                </v-col>
                <v-col class="d-flex justify-center col-flex">
                  <div>
                    <v-text-field class="max-auto" v-model.lazy="vintage_query" label="Millésime"></v-text-field>
                  </div>
                </v-col>
                <v-btn @click="resetQuery" icon>
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-banner>
      </v-card>
    </v-card>

    <v-card
      v-if="winery_name===''"
      :key="winery_name"
      class="d-flex justify-center mt-5"
      elevation="0"
      color="#d05f4f40"
    >
      <v-banner color="#ffffff00">
        <v-col class="d-flex justify-center my-12" style="flex-direction: column;">
          <v-row class="d-flex justify-center">
            <h2>Rentrez ci-dessus les informations de votre vin...</h2>
          </v-row>
          <v-row class="d-flex justify-center mt-12">
            <img src="../assets/grape_and_barrel.png" height="250" width="250" contain />
          </v-row>
          <v-row class="d-flex justify-center mt-4">
            <h3>Nous ferons tout pour le trouver</h3>
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
                    <v-col class="col-color">
                      <v-card v-if="wine.color==='Blanc'" color="#e6cfb5" class="wine-color" />
                      <v-card v-if="wine.color==='Rouge'" color="#701328" class="wine-color" />
                      <v-card v-if="wine.color==='Rose'" color="#ed5565" class="wine-color" />
                      <v-card v-if="wine.color==='Jaune'" color="#ffc107" class="wine-color" />
                    </v-col>
                    <v-col class="col-6 mr-auto align-self-center">
                      <v-list-item-title v-text="wine.wine_name"></v-list-item-title>
                      <v-list-item-subtitle
                        class="text--primary font-italic ml-2"
                      >{{ wine.winery_name }}</v-list-item-subtitle>
                    </v-col>
                    <v-col class="col-2 align-self-center">
                      <v-list-item-title v-if="vintage===''" class="mb-2" v-text="wine.vintage"></v-list-item-title>
                      <v-list-item-title v-else class="mb-2" v-text="vintage"></v-list-item-title>
                      <v-list-item-subtitle v-if="wine.mark">Mark : {{wine.mark}}</v-list-item-subtitle>
                    </v-col>
                    <v-col
                      v-if="added_list[index] && !is_check_list[index]"
                      class="col-3 added-alert"
                    >
                      <v-alert
                        class="added-alert"
                        dense
                        text
                        type="success"
                      >{{ number_list[index] }} bottle(s) added</v-alert>
                    </v-col>
                  </v-row>
                </v-list-item-content>

                <v-list-item-action>
                  <v-row class="d-flex justify-center add-panel">
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
    winery_name: "",
    wine_name: "",
    vintage_query: "",
    vintage: "",
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
      let path = "";
      if (process.env.NODE_ENV === "development") {
        path = "http://localhost:8001/wine_decider";
      } else {
        path = "https://mylittlecellar-scrap.herokuapp.com/wine_decider";
      }
      const q = this.winery_name + " " + this.wine_name;
      if (q != " ") {
        let time_init = Date.now();
        // the loop counter is used to know if it is the first loop, if so the all wines result will be reinitialised
        this.axiosLoop(path, { query: q }, time_init, 1);
      }
    },
    async axiosLoop(path, payload, start_time, loop) {
      const time = Date.now();
      if (time - start_time < 5000) {
        const res = await axios.post(path, payload);
        console.log(res);
        // Reinitialisation of the results because it is the first loop
        // this if statement is just to be sure we don't start an other scrap if the current query is not the one
        // the scrap function will also handled the changement of the query
        if (
          (loop === 1) &
          (payload.query === this.winery_name + " " + this.wine_name)
        ) {
          this.wines = [];
          this.number_list = [];
          this.is_check_list = [];
          this.added_list = [];
        }
        // intermArr will have his duplicates dropped if the vintage query is not empty
        // it's usefull when the vintage input is set and an other input is changed
        // because in this case you don't want to have exactly the same wine in the result
        var intermedArr = this.wines;
        intermedArr.push(...res.data.wines);
        if (this.vintage != "") {
          intermedArr = _.uniqBy(intermedArr, function(elem) {
            return [elem.wine_name, elem.color, elem.winery_name].join();
          });
        }
        const len = res.data.wines.length;
        const a = new Array(len).fill(0);
        const b = new Array(len).fill(1);
        this.$nextTick(() => {
          this.wines = intermedArr;
          this.number_list.push(...b);
          this.is_check_list.push(...a);
          this.added_list.push(...a);
        });
        loop++;
        this.axiosLoop(path, payload, start_time, loop);
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
      payload["vintage"] = this.vintage === "" ? wine.vintage : this.vintage;
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
    dropDuplicate() {
      this.wines = _.uniqBy(this.wines, function(elem) {
        return [elem.wine_name, elem.color, elem.winery_name].join();
      });
      console.log(this.wines);
    },
    increment() {
      this.foo = parseInt(this.foo, 10) + 1;
    },
    decrement() {
      this.foo = parseInt(this.foo, 10) - 1;
    },
    resetQuery() {
      this.wine_name = "";
      (this.winery_name = ""), (this.vintage_query = "");
    },
    test() {
      console.log(0);
    }
  },
  created: function() {
    this.debounceWines = _.debounce(this.SearchForWines, 500);
    this.debounceDuplicate = _.debounce(this.dropDuplicate, 500);
  },
  watch: {
    winery_name: function(newVal, oldVal) {
      if (oldVal != "") {
        this.debounceWines();
      }
    },
    wine_name: function(newVal, oldVal) {
      if (oldVal != "") {
        this.debounceWines();
      }
    },
    vintage_query: function(val) {
      const regex = RegExp("[0-9]{4}");
      if (regex.test(val) & (parseInt(val) < 2020)) {
        // this part is used to reset the added token if we only change the vintage
        this.number_list = this.number_list.fill(1);
        this.is_check_list = this.is_check_list.fill(false);
        this.added_list = this.added_list.fill(false);
        this.debounceDuplicate();
        this.vintage = this.vintage_query;
      } else if (val === "") {
        this.vintage = "";
        this.SearchForWines();
      }
    }
  }
};
</script>
<style scoped>
.col-flex {
  flex-direction: column;
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
.added-alert {
  margin-bottom: 0px;
}
.add-panel {
  align-items: center;
}
</style>