import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
	build: {
		target: 'esnext',
	},
	resolve: {
		alias: {
			'@app': path.resolve(__dirname, './src/app'),
		},
	},
	plugins: [VitePWA({ registerType: 'autoUpdate' })],
})
