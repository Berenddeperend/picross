<script setup lang="ts">
import { watch, onMounted, ref, onUnmounted, computed } from "vue";
import confetti from "canvas-confetti";
import Grid from "@/components/TheGrid.vue";

import { createGrid } from "@/utils";
import useSocket from "@/hooks/useSocket";
import useUserStates from "@/hooks/useUserStates";
import useGrid from "@/hooks/useGrid";
import { isEqual } from "lodash";
import http from "@/services/http";
import TopBar from "@/components/TopBar.vue";
import TheClear from "@/components/TheClear.vue";

const { puzzleId } = defineProps<{ puzzleId?: string }>();
const mode: Mode = puzzleId ? "singleplayer" : "multiplayer";

const grid = ref<Grid>(createGrid(10));
const solution = ref<Grid>();

if (mode === "singleplayer") {
  http.get(`/puzzle/${puzzleId}`).then((response) => {
    setPuzzle(response.data);
  });
}

const { clampToGrid, indexToXY } = useGrid(grid.value);
const { socket } = useSocket();
const { players, player, initState } = useUserStates(
  mode,
  clampToGrid,
  setGrid,
  setPuzzle,
  socket
);

initState();

const levelIsCleared = computed(() => {
  return isEqual(grid.value, solution.value);
});

function setGrid(newGrid: Grid) {
  grid.value = newGrid;
}

function setPuzzle(newPuzzle: any) {
  solution.value = JSON.parse(newPuzzle.puzzle);
}

function onCellClicked(index: number) {
  const [x, y] = indexToXY(index);
  grid.value[y][x] = grid.value[y][x] === " " ? "d" : " ";
  socket.emit("gridUpdated", grid.value);
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
  socket.emit("cursorUpdated", player.value!.position);
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
  <TopBar
    v-if="players && player && mode === 'multiplayer'"
    :player="player"
    :players="players"
  />
  <router-link :to="{ name: 'mainMenu' }">Terug</router-link>

  <TheClear :socket="socket" />

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
