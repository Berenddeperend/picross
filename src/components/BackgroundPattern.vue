<script setup lang="ts">
import { ref } from "@vue/runtime-core";
import { debounce, shuffle } from "lodash";
import useStore from "@/store";
import { drawSinglePuzzle } from "@/services/canvas";
import { computed, nextTick, onMounted, watch } from "vue";

const store = useStore();
const { puzzles, currentPuzzleSize, showFancyBackground } = store;

const dpi = Math.max(window.devicePixelRatio, 2);

const viewportWidth = ref(window.innerWidth);
const viewportHeight = ref(window.innerHeight);

const canvas = ref<HTMLCanvasElement>();

const pixelSize = 6;

const usedPuzzlesSize = computed(() => {
  return currentPuzzleSize.value;
});

const clearCanvas = () => {
  console.log("clearing canvas");
  const ctx = canvas.value?.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, viewportWidth.value * dpi, viewportHeight.value * dpi);
  canvas.value?.classList.add("hibbem");
};

const draw = () => {
  if (!canvas.value) return;
  if (!puzzles.value.length) return;

  viewportWidth.value = window.innerWidth;
  viewportHeight.value = window.innerHeight;

  const columns = Math.floor(
    viewportWidth.value / (usedPuzzlesSize.value * pixelSize)
  );
  const rows = Math.floor(
    viewportHeight.value / (usedPuzzlesSize.value * pixelSize)
  );

  const relevantPuzzles = shuffle(
    puzzles.value.filter((puzzle) => puzzle.width === usedPuzzlesSize.value)
  );

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns + 1; column++) {
      const xoffset =
        row % 2
          ? column * pixelSize * (usedPuzzlesSize.value + 1) -
            (pixelSize * usedPuzzlesSize.value) / 2
          : column * pixelSize * (usedPuzzlesSize.value + 1);

      drawSinglePuzzle(
        canvas.value,
        relevantPuzzles[(row * rows + column) % relevantPuzzles.length],
        "#f2f2f6",
        pixelSize,
        xoffset,
        row * pixelSize * (usedPuzzlesSize.value + 1)
      );
    }
  }

  nextTick().then(() => {
    canvas.value?.classList.remove("hibbem");
  });
};

const redraw = async () => {
  clearCanvas();

  canvas.value?.classList.add("hibbem");

  setTimeout(() => draw());
};

watch(usedPuzzlesSize, () => {
  showFancyBackground.value = true;
  redraw();
});

watch(showFancyBackground, (show) => {
  if (!show) {
    setTimeout(() => {
      canvas.value?.classList.add("hibbem");
    }, 1000);
  }
});

window.addEventListener("resize", debounce(draw, 1000));

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
