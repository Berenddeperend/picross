// https://stackoverflow.com/a/53981706

declare global {
    namespace NodeJS {
      interface ProcessEnv {
        VUE_API_URL: string;
        VUE_SOCKET_BASE_URL: string;
        VUE_SOCKET_PATH: string;
        NODE_ENV: 'development' | 'production';
        PORT?: string;
        PWD: string;
      }
    }
  }

export {}