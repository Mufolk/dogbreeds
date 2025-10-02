import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      globals: true, // allow global test APIs like describe, it, expect
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      // if you use path aliases, ensure they are included here for resolution:
      alias: {
        'vue': 'vue/dist/vue.esm-bundler.js',
      },
      // optionally add coverage or other settings here
    },
  }),
)