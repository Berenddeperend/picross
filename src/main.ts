import { createApp } from "vue";
// import { createPinia } from "pinia";
import App from "./App.vue";

import Game from "./layout/Game.vue";
import Create from "./layout/Create.vue";
import MainMenu from "./layout/MainMenu.vue";
import MyPuzzles from "./layout/MyPuzzles.vue";
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
} from "vue-router";

import "@/scss/all.scss";

const routes = [
  { name: "mainMenu", path: "/", component: MainMenu },
  { name: "multiplayer", path: "/play", component: Game },
  {
    name: "singleplayer",
    path: "/play/singleplayer/:puzzleId",
    component: Game,
    props: true,
  },
  { name: "create", path: "/create", component: Create },
  { name: "myPuzzles", path: "/my-puzzles", component: MyPuzzles },
];

const router = createRouter({
  history: createWebHashHistory(),
  // history: createMemoryHistory(),
  routes,
});

const app = createApp(App)
  .use(router)
  // .use(createPinia())
  .mount("#app");
