<script setup lang="ts">
import { ref } from "vue";
import useStore from "@/store";

const theme = ref("light");
const store = useStore();

// store.fetchPuzzles();
</script>

<template>
  <div>
    <router-view></router-view>
    <div id="modal-target"></div>
  </div>
</template>
