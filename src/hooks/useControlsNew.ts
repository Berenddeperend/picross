import { onMounted, onUnmounted, ref, ComputedRef, computed, watch } from "vue";
import { movePlayerCursor, player } from "@/hooks/useUserStates";
import { grid, levelIsCleared } from "@/hooks/useGrid";
import { socket } from "@/hooks/useSocket";

import { defineEmits } from "vue";
const emit = defineEmits(["moveCursor"]);

const interaction = ref({
  spacePressed: false,
  intention: "build",
});

// export function toggleCellValue(value: string) {
//   console.log("yoink");
//   if (levelIsCleared.value) {
//     return;
//   }
//
//   const cell =
//     grid.value[(player.value as Player).position[1]][
//       (player.value as Player).position[0]
//     ];
//   if (cell === value) {
//     interaction.value.intention = "clear";
//     grid.value[(player.value as Player).position[1]][
//       (player.value as Player).position[0]
//     ] = " ";
//   } else {
//     interaction.value.intention = "build";
//     grid.value[(player.value as Player).position[1]][
//       (player.value as Player).position[0]
//     ] = value;
//   }
//
//   socket.emit("gridUpdated", grid.value);
// }

// function repeatAction() {
//   if (interaction.value.spacePressed) {
//     // interaction.value.intention;
//     toggleCellValue("d");
//   }
// }

export function initControls(fns: {
  onToggleCellValue: (value: string) => any;
  onMovePlayerCursor: (value: Direction) => any;
}) {
  function controls(e: KeyboardEvent) {
    // e.preventDefault();
    // emit("moveCursor");

    if (e.key === "ArrowLeft") {
      fns.onMovePlayerCursor("left");
      if (interaction.value.spacePressed) fns.onToggleCellValue("d");
    } else if (e.key === "ArrowRight") {
      fns.onMovePlayerCursor("right");
      if (interaction.value.spacePressed) fns.onToggleCellValue("d");
    } else if (e.key === "ArrowUp") {
      fns.onMovePlayerCursor("up");
      if (interaction.value.spacePressed) fns.onToggleCellValue("d");
    } else if (e.key === "ArrowDown") {
      fns.onMovePlayerCursor("down");
      if (interaction.value.spacePressed) fns.onToggleCellValue("d");
    } else if (e.key === "f") {
      fns.onToggleCellValue("x");
    } else if (e.key === " ") {
      interaction.value.spacePressed = true;
      fns.onToggleCellValue("d");
    }
  }

  onMounted(() => {
    window.addEventListener("keydown", controls);
    window.addEventListener("keyup", (e) => {
      if (e.key === " ") {
        interaction.value.spacePressed = false;
      }
    });
  });
  onUnmounted(() => {
    window.removeEventListener("keydown", controls);
  });
}
