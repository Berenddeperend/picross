import { onMounted } from "vue";

onMounted(() => {
  window.addEventListener("click", dragListener);
});

function dragListener(clickEvent: MouseEvent) {
  const clickOrigin = {
    x: clickEvent.clientX,
    y: clickEvent.clientY,
  };
  const playField = document.querySelector(
    ".playfield-container"
  ) as HTMLDivElement;

  playField.addEventListener("mouseover", (hoverEvent: MouseEvent) => {
    const dragPosition = {
      x: hoverEvent.clientX,
      y: hoverEvent.clientY,
    };

    let dir: "horizontal" | "vertical";

    if (clickOrigin.x > hoverEvent.x) {
      //dragged to left
      if (clickOrigin.x - dragPosition.x > clickOrigin.y - dragPosition.y) {
        dir = "vertical";
      } else {
        dir = "horizontal";
      }
    } else {
      //dragged to right
      if (clickOrigin.x + dragPosition.x > clickOrigin.y + dragPosition.y) {
        dir = "vertical";
      } else {
        dir = "horizontal";
      }
    }

    console.log(dir);

    // const dir =
    //   clickOrigin.x - dragPosition.x > clickOrigin.y - dragPosition.y
    //     ? "vertical"
    //     : "horizontal";

    // const target = hoverEvent.target as Element;
    // console.log(target.getAttribute("i") ?? "yeee");
  });
}
