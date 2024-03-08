<script setup lang="ts">
import useStore from "@/store";
import CanvasPuzzleViewer from "@/components/CanvasPuzzleViewer.vue";

const store = useStore();
const { puzzles } = store;
</script>

<template>
  <p>Welcome to the hidden admin environment!</p>

  <table>
    <thead>
      <td>Preview</td>
      <td>Puzzle naam</td>
      <td>Author ID</td>
      <td>Author</td>
    </thead>
    <tbody>
      <tr v-for="row in puzzles">
        <td>
          <CanvasPuzzleViewer
            class="puzzle-preview"
            :puzzle="row"
            fill="#444"
            :pixel-size="3"
          />
        </td>
        <td>{{ row.name }}</td>
        <td>{{ row.authorId }}</td>
        <td>{{ row.author.name }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style lang="scss" scoped>
table {
  text-align: left;
}

thead td {
  font-weight: bold;
  padding: 5px;
}
</style>
