import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

// Resolves @zerodev/*, viem*, permissionless from preview/node_modules
// even when imported from files outside the preview/ root.
const resolvePreviewModules = () => ({
  name: 'resolve-preview-modules',
  enforce: 'pre',
  resolveId(id) {
    if (
      id.startsWith('@zerodev/') ||
      id === 'viem' || id.startsWith('viem/') ||
      id === 'permissionless' || id.startsWith('permissionless/')
    ) {
      try { return require.resolve(id) } catch { return null }
    }
  },
})

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), resolvePreviewModules()],
    resolve: { dedupe: ["react", "react-dom"] },
    server: {
      proxy: {
        '/v1': {
          target: 'https://api.anthropic.com',
          changeOrigin: true,
          rewrite: path => path,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('x-api-key', env.ANTHROPIC_API_KEY || '')
              proxyReq.setHeader('anthropic-version', '2023-06-01')
            })
          },
        },
      },
    },
  }
})
