<script setup lang="ts">
import { ref } from 'vue';
import { isEqual } from 'lodash';
import {onMounted} from "vue";

type Grid = string[][];

const gridSize = 10;
const grid = ref(createGrid(gridSize))

const cursorCell = ref([0,0]);

function cellClicked(grid:Grid, row:number, column:number) {
  grid[row][column] = 'x';
}

onMounted(()=> {
  window.addEventListener('keydown', (e) => {
    // e.preventDefault();
    if(e.key === 'ArrowLeft') {
      cursorCell.value[1]--;
    } else if(e.key === 'ArrowRight') {
      cursorCell.value[1]++;
    } else if(e.key === 'ArrowUp') {
      cursorCell.value[0]--;
    } else if(e.key === 'ArrowDown') {
      cursorCell.value[0]++;
    } else if(e.key === ' ') {
      const cell = grid.value[cursorCell.value[0]][cursorCell.value[1]];
      grid.value[cursorCell.value[0]][cursorCell.value[1]] = cell === 'd' ? ' ' : 'd'
    }
  })
})

function createGrid(size:number):any[][] {
  // const grid = new Array(size).fill(new Array(size).fill(0))
  const grid = new Array(size).fill('').map(d => new Array(size).fill(' '))
  return grid;
}
</script>

<template>
  <div class="playfield-container">
    <div class="horizontal-thing"></div>

    <div class="row legend legend-column">
      <div class="cell" v-for="(cell, cellIndex) in gridSize">
        <div>2</div>
        <div>1</div>
      </div>
    </div>
    <div class="row" v-for="(row, rowIndex) in gridSize">
      <div class="legend legend-row">
        <div class="cell">
          <div>2</div>
          <div>1</div>
        </div>
      </div>

      <div
        class="cell"
        v-for="(cell, cellIndex) in gridSize"
        @click="cellClicked(grid, rowIndex, cellIndex)"
        :class="{
          'cursor': isEqual([rowIndex, cellIndex], cursorCell),
          'filled': grid[rowIndex][cellIndex] == 'd'

        }"
      >
        {{ grid[rowIndex][cellIndex] === 'd' ? "" : " " }}
      </div>
    </div>
  </div>

  <div>{{grid}}</div>
</template>

<style lang="scss">

.playfield-container {
  background: gray;
  display: inline-block;
  position: relative;
  padding: 1px;
}

.horizontal-thing {
  position: absolute;
  top:50%;
  height: 2px;
  transform: translateY(-50%);
  width: 100%;
  background: greenyellow;
}

.cell.cursor,
.cell:hover {
  font-weight: bold;
  //border-color: red;
  //background-color: #42b983;


  z-index: 2;
  box-shadow: 0px 0px 0px 2px cyan;
}

.legend .cell {
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.legend-row {
    margin: 1px;

  .cell {
  height: 100%;
  display: flex;
  flex-direction: row;
  }
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
  //border: 1px solid lightgray;
  background: white;
  transition: background-color 0.1s;

  &.filled {
    background-color: #444;
  }
}

</style>
