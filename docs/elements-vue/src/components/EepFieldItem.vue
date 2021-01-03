<template>
  <div>
  <template v-if="unused">
  </template>
  <template v-else-if="item.min && item.max">
      <v-slider v-model="modelValue" :min="parse(item.min)" :max="parse(item.max)" @input="$emit('update:modelValue', $event)"></v-slider>
  </template>
  <template v-else-if="item.value">
    <li @click="$emit('update:modelValue', parse(item.value))" :selected="modelValue === parse(item.value ? item.value.toString() : '')">{{parse(item.value)}}: <span v-html="item.description"></span></li>
  </template>
  <template v-else>
    <li @click="$emit('update:modelValue', parse(item.value))">{{parse(item.value)}}: <span v-html="item.description"></span></li>
  </template>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {ItemElement} from '@enocean-js/eep-transcoder'

import {Prop} from "vue-property-decorator";

function parseValue (v: string): number {
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

@Component({})
export default class extends Vue {
  @Prop({required: true, type:Object})
  private item: ItemElement | undefined;

  @Prop({required: false, type:Object})
  private modelValue: string | number | undefined;

  get unused(){
    return !this.item || this.item.description === 'not used' || this.item.description === 'Not used'
  }

  parse(value: number | string | undefined): Number{
    if (typeof value === "string"){
      return parseValue(value);
    } else if (typeof value === "number"){
      return value
    } else {
      return 0;
    }
  }
}
</script>

<style scoped>

</style>