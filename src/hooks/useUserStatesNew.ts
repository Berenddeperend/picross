import { onMounted, onUnmounted, ref, computed, watch } from "vue";
import { socket } from "@/hooks/useSocket";
import { clampToGrid, setGrid } from "@/hooks/useGrid";

export function useUserStates(mode: 'singleplayer' | 'multiplayer' = 'singleplayer') {
  const multiplayer = mode === 'multiplayer';


  let playerId = ref<string | null>(null);
  let players = ref<Players>({});

  if(!multiplayer) {
    playerId.value = '1';
    players.value = {
      "1": {
        id: "1",
        position: [0, 0],
        color: "green",
        name: "berend",
      },
    }
  }

  const cursor = computed<Position>(() => player?.value?.position as Position);

  const player = computed(() => {
    return playerId.value !== null ? players.value[playerId.value] : null;
  });

  //moet dit hier? Denk het wel.
  function movePlayerCursor(direction: "left" | "right" | "up" | "down") {
    if (playerId.value === null) return;
    const oldPos = (player.value as Player).position;

    if (direction === "left") {
      players.value[playerId.value].position[0] = clampToGrid(
        players.value[playerId.value].position[0] - 1
      );
    }
    if (direction === "right") {
      players.value[playerId.value].position[0] = clampToGrid(
        players.value[playerId.value].position[0] + 1
      );
    }

    if (direction === "up") {
      players.value[playerId.value].position[1] = clampToGrid(
        players.value[playerId.value].position[1] - 1
      );
    }
    if (direction === "down") {
      players.value[playerId.value].position[1] = clampToGrid(
        players.value[playerId.value].position[1] + 1
      );
    }

    socket.emit("cursorPositionChanged", (player.value as Player).position);
  }

  function setPlayersState(newPlayersState: Players) {
    players.value = newPlayersState;
  }

  function initState() {
    socket.on("initPlayer", (data: any) => {
      playerId.value = data.id;
    });

    socket.emit("startGame");
  }

  onMounted(() => {
    initState();
    socket.on("gridUpdated", setGrid);
    socket.on("playersStateUpdated", setPlayersState);
  });

  onUnmounted(() => {
    socket.off("playersStateUpdated", setPlayersState);
  });

  return {
    players,
    player,
    playerId,
    cursor
  };
}
export default useUserStates;
