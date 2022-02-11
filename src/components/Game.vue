<script setup lang="ts">
import { isEqual, clamp } from "lodash";
import { onMounted, ref, watch, computed, ComputedRef } from "vue";
import confetti from "canvas-confetti";

import {
  grid,
  gridSize,
  solution,
  clampToGrid,
  hitsInRow,
  hitsInColumn,
  syncGrid,
} from "@/hooks/useGrid";
import {
  syncPlayersState,
  initState,
  players,
  player,
  playerId,
  cursor,
} from "@/hooks/useUserStates";
import { initControls } from "@/hooks/useControls";
import { socket } from "@/hooks/useSocket";

initState();
syncPlayersState();
syncGrid();
initControls();

const cursorPosition = ref<Position>([0, 0]);

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
  // return cursorPosition.value[0] === index;
  return player.value?.position[0] === index;
}

function rowLegendActive(index: number) {
  // return cursorPosition.value[1] === index;
  return player.value?.position[1] === index;
}

function xYToIndex(xy: Position): number {
  const [x, y] = xy;
  return y * gridSize + x;
}

function cellClicked(grid: Grid, row: number, column: number) {
  grid[row][column] = "x";
}

function setCellValue(value: string) {
  grid.value[cursorPosition.value[1]][cursorPosition.value[0]] = value;
}
</script>

<template>
  {{ players }}
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
        cursor: isEqual(player?.position, indexToXY(index)),
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
