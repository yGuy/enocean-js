<template>
  <v-card>
    <v-card-title>Encoder</v-card-title>
    <v-card-text>
      {{eepString}}
      {{message}}
      <v-card-actions>
        <v-btn @click="send" :disabled="!message || message.length < 1">Send</v-btn>
      </v-card-actions>
      <v-text-field v-model="sender"/>
      <v-text-field v-model="destination"/>
      <radio-message v-if="message && message.length > 0" :message="message"></radio-message>
      <v-select v-model="selectedCase" :items="eepCases" item-text="title" item-value="index"/>
      <eep-case v-if="eepCase" :eep="eep" :eep-case="eepCase" :writable="true" :decoded-value="model" @update:fieldValue="update"/>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import EepCase from "./EepCase.vue";
import {Case, DatafieldElement, Eep, Field, getEEP} from "@enocean-js/eep-transcoder";
import {arrayOrSingle, server} from "./Server";
import {BaseId, devices} from "@/components/Devices";
import RadioView from "@/components/RadioView.vue";
import EepField from "@/components/EepField.vue";
import RadioMessage from "@/components/RadioMessage.vue";

@Component({components:{RadioMessage, RadioView, EepCase}})
export default class extends Vue{

  get eepString() : string | null{
    const eep = this.$route && this.$route.params['eep']
    return eep || null
  }

  private selectedCase : number = 0

  private get eepCases() : any[] {
    const eep = this.eep
    if (eep){
      return arrayOrSingle(eep.case).map((eepCase,index) => ({
        title: eepCase?.title || ('Case ' + index),
        index
      }))
    } else {
      return []
    }
  }

  private get eepCase() : Case | undefined {
    const eep = this.eep
    if (eep && this.selectedCase >= 0){

      let cases = arrayOrSingle(eep.case);
      return cases && cases[this.selectedCase] || undefined
    } else {
      return undefined;
    }
  };

  private get eep(): Eep | undefined {
    return this.eepString !== null ? getEEP(this.eepString.toLowerCase()) : undefined;
  }

  mounted(){
    this.destination = (this.$route && this.$route.params['address']) || 'ffffffff'
    this.sender = (this.$route && this.$route.params['channel']) || '00000000'
  }

  private sender: string = "00000000"
  private destination: string = "ffffffff"

  private update({field, value}:{field:DatafieldElement, value: number}){
    if (typeof field.shortcut === 'string'){
      Vue.set(this.model, field.shortcut!, {value})
    }
  }

  private get message(): string  {
    if (this.eep && this.eepCase){
      return server.encode({eep: this.eep!, eepCase: this.eepCase!, sender: parseInt(this.sender, 16) + parseInt(BaseId, 16), destination: this.destination.toLowerCase(), data: this.model})
    } else {
      return ""
    }
  }

  private model: any = {}

  private send():void {
    const msg = this.message;
    if (msg && msg.length > 0){
      server.send(this.message)
    }
  }
}
</script>

<style scoped>

</style>