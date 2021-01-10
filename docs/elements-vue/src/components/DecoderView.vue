<template>
  <v-card>
    <v-card-title>Decoder</v-card-title>
    <v-card-text>
      <radio-view v-model="message"></radio-view>
      <eep-case v-if="eep && eep_case" :eep="eep" :eep-case="eep_case" :decoded-value="decodedValue"></eep-case>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import EepCase from "./EepCase.vue";
import {Case, Eep} from "@enocean-js/eep-transcoder";
import {server} from "./Server";
import {devices} from "@/components/Devices";
import RadioView from "@/components/RadioView.vue";

@Component({components:{RadioView, EepCase}})
export default class extends Vue{

  get eepString() : string | null{
    const eep = this.$route && this.$route.params['eep']
    return eep || null
  }

  get result() {
    if (this.message){
      return server.decode(this.message, devices)[0]
    } else {
      return null;
    }
  }

  get eep(): Eep | null {
    let foundResult = this.result
    if (foundResult){
      return foundResult.eep
    } else {
      return null;
    }
  }

  get eep_case() : Case | null {
    let foundResult = this.result
    if (foundResult){
      return foundResult.eepCase
    } else {
      return null;
    }
  }

  get message(): string | null {
    const message = this.$route && this.$route.params['message']
    if (message){
      return message;
    } else {
      return null;
    }
  }

  get decodedValue(): any | null {
    let foundResult = this.result
    if (foundResult){
      return foundResult.data
    } else {
      return null;
    }
  }
}
</script>

<style scoped>

</style>