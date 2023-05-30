import { defineConfig } from 'vite';

export default defineConfig({
	root: './',
	base: '/',
	server: {
		port: '3001',
		proxy: {
			'/api': {
				target: 'http://localhost:3000',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, '')
			}
		}
	}
});
