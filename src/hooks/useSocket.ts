import { io, Socket } from "socket.io-client";

export const socket = io("wss://berendswennenhuis.nl", {path: '/path/'});
