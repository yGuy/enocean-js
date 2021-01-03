<template>
  <v-container>
    <v-row>
      <v-col cols="3">
        <v-text-field v-model="search"></v-text-field>
        <v-list
            nav
            dense
        >
          <v-list-item-group
              v-model="selectedItem"
              color="primary"
          >
            <v-list-item
                v-for="item in items"
                :key="item.eep"
            >
              <v-list-item-content>
                <v-list-item-title v-text="item.eep"></v-list-item-title>
                <v-list-item-subtitle v-text="item.title"></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>

      </v-col>
      <v-col cols="9">
         <eep-item v-if="selectedItem>=0" :item="items[selectedItem]"></eep-item>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import EepItem from "@/components/EepItem.vue";
import {EEPs} from '@/components/eeps'
import {Eep} from '@/components/eep'

const allEEPs: Eep[] = Object.values(EEPs);


@Component({
    components: {EepItem}
  })
  export default class extends Vue {
    private search: string = ""

    private get items():any[]{
      return allEEPs.filter(eep => this.search.length === 0 || eep.eep.indexOf(this.search) >= 0);
    }

    private selectedItem: number = -1;
  }
</script>
