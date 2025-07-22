<script setup lang="ts">
import { onMounted, ref } from "vue";
import useStore from "@/store";
import BackgroundPattern from "@/components/BackgroundPattern.vue";
import { useStorage } from "@vueuse/core";

const theme = ref("light");
const store = useStore();

const messageToShanecerity = `
Hey man only you can see this message. Yeah I do have an admin page where I can approve/delete puzzles that users made. So far, just one swastika. The penises I choose to allow. Thanks for playing and for the pixel art. I appreciate you <3
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
