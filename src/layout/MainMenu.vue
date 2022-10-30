<template>
  <h1>Picross</h1>
  <label>
    Nickname

    <div class="input-with-button">
      <input type="text" autofocus v-model="nickName" />
      <router-link class="btn" to="/play">Play</router-link>
    </div>
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
import http from "@/services/http";
import { onMounted } from "@vue/runtime-core";

onMounted(()=> {
  http.get('/ping');
})

const nickName = useStorage("nickName", "");
</script>

<style lang="scss" scoped>
ul {
  padding: 0;
  list-style-type: none;
}
</style>
