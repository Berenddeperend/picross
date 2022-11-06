import { io } from "socket.io-client";
import { onUnmounted } from "vue";

const useSocket = () => {
  const settings = { transports: ["websocket"], upgrade: false };

  const socket = io(
    import.meta.env.VITE_SOCKET_BASE_URL,
    { path: import.meta.env.VITE_SOCKET_PATH, ...settings }
  );

  onUnmounted(() => {
    socket.disconnect();
  });

  return {
    socket,
  };
};

export default useSocket;
