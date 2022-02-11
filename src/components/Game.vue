<script setup lang="ts">
import { isEqual, clamp } from "lodash";
import { onMounted, ref, watch, computed } from "vue";
import { getHits } from "@/grid-helpers";
import confetti from "canvas-confetti";
import useUserStates from "@/hooks/useUserStates";

import { io } from "socket.io-client";
import useGrid from "@/hooks/useGrid";
import { useStore } from "@/stores/store";
const store = useStore();
// const socket = io("ws://localhost:3000", { resource: "ws://localhost:4000" });
const socket = io("ws://localhost:7000");

const { updatePlayerStates, initState, players, playerId } = useUserStates();
initState(socket);
updatePlayerStates(socket);

const { grid, gridSize, solution, clampToGrid, hitsInRow, hitsInColumn } =
  useGrid();

const cursorPosition = ref<Position>([0, 0]);

const interaction = ref({
  spacePressed: false,
  intention: "build",
});

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

function columnLegendActive(index: number) {
  return cursorPosition.value[0] === index;
}

function rowLegendActive(index: number) {
  return cursorPosition.value[1] === index;
}

function xYToIndex(xy: Position): number {
  const [x, y] = xy;
  return y * gridSize + x;
}

function cellClicked(grid: Grid, row: number, column: number) {
  grid[row][column] = "x";
}

function toggleCellValue(value: string) {
  const cell = grid.value[cursorPosition.value[1]][cursorPosition.value[0]];
  if (cell === value) {
    interaction.value.intention = "clear";
    grid.value[cursorPosition.value[1]][cursorPosition.value[0]] = " ";
  } else {
    interaction.value.intention = "build";
    grid.value[cursorPosition.value[1]][cursorPosition.value[0]] = value;
  }
}

function repeatAction() {
  if (interaction.value.spacePressed) {
    interaction.value.intention;
    toggleCellValue("d");
  }
}

function setCellValue(value: string) {
  grid.value[cursorPosition.value[1]][cursorPosition.value[0]] = value;
}

onMounted(() => {
  socket.on("gridChanged", (newGrid: Grid) => {
    grid.value = newGrid;
  });

  // socket.on("userStatesUpdated", (userStates: ) => {
  //   console.log(things);
  //   cursorPosition.value = things;
  // });

  window.addEventListener("keydown", (e) => {
    // e.preventDefault();
    if (e.key === "ArrowLeft") {
      cursorPosition.value[0] = clampToGrid(cursorPosition.value[0] - 1);
      if (interaction.value.spacePressed) toggleCellValue("d");
    } else if (e.key === "ArrowRight") {
      cursorPosition.value[0] = clampToGrid(cursorPosition.value[0] + 1);
      if (interaction.value.spacePressed) toggleCellValue("d");
    } else if (e.key === "ArrowUp") {
      cursorPosition.value[1] = clampToGrid(cursorPosition.value[1] - 1);
      if (interaction.value.spacePressed) toggleCellValue("d");
    } else if (e.key === "ArrowDown") {
      cursorPosition.value[1] = clampToGrid(cursorPosition.value[1] + 1);
      if (interaction.value.spacePressed) toggleCellValue("d");
    } else if (e.key === "f") {
      toggleCellValue("x");
    } else if (e.key === " ") {
      interaction.value.spacePressed = true;
      toggleCellValue("d");
    }

    // socket.emit("cursorPosition", cursorPosition.value);
    // socket.emit("userStateChanged", {});
    socket.emit("cursorPositionChanged", cursorPosition.value);
  });

  window.addEventListener("keyup", (e) => {
    if (e.key === " ") {
      interaction.value.spacePressed = false;
    }
  });
});
</script>

<template>
  {{ Object.keys(players) }},

  <strong>{{ playerId }}</strong>
  <div class="playfield-container" :class="{ cleared: levelIsCleared }">
    <div class="optical-guide horizontal" ref="guidehorizontal"></div>
    <div class="optical-guide vertical" ref="guidevertical"></div>

    <div class="corner"></div>
    <div class="legend horizontal" ref="legendForColumns">
      <div
        class="cell"
        :class="{ highlighted: columnLegendActive(index) }"
        v-for="(cell, index) in gridSize"
        :key="index"
      >
        <div v-for="(hit, hitIndex) in hitsInColumn(index)" :key="hitIndex">
          {{ hit }}
        </div>
      </div>
    </div>
    <div class="legend vertical" ref="legendForRows">
      <div
        class="cell"
        :class="{ highlighted: rowLegendActive(index) }"
        v-for="(cell, index) in gridSize"
        :key="index"
      >
        <div v-for="(hit, hitIndex) in hitsInRow(index)" :key="hitIndex">
          {{ hit }}
        </div>
      </div>
    </div>
    <div
      class="cell"
      v-for="(cell, index) in gridSize * gridSize"
      :key="index"
      :class="{
        cursor: isEqual(cursorPosition, indexToXY(index)),
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
