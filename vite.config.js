import { defineConfig } from 'vite';

export default defineConfig({
	root: './',
	base: '/',
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:3000',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, '')
			}
		}
	},
	optimizeDeps: {
		include: [
			'axios'
		]
	}
});
