<template>
  <div class="create">
    <button @click="showSaveGridModal = true">Save puzzle</button>

    <ModalSavePuzzle
      :open="showSaveGridModal"
      @close="showSaveGridModal = false"
      :grid="grid"
    />

    <PuzzleList />

    <Grid
      :enable-controls="true"
      :grid="grid"
      :player="player"
      :players="players"
      @onCellClicked="onCellClicked"
      @moveCursor="onMoveCursor"
      @toggleCellValue="onToggleCellValue"
      @stateChanged="onStateChanged"
    />
  </div>
  <!--    dit niet emitten maar exposen als functie! dan kan ik {useMoveCurosr} from grid doen -->
</template>

<script setup lang="ts">
import {
  clampToGrid,
  createGrid,
  gridSize,
  indexToXY,
  levelIsCleared,
} from "@/hooks/useGrid";

import Grid from "@/components/TheGrid.vue";
import { ref } from "vue";
import { socket } from "@/hooks/useSocket";
import ModalSavePuzzle from "@/components/ModalSavePuzzle.vue";
import PuzzleList from "@/components/PuzzleList.vue";

const showSaveGridModal = ref<Boolean>(false);
const grid = ref<Grid>(createGrid(gridSize));

//hier gaan we de userstate bijhouden, niet in het grid component.
const player = ref<Player>({
  id: "1",
  position: [0, 0],
  color: "green",
  name: "berend",
});

const players = ref<Players>({
  "1": player.value,
});

function onStateChanged(newState: any) {
  console.log("damn! onstatechanged", newState);
}

function onToggleCellValue(value: string) {
  if (showSaveGridModal.value) return;
  if (levelIsCleared.value) {
    return;
  }
  const [x, y] = (player.value as Player).position;
  grid.value[y][x] = grid.value[y][x] === value ? " " : value;
}

function onCellClicked(index: number) {
  const [x, y] = indexToXY(index);
  grid.value[y][x] = grid.value[y][x] === " " ? "d" : " ";
}

function onMoveCursor(direction: Direction) {
  if (showSaveGridModal.value) return;

  if (direction === "left") {
    player.value.position[0] = clampToGrid(player.value.position[0] - 1);
  }
  if (direction === "right") {
    player.value.position[0] = clampToGrid(player.value.position[0] + 1);
  }
  if (direction === "up") {
    player.value.position[1] = clampToGrid(player.value.position[1] - 1);
  }
  if (direction === "down") {
    player.value.position[1] = clampToGrid(player.value.position[1] + 1);
  }
}
</script>

<style lang="scss" scoped>
.create {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
