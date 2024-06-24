<script setup lang="ts">
import useStore from "@/store";
import CanvasPuzzleViewer from "@/components/CanvasPuzzleViewer.vue";
import http from "@/services/http";

const store = useStore();
const { puzzles } = store;

const updateSanctioned = (puzzle: Puzzle, value: any) => {
  http.put("/admin/sanction-puzzle", {
    value: value === "true",
    puzzleId: puzzle.id,
  });
};

const updateShownInOverview = (puzzle: Puzzle, value: any) => {
  http.put("/admin/puzzle-visible-in-overview", {
    value: value === "true",
    puzzleId: puzzle.id,
  });
};
</script>

<template>
  <p>
    Hi! Looks like you found my hidden admin page. This is where I can block
    certain puzzles from being in circulation. Set a localStorage entry with key
    <code>'nono-admin-password'</code> to enable the authentication. The value
    of is a super secret password tho, so good luck guessing it.
  </p>

  <table>
    <thead>
      <th>Preview</th>
      <th>Size</th>
      <th>Visible</th>
      <th>Sanctioned</th>
      <th>Puzzle naam</th>
      <th>Puzzle Id</th>
      <th>Author ID</th>
      <th>Author</th>
    </thead>
    <tbody>
      <tr v-for="row in puzzles">
        <td>
          <CanvasPuzzleViewer
            class="puzzle-preview"
            :puzzle="row"
            fill="#444"
            :pixel-size="8"
          />
        </td>
        <td>{{ row.width }}x{{ row.width }}</td>
        <td>
          <input
            type="checkbox"
            v-model="row.showInOverview"
            :value="row.showInOverview"
            @change="updateShownInOverview(row, $event.target.value)"
          />
        </td>
        <td>
          <input
            type="checkbox"
            v-model="row.sanctioned"
            :value="row.sanctioned"
            @change="updateSanctioned(row, $event.target.value)"
          />
        </td>
        <td>{{ row.name }}</td>
        <td>{{ row.id }}</td>
        <td>{{ row.authorId }}</td>
        <td>{{ row.author.name }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style lang="scss" scoped>
p {
  max-width: 400px;
  text-align: left;
  margin: 40px 0;
}

table {
  text-align: left;
  border-spacing: 0;
}

thead {
}

th {
  top: 0;
  background: white;
  position: sticky;
  padding: 10px 5px;
}

td {
  padding: 5px;
}

tr {
  background: white;

  &:nth-child(odd) {
    background: #f8f8f8;
  }
}

thead td {
  font-weight: bold;
}
</style>
