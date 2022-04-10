import { createApp } from "vue";
// import { createPinia } from "pinia";
import App from "./App.vue";
import Game from "./layout/GameNew.vue";
import Create from "./layout/Create.vue";
import MainMenu from "./layout/MainMenu.vue";
import MyPuzzles from "./layout/MyPuzzles.vue";
import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  { path: "/", component: MainMenu },
  { path: "/play", component: Game },
  { path: "/create", component: Create },
  { path: "/my-puzzles", component: MyPuzzles },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

createApp(App)
  .use(router)
  // .use(createPinia())
  .mount("#app");
