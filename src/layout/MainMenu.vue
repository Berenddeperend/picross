<template>
  <h1>Picross</h1>
  <label>
    Nickname
    <input type="text" placeholder="Uw naam" v-model="nickName" />
  </label>

  <ul>
    <li>
      <router-link to="/play">Play</router-link>
    </li>
    <li>
      <router-link to="/create">Create Level</router-link>
    </li>
    <li>
      <router-link to="/my-puzzles">My puzzles</router-link>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useStorage } from "@vueuse/core";

const nickName = useStorage("nickName", "");
</script>

<style lang="scss" scoped>
ul {
  padding: 0;
  list-style-type: none;
}
</style>
