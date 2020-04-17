<template>
  <v-card color="#c6a47e63" outlined class="ma-4">
    <v-list-item three-line>
      <v-list-item-content>
        <div class="overline mb-4">My cellar</div>
        <v-list-item-title
          v-if="currentCellar != undefined"
          class="headline mb-1"
        >{{ currentCellar.name }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-row class="d-flex justify-start">
      <v-col class="col-10">
        <v-list rounded class="transparent">
          <v-list-group color="primary">
            <template v-slot:activator>
              <v-list-item-title>change cellar</v-list-item-title>
            </template>
            <v-list-item v-for="(cellar,i) in cellars" :key="i">
              <v-btn>
                <v-list-title v-text="cellar.name" hover @click="changeCellar(cellar)" />
              </v-btn>
            </v-list-item>
          </v-list-group>
        </v-list>
      </v-col>
      <v-col class="d-flex  align-self-start" style="
    padding-left: 0px;
">
        <v-icon @click="addCellarForm" class="mt-5">mdi-plus-circle-outline</v-icon>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-dialog v-model="addCellarDialog" max-width="290">
        <v-card>
          <v-card-title class="headline">Create a new cellar</v-card-title>

          <v-card-text>Please choose a name for your cellar</v-card-text>
          <v-card-text>
            <v-text-field v-model="name" label="Name"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="green darken-1" text @click="addCellarDialog = false">Cancel</v-btn>

            <v-btn color="green darken-1" text @click="addCellar">Add</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row justify="center">
      <v-dialog v-model="chooseCellarDialog" max-width="290">
        <v-card>
          <v-card-title class="headline">Choose your cellar</v-card-title>
          <v-list>
            <v-list-item v-for="(cellar,i) in cellars" :key="i">
              <v-list-item-content hover @click="changeCellar(cellar)">
                <v-btn>{{cellar.name}}</v-btn>
              </v-list-item-content>
            </v-list-item>
            <v-list-item></v-list-item>
          </v-list>
        </v-card>
      </v-dialog>
    </v-row>
  </v-card>
</template>


<script>
import axios from "axios";

export default {
  data: () => ({
    cellars: [],
    currentCellar: undefined,
    addCellarDialog: false,
    chooseCellarDialog: false,
    name: ""
  }),
  mounted() {
    if (localStorage.getItem("current_cellar")) {
      try {
        this.currentCellar = JSON.parse(localStorage.getItem("current_cellar"));
      } catch (e) {
        localStorage.removeItem("current_cellar");
      }
    } else {
      this.chooseCellarDialog = true;
    }
  },
  methods: {
    changeCellar(cellar) {
      this.currentCellar = cellar;
      localStorage.setItem("current_cellar", JSON.stringify(cellar));
      this.chooseCellarDialog = false;
      this.cellarListState = false;
      location.reload();
    },
    getMyCellars() {
      axios.get("mycellars").then(res => {
        if (res.data.cellars === "no registered cellar") {
          this.addCellarDialog = true;
        } else {
          this.cellars = res.data.cellars;
        }
      });
    },
    addCellarForm() {
      this.addCellarDialog = true;
    },
    addCellar() {
      const payload = { name: this.name };
      axios.post("/mycellars", payload).then(res => {
        localStorage.setItem("current_cellar", JSON.stringify(res.data));
        this.getMyCellars();
        this.addCellarDialog = false;
        location.reload();
      });
    }
  },
  created() {
    this.getMyCellars();
  }
};
</script>

<style scoped></style>
