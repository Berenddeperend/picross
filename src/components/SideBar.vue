<template>
  <aside class="sidebar">
    <div class="split">

      <router-link class="link" :to="{ name: 'mainMenu' }">← Menu</router-link>

      <div ref="clickTrap">
        <div class="online-toggle" :class="{open: dropdownOpen}"  @click="dropdownOpen = !dropdownOpen">
          <div class="dot"></div>
            {{Object.entries(players).length}} Online
        </div>
        <transition>
          <div class="dropdown" v-if="dropdownOpen">
            <ul>
              <li v-for="player in players" :class="{'current-player': isCurrentPlayer(player)}">
                <div class="dot" :style="{backgroundColor: player.color}"></div>
                  {{ player.name }}
              </li>
            </ul>
          </div>

        </transition>
      </div>
    </div>

  </aside>
    
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Socket } from "socket.io-client";
const { players, player, socket } =
  defineProps<{ players: Players; player: Player; socket?: Socket }>();

function isCurrentPlayer(somePlayer: Player) {
  return somePlayer.id === player.id;
}

const dropdownOpen = ref(false)
const clickTrap = ref()

const clickOutsideHandler = function(e: any) {
  if(!clickTrap.value.contains(e.target)) {
    window.removeEventListener('click', clickOutsideHandler)
    dropdownOpen.value = false;
  }
}

watch(dropdownOpen, (isOpen)=> {
  isOpen 
    ? window.addEventListener('click', clickOutsideHandler) 
    : window.removeEventListener('click', clickOutsideHandler)  
})

</script>

<style lang="scss" scoped>

$sidebar-bg: $bg-gray-50;

.sidebar {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;

  height: 50px;
  background: $sidebar-bg;
  justify-content: center;
  align-items: center;
  padding: 5px;
  border-bottom: 2px solid darken($sidebar-bg, 5%);
}


.link {
  padding: 10px;
  text-decoration: none;
  color: black;
  border-radius: 4px;
  &:hover {
    background: rgba(0,0,0,0.05);
  }
}

/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {

  transition: opacity 0.2s, transform 0.2s;
}

.v-enter-from,
.v-leave-to {
  transform: translateY(-5px);
  opacity: 0;
}

.dropdown {
  margin-top: 5px;
  position: absolute;
  background: white;
  width: auto;
  right: 0;
  padding: 15px;
  border-radius: 4px;
  box-shadow: 0 1px 1px rgb(0 0 0 / 10%);
}

.online-toggle {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 4px;
  transition: background 0.1s;
  background: rgba(0,0,0,0.05);

  &.open, &:hover {
    background: rgba(0,0,0,0.1);
  }

  .dot {
    border: 1px solid darken(limegreen, 5%);
  }
}

.split {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  width: 100%;
  max-width: 500px;
}

input {
  position: absolute;
  top: 60px;
}

.dot {
  background: limegreen;
  $size: 10px;
  width: $size;
  height: $size;
  border-radius: $size;
}

ul {
  // display: flex;
  margin: 0;
  padding: 0;

  li {
    list-style-type: none;
    display: flex;
    align-items: center;
    gap: 10px;

    &.current-player {
      font-weight: bold;
    }
  }
}
</style>
