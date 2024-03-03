import { shuffle } from "lodash";
import { nextTick } from "vue";

export const dpi = Math.max(window.devicePixelRatio, 2);

export function drawSinglePuzzle(
  canvas: HTMLCanvasElement,
  puzzle: Puzzle,
  fill = "#444",
  pixelSize = 8,
  xOffset = 0,
  yOffset = 0
) {
  const ctx = (canvas as HTMLCanvasElement).getContext(
    "2d"
  ) as CanvasRenderingContext2D;

  const puzzleSize = puzzle.solution.length || 10;
  ctx.fillStyle = fill;

  for (let y = 0; y < puzzleSize; y++) {
    for (let x = 0; x < puzzleSize; x++) {
      if (puzzle.solution[y][x] !== "d") {
        continue;
      }

      ctx.fillRect(
        (x * pixelSize + xOffset) * dpi,
        (y * pixelSize + yOffset) * dpi,
        pixelSize * dpi,
        pixelSize * dpi
      );
    }
  }
}
