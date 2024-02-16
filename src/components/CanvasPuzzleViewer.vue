<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";

// const json = Bun.file("./json/nono-puzzles.json");
// const content = await json.json();
// const puzzles = content
//   .map((puzzle) => JSON.parse(puzzle.solution))
//   .sort((a, b) => Math.round(Math.random() * -1));

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

// const pixelSize = 8;
const dpi = Math.max(window.devicePixelRatio, 2);
// const dpi = 3;

const puzzleSize = computed(() => {
  return grid.value.length || 10;
});

const canvas = ref<HTMLCanvasElement>();

const draw = () => {
  const ctx = (canvas.value as HTMLCanvasElement).getContext(
    "2d"
  ) as CanvasRenderingContext2D;

  ctx.fillStyle = props.fill;

  for (let y = 0; y < puzzleSize.value; y++) {
    for (let x = 0; x < puzzleSize.value; x++) {
      if (grid.value[y][x] !== "d") {
        continue;
      }

      ctx.fillRect(
        x * props.pixelSize * dpi,
        y * props.pixelSize * dpi,
        props.pixelSize * dpi,
        props.pixelSize * dpi
      );
    }
  }
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
