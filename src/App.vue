<script setup lang="ts">
import Game from "@/layout/Game.vue";
import TopBar from "@/components/TopBar.vue";

type GameState = "playing" | "menu";

const gameState: GameState = "playing";
</script>

<template>
  <router-view></router-view>
  <!--  <TopBar />-->
  <!--  <Game />-->
  <div id="modal-target"></div>
</template>

<style>
html,
body {
  height: 100%;
  margin: 0;
}

* {
  box-sizing: border-box;
}

body {
  display: flex;
  justify-content: center;
  align-items: center;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*margin-top: 60px;*/
}
</style>
