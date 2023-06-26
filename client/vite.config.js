import { defineConfig } from 'vite';

export default defineConfig({
	root: './',
	base: '/',
	server: {
		port: '3001',
		open: './index.html'
	},
	build: {
		rollupOptions: {
			input: {
				app: './index.html'
			}
		}
	}
});
