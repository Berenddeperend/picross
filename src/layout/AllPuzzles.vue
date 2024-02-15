<template>
  <div class="all-puzzles-container">
    <div class="header">
      <router-link class="btn outline" :to="{ name: 'mainMenu' }"
        >← Back</router-link
      >
      <h2>All puzzles</h2>
    </div>

    <div v-if="!nickName">No puzzles yet.</div>

    <div class="all-puzzles" v-if="puzzles">
      <div class="puzzle" :key="puzzle.id" v-for="puzzle in puzzles">
        <CanvasPuzzleViewer
          class="puzzle-preview"
          v-if="puzzles.length"
          :puzzle="puzzle"
          fill="#444"
          :pixel-size="10"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Grid from "@/components/TheGrid.vue";

import { onMounted, ref } from "@vue/runtime-core";
import http from "@/services/http";
import { useStorage } from "@vueuse/core";
import useGrid from "@/hooks/useGrid";
import CanvasPuzzleViewer from "@/components/CanvasPuzzleViewer.vue";

type Thing = BackendPuzzle & { game: ReturnType<typeof useGrid> };

const puzzles = ref<Thing[]>([]);
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
.header {
  display: grid;
  align-items: center;
  margin-bottom: 20px;
  justify-content: start;
  grid-template-columns: repeat(3, 1fr);

  .btn {
    width: fit-content;
  }

  h2 {
    justify-self: center;
    text-align: center;
    margin: 0;
  }
}

.all-puzzles-container {
  padding: 0 10px;
  margin-top: 20px;
  text-align: left;
}

.all-puzzles {
  width: 100%;
  max-width: 700px;
  margin: 20px auto;
  gap: 10px;
  display: flex;
  flex-wrap: wrap;

  .puzzle {
    line-height: 0;
  }

  .puzzle-preview {
    border: 1px solid #e1e1e1;
    padding: 10px;
    background: white;
  }
}
</style>
