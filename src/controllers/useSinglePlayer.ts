// hier een soort api definieren ofzo. TheGrid kan hier methods van aanroepen.
// Maar ook van zijn multiplayer tegenhanger met dezelfde interface.

import { createGrid, gridSize, indexToXY } from "@/hooks/useGrid";
import { ref, Ref } from "vue";

export class useSinglePlayer {
  grid: Ref<Grid>;

  constructor() {
    this.grid = ref<Grid>(createGrid(gridSize));
  }

  onCellClicked(index: number) {
    const [x, y] = indexToXY(index);
    this.grid.value[y][x] = this.grid.value[y][x] === " " ? "d" : " ";
  }
}
