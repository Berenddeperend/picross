<template>
  <div class="create">
    <router-link :to="{ name: 'mainMenu' }">Terug</router-link>
    <button @click="showSaveGridModal = true">Save puzzle</button>

    <button @click="validatePuzzle">validate</button>

    <ModalSavePuzzle
      :open="showSaveGridModal"
      @close="showSaveGridModal = false"
      :grid="grid"
    />
    <Grid
      :enable-controls="true"
      :game="game"
      :player="player"
      @onCellClicked="onCellClicked"
      @moveCursor="onMoveCursor"
      @toggleCellValue="onToggleCellValue"
    />
  </div>
  <!--    dit niet emitten maar exposen als functie! dan kan ik {useMoveCurosr} from grid doen -->
</template>

<script setup lang="ts">
import { ref, unref } from "vue";
import { createGrid } from "@/utils";
import useGrid from "@/hooks/useGrid";
import useUserStates from "@/hooks/useUserStates";
import Grid from "@/components/TheGrid.vue";
import ModalSavePuzzle from "@/components/ModalSavePuzzle.vue";
import http from "@/services/http";

const showSaveGridModal = ref<Boolean>(false);

const game = useGrid(createGrid(10));
const { grid, computeHitsInRows, computeHitsInColumns } = game;

const { player } = useUserStates("singleplayer", game);

function validatePuzzle() {
  const addZeroIfEmpty = (arr: number[]): number[] => (arr.length ? arr : [0]);
  const columns = computeHitsInColumns(grid.value).map(addZeroIfEmpty);
  const rows = computeHitsInRows(grid.value).map(addZeroIfEmpty);

  http
    .post("/validate-puzzle", {
      legendData: {
        rows,
        columns,
      },
      // legendData: {
      //   columns: [[1], [0], [1], [0], [1], [0], [1], [0], [1], [0], [1]],
      //   rows: [[1, 1, 1], [0], [1, 1, 1]],
      // },
    })
    .then((response) => {
      console.log(response.data);
    });
}

function onToggleCellValue(value: string) {
  if (showSaveGridModal.value || game.levelIsCleared.value) return;

  const [x, y] = (player.value as Player).position;
  grid.value[y][x] = grid.value[y][x] === value ? " " : value;
}

function onCellClicked(index: number) {
  const [x, y] = game.indexToXY(index);
  grid.value[y][x] = grid.value[y][x] === " " ? "d" : " ";
}

function onMoveCursor(direction: Direction) {
  if (showSaveGridModal.value) return;

  if (direction === "left") {
    player.value!.position[0] = game.clampToGrid(player.value!.position[0] - 1);
  }
  if (direction === "right") {
    player.value!.position[0] = game.clampToGrid(player.value!.position[0] + 1);
  }
  if (direction === "up") {
    player.value!.position[1] = game.clampToGrid(player.value!.position[1] - 1);
  }
  if (direction === "down") {
    player.value!.position[1] = game.clampToGrid(player.value!.position[1] + 1);
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
