<script setup lang="ts">
import { watch, ref } from "vue";
import confetti from "canvas-confetti";
import Grid from "@/components/TheGrid.vue";

import { createGrid } from "@/utils";
import useSocket from "@/hooks/useSocket";
import useUserStates from "@/hooks/useUserStates";
import useGrid from "@/hooks/useGrid";
import http from "@/services/http";
import SideBarGame from "@/layout/partials/SideBarGame.vue";

const { puzzleId } = defineProps<{ puzzleId?: string }>();
const mode: Mode = puzzleId ? "singleplayer" : "multiplayer";

const game = useGrid(createGrid(10));

const { grid, puzzle } = game;

if (mode === "singleplayer") {
  // ?????
  http.get(`/puzzle/${puzzleId}`).then((response) => {
    game.setSolution(JSON.parse(response.data.puzzle));
  });
}

const { socket } = useSocket();
const { players, player, initState } = useUserStates(mode, game, socket);

initState();

function onCellClicked(index: number) {
  const [x, y] = game.indexToXY(index);
  grid.value[y][x] = grid.value[y][x] === " " ? "d" : " ";
  socket.emit("gridUpdated", grid.value);
}

function onCellRightClicked(index: number) {
  const [x, y] = game.indexToXY(index);
  grid.value[y][x] = grid.value[y][x] === " " ? "x" : " ";
  socket.emit("gridUpdated", grid.value);
}

function onMoveCursor(direction: Direction) {
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

function onCellHover(cellIndex: number) {
  player.value!.position = game.indexToXY(cellIndex);
  socket.emit("cursorUpdated", player.value!.position);
}

function onToggleCellValue(value: string) {
  if (game.levelIsCleared.value) return;

  const [x, y] = (player.value as Player).position;
  grid.value[y][x] = grid.value[y][x] === value ? " " : value;
  socket.emit("gridUpdated", grid.value);
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
  <!--  <SideBar-->
  <!--    v-if="players && player && mode === 'multiplayer'"-->
  <!--    :player="player"-->
  <!--    :players="players"-->
  <!--    :socket="socket"-->
  <!--  />-->
  <!--  <SideBarGame-->
  <!--    v-if="players && player && mode === 'multiplayer'"-->
  <!--    :player="player"-->
  <!--    :players="players"-->
  <!--    :socket="socket"-->
  <!--  />-->
  <header>
    <router-link class="link" :to="{ name: 'mainMenu' }">← Back</router-link>
  </header>

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

    <aside>
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
    </aside>
  </div>

  <div
    class="puzzle-title"
    :style="{
      opacity: game.levelIsCleared.value ? 1 : 0,
      transitionDelay: game.levelIsCleared.value ? '2s' : '0s',
    }"
  >
    {{ puzzle?.name }}
  </div>

  <!-- <div class="puzzle-title">{{puzzle?.name}}</div> -->
</template>

<style lang="scss" scoped>
header {
  display: flex;
  margin-bottom: 10px;
  margin-left: 120px;
}
.container {
  display: flex;
  gap: 20px;
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
    //margin: 5px;
    list-style-type: none;
    //padding: 4px 10px;
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
  margin-left: 120px;
}

.puzzle-title {
  margin-top: 10px;
  transition: opacity 0.4s;
}
</style>
