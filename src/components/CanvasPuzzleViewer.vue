<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, unref, watch } from "vue";
import { drawSinglePuzzle } from "@/services/canvas";

const props = withDefaults(
  defineProps<{
    puzzle: Puzzle;
    fill: string;
    pixelSize: number;
  }>(),
  {
    fill: "#444",
    pixelSize: 8,
  }
);

const grid = computed(() => {
  return props.puzzle.solution;
});

const dpi = Math.max(window.devicePixelRatio, 2);

const puzzleSize = computed(() => {
  return grid.value.length || 10;
});

const canvas = ref<HTMLCanvasElement>();

const draw = async () => {
  if (!canvas.value) return;

  drawSinglePuzzle(canvas.value, props.puzzle, props.fill, props.pixelSize);
};

watch(grid, () => {
  draw();
});

onMounted(() => {
  draw();
});
</script>

<template>
  <canvas
    :style="{
      width: `${puzzleSize * pixelSize}px`,
      height: `${puzzleSize * pixelSize}px`,
    }"
    :width="puzzleSize * pixelSize * dpi"
    :height="puzzleSize * pixelSize * dpi"
    ref="canvas"
  ></canvas>
</template>
