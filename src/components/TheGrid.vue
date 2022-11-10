<script setup lang="ts">
import { StyleValue, computed, Ref, unref } from "vue";
import { isEqual } from "lodash";

import useGrid from "@/hooks/useGrid";

import { initControls } from "@/hooks/useControls";

const {
  enableControls = false,
  enableSocket = false,
  players,
  player,
  game,
} = defineProps<{
  enableControls?: boolean;
  enableSocket?: boolean;
  players?: Players;
  player?: Player;
  game: ReturnType<typeof useGrid>;
}>();

const {
  gridSize,
  indexToXY,
  hitsInColumns,
  hitsInRows,
  levelIsCleared,
  grid,
  solution,
} = game;

const emit = defineEmits<{
  (e: "onCellClicked", index: number): void;
  (e: "onCellRightClicked", index: number): void;
  (e: "gridChanged", grid: Grid): void;
  (e: "moveCursor", dir: Direction): void;
  (e: "toggleCellValue", value: string): void;
  (e: "onCellHover", index: number): void;
}>();

const cursor = computed<Position>(() => player?.position as Position);

if (enableControls) {
  initControls({
    toggleCellValue: (value) => {
      emit("toggleCellValue", value);
    },
    movePlayerCursor: (value) => {
      emit("moveCursor", value);
    },
  });

  //ik denk dat dit maar een eventbus moet worden
  // const {controlEvents} = useControls
  // controlEvents.on(moveCursor) ofzo.
}

function cursorStyling(index: number): StyleValue | undefined {
  if (cursor && player && !players) { //build mode, i hate these ifs :(
    if(isEqual(indexToXY(index), player!.position)) {
      return `outline: 5px solid hotpink; z-index: 2;`
    }
  }

  if (!cursor || !player || !players) return;

  const cellIsOwnCursor = isEqual(indexToXY(index), cursor);
  if (cellIsOwnCursor) return;

  if (enableSocket) {
    if(levelIsCleared.value) return '';

    const friend = Object.values(players).find((friends) => {
      return isEqual(indexToXY(index), friends.position);
    });

    return !!friend
      // ? `box-shadow: 1px 1px 0px 2px ${friend.color}; z-index: 2;`
      ? `outline: 5px solid ${friend.color}; z-index: 2;`
      : undefined;
  }
}

const playfieldStyling = computed((): StyleValue => {
  const rule = unref(solution) ? `auto repeat(10, 1fr)` : `repeat(10, 1fr)`;
  return `
    grid-template-columns: ${rule};
    grid-template-rows: ${rule};
  `;
});

function cellIndexIs(index: number, value: string): boolean {
  const [x, y] = indexToXY(index);
  return unref(grid)[y][x] === value;
}

function columnLegendActive(index: number) {
  if (!player) return;
  return player.position[0] === index;
}

function rowLegendActive(index: number) {
  if (!player) return;
  return player.position[1] === index;
}

function onCellClicked(index: number) {
  if (!enableControls) return;
  if (levelIsCleared.value) return;
  emit("onCellClicked", index);
}

function onCellRightClicked(index: number) {
  if (!enableControls) return;
  emit("onCellRightClicked", index);
}

function onCellHover(positionIndex: number) {
  if (!enableControls) return;
  emit("onCellHover", positionIndex);
}
</script>

<template>
  <div
    class="playfield-container"
    :class="{ cleared: levelIsCleared }"
    :style="playfieldStyling"
  >

    <div class="corner" v-if="solution"></div>

    <div class="legend horizontal" v-if="solution">
      <div
        class="cell"
        :class="{ highlighted: columnLegendActive(index) }"
        v-for="(cell, index) in gridSize"
        :key="index"
      >
        <div
          v-for="(hit, hitIndex) in hitsInColumns[index]"
          :key="hitIndex"
          class="hit"
        >
          {{ hit }}
        </div>
      </div>
    </div>
    <div class="legend vertical" v-if="solution">
      <div
        class="cell"
        :class="{ highlighted: rowLegendActive(index) }"
        v-for="(cell, index) in gridSize"
        :key="index"
      >
        <div
          v-for="(hit, hitIndex) in hitsInRows[index]"
          :key="hitIndex"
          class="hit"
        >
          {{ hit }}
        </div>
      </div>
    </div>

    <div
      class="cell"
      v-for="(cell, index) in gridSize * gridSize"
      :key="index"
      :style="cursorStyling(index)"
      @mouseover="onCellHover(index)"
      @click="onCellClicked(index)"
      @click.right.prevent="onCellRightClicked(index)"
      :i="index"
      :class="{
        cursor: isEqual(player?.position, indexToXY(index)),
        filled: cellIndexIs(index, 'd'),
      }"
    >
      <span class="cell-x" v-if="cellIndexIs(index, 'x')">×</span>
  </div>
  </div>
</template>

<style lang="scss" scoped>
$delay: 1s;
$transition-time: 0.1s;
$transition-time-slow: 1s;

$cellSize: 27px;

.horizontal-thing {
  position: absolute;
}

.playfield-container {
  background: gray;
  position: relative;
  padding: 1px;
  //transition: background-color 0.4s;

  display: inline-grid;
  //grid-template-columns: auto repeat(10, 1fr);
  //grid-template-rows: auto repeat(10, 1fr);

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
    background: #d2d6dc;
    //min-width: 10px;
    &:hover {
      box-shadow: none;
    }

    &.highlighted {
      background: lightblue;
    }

    .hit {
      //flex: 1 1 100%;
    }

    //.hit {
    //  color: red;
    //}
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

//.cell:hover,
.cell.cursor {
  z-index: 2;
  // box-shadow: 0 0 0 4px lightblue;
  // outline: 4px solid hotpink;
}

.row {
  display: flex;
}

.cleared .cell {
  margin: 0;
  border-radius: 0;
  transition: background-color $transition-time,
    margin $transition-time-slow $delay,
    border-radius $transition-time-slow $delay;
  box-shadow: none !important;

  .cell-x {
    transition-delay: $delay;
    opacity: 0; 
  }
}

.cell {
  margin: 1px;
  // border: 1px solid gray;
  border-radius: 2px;
  width: $cellSize;
  height: $cellSize;
  //min-width: $cellSize;
  //min-height: $cellSize;
  vertical-align: center;
  background: white;
  transition: background-color 0.1s;

  .cell-x {
    transition: opacity 0.5s;
  }

  > div {
    //width: 20px;
    width: calc(#{$cellSize} - 2px);
    height: calc(#{$cellSize} - 2px);
    text-align: center;
  }

  &.filled {
    background-color: #444;
  }

  &.flagged {
    //background-color: transparent;
  }
}
</style>
