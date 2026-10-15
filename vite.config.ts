import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  build: {
    target: 'esnext',
  },
  resolve: {
    alias: {
      '@app': '/src/app',
    },
  },
  lint: {
    ignorePatterns: ['dist/**'],
    rules: {
      'typescript/unbound-method': 'off',
    },
  },
  fmt: {
    semi: true,
    singleQuote: true,
  },
  plugins: [VitePWA({ registerType: 'autoUpdate' })],
});
