<script setup lang="ts">
import { debounce, shuffle } from "lodash";
import useStore from "@/store";
import { onBeforeUnmount, onMounted } from "vue";

const store = useStore();
const { puzzles, canvas, drawBackground, viewportWidth, viewportHeight, dpi } =
  store;

const debouncedDrawBackground = debounce(drawBackground, 1000);

onMounted(() => {
  store.fetchPuzzles().then(drawBackground);
  window.addEventListener("resize", debouncedDrawBackground);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", debouncedDrawBackground);
});
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
