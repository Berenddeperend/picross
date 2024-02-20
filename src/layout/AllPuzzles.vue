<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import CanvasPuzzleViewer from "@/components/CanvasPuzzleViewer.vue";
import useStore from "@/store";
import { onBeforeMount } from "vue";

const store = useStore();
const { puzzles, showFancyBackground } = store;

onBeforeMount(() => {
  showFancyBackground.value = false;
});

store.fetchPuzzles();
if (!puzzles.value.length) {
}

const nickName = useStorage("nickName", "Berend");
</script>

<template>
  <div class="all-puzzles-container">
    <div class="header">
      <router-link class="btn outline" :to="{ name: 'mainMenu' }"
        >← Back</router-link
      >
      <h2>All puzzles</h2>
    </div>

    <div v-if="!nickName">No puzzles yet.</div>

    <div class="all-puzzles" v-if="puzzles">
      <div class="puzzle" :key="puzzle.id" v-for="puzzle in puzzles">
        <CanvasPuzzleViewer
          class="puzzle-preview"
          v-if="puzzles.length"
          :puzzle="puzzle"
          fill="#444"
          :pixel-size="10"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  display: grid;
  align-items: center;
  margin-bottom: 20px;
  justify-content: start;
  grid-template-columns: repeat(3, 1fr);

  .btn {
    width: fit-content;
  }

  h2 {
    justify-self: center;
    text-align: center;
    margin: 0;
  }
}

.all-puzzles-container {
  padding: 0 10px;
  margin-top: 20px;
  text-align: left;
}

.all-puzzles {
  width: 100%;
  max-width: 700px;
  margin: 20px auto;
  gap: 10px;
  display: flex;
  flex-wrap: wrap;

  .puzzle {
    line-height: 0;
  }

  .puzzle-preview {
    border: 1px solid #e1e1e1;
    padding: 10px;
    background: white;
  }
}
</style>
