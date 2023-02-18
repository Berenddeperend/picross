import { clamp } from "lodash";

export function createGrid(size: number = 10): Grid {
  return new Array(size).fill("").map((d) => new Array(size).fill(" "));
}
