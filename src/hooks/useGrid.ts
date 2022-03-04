import { onMounted, onUnmounted, ref } from "vue";
import SampleLevel from "@/sample-level.json";
import { clamp } from "lodash";
import { socket } from "@/hooks/useSocket";

function getHits(arr: string[]): number[] {
  return arr.reduce((acc: number[], curr, i, arr) => {
    if (curr === "d") {
      if (acc.length > 0 && arr[i - 1] === "d") {
        acc[acc.length - 1]++;
      } else {
        acc.push(1);
      }
    }
    return acc;
  }, []);
}

export const gridSize = 10;
export const grid = ref<Grid>(createGrid(gridSize));
export const solution = ref<Grid>(SampleLevel);

export const legendForColumns = ref<HTMLDivElement>();
export const legendForRows = ref<HTMLDivElement>();

export function createGrid(size: number): Grid {
  const grid = new Array(size).fill("").map((d) => new Array(size).fill(" "));
  return grid;
}

export function clearGrid() {
  grid.value = createGrid(gridSize);
}

export function clampToGrid(value: number) {
  return clamp(value, 0, gridSize - 1);
}

export function hitsInRow(rowNumber: number): number[] {
  return getHits(solution.value[rowNumber]);
}

export function hitsInColumn(colNumber: number): number[] {
  return getHits(solution.value.map((x) => x[colNumber]));
}

export function setGrid(newGrid: Grid) {
  grid.value = newGrid;
}

export function syncGrid() {
  onMounted(() => {
    socket.on("gridUpdated", setGrid);
  });

  onUnmounted(() => {
    socket.off("gridUpdated", setGrid);
  });
}
