<script setup lang="ts">
import { useStorage } from "@vueuse/core";

const nickName = useStorage("nickName", "");
</script>

<template>
  <div class="page">
    <div class="main-menu-wrapper">
      <h1>
        Nonogram <br />
        <small>with Friends</small>
      </h1>
      <label>
        <!--      <div class="nickname-label">Nickname</div>-->

        <div class="input-with-button">
          <input
            type="text"
            autofocus
            v-model="nickName"
            placeholder="Nickname"
          />
          <div style="display: flex" @click="">
            <router-link
              :disabled="!nickName"
              class="btn"
              :class="{ disabled: !nickName }"
              to="/play"
              >Play</router-link
            >
          </div>
        </div>
      </label>

      <router-link class="menu-btn" to="/create">Create puzzle</router-link>
      <router-link class="menu-btn" to="/all-puzzles">View puzzles</router-link>
    </div>

    <a
      href="https://buymeacoffee.com/berenddeperend"
      target="_blank"
      class="bmc-link"
    >
      <img
        src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
        alt="Buy Me A Coffee"
      />
    </a>
  </div>
</template>

<style lang="scss" scoped>
h1 {
  line-height: 1;
  margin-bottom: 40px;
}

input {
  background: white;
  color: #2c3e50;
  text-align: left;
  padding-left: 20px;
  padding-right: 20px;
  border: 1.5px solid #c0c8cc;
  border-top-left-radius: 0.5em;
  border-bottom-left-radius: 0.5em;
  border-right: none;
  width: 100%;
}

.input-with-button {
  display: flex;

  .btn {
    border-radius: 0.5em;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;

    &.disabled {
      //pointer-events: none;
      cursor: not-allowed;
    }
  }
}

.main-menu-wrapper {
  max-width: 250px;
  margin: auto;
}

.nickname-label {
  display: block;
  font-weight: bold;
  //text-align: left;
  padding-right: 20px;
  text-transform: uppercase;
  font-size: 12px;
}

.menu-btn {
  display: block;
  margin-top: 10px;
  text-align: center;
  text-decoration: none;
  color: #2c3e50;
  border: 1.5px solid #c0c8cc;
  border-radius: 0.5em;
  background-color: white;
  padding: 0.5em;

  &:hover {
    background-color: #ebf1f4;
  }
}

small {
  font-size: 0.6em;
  font-weight: normal;
}

.page {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 20px;
  box-sizing: border-box;
}

.bmc-link {
  padding-top: 30px;

  img {
    height: 40px;
  }
}
</style>
