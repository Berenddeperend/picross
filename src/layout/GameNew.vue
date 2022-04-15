<script setup lang="ts">
import { isEqual } from "lodash";
import { watch, computed, StyleValue, onMounted, ref, onUnmounted } from "vue";
import confetti from "canvas-confetti";
import Grid from "@/components/TheGrid.vue";

import { socket } from "@/hooks/useSocket";

onMounted(() => {
  socket.on("solution", setSolution);
});

onUnmounted(() => {
  socket.off("solution", setSolution);
});

import { syncGrid, levelIsCleared } from "@/hooks/useGrid";

import { createGrid } from "@/utils";

const grid = ref<Grid>(createGrid(10));
const solution = ref<Grid>();

import useUserStates from "@/hooks/useUserStatesNew";
import { initControls, toggleCellValue } from "@/hooks/useControls";
import useGrid from "@/hooks/useGridNew";

const { clampToGrid } = useGrid(grid.value);

const { players, player } = useUserStates("multiplayer", clampToGrid, setGrid);

function setGrid(newGrid: Grid) {
  //Deze is vrij lomp overgekopieerd van 'create'
  grid.value = newGrid;
}

function setSolution(newSolution: any) {
  solution.value = JSON.parse(newSolution[0].puzzle);
}

initControls();

watch(levelIsCleared, (value) => {
  if (value) {
    confetti({
      zIndex: -1,
      particleCount: 50,
      spread: 70,
      angle: 60,
      origin: { y: 0.6 },
    });
    confetti({
      zIndex: -1,
      particleCount: 50,
      spread: 70,
      angle: 120,
      origin: { y: 0.6 },
    });
  }
});
</script>

<template>
  <Grid
    v-if="grid && solution"
    :enable-controls="true"
    :enable-socket="true"
    :grid="grid"
    :solution="solution"
    :player="player"
    :players="players"
    @onCellClicked="onCellClicked"
    @moveCursor="onMoveCursor"
    @toggleCellValue="onToggleCellValue"
    @stateChanged="onStateChanged"
  />
</template>

<style lang="scss" scoped></style>
