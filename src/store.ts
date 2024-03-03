import { nextTick, ref } from "vue";
import http from "@/services/http";
import { shuffle } from "lodash";
import { drawSinglePuzzle } from "@/services/canvas";

const pixelSize = 6;
const puzzles = ref<Puzzle[]>([]);
const isFetchingPuzzles = ref(false);
const showFancyBackground = ref(true);
const currentPuzzleSize = ref(10);
const canvas = ref<HTMLCanvasElement>();
const dpi = Math.max(window.devicePixelRatio, 2);
const viewportWidth = ref(window.innerWidth);
const viewportHeight = ref(window.innerHeight);

export default function useStore() {
  const clearBackground = () => {
    const ctx = canvas.value?.getContext("2d");
    if (!ctx) return;

    canvas.value?.classList.add("hibbem");

    setTimeout(() => {
      ctx.clearRect(
        0,
        0,
        viewportWidth.value * dpi,
        viewportHeight.value * dpi
      );
    }, 1000);
  };

  const drawBackground = () => {
    //maybe move this to service.
    console.log("draw!");
    if (!canvas.value) return;
    if (!puzzles.value.length) return;

    viewportWidth.value = window.innerWidth;
    viewportHeight.value = window.innerHeight;

    const columns = Math.floor(
      viewportWidth.value / (currentPuzzleSize.value * pixelSize)
    );
    const rows = Math.floor(
      viewportHeight.value / (currentPuzzleSize.value * pixelSize)
    );

    const relevantPuzzles = shuffle(
      puzzles.value.filter((puzzle) => puzzle.width === currentPuzzleSize.value)
    );

    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns + 1; column++) {
        const xoffset =
          row % 2
            ? column * pixelSize * (currentPuzzleSize.value + 1) -
              (pixelSize * currentPuzzleSize.value) / 2
            : column * pixelSize * (currentPuzzleSize.value + 1);

        drawSinglePuzzle(
          canvas.value,
          relevantPuzzles[(row * rows + column) % relevantPuzzles.length],
          "#f2f2f6",
          // "black",
          pixelSize,
          xoffset,
          row * pixelSize * (currentPuzzleSize.value + 1)
        );
      }
    }

    nextTick().then(() => {
      canvas.value?.classList.remove("hibbem");
    });
  };

  const fetchPuzzles = (bustCache = false) => {
    if (isFetchingPuzzles.value) return Promise.resolve();
    if (!bustCache && puzzles.value.length > 0) Promise.resolve();

    isFetchingPuzzles.value = true;

    return http.get("/puzzles").then((response) => {
      puzzles.value = response.data.map((puzzle: BackendPuzzle) => {
        return { ...puzzle, solution: JSON.parse(puzzle.solution) };
      });
      isFetchingPuzzles.value = false;
    });
  };

  return {
    dpi,
    canvas,
    puzzles,
    fetchPuzzles,
    showFancyBackground,
    currentPuzzleSize,
    drawBackground,
    viewportWidth,
    viewportHeight,
    clearBackground,
  };
}
