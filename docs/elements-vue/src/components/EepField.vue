<template>
  <v-card>
    <v-card-title>{{field.shortcut}} - {{field.description}}</v-card-title>
    <v-card-subtitle v-if="typeof field.data === 'string'" v-html="field.data"></v-card-subtitle>
    <v-card-subtitle>[{{type}}]</v-card-subtitle>
    <v-card-text>
      <span>Value is {{ modelValue }}</span>
      <template v-if="type === 'enum'">
        <eep-field-item v-for="(item,i) of arrayOrSingle(field.enum.item)" :key="i" :model-value="modelValue" @update:modelValue="$emit('update:modelValue', $event)" :item="item" :writable="writable"></eep-field-item>
      </template>
      <template v-if="type === 'range'">
        Range
      </template>
      <template v-if="type === 'scale'">
        <v-slider :min="parse(field.scale.min)" :max="parse(field.scale.max)" :value="modelValue" @input="$emit('update:modelValue', $event)" :readonly="!writable"></v-slider>
      </template>
      <template v-if="type === 'bitmsk'">
        Bitmask
      </template>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {DatafieldElement, ItemElement} from '@enocean-js/eep-transcoder';
import {Prop} from "vue-property-decorator";
import EepFieldItem from "@/components/EepFieldItem.vue";
import {parse} from "@/components/Server";

export function getType (item:ItemElement|DatafieldElement) : undefined |'enum'|'scale'|'range'|'bitmsk' {
  if ((item as DatafieldElement).enum) return 'enum'
  if (item.range && item.scale) return 'scale'
  if (item.range) return 'range'
  if ((item as ItemElement).bitmask) return 'bitmsk'
}


@Component({
  components: {EepFieldItem}
})
export default class EepField extends Vue {
  @Prop({default:false, required: false, type:Boolean})
  private writable: boolean | undefined

  @Prop({required: true, type:Object})
  private field: DatafieldElement|undefined;

  @Prop({required: false, type: Number, default: 0})
  private modelValue: number | undefined

  private parse = parse;

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