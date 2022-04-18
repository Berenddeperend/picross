<template>
  <button @click="suggestClear">Clear</button>
</template>

<script setup lang="ts">
import { Socket } from "socket.io-client";
const { socket } = defineProps<{ socket: Socket }>();

function suggestClear() {
  socket.emit("suggestClear");
}
</script>
