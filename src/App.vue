<template>
  <v-app>
    <template v-if="auth.loading">
      <v-content class="fill-height">
        <v-container fluid class="fill-height">
          <v-row justify="center" class="fill-height" align="center">
            <v-col class="text-center">
              <v-progress-circular indeterminate />
            </v-col>
          </v-row>
        </v-container>
      </v-content>
    </template>

    <template v-else-if="!auth.user.authenticated">
      <v-content class="fill-height">
        <v-container fluid class="fill-height pa-0">
          <LoginPage />
        </v-container>
      </v-content>
    </template>

    <template v-else>
      <v-navigation-drawer
        color="#e69c4736"
        v-model="drawer"
        app
        width="300"
        clipped
        class="elevation-4 background"
      >
        <ProfileSummaryCard :profile="auth.user.profile" />
        <CurrentCellarCard />

        <v-divider class="mt-8" />

        <v-list rounded class="transparent">
          <template v-for="(item,i) in nav">
            <v-list-item :key="i" class="px-5 my-4">
              <v-list-group color="#bb3e2d">
                <template v-slot:activator>
                  <v-list-item-icon>
                    <v-img
                      v-bind:src="require('../src/assets/'+ item.asset)"
                      contain
                      width="45"
                      height="45"
                    />
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.text"></v-list-item-title>
                  </v-list-item-content>
                </template>
                <v-list flat class="pl-10" >
                <v-list-item-group class="test">
                  <v-list-item
                    v-for="(sub_item, j) in item.sub_nav"
                    :key="j"
                    :to="sub_item.path"
                  >
                    <v-list-item-content>
                      <v-list-item-title v-text="sub_item.text"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
                </v-list>
              </v-list-group>
            </v-list-item>
          </template>
        </v-list>

        <v-btn color="error" text absolute block bottom @click="logout">Deconnexion</v-btn>
      </v-navigation-drawer>

      <v-app-bar
        color="#a57034a1"
        app
        class="background elevation-2 px-4"
        height="112"
        clipped-left
      >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

        <v-toolbar-title>
          <img
            src="./assets/wine_glass.png"
            alt="logo"
            class="mb-2"
            style="height: 75px; display: block"
            @click="$router.push('/')"
          />
        </v-toolbar-title>
      </v-app-bar>

      <v-content class="background">
        <v-container class="py-0 px-0">
          <v-fade-transition mode="out-in" appear>
            <router-view :key="$route.fullPath" />
          </v-fade-transition>
        </v-container>
      </v-content>
    </template>
  </v-app>
</template>

<script>
import auth from "./modules/auth";

import LoginPage from "./pages/AuthPage.vue";
import ProfileSummaryCard from "./components/ProfileSummaryCard.vue";
import CurrentCellarCard from "./components/CurrentCellarCard.vue";

export default {
  name: "App",

  components: { LoginPage, ProfileSummaryCard, CurrentCellarCard },

  data: () => ({
    profile: false,
    drawer: true,
    auth: {
      user: auth.user,
      loading: true
    },
    nav: [
      {
        text: "Wines",
        asset: "magnify.png",
        sub_nav: [{ text: "Look for a wine", path: "/" }]
      },
      {
        text: "My Cellar",
        asset: "cellar.png",
        sub_nav: [
          { text: "Livret de cave", path: "/mycellar" },
          { text: "Statistiques", path: "/mycellar/stats" }
        ]
      },
      {
        text: "My recipes",
        asset: "recipes.png",
        sub_nav: [
          { text: "Match a recipe", path: "/myrecipes" },
          { text: "Match a bottle", path: "/myrecipes" }
        ]
      }
    ]
  }),
  methods: {
    logout() {
      this.profile = false;
      auth.logout();
    }
  },
  created() {
    auth.checkAuth(undefined).then(() => {
      this.auth.loading = false;
    });

    setInterval(() => auth.checkAuth(undefined), 60000);
  }
};
</script>
<style scoped>
.test {
  background-color: #fdf2e5 !important;
}
</style>