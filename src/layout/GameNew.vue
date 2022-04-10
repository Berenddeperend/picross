<script setup lang="ts">
import { isEqual } from "lodash";
import { watch, computed, StyleValue, onMounted, ref } from "vue";
import confetti from "canvas-confetti";
import Grid from "@/components/TheGrid.vue";

import SampleLevel from "@/sample-level.json";

import {
  grid,
  gridSize,
  // solution,
  hitsInRow,
  hitsInColumn,
  syncGrid,
  levelIsCleared,
} from "@/hooks/useGrid";

import useUserStates from "@/hooks/useUserStatesNew";
import { initControls, toggleCellValue } from "@/hooks/useControls";

const { players, player } = useUserStates();

syncGrid();
initControls();

const solution = ref<Grid>(SampleLevel);

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
</script>

<template>
  <Grid
    :enable-controls="true"
    :enable-socket="true"
    :grid="grid"
    :solution="solution"
    :player="player"
    :players="players"
    @onCellClicked="onCellClicked"
    @moveCursor="onMoveCursor"
    @toggleCellValue="onToggleCellValue"
    @stateChanged="onStateChanged"
  />
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
