<script setup lang="ts">
import { ref } from 'vue';
import { isEqual } from 'lodash';
import {onMounted} from "vue";

type Grid = string[][];

const gridSize = 10;
const grid = ref(createGrid(gridSize))

const cursorCell = ref([0,0]);

function indexToXY(index:number):[number, number] {
  const x = index % gridSize;
  const y = Math.floor(index/gridSize)
  return [x,y];
}

function cellIndexIsFilled(index: number):boolean {
    const [x,y] = indexToXY(index);
    return grid.value[y][x] === 'd'
}

console.log(grid.value)


function xYToIndex(xy:[number,number]):number {
  const [x,y] = xy;
  return y * gridSize + x;
}

function cellClicked(grid:Grid, row:number, column:number) {
  grid[row][column] = 'x';
}

onMounted(()=> {
  window.addEventListener('keydown', (e) => {
    // e.preventDefault();
    if(e.key === 'ArrowLeft') {
      cursorCell.value[0]--;
    } else if(e.key === 'ArrowRight') {
      cursorCell.value[0]++;
    } else if(e.key === 'ArrowUp') {
      cursorCell.value[1]--;
    } else if(e.key === 'ArrowDown') {
      cursorCell.value[1]++;
    } else if(e.key === ' ') {
      const cell = grid.value[cursorCell.value[1]][cursorCell.value[0]];
      grid.value[cursorCell.value[1]][cursorCell.value[0]] = cell === 'd' ? ' ' : 'd'
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

  {{cursorCell}}
  <div class="playfield-container">
<!--    <div class="horizontal-thing"></div>-->



    <div class="corner"></div>
    <div class="legend horizontal">
      <div class="cell" v-for="(cell, index) in gridSize">
        <div>1</div>
      </div>
    </div>
    <div class="legend vertical">
      <div class="cell" v-for="(cell, index) in gridSize">
        <div>2</div>
      </div>
    </div>
    <div
      class="cell" v-for="(cell, index) in gridSize*gridSize"
      :class="{
        'cursor': isEqual(cursorCell, indexToXY(index)),
        'filled': cellIndexIsFilled(index)
      }"
    ></div>
  </div>

  <div>{{grid}}</div>
</template>

<style lang="scss">

.horizontal-thing {
  position: absolute;
}

.playfield-container {
  background: gray;
  display: inline-block;
  position: relative;
  padding: 1px;

  display: inline-grid;
  grid-template-columns: auto repeat(10, 1fr);
  grid-template-rows: auto repeat(10, 1fr);
}

.corner {
  //width: 100px;
  //height: 100px;
}

.legend.horizontal {
  grid-column: span 10;
  display:flex;

  .cell {
    height: auto;
  }
}
.legend.vertical {
  display:flex;
  flex-direction: column;

  .cell {
    display: flex;
    width: auto;
  }
  grid-row: span 10;

}

//.horizontal-thing {
//  position: absolute;
//  top:50%;
//  height: 2px;
//  transform: translateY(-50%);
//  width: 100%;
//  background: greenyellow;
//}

.cell.cursor,
.cell:hover {
  font-weight: bold;
  z-index: 2;
  box-shadow: 0px 0px 0px 2px cyan;
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
}

</style>
