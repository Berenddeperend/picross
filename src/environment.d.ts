// https://stackoverflow.com/a/53981706

declare global {
    namespace NodeJS {
      interface ProcessEnv {
        VITE_API_URL: string;
        VITE_SOCKET_BASE_URL: string;
        VITE_SOCKET_PATH: string;
        NODE_ENV: 'development' | 'production';
        PORT?: string;
        PWD: string;
      }
    }
  }

export {}