<template>
  <header>
    <router-link :to="{ name: 'mainMenu' }">Terug</router-link>
    <br />
    Now playing: ({{ Object.values(players).length }}):
    <ul>
      <li
        v-for="player in players"
        :class="[{ 'current-player': isCurrentPlayer(player) }, player.id]"
        ref="playersRef"
      >
        {{ player.name }}
      </li>
    </ul>

    <VoteClear v-if="socket" :socket="socket" />
    <VoteNext v-if="socket" :socket="socket" />
  </header>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import VoteClear from "@/components/VoteClear.vue";
import VoteNext from "@/components/VoteNext.vue";
import { Socket } from "socket.io-client";

const { players, player, socket } =
  defineProps<{ players: Players; player: Player; socket?: Socket }>();

const inputRef = ref(null);

const name = ref("");

onMounted(() => {});

function isCurrentPlayer(somePlayer: Player) {
  return somePlayer.id === player.id;
}
</script>

<style lang="scss" scoped>
header {
  //display: flex;
  position: absolute;

  top: 0;
  left: 0;
  //width: 100%;
  width: 200px;
  height: 100%;
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
