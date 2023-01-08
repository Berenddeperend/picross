import { createApp } from "vue";
// import { createPinia } from "pinia";
import App from "./App.vue";

import Game from "./layout/Game.vue";
import Create from "./layout/Create.vue";
import MainMenu from "./layout/MainMenu.vue";
import AllPuzzles from "./layout/AllPuzzles.vue";
import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
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
  { name: "allPuzzles", path: "/all-puzzles", component: AllPuzzles },
];

const router = createRouter({
  // history: createWebHistory(),
  history: createWebHashHistory(),
  routes,
});

const app = createApp(App).use(router).mount("#app");
