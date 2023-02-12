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



function autoXSequence(userSequence: string[], solutionSequence: string[]): string[] {  
  const hasAllRequiredCells = solutionSequence.every((solutionCell, index) => {
    return solutionCell === 'd' ? userSequence[index] === solutionCell : true; 
  });

  const hasNoWrongCells = userSequence.every((userCell, index) => {
    return userCell === 'd' ? solutionSequence[index] === userCell : true; 
  })

  const sequenceShouldBeAutoXed = hasAllRequiredCells && hasNoWrongCells;

  return sequenceShouldBeAutoXed ? userSequence.map(cell => cell === 'd' ? 'd' : 'x'): userSequence;
}

function autoXGrid(grid: Grid, solution: Grid | null): Grid {
  if (!solution) return grid;
  const gridWithAutoXedRows = [...grid].map((gridRow, rowIndex) => autoXSequence(gridRow, [...solution][rowIndex]) );


  const autoXedColumns = gridWithAutoXedRows[0].map((cell, columnIndex) => {
    const userColumn = gridWithAutoXedRows.map((row, rowIndex) => row[columnIndex]);
    const solutionColumn = solution.map((row, rowIndex) => row[columnIndex]);

    return autoXSequence(userColumn, solutionColumn)
  })

  return grid.map((row, rowIndex) => {
    return row.map((cell, columnIndex) => {
      return autoXedColumns[columnIndex][rowIndex]
    })
  })
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

  const setCell = (args: {position: Position, value: string}) => {
    const {position, value} = args;
    const [x,y] = position;
    grid.value[y][x] = value;
  }

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

  return {
    puzzle,
    grid: computed(()=> autoXGrid(grid.value, solution.value)),
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
    setCell,
    setSolution,
    setPuzzle,
  };
};

export default useGrid;
