import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
    base: '/new',
    build: {
        outDir: '/var/www/akostylev/html'
    },
    resolve: {
        alias: {
            '~': path.resolve('src')
        }
    },
    plugins: [
        tanstackRouter({
            target: 'react',
            autoCodeSplitting: true
        }),
        react()
    ],
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8000',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    }
});
