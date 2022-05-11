import { computed, watch, ref, Ref, toRefs } from "vue";
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

//de meeste van deze dingen waarschijnlijk gewoon in TheGrid plaatsen, omdat ik die grid niet lekker als Ref krijg hier.
// dat is wel kill your darlings, meh.
// Even denken, gaat het dan goed?

const useGrid = (gridSource?: Grid, solutionSource?: Grid) => {
  const grid = ref(gridSource || createGrid(10));
  const solution = ref(solutionSource || null);

  // const { perPage = ref(10), total = ref(null), startPage = 1 } = toRefs(
  //   options
  // )

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
    return isEqual(grid.value, solution?.value);
  });

  const hitsInRows = computed(() =>
    solution.value?.map((row) => {
      return getHits(row);
    })
  );

  const hitsInColumns = computed(() => {
    const columns = solution.value?.map((row, rowIndex, src) => {
      return src.map((d) => d[rowIndex]);
    });

    return columns?.map((column) => getHits(column));
  });

  return {
    gridSize,
    indexToXY,
    clampToGrid,
    hitsInRows,
    hitsInColumns,
    levelIsCleared,
    // new stuffs below
    setGrid,
    setSolution,
    grid,
    solution,
  };
};

export default useGrid;
