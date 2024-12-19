import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
	build: {
		target: 'esnext',
	},
	resolve: {
		alias: {
			'@app': resolve(__dirname, './src/app'),
		},
	},
	plugins: [VitePWA({ registerType: 'autoUpdate' })],
})
