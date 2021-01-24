<template>
  <v-card>
    <v-card-text>
      <v-text-field v-model="connection" :disabled="state !== 'DISCONNECTED'"></v-text-field>
      <span>{{ state }}</span>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="toggle()" v-text="'Toggle Connection'"></v-btn>
      <v-btn @click="clear()">Clear Log</v-btn>
    </v-card-actions>
    <v-card-text>
      <v-data-table @click:row="currentMessage = $event" dense :headers="headers" :items="items">
        <template v-slot:item.time="{ item }">
          <span v-text="new Date(item.time).toString()"></span>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon
              small
              class="mr-2"
              @click="decode(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
              small
              class="mr-2"
              @click="$router.push({path:`/radio/${item.message}`})"
          >
            mdi-arrow-right-box
          </v-icon>
          <v-icon
              small
              class="mr-2"
              @click="$router.push({path:`/decode/${item.message}`})"
          >
            mdi-arrow-down-box
          </v-icon>
          <v-icon
              small
              @click="deleteMessage(item)"
          >
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card-text>
    <v-card-text>
      <v-text-field v-model="message" :disabled="state !== 'CONNECTED'"></v-text-field>
      <v-card-actions>
        <v-btn @click="send()" :disabled="state !== 'CONNECTED'">Send Message</v-btn>
      </v-card-actions>
    </v-card-text>
    <v-card-text>
      <radio-message v-if="currentMessage" :message="currentMessage.message"/>
    </v-card-text>
    <v-card-title>
      Decoded
    </v-card-title>
    <v-card-text>
      <json-viewer :value="decoded" :expand-depth="4" :expanded="true" copyable>
      </json-viewer>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import {Vue} from "vue-property-decorator";
import Component from "vue-class-component";

import {Message, server, State} from "./Server"
import {devices} from "@/components/Devices";
// @ts-ignore
// noinspection TypeScriptCheckImport
import JsonViewer from 'vue-json-viewer';
import RadioMessage from "@/components/RadioMessage.vue";

@Component({components: {RadioMessage, JsonViewer}})
export default class extends Vue {
  private connection: string = "ws://raspberrypi.fritz.box:1880/ws/enocean"
  private state: State = State.DISCONNECTED;
  private message: string = ""
  private decoded: any = {}

  private currentMessage: Message | null = null

  toggle() {
    if (server.state !== State.DISCONNECTED) {
      server.disconnect();
    } else {
      server.connect(this.connection)
    }
  }

  mounted() {
    this.state = server.state
    this.items = []
    server.addStateListener(arg => {
      this.state = arg.state
    })
    server.addMessageListener(arg => {
      this.items.push(arg)
    })
    for (let m of server.messages) {
      this.items.push(m)
    }
    this.state = server.state
  }

  send() {
    server.send(this.message)
  }

  clear() {
    server.clear()
    this.items = []
  }

  decode(message: Message) {
    let decodeResults = server.decode(message.message, devices);
    this.decoded = decodeResults.length > 0 ? decodeResults[0].data : {}
  }

  deleteMessage(message: Message) {
    this.items.splice(this.items.indexOf(message), 1)
  }

  private items: Message[] = []
  private headers = [{text: 'Time', align: 'start', sortable: true, value: "time"}, {
    text: 'Message',
    align: 'start',
    sortable: false,
    value: "message"
  }, {value: 'actions', align: 'end', sortable: false, text: 'Actions'}]
}
</script>

<style scoped>

</style>