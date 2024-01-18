<template>
  <ul>
    <li v-for="puzzle in puzzles" :key="puzzle.id">{{ puzzle.name }}</li>
  </ul>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "@vue/runtime-core";
import http from "@/services/http";
import { useStorage } from "@vueuse/core";

const puzzles = ref();
const nickName = useStorage("nickName", "");
onMounted(() => {
  http.get(`/users/${nickName.value}/puzzles`).then((response) => {
    puzzles.value = response.data;
  });
});
</script>
