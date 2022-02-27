import { io, Socket } from "socket.io-client";

const isProd = process.env.NODE_ENV === "production";
export const socket = io(
  isProd ? "wss://berendswennenhuis.nl" : "localhost:7100",
  isProd ? { path: "/path/" } : {}
);
