<template>
  <div class="create">
    <router-link :to="{ name: 'mainMenu' }">Terug</router-link>
    <button @click="showSaveGridModal = true">Save puzzle</button>

    <ModalSavePuzzle
      :open="showSaveGridModal"
      @close="showSaveGridModal = false"
      :grid="grid"
    />

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
import { ref } from "vue";
import { createGrid } from "@/utils";
import useGrid from "@/hooks/useGrid";
import useUserStates from "@/hooks/useUserStates";
import Grid from "@/components/TheGrid.vue";
import ModalSavePuzzle from "@/components/ModalSavePuzzle.vue";

const showSaveGridModal = ref<Boolean>(false);
const grid = ref<Grid>(createGrid(10));

const { indexToXY, clampToGrid, levelIsCleared } = useGrid(grid.value);
const { player } = useUserStates("singleplayer", clampToGrid, setGrid);

function onStateChanged(newState: any) {
  console.log("damn! onstatechanged", newState);
}

function onToggleCellValue(value: string) {
  if (showSaveGridModal.value || levelIsCleared.value) return;

  const [x, y] = (player.value as Player).position;
  grid.value[y][x] = grid.value[y][x] === value ? " " : value;
}

function setGrid(newGrid: Grid) {
  grid.value = newGrid;
}

function onCellClicked(index: number) {
  const [x, y] = indexToXY(index);
  grid.value[y][x] = grid.value[y][x] === " " ? "d" : " ";
}

function onMoveCursor(direction: Direction) {
  if (showSaveGridModal.value) return;

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
