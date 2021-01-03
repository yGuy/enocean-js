<template>
  <eep-viewer/>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import EepViewer from "@/components/EepViewer.vue"; // @ is an alias to /src

@Component({
  components: {
    EepViewer,
  },
})
export default class Home extends Vue {}
</script>
