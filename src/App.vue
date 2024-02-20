<script setup lang="ts">
import { ref } from "vue";
import useStore from "@/store";
import BackgroundPattern from "@/components/BackgroundPattern.vue";

const theme = ref("light");
const store = useStore();

// store.fetchPuzzles();
</script>

<template>
  <div>
    <router-view></router-view>
    <BackgroundPattern />
    <div id="modal-target"></div>
  </div>
</template>
