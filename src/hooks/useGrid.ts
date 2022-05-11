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

  const hitsInColumn = (colNumber: number): number[] => {
    if (!solution.value) return [];
    return getHits(solution.value.map((x) => x[colNumber]));
  };

  // in plaats van deze functie moeten we alleen het resultaat returnen. Met een 'watch' in dit bestand kunnen we die uptdaten.
  const hitsInRow = (rowNumber: number): number[] => {
    if (!solution.value) return [];
    console.log(solution.value[rowNumber]);
    return getHits(solution.value[rowNumber]);
  };

  const newHitsInRow = computed(() =>
    solution.value!.map((row) => {
      return getHits(row);
    })
  );

  //kijken of ik de reactivity break misschien
  const newHitsInColumn = computed(() =>
    solution.value?.map((row, rowIndex) => {
      return row.map((cell, columnIndex) => {
        // return getHits(row[columnIndex]);
      });
    })
  );

  // const newHitsInColumns = ref(
  //   solution.value?.map((row, rowIndex) => {
  //     return row.map((cell, columnIndex) => {
  //       // return getHits(row[columnIndex]);
  //     });
  //   })
  // );

  //hier zit nog een bugje
  // watch(solution, (newSolution) => {
  //   console.log("newSolution", newSolution);
  //   newHitsInRows.value = newSolution?.puzzle?.map((row) => {
  //     return getHits(row);
  //   });
  // });

  return {
    gridSize,
    indexToXY,
    hitsInColumn,
    hitsInRow,
    clampToGrid,
    newHitsInRow,
    newHitsInColumn,
    levelIsCleared,
    // new stuffs below
    setGrid,
    setSolution,
    grid,
    solution,
  };
};

export default useGrid;
