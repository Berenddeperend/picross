import { onMounted, onUnmounted, ref, computed, watch } from "vue";
import { socket } from "@/hooks/useSocket";

export let playerId = ref<string | null>(null);
export let players = ref<Players>({});

export const player = computed(() => {
  return playerId.value !== null ? players.value[playerId.value] : null;
});

export const cursor = computed<Position>(
  () => player?.value?.position as Position
);

export function movePlayerCursor(direction: "left" | "right" | "up" | "down") {
  console.log(Date.now());
  console.log("-> playerId.value", playerId.value);
  if (playerId.value === null) return;
  const oldPos = (player.value as Player).position;

  if (direction === "left") {
    players.value[playerId.value].position[0]--;
  }
  if (direction === "right") {
    players.value[playerId.value].position[0]++;
  }

  if (direction === "up") {
    players.value[playerId.value].position[1]--;
  }
  if (direction === "down") {
    players.value[playerId.value].position[1]++;
  }

  socket.emit("cursorPositionChanged", (player.value as Player).position);
}

export function setPlayersState(newPlayersState: Players) {
  console.log("setting players", newPlayersState);
  players.value = newPlayersState;
}

export function initState() {
  socket.once("initPlayer", (data: any) => {
    console.log("initplayer called", data);
    playerId.value = data.id;
  });
}

export function syncPlayersState() {
  onMounted(() => {
    socket.on("playersStateUpdated", setPlayersState);
  });

  onUnmounted(() => {
    socket.off("playersStateUpdated", setPlayersState);
  });
}
