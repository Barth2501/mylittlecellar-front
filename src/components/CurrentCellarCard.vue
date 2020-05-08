<template>
  <v-card color="#e6cfb5" outlined class="ma-4">
    <v-list-item>
      <v-list-item-content>
        <div class="overline mb-4">Ma cave</div>
        <v-list-item-title
          v-if="currentCellar != undefined"
          class="headline mb-1"
        >{{ currentCellar.name }}</v-list-item-title>
      </v-list-item-content>
      <v-list-item-avatar tile size="50" color="#a57034a1">
        <v-img src="../assets/empty_barrel.png" />
      </v-list-item-avatar>
    </v-list-item>
    <v-row class="d-flex justify-space-between py-0">
      <v-col class="py-0">
        <v-list v-if="renderCellarList" rounded class="transparent">
          <v-list-group color="primary">
            <template v-slot:activator>
              <h5>changer de cave</h5>
            </template>
            <v-list-item v-for="(cellar,i) in cellars" :key="i">
              <v-btn>
                <v-list-title v-text="cellar.name" hover @click="changeCellar(cellar)" />
              </v-btn>
            </v-list-item>
          </v-list-group>
        </v-list>
      </v-col>
      <v-col class="d-flex align-self-start shrink mr-3">
        <v-icon @click="addCellarForm" >mdi-plus-circle-outline</v-icon>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-dialog v-model="addCellarDialog" max-width="350">
        <v-card>
          <v-card-title class="headline center">Créer une nouvelle cave</v-card-title>

          <v-card-text class="center">Choisissez le nom de votre cave</v-card-text>
          <v-card-text>
            <v-text-field v-model="name" label="Name"></v-text-field>
          </v-card-text>
          <v-card-actions class="d-flex justify-center">
            <v-btn color="green darken-1" text @click="addCellarDialog = false">Annuler</v-btn>

            <v-btn color="green darken-1" text @click="addCellar">Ajouter</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row justify="center">
      <v-dialog v-model="chooseCellarDialog" max-width="290">
        <v-card>
          <v-card-title class="headline">Choisissez votre cave</v-card-title>
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
    name: "",
    renderCellarList: true
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
      this.renderCellarList = false;
      this.$nextTick(() => (this.renderCellarList = true));
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
        this.renderCellarList = false;
        this.currentCellar = res.data;
        this.$nextTick(() => {
          this.renderCellarList = true;
        });
      });
    }
  },
  created() {
    this.getMyCellars();
  }
};
</script>

<style scoped>
.shrink {
  flex-grow: initial;
}
.center {
  justify-content: center;
  text-align: center;
}
</style>
