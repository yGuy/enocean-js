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
    <v-card-text v-for="(field,i) of unreserved" :key="i">
      <eep-field :field="field" :model-value="getValue(field)" @update:modelValue="fieldUpdated(field,$event)" :writable="writable"></eep-field>
    </v-card-text>
    <span v-for="field of eepCase.statusfield">{{field.data}} = {{field.value}}, </span>
  </v-card>
</template>

<script lang="ts">
import {Prop, Vue} from "vue-property-decorator";

import {Case, DatafieldElement, Eep} from '@enocean-js/eep-transcoder';
import Component from "vue-class-component";
import EepField from "@/components/EepField.vue";
import {arrayOrSingle, parse} from "@/components/Server";


@Component({
  components: {EepField}
})
export default class EepCase extends Vue {
  @Prop({default:false, required: false, type:Boolean})
  private writable: boolean | undefined
  @Prop()
  private eep: Eep | undefined
  @Prop()
  private eepCase: Case |undefined

  @Prop({required:false, default:()=>({}), type: Object})
  private decodedValue: any | undefined

  private baseid: string  |undefined
  private channel: string |undefined

  get unreserved(){
    return arrayOrSingle(this.eepCase!.datafield).filter(field => !field.reserved)
  }


  getValue(field: DatafieldElement) : Number |undefined{
    if (this.decodedValue && typeof field.shortcut === 'string'){
      if (this.decodedValue[field.shortcut]){
        return parse(this.decodedValue[field.shortcut].value)
      } else if (this.decodedValue[field.shortcut.toLowerCase()]){
        return parse(this.decodedValue[field.shortcut.toLowerCase()].value)
      }
    } else {
      return 0
    }
  }

  fieldUpdated(field: DatafieldElement, value: Number){
    this.$emit('update:fieldValue', {field, value})
  }

  private arrayOrSingle = arrayOrSingle;

}
</script>

<style scoped>

</style>