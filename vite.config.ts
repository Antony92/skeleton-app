import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig, type PluginOption } from 'vite-plus';

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
    options: {
      typeAware: true,
      typeCheck: true,
    },
    ignorePatterns: ['dist/**'],
    rules: {
      'typescript/unbound-method': 'off',
    },
  },
  fmt: {
    semi: true,
    singleQuote: true,
  },
  plugins: [VitePWA({ registerType: 'autoUpdate' })] as PluginOption[],
});
