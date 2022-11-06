<script setup lang="ts">
import {ref} from 'vue'

const theme = ref('light');

</script>

<template>
  <div>
    <router-view></router-view>
    <div id="modal-target"></div>
  </div>
</template>

<style>
html,
body {
  height: 100%;
  margin: 0;
}

body {
  display: flex;
  justify-content: center;
  align-items: center;
}

* {
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
