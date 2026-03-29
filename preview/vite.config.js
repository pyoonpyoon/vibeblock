import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Virtual module that re-exports ZeroDev/viem from preview/node_modules.
// Because the virtual module is resolved by Vite in the preview/ project root,
// all sub-imports use the correct ESM entry points — no CJS/ESM mismatch.
const VIRTUAL_ID = 'virtual:zerodev'
const RESOLVED_ID = '\0' + VIRTUAL_ID

const virtualZeroDev = () => ({
  name: 'virtual-zerodev',
  resolveId(id) {
    if (id === VIRTUAL_ID) return RESOLVED_ID
  },
  load(id) {
    if (id === RESOLVED_ID) {
      return `
        export { createKernelAccount, createKernelAccountClient, createZeroDevPaymasterClient } from '@zerodev/sdk';
        export { KERNEL_V3_1 } from '@zerodev/sdk/constants';
        export { toPasskeyValidator, toWebAuthnKey, WebAuthnMode } from '@zerodev/passkey-validator';
        export { http, createPublicClient } from 'viem';
        export { arbitrumSepolia } from 'viem/chains';
      `
    }
  },
})

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), virtualZeroDev()],
    resolve: {
      dedupe: ["react", "react-dom", "viem"],
      alias: { events: "events" },  // browser-compatible EventEmitter polyfill
    },
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
