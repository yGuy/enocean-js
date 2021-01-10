<template>
  <v-card>
    <v-card-title>Radio Message</v-card-title>
    <v-card-subtitle>{{ message }}</v-card-subtitle>
    <v-card-text>
      <radio-message :message="message"></radio-message>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import RadioMessage from "@/components/RadioMessage.vue";

@Component({components:{RadioMessage}})
export default class extends Vue {
  get message(): string | null {
    return this.$route && this.$route.params['message'] || null
  }
}
</script>

<style scoped>

</style>