<script setup lang="ts">
import { isEqual } from "lodash";
import { watch, computed, StyleValue, onMounted, ref, onUnmounted } from "vue";
import confetti from "canvas-confetti";
import Grid from "@/components/TheGrid.vue";

import { socket } from "@/hooks/useSocket";

const grid = ref<Grid>(createGrid(10));
const solution = ref<Grid>();

import { createGrid } from "@/utils";
import useUserStates from "@/hooks/useUserStatesNew";
// import { initControls, toggleCellValue } from "@/hooks/useControls";
// initControls();
import useGrid from "@/hooks/useGridNew";

const { clampToGrid, levelIsCleared, indexToXY } = useGrid(grid.value);

const { players, player } = useUserStates("multiplayer", clampToGrid, setGrid);

onMounted(() => {
  socket.on("solution", setSolution);
});

onUnmounted(() => {
  socket.off("solution", setSolution);
});

function setGrid(newGrid: Grid) {
  //Deze is vrij lomp overgekopieerd van 'create'
  grid.value = newGrid;
}

function setSolution(newSolution: any) {
  solution.value = JSON.parse(newSolution.puzzle);
}

function onCellClicked(index: number) {
  const [x, y] = indexToXY(index);
  grid.value[y][x] = grid.value[y][x] === " " ? "d" : " ";
}

function onMoveCursor(direction: Direction) {
  if (direction === "left") {
    player.value!.position[0] = clampToGrid(player.value!.position[0] - 1);
  }
  if (direction === "right") {
    player.value!.position[0] = clampToGrid(player.value!.position[0] + 1);
  }
  if (direction === "up") {
    player.value!.position[1] = clampToGrid(player.value!.position[1] - 1);
  }
  if (direction === "down") {
    player.value!.position[1] = clampToGrid(player.value!.position[1] + 1);
  }
  socket.emit("cursorPositionChanged", player.value!.position);
}

function onStateChanged(newState: any) {
  console.log("damn! onstatechanged", newState);
}

function onToggleCellValue(value: string) {
  if (levelIsCleared.value) return;

  const [x, y] = (player.value as Player).position;
  grid.value[y][x] = grid.value[y][x] === value ? " " : value;
  socket.emit("gridUpdated", grid.value);
}

watch(levelIsCleared, (value) => {
  console.log("ree");
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
