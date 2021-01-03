<template>
  <v-card>
    <v-card-title>Title {{eepCase.title}} - {{eepCase.direction === "2" ? 'In' : 'Out'}}</v-card-title>
    <v-card-text v-html="eepCase.description"></v-card-text>
    <template v-if="eepCase.condition">
      <v-card-subtitle>Conditional</v-card-subtitle>
      <v-card-text>
        <template v-if="eepCase.condition.direction">
          <span>Direction: {{eepCase.condition.direction === "2" ? 'In' : 'Out'}}</span>
        </template>
        <template v-if="eepCase.condition.statusfield">
          <template v-for="status of eepCase.condition.statusfield">
            <span>Status: {{status.bitoffs}} {{status.bitsize}} = {{status.value}}   ({{status.data}})</span>
          </template>
        </template>
        <template v-if="eepCase.condition.datafield">
          <template v-for="data of arrayOrSingle(eepCase.condition.datafield)">
            <span>Data: {{data.bitoffs}} {{data.bitsize}} = {{data.value}}</span>
          </template>
        </template>
      </v-card-text>
    </template>

    <eep-field v-for="field of unreserved" :field="field"></eep-field>
    <span v-for="field of eepCase.statusfield">{{field.data}} = {{field.value}}, </span>
  </v-card>
</template>

<script lang="ts">
import {Prop, Vue} from "vue-property-decorator";

import {Case, Eep} from '@enocean-js/eep-transcoder';
import Component from "vue-class-component";
import EepField from "@/components/EepField.vue";

function arrayOrSingle<T>(el: T[]|T): T[]{
  return Array.isArray(el) ? el : [el]
}


@Component({
  components: {EepField}
})
export default class extends Vue {
  @Prop()
  private eep: Eep | undefined
  @Prop()
  private eepCase: Case |undefined

  private baseid: string  |undefined
  private channel: string |undefined

  get unreserved(){
    return arrayOrSingle(this.eepCase!.datafield).filter(field => !field.reserved)
  }

  private arrayOrSingle = arrayOrSingle;

}
</script>

<style scoped>

</style>