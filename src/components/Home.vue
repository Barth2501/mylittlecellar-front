<template>
  <v-col>
    <v-form>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="3">
            <v-text-field v-model="query" label="Regular"></v-text-field>
            <div class="my-2">
              <v-btn small @click="onSend">Normal</v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <v-row v-for="(wine, i) in wines" :key="i" class="pl-10 my-4">
      <v-col>
        <v-list-item-content>
          <v-img :src="wine.maturity" max-height="50px" max-width="50px"></v-img>
          <v-list-item-title v-text="wine.wine_name" />
          <v-list-item-title v-text="wine.domain_name" />
          <v-list-item-title v-text="wine.vintage" />
          <v-list-item-title v-text="wine.mark" />
        </v-list-item-content>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    query: "",
    wines: []
  }),
  methods: {
    getWines() {
      const path = "http://localhost:5000";
      axios.get(path).then(res => {
        this.wines = res.data;
      });
    },
    onSend(evt) {
      evt.preventDefault();
      const payload = {
        query: this.query
      };
      this.sendQuery(payload);
    },
    sendQuery(payload) {
      const path = "http://localhost:5000";
      axios.post(path, payload)
      .then((res) => {
        console.log(res.data.wines);
        this.wines = res.data.wines;
      });
    }
  }
};
</script>
