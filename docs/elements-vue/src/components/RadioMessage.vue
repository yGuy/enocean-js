<template>
      <v-container class="ma-0 pa-0">
        <v-row no-gutters>
          <v-col cols="3" md="2" lg="1">
            <h3>RORG</h3>
            <p>{{ radio.RORG.toString(16) }}</p>
          </v-col>
          <v-col cols="3" md="3" lg="1">
            <h3>Sender</h3>
            <p>{{ radio.senderId }}</p>
          </v-col>
          <v-col cols="3" md="3" lg="1">
            <h3>Destination</h3>
            <p>{{ radio.destinationId }}</p>
          </v-col>
          <v-col cols="3" md="4">
            <h3>Payload ({{ radio.payload.length }})</h3>
            <p>{{ radio.payload.toString() }}</p>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="6">
            <h3>Data ({{ radio.dataLength }})</h3>
            <p>{{ radio.data.toString() }}</p>
          </v-col>
          <v-col cols="6">
            <h3>Optional Data ({{ radio.optionalLength }})</h3>
            <p>{{ radio.optionalData.toString() }}</p>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="3" sm="3" md="1">
            <h3>Status</h3>
            <p>{{ radio.status }}</p>
          </v-col>
          <v-col cols="3" sm="3" md="1">
            <h3>RSSI</h3>
            <p>{{ radio.RSSI }}</p>
          </v-col>
          <v-col cols="3" sm="3" md="1">
            <h3>T21</h3>
            <p>{{ radio.T21 }}</p>
          </v-col>
          <v-col cols="3" sm="3" md="1">
            <h3>NU</h3>
            <p>{{ radio.NU }}</p>
          </v-col>
          <v-col cols="6" sm="6" md="2">
            <h3>Security Level</h3>
            <p>{{ radio.securityLevel }}</p>
          </v-col>
          <v-col cols="6" sm="6" md="2">
            <h3>Sub Telegram Number</h3>
            <p>{{ radio.subTelNum }}</p>
          </v-col>
          <v-col cols="6" sm="6" md="4">
            <h3>CRC</h3>
            <p>{{ radio.crc8Data.toString(16) }}</p>
          </v-col>
        </v-row>
      </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {RadioERP1} from "@enocean-js/radio-erp1";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";

@Component({})
export default class extends Vue {

  @Prop({required: true, type:String, default:''})
  private message: string |undefined;

  get radio(): RadioERP1 | null {
    if (this.message) {
      return RadioERP1.from(this.message)
    } else {
      return null;
    }
  }
}
</script>

<style scoped>

</style>