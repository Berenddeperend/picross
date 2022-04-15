import { defineStore } from "pinia";

type RootState = {
  grid: Grid;
  solution: Grid;
};

export const useActiveGrid = defineStore("activeGrid", {
  state: () =>
    ({
      grid: [[]],
      solution: [[]],
    } as RootState),

  getters: {
    gridSize(state) {
      return state.grid ? state.grid[0].length : null;
    },
  },
  actions: {
    setGrid(grid: Grid) {
      this.grid = grid;
    },
    setSolution(solution: Grid) {
      this.solution = solution;
    },
  },
});
