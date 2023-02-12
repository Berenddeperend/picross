<template>
  <side-bar>
    <router-link :to="{ name: 'mainMenu' }">Back</router-link>
    <!-- <br />
    Now playing: ({{ Object.values(players).length }}):
    <ul>
      <li
        v-for="player in players"
        :class="[{ 'current-player': isCurrentPlayer(player) }, player.id]"
        ref="playersRef"
      >
        {{ player.name }}
        <span class="score">12</span>
      </li>
    </ul>

    <VoteClear v-if="socket" :socket="socket" />
    <VoteNext v-if="socket" :socket="socket" /> -->
  </side-bar>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import VoteClear from "@/components/VoteClear.vue";
import VoteNext from "@/components/VoteNext.vue";
import SideBar from "@/components/SideBar.vue";
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
ul {
  display: flex;
  padding: 0;
  margin: 0 10px;


  li {
    margin: 5px;
    list-style-type: none;
    //padding: 0 10px;
    padding-left: 10px;
    border-radius: 3px;

    &.current-player {
      background: lightblue;
    }

    .score {
      $size: 30px;
      background: darken(lightblue, 10%);
      color: black;
      //border-radius: $size;
      width: $size;
      height: $size;
      text-align: center;
      display: inline-flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
