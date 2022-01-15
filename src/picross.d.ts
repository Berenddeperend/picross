interface Player {
  id: string;
  position: Position;
  // color: Colors
  color: string;
  name: string;
}

type Grid = string[][];
type Position = [number, number];

// const colors = ['yellow', 'green', 'blue'];
