import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

import dotenv from 'dotenv';
dotenv.config();

// Prevent Node.js (especially Node 22/24 on Windows) from crashing when a mobile browser or client resets TCP sockets
process.on('uncaughtException', (err: any) => {
  if (err?.code === 'ECONNRESET' || err?.errno === -4077 || err?.message?.includes('ECONNRESET')) {
    // Harmless socket drop from client disconnecting or navigating away
    return;
  }
  console.error('[Uncaught Exception]:', err);
});

// Plugin to attach error handlers to dev server HTTP sockets so reset connections don't crash Node
const socketResiliencePlugin = (): Plugin => ({
  name: 'socket-resilience',
  configureServer(server) {
    if (server.httpServer) {
      server.httpServer.on('clientError', (err: any, socket: any) => {
        if (err.code === 'ECONNRESET' || err.errno === -4077 || !socket.writable) {
          return;
        }
        socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
      });

      server.httpServer.on('connection', (socket: any) => {
        socket.on('error', (err: any) => {
          if (err.code === 'ECONNRESET' || err.errno === -4077) {
            return;
          }
        });
      });
    }
  },
});

export default defineConfig({
  plugins: [react(), socketResiliencePlugin()],
  define: {
    global: 'window',
    'process.env': {
      GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
      VITE_GEMINI_API_KEY: process.env.VITE_GEMINI_API_KEY || '',
    },
    __DEV__: process.env.NODE_ENV !== 'production' || true,
  },
  resolve: {
    alias: {
      'react-native/Libraries/Utilities/codegenNativeComponent': path.resolve(__dirname, './src/mock-codegenNativeComponent.js'),
      'react-native': 'react-native-web',
      'expo-sensors': path.resolve(__dirname, './src/mock-expo-sensors.ts'),
      'expo-image-manipulator': path.resolve(__dirname, './src/mock-expo-image-manipulator.ts'),
    },
    extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js'],
  },
  optimizeDeps: {
    esbuildOptions: {
      resolveExtensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js'],
    },
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api/gemini': {
        target: 'https://generativelanguage.googleapis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/gemini/, ''),
        secure: false,
        timeout: 60000,
        configure: (proxy) => {
          proxy.on('error', (err: any, _req: any, res: any) => {
            console.warn('[Vite Gemini Proxy Warning]:', err.message);
            if (res && !res.headersSent && typeof res.writeHead === 'function') {
              res.writeHead(502, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: { message: 'Proxy request failed', details: err.message } }));
            }
          });
          proxy.on('proxyReq', (proxyReq: any, req: any) => {
            req.on('aborted', () => {
              proxyReq.destroy();
            });
            req.on('error', (err: any) => {
              if (err.code !== 'ECONNRESET') {
                console.warn('[Proxy Client Req Error]:', err.message);
              }
              proxyReq.destroy();
            });
          });
        },
      },
    },
  },
});

