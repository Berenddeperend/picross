<template>
  {{ nickName.value }}
  <div class="my-puzzles">
    <div class="puzzle" :key="puzzle.id" v-for="puzzle in puzzles">
      <h3>{{ puzzle.name }}</h3>
      <Grid :enable-controls="false" :grid="puzzle.puzzle" />
      <a href="">Play</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import Grid from "@/components/TheGrid.vue";

import { onMounted, ref } from "@vue/runtime-core";
import http from "@/services/http";
import { useStorage } from "@vueuse/core";

const puzzles = ref();
const nickName = useStorage("nickName", "Berend");
onMounted(() => {
  http.get(`/users/${nickName.value}/puzzles`).then((response) => {
    console.log("-> response.data", response.data);
    puzzles.value = response.data.map((thing: any) => {
      thing.puzzle = JSON.parse(thing.puzzle);
      return thing;
    });
  });
});
</script>

<style lang="scss" scoped>
.my-puzzles {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;

  :deep(.playfield-container) {
    //border: 1px solid red;
    .cell {
      $size: 10px;
      border: none;
      border-radius: 0;
      width: $size;
      height: $size;
    }
  }
}
</style>
