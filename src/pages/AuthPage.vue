<template>
  <v-row class="fill-height ma-0">
    <v-col lg="8" md="10" class="hidden-sm-and-down auth-left" />
    <v-col lg="4" md="8" sm="12" class="auth elevation-10">
      <v-fade-transition mode="out-in">
        <v-row
          v-if="!registering && !forgeting"
          key="login"
          class="fill-height px-10"
          align="center"
          justify="center"
        >
          <v-col xl="8" lg="10" md="12">
            <img src="../assets/wine_glass.png" class="logo px-10 mb-10" />

            <v-text-field
              background-color="rgba(187, 62, 45, 0.28)"
              v-model="email"
              placeholder="E-mail"
              required
              light
              filled
              rounded
            />

            <v-text-field
              background-color="rgba(187, 62, 45, 0.28)"
              v-model="password"
              placeholder="Mot de passe"
              required
              light
              filled
              rounded
              type="password"
            />

            <v-btn
              color="rgba(79, 40, 22, 0.74)"
              class="mt-2"
              block
              light
              large
              rounded
              :loading="loading"
              @click="login"
            >Se connecter</v-btn>

            <v-row justify="space-between" align="center" class="mt-4 px-1">
              <v-col sm="6" cols="12">
                <v-checkbox v-model="remember" color="rgba(79, 40, 22, 0.74)" label="Se souvenir de moi" light />
              </v-col>
              <v-col class="text-right" sm="6" cols="12">
                <a
                  class="pwd font-weight-bold"
                  @click="forgeting = true"
                >Mot de passe oublié ?</a>
              </v-col>
            </v-row>
          </v-col>

          <div class="footer text-center">
            Pas de compte ? Rejoignez
            <a
              class="pwd font-weight-bold"
              @click="registering = true"
            >My Little Cellar</a>
          </div>
        </v-row>

        <v-row
          v-else-if="registering"
          key="registering"
          class="fill-height px-10"
          align="center"
          justify="center"
        >
          <v-col xl="8" lg="10" md="12">
            <img src="../assets/wine_glass.png" class="logo px-10 mb-10" />

            <v-text-field background-color="rgba(187, 62, 45, 0.28)" v-model="email" label="E-mail" required light filled rounded />

            <v-text-field background-color="rgba(187, 62, 45, 0.28)" v-model="username" label="Pseudo" required light filled rounded />

            <v-text-field
            background-color="rgba(187, 62, 45, 0.28)"
              v-model="password"
              label="Mot de passe"
              required
              light
              filled
              rounded
              type="password"
            />

            <v-btn
              color="rgba(79, 40, 22, 0.74)"
              class="mt-2"
              block
              light
              large
              rounded
              :loading="loading"
              @click="register"
            >S'inscrire</v-btn>

            <v-row justify="space-between" align="center" class="mt-4 px-1">
              <v-col cols="12">
                <v-checkbox v-model="remember" label="Se souvenir de moi" light color="rgba(79, 40, 22, 0.74)" />
              </v-col>
            </v-row>
          </v-col>

          <div class="footer text-center">
            Déja un compte ?
            <a
              class="pwd font-weight-bold"
              @click="registering = false"
            >Connectez vous</a>
          </div>
        </v-row>

        <v-row
          v-else-if="forgeting"
          key="forgeting"
          class="fill-height px-10"
          align="center"
          justify="center"
        >
          <v-col xl="8" lg="10" md="12">
            <img src="../assets/wine_glass.png" class="logo px-10 mb-10" />

            <v-text-field background-color="rgba(187, 62, 45, 0.28)" v-model="email" label="E-mail" required light filled rounded />

            <v-btn
              color="rgba(79, 40, 22, 0.74)"
              class="mt-2"
              block
              light
              large
              rounded
              :loading="loading"
            >J'ai oublié mon mot de passe</v-btn>
          </v-col>

          <div class="footer text-center">
            Déja un compte ?
            <a
              class="pwd font-weight-bold"
              @click="forgeting = false"
            >Connectez vous</a>
          </div>
        </v-row>
      </v-fade-transition>
      <v-snackbar v-model="error" right absolute class="ma-4">
        {{ errorText }}
        <v-btn color="accent" text @click="error = false">Close</v-btn>
      </v-snackbar>
    </v-col>
  </v-row>
</template>

<script>
import auth from "../modules/auth";

export default {
  props: {
    email: {
      type: String,
      default: ""
    },
    username: {
      type: String,
      default: ""
    },
    password: {
      type: String,
      default: ""
    },

    remember: {
      type: Boolean,
      default: true
    },
    error: {
      type: Boolean,
      default: false
    },
    errorText: {
      type: String,
      default: ""
    },

    loading: {
      type: Boolean,
      default: false
    },
    registering: {
      type: Boolean,
      default: false
    },
    forgeting: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    login() {
      this.loading = true;
      auth.login(this.email, this.password, this.remember).catch(error => {
        this.errorText = error;
        this.error = true;
        this.loading = false;
      });
    },
    register() {
      this.loading = true;
      auth
        .register(this.email, this.password, this.username, this.remember)
        .catch(error => {
          this.errorText = error;
          this.error = true;
          this.loading = false;
        });
    }
  }
};
</script>

<style scoped>
.auth {
  background-color: #f2dec2 !important;
}

.pwd {
  color: rgba(79, 40, 22, 0.74) !important;
}
.logo {
  width: 100%;
}

.auth-left {
  background-color: #343949;
  background-image: url("../assets/background.png");
  background-size: cover;
  background-repeat: repeat;
}

.footer {
  position: absolute;
  bottom: 24px;
  color: #343949;
}
</style>
