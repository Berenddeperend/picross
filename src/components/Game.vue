<script setup lang="ts">
import { ref } from 'vue';
import { isEqual } from 'lodash';
import {onMounted} from "vue";

const gridSize = 10;
const grid = ref(createGrid(gridSize))

const cursorCell = ref([0,0]);

function cellClicked(row:number, column:number) {
  this.grid[row][column] = 'x';
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
      grid.value[cursorCell.value[0]][cursorCell.value[1]] = 'd'
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
  <table>
    <tr v-for="(row, rowIndex) in gridSize">
      <td
        v-for="(cell, cellIndex) in gridSize"
        @click="cellClicked(rowIndex, cellIndex)"
        :class="{
          'cursor': isEqual([rowIndex, cellIndex], cursorCell),
          'filled': grid[rowIndex][cellIndex] == 'd'

        }"
      >
        {{ grid[rowIndex][cellIndex] === 'd' ? "" : " " }}
      </td>
    </tr>
  </table>

  <div>{{grid}}</div>
</template>

<style lang="scss">

table {
  border-spacing: 0;
  border-collapse: collapse;
}

.cursor {
  font-weight: bold;
  //border-color: red;

  z-index: 2;
  box-shadow: 0px 0px 0px 1px inset red;
}

tr:nth-child(5) {
  td {
    border-bottom: 1px solid deepskyblue;
    //background-color: rgba(255,0,0,0.1);
  }
}



td {
  width: 25px;
  height: 25px;
  vertical-align: center;
  border: 1px solid lightgray;

  &.filled {
    background-color: green;
  }

  &:nth-child(5) {
  border-right: 1px solid deepskyblue;

}
}

</style>
