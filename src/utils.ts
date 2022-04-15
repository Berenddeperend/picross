import { clamp } from "lodash";

export function createGrid(size: number): Grid {
  return new Array(size).fill("").map((d) => new Array(size).fill(" "));
}
