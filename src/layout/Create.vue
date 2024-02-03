<script setup lang="ts">
import { ref, watch } from "vue";
import { debounce } from "lodash";
import { createGrid } from "@/utils";
import useGrid from "@/hooks/useGrid";
import useUserStates from "@/hooks/useUserStates";
import Grid from "@/components/TheGrid.vue";
import ModalSavePuzzle from "@/components/ModalSavePuzzle.vue";
import ModalPuzzleInvalid from "@/components/ModalPuzzleInvalid.vue";
import http from "@/services/http";

const showSaveGridModal = ref<Boolean>(false);
const showPuzzleInvalidModal = ref<Boolean>(false);

const chosenPuzzleSize = ref(10);

const game = useGrid(createGrid(chosenPuzzleSize.value));
const { grid, computeHitsInRows, computeHitsInColumns, setPuzzle } = game;
const { player } = useUserStates("singleplayer", game);

const puzzleIsValidated = ref(false);
const puzzleIsValid = ref(false);

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
    })
    .then((response) => {
      puzzleIsValidated.value = true;
      puzzleIsValid.value = response.data;
    });
}
const debouncedValidate = debounce(validatePuzzle, 400);

function onToggleCellValue(value: string) {
  if (showSaveGridModal.value || game.levelIsCleared.value) return;

  const [x, y] = (player.value as Player).position;
  grid.value[y][x] = grid.value[y][x] === value ? " " : value;
}

function onClearClicked() {
  game.setGrid(createGrid(chosenPuzzleSize.value));
}

function onCellClicked(index: number) {
  const [x, y] = game.indexToXY(index);
  grid.value[y][x] = grid.value[y][x] === " " ? "d" : " ";
}

function onCellHover(index: number) {
  player.value!.position = game.indexToXY(index);
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

function onSaveClick() {
  if (puzzleIsValid.value) {
    showSaveGridModal.value = true;
  } else {
    showPuzzleInvalidModal.value = true;
  }
}
const sizeToggle = ref(false);

watch(sizeToggle, () => {
  chosenPuzzleSize.value = sizeToggle.value ? 15 : 10;
  game.setGrid(createGrid(chosenPuzzleSize.value));
});

watch(
  grid,
  () => {
    puzzleIsValidated.value = false;
    debouncedValidate();
  },
  { deep: true }
);
</script>

<template>
  <div class="create">
    <header>
      <router-link class="link" :to="{ name: 'mainMenu' }">← Back</router-link>

      <label class="toggle" style="width: 160px">
        <input type="checkbox" v-model="sizeToggle" />
        <a></a>
        <span>
          <span class="left-span">10x10</span>
          <span class="right-span">15x15</span>
        </span>
      </label>
    </header>

    <ModalPuzzleInvalid
      :open="showPuzzleInvalidModal"
      @close="showPuzzleInvalidModal = false"
    />

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
      @onCellHover="onCellHover"
      @toggleCellValue="onToggleCellValue"
    />

    <div class="btns-container">
      <button class="btn btn-link" @click="onClearClicked">Clear</button>

      <button
        class="btn"
        :class="{ disabled: !puzzleIsValid }"
        @click="onSaveClick"
      >
        Save puzzle
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.create {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

header {
  display: flex;
  margin-bottom: 10px;
  justify-content: space-between;
  width: 100%;
}

.btns-container {
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-top: 10px;
}
</style>
