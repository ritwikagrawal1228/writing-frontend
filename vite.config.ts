import * as path from 'path'

import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// // https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    // vite config
    server: {
      host: 'localhost',
      port: 3000,
      proxy: {
        '/query': {
          target: `${env.VITE_API_SERVER_URI}`,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/query/, ''),
        },
      },
      cors: false,
    },
    plugins: [react(), htmlPlugin(loadEnv(mode, '.'))],
    resolve: {
      alias: [
        { find: '@/', replacement: path.join(__dirname, 'src/') },
        { find: './runtimeConfig', replacement: './runtimeConfig.browser' },
      ],
    },
    esbuild: {
      logOverride: { 'this-is-undefined-in-esm': 'silent' },
    },
    define: {
      global: {},
    },
  }
})

/**
 * Replace env variables in index.html
 * @see https://github.com/vitejs/vite/issues/3105#issuecomment-939703781
 * @example `%VITE_MY_ENV%`
 * @see https://vitejs.dev/guide/api-plugin.html#transformindexhtml
 */
function htmlPlugin(env: ReturnType<typeof loadEnv>) {
  return {
    name: 'html-transform',
    transformIndexHtml: {
      enforce: 'pre' as const,
      transform: (html: string): string =>
        html.replace(/%(.*?)%/g, (match, p1) => env[p1] ?? match),
    },
  }
}
