<template>
  <v-card>
    <v-card-title>{{field.shortcut}} - {{field.description}}</v-card-title>
    <v-card-subtitle v-if="typeof field.data === 'string'" v-html="field.data"></v-card-subtitle>
    <v-card-subtitle>[{{type}}]</v-card-subtitle>
    <span>Value is {{modelValue}}</span>
    <template v-if="type === 'enum'">
      <eep-field-item v-for="item of arrayOrSingle(field.enum.item)" :model-value.sync="modelValue" :item="item"></eep-field-item>
    </template>
    <template v-if="type === 'range'">
      Range
    </template>
    <template v-if="type === 'scale'">
      <v-slider :min="parse(field.scale.min)" :max="parse(field.scale.max)" v-model="modelValue"></v-slider>
    </template>
    <template v-if="type === 'bitmsk'">
      Bitmask
    </template>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {DatafieldElement, ItemElement} from "./eep";
import {Prop} from "vue-property-decorator";
import EepFieldItem from "@/components/EepFieldItem.vue";

function parseValue (v:string):number {
  let radix;
  try {
    radix = v.toString().substr(0, 2)
  } catch (err) {
    console.log(v)
    return 0
  }
  switch (radix) {
    case '0b':
      return parseInt(v.replace('0b', ''), 2)
    case '0x':
      return parseInt(v.replace('0x', ''), 16)
    case '0o':
      return parseInt(v.replace('0o', ''), 8)
    default:
      return parseInt(v)
  }
}
function getType (item:ItemElement|DatafieldElement) : undefined |'enum'|'scale'|'range'|'bitmsk' {
  if ((item as DatafieldElement).enum) return 'enum'
  if (item.range && item.scale) return 'scale'
  if (item.range) return 'range'
  if ((item as ItemElement).bitmask) return 'bitmsk'
}
@Component({
  components: {EepFieldItem}
})
export default class extends Vue {
  @Prop({required: true, type:Object})
  private field: DatafieldElement|undefined;

  @Prop({required: true, type: Number})
  private value: number | undefined

  private modelValue: number = 0

  parse(value: number | string | undefined): Number{
    if (typeof value === "string"){
      return parseValue(value);
    } else if (typeof value === "number"){
      return value
    } else {
      return 0;
    }
  }

  arrayOrSingle<T>(el: T[]|T): T[]{
    return Array.isArray(el) ? el : [el]
  }

  get type(): undefined | 'enum'|'scale'|'range'|'bitmsk' {
    return getType(this.field!)
  }
}
</script>

<style scoped>

</style>