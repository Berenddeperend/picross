import { io } from "socket.io-client";
import { onUnmounted } from "vue";

const useSocket = () => {
  const isProd = import.meta.env.PROD;
  const settings = { transports: ["websocket"], upgrade: false };

  console.log('isProd', isProd);


  // const socket = io(
  //   isProd ? import.meta.env.VITE_SOCKET_BASE_URL : "localhost:7100",
  //   isProd ? { path: import.meta.env.VITE_SOCKET_PATH, ...settings } : { ...settings }
  // );


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
