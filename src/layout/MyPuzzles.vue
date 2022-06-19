<template>
  <router-link :to="{ name: 'mainMenu' }">Terug</router-link>

  <div v-if="!nickName">Nog geen puzzels</div>

  <div class="my-puzzles" v-if="puzzles">
    <div class="puzzle" :key="puzzle.id" v-for="puzzle in puzzles">
      <h3>{{ puzzle.name }}</h3>
      <Grid :enable-controls="false" :game="puzzle.game" />
      <router-link
        :to="{ name: 'singleplayer', params: { puzzleId: puzzle.id } }"
        >Play</router-link
      >
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
  if (!nickName.value) return;

  http.get(`/users/${nickName.value}/puzzles`).then((response) => {
    puzzles.value = response.data.map((puzzle: Puzzle) => {
      //set both working state and solution to be the same. Not ideal but it works.
      const solution = JSON.parse(puzzle.solution);

      return {
        ...puzzle,
        game: useGrid(solution, solution),
      };
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
