import { ref } from "vue";
import http from "@/services/http";

const puzzles = ref<Puzzle[]>([]);
const isFetchingPuzzles = ref(false);
const showFancyBackground = ref(true);
const currentPuzzleSize = ref(10);

export default function useStore() {
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
    puzzles,
    fetchPuzzles,
    showFancyBackground,
    currentPuzzleSize,
  };
}
