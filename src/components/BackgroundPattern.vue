<script setup lang="ts">
import { ref } from "@vue/runtime-core";
import { debounce, shuffle } from "lodash";
import useStore from "@/store";
import { drawSinglePuzzle } from "@/services/canvas";
import { computed, nextTick, onMounted, provide, watch } from "vue";

const store = useStore();
const { puzzles, canvas, drawBackground, viewportWidth, viewportHeight, dpi } =
  store;

window.addEventListener("resize", debounce(drawBackground, 1000));

store.fetchPuzzles().then(drawBackground);
</script>

<template>
  <canvas
    :style="{
      width: `${viewportWidth}px`,
      height: `${viewportHeight}px`,
    }"
    :width="viewportWidth * dpi"
    :height="viewportHeight * dpi"
    class="hibbem"
    ref="canvas"
  ></canvas>
</template>

<style scoped lang="scss">
.hibbem {
  opacity: 0;
}

canvas {
  left: 0;
  top: 0;
  position: fixed;
  z-index: -1;
  opacity: 0.5;
  transition: opacity 1s;
}
</style>
