import { computed } from "vue";
import { clamp, isEqual } from "lodash";

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

const useGrid = (grid: Grid, solution?: Grid) => {
  const gridSize = computed(() => grid[0].length);

  function indexToXY(index: number): Position {
    const x = index % gridSize.value;
    const y = Math.floor(index / gridSize.value);
    return [x, y];
  }

  function clampToGrid(value: number): number {
    return clamp(value, 0, gridSize.value - 1);
  }

  function hitsInColumn(colNumber: number): number[] {
    return getHits(solution!.map((x) => x[colNumber]));
  }

  function hitsInRow(rowNumber: number): number[] {
    return getHits(solution![rowNumber]);
  }

  const levelIsCleared = computed(() => {
    return isEqual(grid, solution);
  });

  return {
    gridSize,
    indexToXY,
    hitsInColumn,
    hitsInRow,
    clampToGrid,
    levelIsCleared,
  };
};

export default useGrid;
