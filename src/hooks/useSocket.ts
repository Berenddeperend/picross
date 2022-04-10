import { io, Socket } from "socket.io-client";

const isProd = process.env.NODE_ENV === "production";
const settings = { transports: ["websocket"], upgrade: false };

export const socket = io(
  isProd ? "wss://berendswennenhuis.nl" : "localhost:7100",
  isProd ? { path: "/path/", ...settings } : { ...settings }
);

const useSocket = () => {
  const isProd = process.env.NODE_ENV === "production";
  const settings = { transports: ["websocket"], upgrade: false };

  const socket = io(
    isProd ? "wss://berendswennenhuis.nl" : "localhost:7100",
    isProd ? { path: "/path/", ...settings } : { ...settings }
  );

  return {
    socket,
  };
};

export default useSocket;
