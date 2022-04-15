<script setup lang="ts"></script>

<template>
  <router-view></router-view>
  <div id="modal-target"></div>
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
  /*margin-top: 60px;*/
}
</style>
