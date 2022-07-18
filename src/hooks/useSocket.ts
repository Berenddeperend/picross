import { io } from "socket.io-client";
import { onUnmounted } from "vue";

const useSocket = () => {
  const isProd = process.env.NODE_ENV === "production";
  const settings = { transports: ["websocket"], upgrade: false };

  const socket = io(
    isProd ? process.env.VUE_SOCKET_BASE_URL : "localhost:7100",
    isProd ? { path: process.env.VUE_SOCKET_PATH, ...settings } : { ...settings }
  );

  onUnmounted(() => {
    socket.disconnect();
  });

  return {
    socket,
  };
};

export default useSocket;
