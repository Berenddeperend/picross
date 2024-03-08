import { createApp } from "vue";
// import { createPinia } from "pinia";
import App from "./App.vue";

import Game from "./layout/Game.vue";
import Create from "./layout/Create.vue";
import MainMenu from "./layout/MainMenu.vue";
import AllPuzzles from "./layout/AllPuzzles.vue";
import Admin from "@/layout/Admin.vue";
import { createRouter, createWebHashHistory } from "vue-router";

import "@/scss/style.scss";
import "@/scss/toggle.scss";

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
  { name: "admin", path: "/admin", component: Admin },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const app = createApp(App).use(router).mount("#app");
