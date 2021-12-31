<script setup lang="ts">
import { isEqual, clamp } from 'lodash';
import {onMounted, ref, watch} from "vue";

import SampleLevel from './../sample-level.json'

type Grid = string[][];

const gridSize = 10;
// const grid = ref(createGrid(gridSize))
const grid = ref(SampleLevel)
const cursorCell = ref([0,0]);

const legendForColumns = ref<HTMLDivElement>()
const legendForRows = ref<HTMLDivElement>()

const horizontalLegendStyle = ref({

})

function clampToGrid(value:number) {
  return clamp(value, 0, gridSize -1);
}

function hitsInRow(rowNumber: number): number[] {
  return getHits(grid.value[rowNumber]);
}

function hitsInColumn(colNumber: number): number[] {
  return getHits(grid.value.map(x => x[colNumber]))
}

function getHits(arr: string[]): number[] {
  return arr.reduce((acc:number[], curr, i, arr) => {
    if(curr === 'd') {
      if( acc.length > 0 && arr[i -1] === 'd' ) {
        acc[acc.length -1]++
      } else {
        acc.push(1)
      }
    }
    return acc;
  }, []);
}


function indexToXY(index:number): [number, number] {
  const x = index % gridSize;
  const y = Math.floor(index/gridSize)
  return [x,y];
}

function cellIndexIsFilled(index: number):boolean {
    const [x,y] = indexToXY(index);
    return grid.value[y][x] === 'd'
}

watch(()=> grid, (grid) => {
  console.log('grid changed,', grid)
  console.log(legendForRows.value!.offsetWidth)
}, { deep: true})

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
      cursorCell.value[0] = clampToGrid(cursorCell.value[0] -1)
    } else if(e.key === 'ArrowRight') {
      cursorCell.value[0] = clampToGrid(cursorCell.value[0] +1)
    } else if(e.key === 'ArrowUp') {
      cursorCell.value[1] = clampToGrid(cursorCell.value[1] -1)
    } else if(e.key === 'ArrowDown') {
      cursorCell.value[1] = clampToGrid(cursorCell.value[1] +1)
    } else if(e.key === ' ') {
      const cell = grid.value[cursorCell.value[1]][cursorCell.value[0]];
      grid.value[cursorCell.value[1]][cursorCell.value[0]] = cell === 'd' ? ' ' : 'd'
    }
  })
})

function createGrid(size:number):any[][] {
  const grid = new Array(size).fill('').map(d => new Array(size).fill(' '))
  return grid;
}
</script>

<template>

  {{cursorCell}}
  <div class="playfield-container">
    <div class="optical-guide horizontal" ref="guidehorizontal"></div>
    <div class="optical-guide vertical" ref="guidevertical"></div>



    <div class="corner"></div>
    <div class="legend horizontal" ref="legendForColumns">
      <div class="cell" v-for="(cell, index) in gridSize">
        <div v-for="hit in hitsInColumn(index)">{{hit}}</div>
      </div>
    </div>
    <div class="legend vertical" ref="legendForRows">
      <div class="cell" v-for="(cell, index) in gridSize">
        <div v-for="hit in hitsInRow(index)">{{hit}}</div>
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

.legend {
  .cell {
    display: flex;
    justify-content: flex-end;
  }

  &.horizontal {
    grid-column: span 10;
    display:flex;

    .cell {
      flex-direction: column;
      height: auto;
    }
  }

  &.vertical {
    display:flex;
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
