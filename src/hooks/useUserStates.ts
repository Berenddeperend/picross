import { onMounted, onUnmounted, ref, computed, watch } from "vue";
import { socket } from "@/hooks/useSocket";
import { clampToGrid } from "@/hooks/useGrid";

export let playerId = ref<string | null>(null);
export let players = ref<Players>({});

export const player = computed(() => {
  return playerId.value !== null ? players.value[playerId.value] : null;
});

export const cursor = computed<Position>(
  () => player?.value?.position as Position
);

export function movePlayerCursor(direction: "left" | "right" | "up" | "down") {
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

  socket.emit("cursorUpdated", (player.value as Player).position);
}

export function setPlayersState(newPlayersState: Players) {
  players.value = newPlayersState;
}

export function initState() {
  socket.on("initPlayer", (data: any) => {
    playerId.value = data.id;
  });

  socket.emit("startGame");
}

export function syncPlayersState() {
  onMounted(() => {
    socket.on("playersStateUpdated", setPlayersState);
  });

  onUnmounted(() => {
    socket.off("playersStateUpdated", setPlayersState);
  });
}
