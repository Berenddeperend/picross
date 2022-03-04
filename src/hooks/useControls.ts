import { onMounted, onUnmounted, ref, ComputedRef, computed, watch } from "vue";
import { movePlayerCursor, player } from "@/hooks/useUserStates";
import { grid, levelIsCleared } from "@/hooks/useGrid";
import { socket } from "@/hooks/useSocket";

const interaction = ref({
  spacePressed: false,
  intention: "build",
});

function toggleCellValue(value: string) {
  if (levelIsCleared.value) {
    return;
  }

  const cell =
    grid.value[(player.value as Player).position[1]][
      (player.value as Player).position[0]
    ];
  if (cell === value) {
    interaction.value.intention = "clear";
    grid.value[(player.value as Player).position[1]][
      (player.value as Player).position[0]
    ] = " ";
  } else {
    interaction.value.intention = "build";
    grid.value[(player.value as Player).position[1]][
      (player.value as Player).position[0]
    ] = value;
  }

  socket.emit("gridUpdated", grid.value);
}

function repeatAction() {
  if (interaction.value.spacePressed) {
    // interaction.value.intention;
    toggleCellValue("d");
  }
}

export function initControls() {
  function controls(e: KeyboardEvent) {
    // e.preventDefault();

    if (e.key === "ArrowLeft") {
      movePlayerCursor("left");
      if (interaction.value.spacePressed) toggleCellValue("d");
    } else if (e.key === "ArrowRight") {
      movePlayerCursor("right");
      if (interaction.value.spacePressed) toggleCellValue("d");
    } else if (e.key === "ArrowUp") {
      movePlayerCursor("up");
      if (interaction.value.spacePressed) toggleCellValue("d");
    } else if (e.key === "ArrowDown") {
      movePlayerCursor("down");
      if (interaction.value.spacePressed) toggleCellValue("d");
    } else if (e.key === "f") {
      toggleCellValue("x");
    } else if (e.key === " ") {
      interaction.value.spacePressed = true;
      toggleCellValue("d");
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
