import { ref } from "vue";
import http from "@/services/http";

const puzzles = ref<Puzzle[]>([]);
const isFetchingPuzzles = ref(false);

export default function useStore() {
  const fetchPuzzles = (bustCache = false) => {
    if (isFetchingPuzzles.value) return;
    if (!bustCache && puzzles.value.length > 0) return;

    isFetchingPuzzles.value = true;

    http.get("/puzzles").then((response) => {
      puzzles.value = response.data.map((puzzle: BackendPuzzle) => {
        return { ...puzzle, solution: JSON.parse(puzzle.solution) };
      });
      isFetchingPuzzles.value = false;
    });
  };

  return {
    puzzles,
    fetchPuzzles,
  };
}
