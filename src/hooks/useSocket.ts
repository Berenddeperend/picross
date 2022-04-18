import { io } from "socket.io-client";
import { onUnmounted } from "vue";

const useSocket = () => {
  const isProd = process.env.NODE_ENV === "production";
  const settings = { transports: ["websocket"], upgrade: false };

  const socket = io(
    isProd ? "wss://berendswennenhuis.nl" : "localhost:7100",
    isProd ? { path: "/path/", ...settings } : { ...settings }
  );

  onUnmounted(() => {
    socket.disconnect();
  });

  return {
    socket,
  };
};

export default useSocket;
