<template>
  <router-link :to="{ name: 'mainMenu' }">Back</router-link>

  <div v-if="!nickName">No puzzles yet.</div>

  <div class="all-puzzles" v-if="puzzles">
    <div class="puzzle" :key="puzzle.id" v-for="puzzle in puzzles">
      <!-- <h3>{{ puzzle.name }}</h3> -->
      <Grid :enable-controls="false" :game="puzzle.game" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Grid from "@/components/TheGrid.vue";

import { onMounted, ref } from "@vue/runtime-core";
import http from "@/services/http";
import { useStorage } from "@vueuse/core";
import useGrid from "@/hooks/useGrid";

const puzzles = ref();
const nickName = useStorage("nickName", "Berend");

onMounted(() => {
  http.get("/puzzles").then((response) => {
    puzzles.value = response.data.map((puzzle: BackendPuzzle) => {
      //set both working state and solution to be the same. Not ideal but it works.
      const solution: Grid = JSON.parse(puzzle.solution);

      return {
        ...puzzle,
        game: useGrid(solution, solution),
      };
    });
  });
});
</script>

<style lang="scss" scoped>
.all-puzzles {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  gap: 10px;
  display: flex;
  flex-wrap: wrap;

  .puzzle {
    display: inline-block;
  }

  :deep(.playfield-container) {
    border: 1px solid #e1e1e1;
    padding: 10px;
    background: white;

    .cell {
      $size: 8px;
      border: none;
      border-radius: 0;
      width: $size;
      height: $size;
    }
  }
}
</style>
