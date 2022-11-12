import { computed, ref } from "vue";
import { clamp, isEqual } from "lodash";
import { createGrid } from "@/utils";

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

export function computeHitsInRows(grid: Grid) {
  return grid.map((row) => {
    return getHits(row);
  });
}

export function computeHitsInColumns(grid: Grid) {
  const columns = grid.map((row, rowIndex, src) => {
    return src.map((d) => d[rowIndex]);
  });

  return columns?.map((column) => getHits(column));
}

const useGrid = (gridSource?: Grid, solutionSource?: Grid) => {
  const grid = ref(gridSource || createGrid(10));
  const solution = ref(solutionSource || null);
  const puzzle = ref<Puzzle>();

  const setPuzzle = (newPuzzle: Puzzle) => {
    puzzle.value = newPuzzle;
    setSolution(newPuzzle.solution);
  };

  const setGrid = (newGrid: Grid) => {
    grid.value = newGrid;
  };

  const setSolution = (newSolution: Grid) => {
    solution.value = newSolution;
  };

  const gridSize = computed(() => grid.value[0].length);

  const indexToXY = (index: number): Position => {
    const x = index % gridSize.value;
    const y = Math.floor(index / gridSize.value);
    return [x, y];
  };

  const clampToGrid = (value: number): number => {
    return clamp(value, 0, gridSize.value - 1);
  };

  const levelIsCleared = computed(() => {
    if (!solution.value) return false;

    const stringify = (grid: Grid) =>
      grid
        .flat()
        .map((cell) => (cell === "x" ? " " : cell))
        .join("");
    return stringify(grid.value) === stringify(solution?.value);
  });

  const hitsInRows = computed(() => computeHitsInRows(solution.value as Grid));
  const hitsInColumns = computed(() =>
    computeHitsInColumns(solution.value as Grid)
  );

  const gridWithAutoX = computed(() => {
    return grid.value;
    // console.log('recalc')
    // return [...grid.value].map((row, index) => {
    //   if(index === 0) {
    //     return row.map(cell => 'x')
    //   }
    //   return row
    // });
  });

  return {
    puzzle,
    grid,
    solution,
    gridSize,
    hitsInRows,
    hitsInColumns,
    computeHitsInRows,
    computeHitsInColumns,
    levelIsCleared,
    indexToXY,
    clampToGrid,
    setGrid,
    setSolution,
    setPuzzle,
    gridWithAutoX,
  };
};

export default useGrid;
