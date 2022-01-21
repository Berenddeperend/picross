import { onMounted, onUnmounted, ref } from "vue";
import SampleLevel from "@/sample-level.json";
import { clamp } from "lodash";
import { getHits } from "@/grid-helpers";

export default function useGrid() {
  const gridSize = 10;
  const grid = ref<Grid>(createGrid(gridSize));
  const solution = ref<Grid>(SampleLevel);

  const legendForColumns = ref<HTMLDivElement>();
  const legendForRows = ref<HTMLDivElement>();

  function createGrid(size: number): Grid {
    const grid = new Array(size).fill("").map((d) => new Array(size).fill(" "));
    return grid;
  }

  function clampToGrid(value: number) {
    return clamp(value, 0, gridSize - 1);
  }

  function hitsInRow(rowNumber: number): number[] {
    return getHits(solution.value[rowNumber]);
  }

  function hitsInColumn(colNumber: number): number[] {
    return getHits(solution.value.map((x) => x[colNumber]));
  }

  return {
    grid,
    gridSize,
    solution,
    clampToGrid,
    hitsInRow,
    hitsInColumn,
  };
}
