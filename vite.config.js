import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  build: {
    target: 'esnext'
  },
	resolve: {
		alias: {
			'@app': '/src/app',
		},
	},
	plugins: [VitePWA({ registerType: 'autoUpdate' })],
})
