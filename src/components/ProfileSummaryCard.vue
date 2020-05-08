<template>
  <v-card color="#e6cfb5" outlined class="ma-4" hover to="/mycellar/stats">
    <v-list-item three-line>
      <v-list-item-content>
        <div class="overline mb-4">Compte</div>
        <v-list-item-title class="headline mb-1">
          {{ profile.username }}
        </v-list-item-title>
        <v-list-item-subtitle>
          Grand amateur de vin
        </v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-avatar tile size="50" color="#a57034a1">
        <v-img src="../assets/grapes.png" />
      </v-list-item-avatar>
    </v-list-item>

    <!-- <v-row class="py-0 mt-2 px-2 mx-0">
      <v-col cols="4">
        Cash
      </v-col>
      <v-col class="text-right" cols="8">
        {{ profile.cash_flow | toCurrency }}
      </v-col>
      <v-col cols="4">
        Porfolio
      </v-col>
      <v-col class="text-right" cols="8">
        {{ profile.wallet_value | toCurrency }}
      </v-col>
    </v-row>
    <v-row class="py-0 px-2 mx-0 primary">
      <v-col cols="4">
        Total
      </v-col>
      <v-col class="text-right font-weight-bold" cols="8">
        <v-icon v-if="valueTrend === true" class="pb-1" color="success">
          mdi-menu-up
        </v-icon>
        <v-icon v-else-if="valueTrend === false" class="pb-1" color="error">
          mdi-menu-down
        </v-icon>
        {{ profile.value | toCurrency }}
      </v-col>
    </v-row> -->
  </v-card>
</template>

<script>
export default {
  props: ['profile']
};
</script>

<style scoped></style>
