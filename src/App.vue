<script setup lang="ts">
import { onMounted, ref } from "vue";
import useStore from "@/store";
import BackgroundPattern from "@/components/BackgroundPattern.vue";
import { useStorage } from "@vueuse/core";

const theme = ref("light");
const store = useStore();

const messageToShanecerity = `
Thanks homie! I actually get a notification everytime someone enters a game, so if I have the opportunity to join you I will! <3
`;

onMounted(() => {
  const nickName = useStorage("nickName", "");

  // if date is before 30th of july 2025, show message
  if (new Date() < new Date("2025-07-30")) {
    if (nickName.value?.toLowerCase() === "shanecerity") {
      alert(messageToShanecerity);
    }
  }
});

// store.fetchPuzzles();
</script>

<template>
  <div>
    <router-view></router-view>
    <BackgroundPattern />
    <div id="modal-target"></div>
  </div>
</template>
