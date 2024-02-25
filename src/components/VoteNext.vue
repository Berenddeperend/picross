<template>
  <button @click="suggestNext">Vote to skip this puzzle</button>
</template>

<script setup lang="ts">
import { Socket } from "socket.io-client";
const { socket } = defineProps<{ socket: Socket }>();

function suggestNext() {
  socket.emit("suggestNext");
}
</script>
