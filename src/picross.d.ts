interface Player {
  id: string;
  position: Position;
  color: string;
  name: string;
}

type Players = {
  [id: string]: Player;
};

type Direction = "left" | "right" | "up" | "down";

type Grid = string[][];
type Position = [number, number];

// type Intention = "build";
type Puzzle = {
  id: number;
  name: string;
  puzzle: string;
  width: number | null;
  height: number | null;
  authorId: number;
};
