<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import Game from "@/components/Game.vue";
import TopBar from "@/components/TopBar.vue";

type GameState = "playing" | "menu";

const gameState: GameState = "playing";
</script>

<template>
  <TopBar />
  <Game />
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
