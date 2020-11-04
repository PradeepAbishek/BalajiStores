<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <h1 class="ttu">Balaji Stores</h1>
      <v-spacer></v-spacer>
      <v-avatar color="success" size="36" v-if="totalItemsEntered > 0">
        <span class="white--text b">{{ totalItemsEntered }}</span>
      </v-avatar>
    </v-app-bar>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({}),
  computed: {
    totalItemsEntered() {
      return this.$store.state.totalItemsEntered;
    },
  },
};
</script>
