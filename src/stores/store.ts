import { defineStore, Store } from "pinia";
import { Socket } from "socket.io-client";
export const useStore = defineStore("game", {
  state: (): {
    grid: Grid;
    solution: Grid;
    players: Player[];
    playerId: string | null;
    socket: Socket | null;
  } => ({
    grid: [[]],
    solution: [[]],
    players: [],
    playerId: null,
    socket: null,
  }),
});
