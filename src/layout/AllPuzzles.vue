<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import CanvasPuzzleViewer from "@/components/CanvasPuzzleViewer.vue";
import useStore from "@/store";
import { computed, onBeforeMount } from "vue";

const store = useStore();
const { puzzles, showFancyBackground } = store;

// onBeforeMount(() => {
//   showFancyBackground.value = false;
// });

const puzzles10x10 = computed(() =>
  puzzles.value.filter((puzzle) => puzzle.solution[0].length === 10)
);

const puzzles15x15 = computed(() =>
  puzzles.value.filter((puzzle) => puzzle.solution[0].length === 15)
);

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
      <h2>
        All puzzles <small v-if="puzzles">({{ puzzles.length }})</small>
      </h2>
    </div>

    <div v-if="!nickName">No puzzles yet.</div>

    <h2 class="sticky">
      <div>
        10x10 <small>({{ puzzles10x10.length }} puzzles)</small>
      </div>
    </h2>
    <div class="all-puzzles" v-if="puzzles">
      <div class="puzzle" :key="puzzle.id" v-for="puzzle in puzzles10x10">
        <CanvasPuzzleViewer
          class="puzzle-preview"
          v-if="puzzles.length"
          :puzzle="puzzle"
          fill="#444"
          :pixel-size="10"
        />
      </div>
    </div>

    <h2 class="sticky">
      <div>
        15x15 <small>({{ puzzles15x15.length }} puzzles)</small>
      </div>
    </h2>
    <div class="all-puzzles" v-if="puzzles">
      <div class="puzzle" :key="puzzle.id" v-for="puzzle in puzzles15x15">
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
//.sticky {
//  position: sticky;
//  top: 0;
//
//  * {
//    position: relative;
//    left: -100px;
//  }
//}

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
