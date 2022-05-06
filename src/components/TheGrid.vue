<script setup lang="ts">
import { StyleValue, computed, Ref } from "vue";
import { isEqual } from "lodash";

import useGrid from "@/hooks/useGrid";

import { initControls } from "@/hooks/useControls";

const {
  enableFlag = false,
  enableControls = false,
  enableSocket = false,
  players,
  player,
  game,
} = defineProps<{
  enableFlag?: boolean;
  enableControls?: boolean;
  enableSocket?: boolean;
  players?: Players;
  player?: Player;
  game: ReturnType<typeof useGrid>;
}>();

console.log(game.grid);

// const { gridSize, newHitsInRows, hitsInColumn, levelIsCleared, indexToXY } =
//   useGrid(grid, solution); //todo: beetje gek misschien, 'use' gebruiken in component maar ook deels van parent krijgen

const emit = defineEmits<{
  (e: "onCellClicked", index: number): void;
  (e: "gridChanged", grid: Grid): void;
  (e: "stateChanged", grid: Grid): void;
  (e: "moveCursor", dir: Direction): void;
  (e: "toggleCellValue", value: string): void;
}>();

const cursor = player
  ? computed<Position>(() => player.position as Position)
  : null;

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
  if (!cursor || !player || !players) return;

  const cellIsOwnCursor = isEqual(game.indexToXY(index), cursor.value);
  if (cellIsOwnCursor)
    return `
    box-shadow: 0px 0px 0px 2px ${player.color};
  `;

  if (enableSocket) {
    const friend = Object.values(players).find((friends) => {
      return isEqual(game.indexToXY(index), friends.position);
    });
    return !!friend ? `box-shadow: 0px 0px 0px 2px ${friend.color}` : undefined;
  }
}

const playfieldStyling = computed((): StyleValue => {
  const rule = game.solution.value ? `auto repeat(10, 1fr)` : `repeat(10, 1fr)`;
  return `
    grid-template-columns: ${rule};
    grid-template-rows: ${rule};
  `;
});

function cellIndexIs(index: number, value: string): boolean {
  const [x, y] = game.indexToXY(index);
  return game.grid.value[y][x] === value;
}

function columnLegendActive(index: number) {
  if (!player) return;
  // return cursorPosition.value[0] === index;
  return player.position[0] === index;
}

function rowLegendActive(index: number) {
  if (!player) return;
  // return cursorPosition.value[1] === index;
  return player.position[1] === index;
}

function onCellClicked(index: number) {
  // const [x, y] = indexToXY(index);
  if (!enableControls) return;
  emit("onCellClicked", index);
  // grid.value[y][x] = "d";
}
</script>

<template>
  <div
    class="playfield-container"
    :class="{ cleared: game.levelIsCleared }"
    :style="playfieldStyling"
  >
    <div class="corner" v-if="game.solution.value"></div>

    <div class="legend horizontal" v-if="game.solution.value">
      <div
        class="cell"
        :class="{ highlighted: columnLegendActive(index) }"
        v-for="(cell, index) in game.gridSize"
        :key="index"
      >
        <div
          v-for="(hit, hitIndex) in game.hitsInColumn(index)"
          :key="hitIndex"
          class="hit"
        >
          {{ hit }}
        </div>
      </div>
    </div>
    <div class="legend vertical" v-if="game.solution.value">
      <div
        class="cell"
        :class="{ highlighted: rowLegendActive(index) }"
        v-for="(cell, index) in game.gridSize"
        :key="index"
      >
        <div
          v-for="(hit, hitIndex) in game.newHitsInRows[index]"
          :key="hitIndex"
        >
          {{ hit }}
        </div>
      </div>
    </div>

    <div
      class="cell"
      v-for="(cell, index) in game.gridSize.value * game.gridSize.value"
      :key="index"
      :style="cursorStyling(index)"
      @click="onCellClicked(index)"
      :i="index"
      :class="{
        cursor: isEqual(player?.position, game.indexToXY(index)),
        filled: cellIndexIs(index, 'd'),
        flagged: cellIndexIs(index, 'x'),
      }"
    ></div>
  </div>
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
  $size: 27px;
  //margin: 1px;
  border: 1px solid gray;
  border-radius: 3px;
  width: $size;
  height: $size;
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
