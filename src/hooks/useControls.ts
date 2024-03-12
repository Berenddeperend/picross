import { onMounted, onUnmounted, ref } from "vue";

const interaction = ref({
  spacePressed: false,
  intention: "build",
});

export function initControls(fns: {
  toggleCellValue: (value: string) => any;
  movePlayerCursor: (value: Direction) => any;
}) {
  const { toggleCellValue, movePlayerCursor } = fns;
  function controls(e: KeyboardEvent) {
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
    } else if (e.key === "f" || e.key === "x") {
      toggleCellValue("x");
    } else if (e.key === " ") {
      interaction.value.spacePressed = true;
      toggleCellValue("d");
    }
  }

  onMounted(() => {
    window.addEventListener("keydown", controls);
    window.addEventListener("keyup", (e) => {
      e.preventDefault();
      if (e.key === " ") {
        interaction.value.spacePressed = false;
      }
    });
  });
  onUnmounted(() => {
    window.removeEventListener("keydown", controls);
  });
}
