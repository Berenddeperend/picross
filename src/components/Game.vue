<script setup lang="ts">
import { isEqual, clamp } from "lodash";
import { onMounted, ref, watch, computed } from "vue";
import { getHits } from "../grid-helpers";
import confetti from "canvas-confetti";

import SampleLevel from "./../sample-level.json";

type Grid = string[][];
type Position = [number, number];

type Intention = "build";

const gridSize = 10;
const grid = ref<Grid>(createGrid(gridSize));
const solution = ref<Grid>(SampleLevel);
const cursorCell = ref<Position>([0, 0]);

const legendForColumns = ref<HTMLDivElement>();
const legendForRows = ref<HTMLDivElement>();

const horizontalLegendStyle = ref({});

const interaction = ref({
  spacePressed: false,
  intention: "build",
});

function clampToGrid(value: number) {
  return clamp(value, 0, gridSize - 1);
}

function hitsInRow(rowNumber: number): number[] {
  return getHits(solution.value[rowNumber]);
}

function hitsInColumn(colNumber: number): number[] {
  return getHits(solution.value.map((x) => x[colNumber]));
}

const levelIsCleared = computed(() => {
  return isEqual(grid.value, solution.value);
});

function indexToXY(index: number): Position {
  const x = index % gridSize;
  const y = Math.floor(index / gridSize);
  return [x, y];
}

function cellIndexIs(index: number, value: string): boolean {
  const [x, y] = indexToXY(index);
  return grid.value[y][x] === value;
}

function cellIndexIsFilled(index: number): boolean {
  const [x, y] = indexToXY(index);
  return grid.value[y][x] === "d";
}

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

watch(
  () => grid,
  (grid) => {
    console.log(legendForRows.value!.offsetWidth);
  },
  { deep: true }
);

function columnLegendActive(index: number) {
  return cursorCell.value[0] === index;
}

function rowLegendActive(index: number) {
  return cursorCell.value[1] === index;
}

function xYToIndex(xy: Position): number {
  const [x, y] = xy;
  return y * gridSize + x;
}

function cellClicked(grid: Grid, row: number, column: number) {
  grid[row][column] = "x";
}

function toggleCellValue(value: string) {
  const cell = grid.value[cursorCell.value[1]][cursorCell.value[0]];
  if (cell === value) {
    interaction.value.intention = "clear";
    grid.value[cursorCell.value[1]][cursorCell.value[0]] = " ";
  } else {
    interaction.value.intention = "build";
    grid.value[cursorCell.value[1]][cursorCell.value[0]] = value;
  }
}

function repeatAction() {
  if (interaction.value.spacePressed) {
    interaction.value.intention;
    toggleCellValue("d");
  }
}

function setCellValue(value: string) {
  grid.value[cursorCell.value[1]][cursorCell.value[0]] = value;
}

onMounted(() => {
  window.addEventListener("keydown", (e) => {
    // e.preventDefault();
    if (e.key === "ArrowLeft") {
      cursorCell.value[0] = clampToGrid(cursorCell.value[0] - 1);
      if (interaction.value.spacePressed) toggleCellValue("d");
    } else if (e.key === "ArrowRight") {
      cursorCell.value[0] = clampToGrid(cursorCell.value[0] + 1);
      if (interaction.value.spacePressed) toggleCellValue("d");
    } else if (e.key === "ArrowUp") {
      cursorCell.value[1] = clampToGrid(cursorCell.value[1] - 1);
      if (interaction.value.spacePressed) toggleCellValue("d");
    } else if (e.key === "ArrowDown") {
      cursorCell.value[1] = clampToGrid(cursorCell.value[1] + 1);
      if (interaction.value.spacePressed) toggleCellValue("d");
    } else if (e.key === "f") {
      toggleCellValue("x");
    } else if (e.key === " ") {
      interaction.value.spacePressed = true;
      toggleCellValue("d");
    }
  });

  window.addEventListener("keyup", (e) => {
    if (e.key === " ") {
      interaction.value.spacePressed = false;
    }
  });
});

function createGrid(size: number): Grid {
  const grid = new Array(size).fill("").map((d) => new Array(size).fill(" "));
  return grid;
}
</script>

<template>
  <div class="playfield-container" :class="{ cleared: levelIsCleared }">
    <div class="optical-guide horizontal" ref="guidehorizontal"></div>
    <div class="optical-guide vertical" ref="guidevertical"></div>

    <div class="corner"></div>
    <div class="legend horizontal" ref="legendForColumns">
      <div
        class="cell"
        :class="{ highlighted: columnLegendActive(index) }"
        v-for="(cell, index) in gridSize"
      >
        <div v-for="hit in hitsInColumn(index)">{{ hit }}</div>
      </div>
    </div>
    <div class="legend vertical" ref="legendForRows">
      <div
        class="cell"
        :class="{ highlighted: rowLegendActive(index) }"
        v-for="(cell, index) in gridSize"
      >
        <div v-for="hit in hitsInRow(index)">{{ hit }}</div>
      </div>
    </div>
    <div
      class="cell"
      v-for="(cell, index) in gridSize * gridSize"
      :class="{
        cursor: isEqual(cursorCell, indexToXY(index)),
        filled: cellIndexIs(index, 'd'),
        flagged: cellIndexIs(index, 'x'),
      }"
    ></div>
  </div>
</template>

<style lang="scss">
.horizontal-thing {
  position: absolute;
}

.playfield-container {
  background: gray;
  position: relative;
  padding: 1px;
  transition: background-color 0.4s;

  display: inline-grid;
  grid-template-columns: auto repeat(10, 1fr);
  grid-template-rows: auto repeat(10, 1fr);

  &.cleared {
    //background: green;
  }
}

.corner {
  //width: 100px;
  //height: 100px;
}

.legend {
  .cell {
    display: flex;
    justify-content: flex-end;

    &.highlighted {
      background: lightblue;
    }
  }

  &.horizontal {
    grid-column: span 10;
    display: flex;

    .cell {
      flex-direction: column;
      height: auto;
    }
  }

  &.vertical {
    display: flex;
    flex-direction: column;

    .cell {
      display: flex;
      width: auto;
    }

    grid-row: span 10;
  }
}

.optical-guide {
  background: greenyellow;
  position: absolute;

  &.horizontal {
    bottom: 134px;
    height: 2px;
    width: 100%;
    transform: translateY(-50%);
  }

  &.vertical {
    //right: calc(50% - 13px);
    //right: calc(50% - 13px);
    right: 134px;
    width: 2px;
    height: 100%;
    transform: translateX(-50%);
  }
}

.cell.cursor,
.cell:hover {
  font-weight: bold;
  z-index: 2;
  box-shadow: 0px 0px 0px 2px lightblue;
}

.row {
  display: flex;
}

.cell {
  margin: 1px;
  border-radius: 2px;
  width: 25px;
  height: 25px;
  vertical-align: center;
  background: white;
  transition: background-color 0.1s;

  > div {
    width: 20px;
    text-align: center;
  }

  &.filled {
    background-color: #444;
  }

  &.flagged {
    background-color: red;
  }
}
</style>
