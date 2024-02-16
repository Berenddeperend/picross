<script setup lang="ts">
import { onMounted, ref } from "@vue/runtime-core";
import http from "@/services/http";
import Grid from "@/components/TheGrid.vue";
import useGrid from "@/hooks/useGrid";
import CanvasPuzzleViewer from "@/components/CanvasPuzzleViewer.vue";
import { shuffle } from "lodash";
import useStore from "@/store";

const store = useStore();
const { puzzles } = store;

store.fetchPuzzles();
</script>

<template>
  <div class="all-puzzles" v-if="puzzles.length">
    <div class="puzzle" :key="puzzle.id" v-for="puzzle in shuffle(puzzles)">
      <CanvasPuzzleViewer
        class="puzzle-preview"
        v-if="puzzles.length"
        :puzzle="puzzle"
        fill="#f4f4f4"
        :pixel-size="8"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.all-puzzles {
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
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
    background: white;
  }
}
</style>
