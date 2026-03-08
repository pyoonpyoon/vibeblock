// Rewrites fetch calls targeting api.anthropic.com to go through Vite's local proxy instead.
// This avoids CORS and lets vite.config.js inject the API key server-side.
const _fetch = window.fetch.bind(window)
window.fetch = (input, init) => {
  const url = typeof input === 'string' ? input : input instanceof Request ? input.url : String(input)
  if (url.startsWith('https://api.anthropic.com')) {
    const proxied = url.replace('https://api.anthropic.com', '')
    const headers = new Headers(init?.headers || (input instanceof Request ? input.headers : {}))
    // Strip any existing auth headers — proxy injects them
    headers.delete('x-api-key')
    headers.delete('anthropic-version')
    headers.delete('anthropic-dangerous-direct-browser-access')
    return _fetch(proxied, { ...init, headers })
  }
  return _fetch(input, init)
}
