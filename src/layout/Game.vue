<script setup lang="ts">
import { watch, ref } from "vue";
import confetti from "canvas-confetti";
import Grid from "@/components/TheGrid.vue";

import { createGrid } from "@/utils";
import useSocket from "@/hooks/useSocket";
import useUserStates from "@/hooks/useUserStates";
import useGrid from "@/hooks/useGrid";
import http from "@/services/http";
// import SideBarGame from "@/layout/partials/SideBarGame.vue";
import SideBar from "@/components/SideBar.vue";

const { puzzleId } = defineProps<{ puzzleId?: string }>();
const mode: Mode = puzzleId ? "singleplayer" : "multiplayer";

const game = useGrid(createGrid(10));

const xMode = ref(false);

const { grid, puzzle, setCell } = game;

const { socket } = useSocket();
const { players, player, initState } = useUserStates(mode, game, socket);

initState();

function onCellHover(cellIndex: number) {
  if (game.levelIsCleared.value) return;
  player.value!.position = game.indexToXY(cellIndex);
  socket.emit("cursorUpdated", player.value!.position);
}

function onCellClicked(index: number) {
  if (game.levelIsCleared.value) return;
  if (xMode.value) {
    return onCellRightClicked(index);
  }

  const [x, y] = game.indexToXY(index);

  // here were overwriting a computed value. Aint it.
  const newValue = grid.value[y][x] === "d" ? " " : "d";
  setCell({ position: [x, y], value: newValue });
  socket.emit("cellUpdated", { position: [x, y], value: newValue });
}

function onCellRightClicked(index: number) {
  if (game.levelIsCleared.value) return;
  const [x, y] = game.indexToXY(index);
  const newValue = grid.value[y][x] === "x" ? " " : "x";
  setCell({ position: [x, y], value: newValue });
  socket.emit("cellUpdated", { position: [x, y], value: newValue });
}

function onToggleCellValue(value: string) {
  if (game.levelIsCleared.value) return;

  const [x, y] = (player.value as Player).position;
  const newValue = grid.value[y][x] === value ? " " : value;

  setCell({ position: [x, y], value: newValue });
  socket.emit("cellUpdated", { position: [x, y], value: newValue });
}

function onMoveCursor(direction: Direction) {
  if (game.levelIsCleared.value) return;
  if (direction === "left") {
    player.value!.position[0] = game.clampToGrid(player.value!.position[0] - 1);
  }
  if (direction === "right") {
    player.value!.position[0] = game.clampToGrid(player.value!.position[0] + 1);
  }
  if (direction === "up") {
    player.value!.position[1] = game.clampToGrid(player.value!.position[1] - 1);
  }
  if (direction === "down") {
    player.value!.position[1] = game.clampToGrid(player.value!.position[1] + 1);
  }

  socket.emit("cursorUpdated", player.value!.position);
}

function isCurrentPlayer(somePlayer: Player) {
  return somePlayer.id === player.value?.id;
}

watch(game.levelIsCleared, (value) => {
  if (value) {
    confetti({
      zIndex: -1,
      particleCount: 50,
      spread: 70,
      angle: 60,
      origin: { y: 0.6 },
    });
    confetti({
      zIndex: -1,
      particleCount: 50,
      spread: 70,
      angle: 120,
      origin: { y: 0.6 },
    });
  }
});
</script>

<template>
  <SideBar
    v-if="players && player && mode === 'multiplayer'"
    :player="player"
    :players="players"
    :socket="socket"
  />
  <!-- <SideBarGame
     v-if="players && player && mode === 'multiplayer'"
     :player="player"
     :players="players"
     :socket="socket"
   /> -->
  <!-- <header>
    <router-link class="link" :to="{ name: 'mainMenu' }">← Back</router-link>
  </header> -->

  <div class="container">
    <Grid
      class="grid"
      v-if="game.grid && game.solution"
      :enable-controls="true"
      :enable-socket="true"
      :game="game"
      :player="player"
      :players="players"
      @onCellClicked="onCellClicked"
      @onCellRightClicked="onCellRightClicked"
      @onCellHover="onCellHover"
      @moveCursor="onMoveCursor"
      @toggleCellValue="onToggleCellValue"
    />

    <!-- <aside>
      <br />
      <span class="now-playing"
        >Now playing ({{ Object.values(players).length }})</span
      >
      <ul>
        <li
          v-for="player in players"
          :key="player.id"
          :class="[{ 'current-player': isCurrentPlayer(player) }, player.id]"
          ref="playersRef"
        >
          <span class="online-indicator"></span>
          {{ player.name }}
        </li>
      </ul>
    </aside> -->
  </div>

  <div
    class="puzzle-title"
    :style="{
      opacity: game.levelIsCleared.value ? 1 : 0,
      transition: game.levelIsCleared.value
        ? 'opacity 0.4s, letter-spacing 1s cubic-bezier(0, 0.42, 0.25, 1), text-shadow 0.5s'
        : 'all 0s',
      transitionDelay: game.levelIsCleared.value ? '2s' : '0s',
      letterSpacing: game.levelIsCleared.value ? '1px' : '-2px',
      // textShadow: game.levelIsCleared.value ? '2px 2px red, -4px -4px orange' :'0px 0px red, 0px 0px orange'
    }"
  >
    {{ puzzle?.name }}
  </div>

  <label
    class="toggle"
    :style="{
      opacity: game.levelIsCleared.value ? 0 : 1,
      transition: game.levelIsCleared.value ? 'opacity 1s' : 'all 0s',
      transitionDelay: game.levelIsCleared.value ? '1s' : '0s',
    }"
  >
    <input type="checkbox" v-model="xMode" />
    <a></a>
    <span>
      <span class="left-span"><div class="cell"></div></span>
      <span class="right-span">×</span>
    </span>
  </label>
</template>

<style lang="scss" scoped>
header {
  display: flex;
  margin-bottom: 10px;
  justify-content: space-between;
}
.container {
  display: flex;
  gap: 20px;
  margin: 60px 10px 10px 10px;
  user-select: none;
}

.now-playing {
  color: gray;
}

ul {
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 10px 0;
  text-align: left;

  li {
    list-style-type: none;
    border-radius: 3px;
  }
}

.online-indicator {
  $size: 7px;
  margin-right: 5px;
  position: relative;
  top: -1px;
  display: inline-block;
  width: $size;
  height: $size;
  border-radius: $size;
  background: limegreen;

  border: 1px solid darken(limegreen, 5%);
}

.link {
  text-decoration: none;
}

.grid {
  // margin-left: 120px;
}

.puzzle-title {
  margin-top: 10px;

  user-select: none;
  // font-family: 'bebas neue';

  font-size: 20px;
  // color: white;
  font-weight: bold;
  letter-spacing: 0px;
  // text-shadow: 2px 2px red, 4px 4px orange;
}
</style>
