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
      <eep-case :eep="item" :eep-case="ca" v-for="ca of item.case" :key="ca.title"></eep-case>
    </template>
  </v-card>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {Eep} from "@enocean-js/eep-transcoder";
import EepCase from "@/components/EepCase.vue";
@Component({
  components: {EepCase}
})
export default class extends Vue {
  @Prop({required:true, type:Object})
  private item:Eep | undefined;
}
</script>

<style scoped>

</style>