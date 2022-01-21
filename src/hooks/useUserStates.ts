import { Socket } from "socket.io-client";
import { onMounted, onUnmounted, ref } from "vue";

export default function useUserStates() {
  let playerId = ref<string | null>(null);
  let players = ref<Players>({});

  function setPlayersState(newPlayersState: Players) {
    console.log("yeh");
    players.value = newPlayersState;
  }

  function initState(socket: Socket) {
    // console.log(socket.id);
    // playerId.value = socket.id;
    socket.once("initPlayer", (data: any) => {
      playerId.value = data.id;
    });
  }

  function updatePlayerStates(socket: Socket) {
    onMounted(() => {
      socket.on("userStatesUpdated", setPlayersState);
    });

    onUnmounted(() => {
      socket.off("userStatesUpdated", setPlayersState);
    });
  }

  // function updateGrid
  return {
    updatePlayerStates,
    players,
    initState,
    playerId,
  };
}
