<template>
  <v-card>
    <v-card-text>
      <v-data-table dense :headers="headers" :items="devices">
        <template v-slot:item.validEeps="{ item }">
          <span v-for="(target,i) of item.targets" :key="i" @click="$router.push({path:`/encode/${target.eep}/${item.address}/${target.sender || ''}`})"
          >
            {{target.eep}}
          <v-icon
              small
              class="mr-2"
          >
            mdi-upload-network
          </v-icon>
          </span>
        </template>
      </v-data-table>
    </v-card-text>
    <v-card-text>
      <v-text-field label="Name"></v-text-field>
      <v-text-field label="Channel"></v-text-field>
      <v-text-field label="Address"></v-text-field>
      <v-text-field label="Message"></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-btn>Add</v-btn>
      <v-btn>Remove</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import {Vue} from "vue-property-decorator";
import Component from "vue-class-component";

import {Device} from "@/components/Device";
import {devices} from "@/components/Devices";
import {Eep, getEEP} from "@enocean-js/eep-transcoder";

@Component({})
export default class extends Vue {
  private devices: Device[] = []

  private created(){
    this.devices =  devices;
  }


  private headers = [
      {text:'Name', align:'start', sortable: true, value:"name"},
      {text:'Channel', align:'start', sortable: true, value:"channel"},
      {text:'Address', align:'start', sortable: true, value:"address"},
      {text:'EEPs', align:'start', sortable: false, value:"validEeps"},
      {text:'Code', align:'start', sortable: false, value:"code"}]
}
</script>

<style scoped>

</style>