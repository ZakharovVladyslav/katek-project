import { defineConfig } from 'vite';

export default defineConfig({
	root: './',
	base: '/',
	server: {
		port: '3001',
		open: './'
	},
	build: {
		rollupOptions: {
			input: {
				app: './index.html'
			}
		}
	}
});
