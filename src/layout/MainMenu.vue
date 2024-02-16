<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import BackgroundPattern from "@/components/BackgroundPattern.vue";

const nickName = useStorage("nickName", "");
</script>

<template>
  <BackgroundPattern />

  <h1>
    Nonogram <br />
    <small>with Friends</small>
  </h1>
  <label>
    Nickname

    <div class="input-with-button">
      <input type="text" autofocus v-model="nickName" />
      <router-link class="btn" to="/play">Play</router-link>
    </div>
  </label>

  <router-link class="menu-btn" to="/create">Create Level</router-link>
  <router-link class="menu-btn" to="/all-puzzles">View puzzles</router-link>
</template>

<style lang="scss" scoped>
h1 {
  line-height: 1;
  margin-bottom: 40px;
}

input {
  background: white;
}

.menu-btn {
  display: block;
  margin-top: 10px;
  text-align: center;
  text-decoration: none;
  color: #2c3e50;
  border: 1.5px solid #c0c8cc;
  background-color: white;
  padding: 0.5em;
  border-radius: 0.5em;

  &:hover {
    background-color: #ebf1f4;
  }
}

small {
  font-size: 0.6em;
  font-weight: normal;
}
</style>
