import { useStore } from "@/stores/store";
import { io, Socket } from "socket.io-client";
const store = useStore();

export default function initGame() {
  store.socket = io("ws://localhost:7000");
}
