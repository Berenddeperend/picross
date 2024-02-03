<script setup lang="ts">
import { StyleValue, computed, Ref, unref } from "vue";
import { isEqual } from "lodash";
import { initControls } from "@/hooks/useControls";
import useGrid from "@/hooks/useGrid";

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
  puzzle,
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

const shouldShowLegend = computed(() => {
  return unref(solution) && enableControls;
});

const opticalGuideCount = computed(() => {
  return Math.ceil(unref(gridSize) / 5) - 1;
});

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

function getOpticalGuideOffset(index: number): number {
  const cellSize = 28;
  return 2 + index * (5 * cellSize);
}

function cursorStyling(index: number): StyleValue | undefined {
  if (cursor && player && !players) {
    //build mode, i hate these ifs :(
    if (isEqual(indexToXY(index), player!.position)) {
      return `outline: 5px solid hotpink; z-index: 4;`;
    }
  }

  if (!cursor || !player || !players) return;

  const cellIsOwnCursor = isEqual(indexToXY(index), cursor);
  if (cellIsOwnCursor) return;

  if (enableSocket) {
    if (levelIsCleared.value) return "";

    const friend = Object.values(players).find((friends) => {
      return isEqual(indexToXY(index), friends.position);
    });

    return !!friend
      ? `outline: 5px solid ${friend.color}; z-index: 3;`
      : undefined;
  }
}

const playfieldStyling = computed((): StyleValue => {
  const rule = shouldShowLegend.value
    ? `auto repeat(${unref(gridSize)}, 1fr)`
    : `repeat(${unref(gridSize)}, 1fr)`;

  return `
    grid-template-columns: ${rule};
    grid-template-rows: ${rule};
  `;
});

function cellIndexIs(index: number, value: string): boolean {
  const [x, y] = indexToXY(index); //maybe memoize this
  return unref(grid)[y][x] === value; // keep this unref, not sure why tho.
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
    <div class="corner" v-if="shouldShowLegend"></div>

    <div
      class="legend horizontal"
      v-if="shouldShowLegend"
      :style="{ 'grid-column': `span ${gridSize}` }"
    >
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
    <div
      class="legend vertical"
      v-if="shouldShowLegend"
      :style="{ 'grid-row': `span ${gridSize}` }"
    >
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
      v-for="(cell, index) in grid.length * grid.length"
      :key="cell"
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
      <transition name="x">
        <span class="cell-x" v-if="!levelIsCleared && cellIndexIs(index, 'x')"
          >×</span
        >
      </transition>
    </div>

    <div
      v-for="i in opticalGuideCount"
      class="optical-guide horizontal"
      :style="{
        width: `${28 * gridSize - 1}px`,
        bottom: `${getOpticalGuideOffset(i) - 0.5}px`,
      }"
    ></div>
    <div
      v-for="i in opticalGuideCount"
      class="optical-guide vertical"
      :style="{
        height: `${28 * gridSize - 0.5}px`,
        right: `${getOpticalGuideOffset(i) - 1}px`,
      }"
    ></div>
  </div>
</template>

<style lang="scss" scoped>
$delay: 1s;
$transition-time: 0.1s;
$transition-time-slow: 1s;
$cellSize: 27px;

$bg: $bg-gray-100;
$cell-filled: linear-gradient(0deg, #555, #666);
$cell-cleared-filled: #444;
// $legend-bg: hsl(200deg 19% 94%);
$legend-bg: $bg-gray-50;
$legend-bg-active: $bg-blue-50;
$bg-corner: $bg;

.horizontal-thing {
  position: absolute;
}

.playfield-container {
  background: $bg;
  position: relative;
  padding: 2px;
  border-radius: 2px;

  display: inline-grid;

  &.cleared {
    background: none;
    transition: background-color $transition-time-slow 1s;
  }
}

.legend {
  .cell {
    display: flex;
    justify-content: flex-end;
    background: $legend-bg;
    font-weight: bold;
    font-size: 13px;

    &:hover {
      box-shadow: none;
    }

    &.highlighted {
      background: $legend-bg-active;
    }
  }

  &.horizontal {
    grid-column: span 10;
    display: flex;

    .cell {
      flex-direction: column;
      height: auto;
      align-items: center;
    }
  }

  &.vertical {
    display: flex;
    flex-direction: column;

    .cell {
      display: flex;
      width: auto;
      align-items: center;
    }

    grid-row: span 10;
  }
}

.corner {
  background: $bg-corner;
  border-radius: 2px;
  margin: 1px;
}

.cleared .optical-guide,
.cleared .corner,
.cleared .legend {
  opacity: 0;
  transition: $transition-time-slow $delay;
}

.cleared .optical-guide {
  transition-delay: 0s;
}

.optical-guide {
  background: black;
  position: absolute;

  &.horizontal {
    height: 1px;
    width: 279px;
    right: 2.5px;
  }

  &.vertical {
    width: 1px;
    bottom: 2px;
    height: 279px;
    transform: translateX(-50%);
  }
}

.cell.cursor {
  z-index: 5 !important;
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

  &.filled {
    background: $cell-cleared-filled;
    position: relative;

    &:before {
      transition: opacity $transition-time-slow $delay;
      opacity: 0;
    }
  }

  .cell-x {
    transition: opacity $transition-time-slow $delay !important;
    transition-delay: $delay;
    opacity: 0;
  }
}

.x-enter-active,
.x-leave-active {
  transition: opacity 0.2s ease, transform 0.2s;
}

.x-enter-from,
.x-leave-to {
  opacity: 0;
  transform: rotate(90deg);
}

.cell {
  width: var(--cell-size);
  height: var(--cell-size);
  line-height: var(--cell-size);
  background: white;
  transition: background-color 0.1s;
  color: black;
  user-select: none;

  margin: 0.5px;
  border-radius: 0px;
  box-shadow: 0 1px 1px rgb(0 0 0 / 10%);
  position: relative;

  &:before {
    opacity: 0;
    background: white;
    z-index: 2;
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
  }

  .cell-x {
    display: block;
  }

  > div {
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
  }

  &.filled {
    &:before {
      background: $cell-filled;
      animation: pop 0.2s;
      opacity: 1;
    }

    .cell-x {
      transition: none;
    }
  }
}
@keyframes pop {
  0% {
    transform: scale(0.8);
  }
  30% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
