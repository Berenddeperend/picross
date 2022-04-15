<script setup lang="ts">
import { isEqual } from "lodash";
import { watch, computed, StyleValue, onMounted } from "vue";
import confetti from "canvas-confetti";

import {
  grid,
  gridSize,
  // solution,
  hitsInRow,
  hitsInColumn,
  syncGrid,
  levelIsCleared,
} from "@/hooks/useGrid";
import {
  syncPlayersState,
  initState,
  players,
  player,
  cursor,
} from "@/hooks/useUserStates";
import { initControls, toggleCellValue } from "@/hooks/useControls";

import ClearGrid from "@/components/TheClear.vue";

syncGrid();
syncPlayersState();
initControls();
initState();

function indexToXY(index: number): Position {
  const x = index % gridSize;
  const y = Math.floor(index / gridSize);
  return [x, y];
}

function cursorStyling(index: number): StyleValue | undefined {
  const cellIsOwnCursor = isEqual(indexToXY(index), cursor.value);
  if (cellIsOwnCursor)
    return `
    box-shadow: 0px 0px 0px 2px ${player.value?.color};
  `;

  const friend = Object.values(players.value).find((friends) => {
    return isEqual(indexToXY(index), friends.position);
  });
  return !!friend ? `box-shadow: 0px 0px 0px 2px ${friend.color}` : undefined;
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

function onCellClicked(index: number) {
  const [x, y] = indexToXY(index);
  grid.value[y][x] = "d";
}

// function setCellValue(value: string) {
// grid.value[cursorPosition.value[1]][cursorPosition.value[0]] = value;
// }
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
      :style="cursorStyling(index)"
      @click="onCellClicked(index)"
      :i="index"
      :class="{
        // cursor: isEqual(player?.position, indexToXY(index)),
        filled: cellIndexIs(index, 'd'),
        flagged: cellIndexIs(index, 'x'),
      }"
    ></div>
  </div>
  <ClearGrid />
</template>

<style lang="scss" scoped>
$delay: 1s;
$transition-time: 0.1s;
$transition-time-slow: 1s;

.horizontal-thing {
  position: absolute;
}

.playfield-container {
  background: gray;
  position: relative;
  padding: 1px;
  //transition: background-color 0.4s;

  display: inline-grid;
  grid-template-columns: auto repeat(10, 1fr);
  grid-template-rows: auto repeat(10, 1fr);

  &.cleared {
    background: none;
    transition: background-color $transition-time-slow 1s;
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

.cleared .optical-guide,
.cleared .legend {
  //width: 0;
  //height: 0;
  opacity: 0;
  transition: $transition-time-slow $delay;
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
  box-shadow: 0 0 0 2px lightblue;
}

.row {
  display: flex;
}

.cleared .cell {
  margin: 0;
  border-radius: 0;
  transition: background-color $transition-time,
    margin $transition-time-slow $delay * 2,
    border-radius $transition-time-slow $delay * 2;
  box-shadow: none !important;
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