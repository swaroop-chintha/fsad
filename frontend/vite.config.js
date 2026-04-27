import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    base: '/',
    plugins: [react()],
    define: {
      global: 'window',
      'process.env': {},
    },
    resolve: {
      alias: {
        process: 'process/browser',
        util: 'util/',
        stream: 'stream-browserify',
      },
    },
    optimizeDeps: {
      exclude: ['sockjs-client', '@stomp/stompjs'],
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
})
