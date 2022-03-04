<template>
  <header>
    Now playing: ({{ Object.values(players).length }}):
    <ul>
      <li
        v-for="player in players"
        :class="[{ 'current-player': isCurrentPlayer(player) }, player.id]"
        ref="playersRef"
      >
        {{ player.name }}

        <!--        <input-->
        <!--          ref="inputRef"-->
        <!--          v-if="isCurrentPlayer(player)"-->
        <!--          v-model="player.name"-->
        <!--          type="text"-->
        <!--        />-->
      </li>
    </ul>
  </header>
</template>

<script setup lang="ts">
import { players, playerId } from "@/hooks/useUserStates";
import { createPopper } from "@popperjs/core";
import { nextTick, onMounted, ref, watch } from "vue";

const playersRef = ref([]);
const inputRef = ref(null);

const name = ref("");

onMounted(() => {
  console.log("-> inputRef", inputRef);
  //   console.log("-> playersRef", playersRef.value);
});

// createPopper(player as HTMLElement, $refs["input"] as HTMLDivElement, {
//   placement: "right",
//   modifiers: [
//     {
//       name: "arrow",
//       options: {
//         padding: 5,
//       },
//     },
//   ],
// });

function isCurrentPlayer(player: Player) {
  return player.id === playerId.value;
}
</script>

<style lang="scss" scoped>
header {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background: #f7f7f7;
  justify-content: center;
  align-items: center;
  padding: 5px;
  border-bottom: 1px solid #f0f0f0;
}

input {
  position: absolute;
  top: 60px;
}

ul {
  display: flex;
  padding: 0;
  margin: 0 10px;

  li {
    margin: 5px;
    list-style-type: none;
    padding: 4px 10px;
    border-radius: 3px;

    &.current-player {
      background: lightblue;
    }
  }
}
</style>
