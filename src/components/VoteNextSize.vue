<template>
  hierna:
  <button @click="suggestNext('10x10')">10x10</button>
  <button @click="suggestNext('15x15')">15x15</button>
</template>

<script setup lang="ts">
import { Socket } from "socket.io-client";
const { socket } = defineProps<{ socket: Socket }>();

function suggestNext(size: string) {
  socket.emit("voteNextSize", size);
}
</script>
