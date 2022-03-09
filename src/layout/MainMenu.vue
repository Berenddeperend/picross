<template>
  <h1>Picross</h1>

  <ul>
    <li>
      <router-link to="/play">Play</router-link>
    </li>
    <li>
      <router-link to="/create">Create Level</router-link>
    </li>
  </ul>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
ul {
  padding: 0;
  list-style-type: none;
}
</style>
