<template>
  <v-card>
    <v-card-title >
      {{item.eep}} - {{item.title}}
    </v-card-title>
    <v-card-subtitle v-html="item.description">
    </v-card-subtitle>

    <v-card-text>
      <span v-for="submitter of item.submitter">{{submitter}}, </span>
    </v-card-text>
    <template v-if="item.case" >
      <eep-case :eep="item" :eep-case="ca" v-for="ca of item.case" :key="ca.title" :writable="true" @update:fieldValue="updateField($event.field, $event.value, ca)"></eep-case>
    </template>
    <v-card-subtitle>Values</v-card-subtitle>
    <v-card-text>
      <json-viewer :value="scratch" :expand-depth="2" :expanded="true" copyable>
      </json-viewer>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {Case, DatafieldElement, Eep} from "@enocean-js/eep-transcoder";
import EepCase from "@/components/EepCase.vue";
// @ts-ignore
import JsonViewer from 'vue-json-viewer';

@Component({
  components: {EepCase, JsonViewer}
})
export default class extends Vue {
  @Prop({required:true, type:Object})
  private item:Eep | undefined;

  private scratch: any
  private destination: string
  private channel: number
  private baseId: string

  constructor(){
    super()
    this.destination = "12345678"
    this.channel = 1
    this.baseId = "12345678"
    this.scratch = {}
  }

  updateField(field: DatafieldElement, value: number, eepCase: Case){
    if (!this.scratch){
      this.scratch = {}
    }
    if (typeof field.shortcut === 'string'){
      Vue.set(this.scratch, field.shortcut, value)
    }
  }
}
</script>

<style scoped>

</style>