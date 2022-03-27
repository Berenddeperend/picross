<template>
  <modal :visible="true"> yeetusß </modal>
  <Grid
    :enable-controls="true"
    :grid="grid"
    :player="player"
    :players="players"
    @onCellClicked="onCellClicked"
    @moveCursor="onMoveCursor"
    @stateChanged="onStateChanged"
  />
  <!--    dit niet emitten maar exposen als functie! dan kan ik {useMoveCurosr} from grid doen -->
</template>

<script setup lang="ts">
import { clampToGrid, createGrid, gridSize, indexToXY } from "@/hooks/useGrid";
import Modal from "@/components/TheModal.vue";
import Grid from "@/components/TheGrid.vue";
import { ref } from "vue";

const grid = ref<Grid>(createGrid(gridSize));

//hier gaan we de userstate bijhouden, niet in het grid component.
const player = ref<Player>({
  id: "1",
  position: [0, 0],
  color: "green",
  name: "berend",
});

const players = ref<Players>({
  "1": player.value,
});

function onMoveCursor(dir: Direction) {
  movePlayerCursor(dir);
  console.log("woai");
}

function onStateChanged(newState: any) {
  console.log("damn! onstatechanged", newState);
}

function onCellClicked(index: number) {
  const [x, y] = indexToXY(index);
  grid.value[y][x] = grid.value[y][x] === " " ? "d" : " ";
}

function movePlayerCursor(direction: Direction) {
  const oldPos = player.value.position;

  if (direction === "left") {
    player.value.position[0] = clampToGrid(player.value.position[0] - 1);
  }
  if (direction === "right") {
    player.value.position[0] = clampToGrid(player.value.position[0] + 1);
  }

  if (direction === "up") {
    player.value.position[1] = clampToGrid(player.value.position[1] - 1);
  }
  if (direction === "down") {
    player.value.position[1] = clampToGrid(player.value.position[1] + 1);
  }
}
</script>
