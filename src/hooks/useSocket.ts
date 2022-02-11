import { io, Socket } from "socket.io-client";

export const socket = io("ws://localhost:4000");
