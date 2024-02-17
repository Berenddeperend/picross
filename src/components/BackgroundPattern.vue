<script setup lang="ts">
import { ref } from "@vue/runtime-core";
import { shuffle } from "lodash";
import useStore from "@/store";
import { drawSinglePuzzle } from "@/services/canvas";

const store = useStore();
const { puzzles } = store;

const dpi = Math.max(window.devicePixelRatio, 2);

const viewportWidth = ref(window.innerWidth);
const viewportHeight = ref(window.innerHeight);

const canvas = ref<HTMLCanvasElement>();

const pixelSize = 6;
const usedPuzzlesSize = 10;

const draw = () => {
  if (!canvas.value) return;

  viewportWidth.value = window.innerWidth;
  viewportHeight.value = window.innerHeight;

  const columns = Math.floor(
    viewportWidth.value / (usedPuzzlesSize * pixelSize)
  );
  const rows = Math.floor(viewportHeight.value / (usedPuzzlesSize * pixelSize));

  const relevantPuzzles = shuffle(
    puzzles.value.filter(
      (puzzle) => puzzle.solution[0].length === usedPuzzlesSize
    )
  );

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns + 1; column++) {
      const xoffset =
        row % 2
          ? column * pixelSize * (usedPuzzlesSize + 1) -
            (pixelSize * usedPuzzlesSize) / 2
          : column * pixelSize * (usedPuzzlesSize + 1);

      drawSinglePuzzle(
        canvas.value,
        relevantPuzzles[(row * rows + column) % relevantPuzzles.length],
        "#f4f4f4",
        pixelSize,
        xoffset,
        row * pixelSize * (usedPuzzlesSize + 1)
      );
    }
  }
};

store.fetchPuzzles().then(draw);
</script>

<template>
  <canvas
    :style="{
      width: `${viewportWidth}px`,
      height: `${viewportHeight}px`,
    }"
    :width="viewportWidth * dpi"
    :height="viewportHeight * dpi"
    ref="canvas"
  ></canvas>
</template>

<style scoped lang="scss">
canvas {
  left: 0;
  top: 0;
  position: absolute;
  z-index: -1;
}
</style>
