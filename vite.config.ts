import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    build: {
        target: 'esnext'
    },
    plugins: [
        VitePWA({ registerType: 'autoUpdate' })
    ]
})