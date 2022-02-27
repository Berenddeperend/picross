<template>
  <header>
    Now playing: ({{ Object.values(players).length }}):
    <ul>
      <li
        v-for="player in players"
        :class="{ 'current-player': isCurrentPlayer(player) }"
        :key="player"
        contenteditable="true"
      >
        {{ player.name }}
      </li>
    </ul>
    <input type="text" />
  </header>
</template>

<script setup lang="ts">
import { players, playerId } from "@/hooks/useUserStates";

function isCurrentPlayer(player: Player) {
  return player.id === playerId.value;
}
</script>

<style lang="scss" scoped>
header {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background: #f7f7f7;
  justify-content: center;
  align-items: center;
  padding: 5px;
  border-bottom: 1px solid #f0f0f0;
}

input {
  position: absolute;
  top: 60px;
}

ul {
  display: flex;
  padding: 0;
  margin: 0 10px;

  li {
    margin: 5px;
    list-style-type: none;
    padding: 4px 10px;
    border-radius: 3px;

    &.current-player {
      background: lightblue;
    }
  }
}
</style>
