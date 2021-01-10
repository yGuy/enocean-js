<template>
  <div>
  <template v-if="unused">
  </template>
  <template v-else-if="item.min && item.max">
      <v-slider :value="modelValue" :min="parse(item.min)" :max="parse(item.max)" @input="writable && $emit('update:modelValue', $event)" readonly="!writable"></v-slider>
  </template>
  <template v-else-if="item.value">
    <li @click="writable && $emit('update:modelValue', parse(item.value))" :selected="modelValue === parse(item.value ? item.value.toString() : '')">{{parse(item.value)}}: <span v-html="item.description"></span></li>
  </template>
  <template v-else>
    <li @click="writable && $emit('update:modelValue', parse(item.value))">{{parse(item.value)}}: <span v-html="item.description"></span></li>
  </template>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {ItemElement} from '@enocean-js/eep-transcoder'
import {parse} from './Server'

import {Prop} from "vue-property-decorator";

@Component({})
export default class extends Vue {

  @Prop({default:false, required: false, type:Boolean})
  private writable: boolean | undefined

  @Prop({required: true, type:Object})
  private item: ItemElement | undefined;

  @Prop({required: false, type:Number, default: 0})
  private modelValue: number | undefined;

  get unused(){
    return !this.item || this.item.description === 'not used' || this.item.description === 'Not used'
  }

  parse(value: number | string | undefined): Number{
    if (typeof value === "string"){
      return parse(value);
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