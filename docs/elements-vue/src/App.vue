<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
      </div>

      <v-spacer></v-spacer>
      <router-link to="/"><v-btn tile>EEPs</v-btn></router-link>
      <router-link to="/log"><v-btn tile>Logger</v-btn></router-link>
      <router-link to="/devices"><v-btn tile>Devices</v-btn></router-link>
      <router-link to="/about"><v-btn tile>About</v-btn></router-link>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import EepViewer from "@/components/EepViewer.vue";

export default Vue.extend({
  name: 'App',

  components: {
    EepViewer
  },

  data: () => ({
    //
  }),
});
</script>
