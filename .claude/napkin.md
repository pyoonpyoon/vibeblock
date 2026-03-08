# VibeBlock — Napkin
_Project memory for Claude Code. Updated continuously._

## What This Project Is
VibeBlock — "Lovable for Arbitrum." Arbitrum hackathon submission.
Takes a plain-English idea → generates complete product (smart contract + frontend + security audit).
Crypto is invisible to end users. They see dollars and buttons, never wallets or gas.

## Key Files
- `VibeBlock-demo.jsx` — ~3,700 lines. THE main demo app. Single-file React. All UI lives here.
- `VibeBlock-pitch.jsx` — 11-slide pitch deck. React single-file. Keyboard nav (arrows/space).
- `VibeBlock-v3.jsx` — older version, mostly superseded by demo.jsx
- `preview/` — Vite app that imports VibeBlock-demo.jsx. This is what deploys to Vercel.
- `preview/public/` — static assets (screenshots, etc.)
- `vercel.json` — `buildCommand: "cd preview && npm install && npm run build"`, `outputDirectory: "preview/dist"`

## Deployment
- GitHub: github.com/pyoonpyoon/vibeblock
- Vercel: vibeblock.vercel.app (auto-deploys from main)
- Arbitrum Sepolia contracts deployed via DeployPanel in demo

## Color Palette (Arbitrum Blue — use everywhere)
- Backgrounds: `#000000`
- Borders: `#1e2d4a`
- Muted text: `#375280`
- Accent: `#12AAFF`
- Status bar: `#1B6FE4`
- Green: `#00C805` (success/positive)
- DO NOT use old green terminal colors: `#080c08`, `#1a2e1a`, `#3a5a3a`, `#00C805` for chrome

## Pitch Deck — 11 slides in order
1. Cover — "Build anything. Runs everywhere."
2. SlideWaveHook — "A new kind of builder is waking up"
3. SlideAIStats — 500M AI users bar chart + wave table
4. Slide5 — "Why VibeBlock?" (vs Claude Code/Codex — intentionally before problem/solution)
5. Slide2 — "The Problem" (browser frames showing the wall)
6. Slide3 — "The Solution" (3-step cards + light-mode screenshot + corner brackets)
7. Slide4 — "The Real Opportunity" (invisible blockchain)
8. Slide6 — "Built for Both" (GUI + CLI)
9. Slide7 — "Technical Depth" (stack table)
10. SlidePartners — ZeroDev featured + 5 partners grid
11. SlideRoadmap — 4-phase roadmap

**Slide ordering is intentional** — "Why VibeBlock?" before problem/solution answers "why not just use Claude Code?" objection first. Do NOT reorder.

## VibeBlock-demo.jsx Architecture
- `DEMOS` array — 4 products: bot, escrow, game, marketplace
- `T` / `DARK_T` / `LIGHT_T` — theme tokens, reassigned via `Object.assign(T, ...)`
- `CliPanel` — VS Code-style terminal. Props: `onClose`, `panelHeight`, `setPanelHeight`, `sidebarOpen`
  - Activity bar (4 icons), panel tabs, action toolbar with functional dropdowns
  - Drag-to-resize: top border (panel height), left sidebar border (sidebar width)
  - `panelHeight` state lives in parent `VibeBlock`, not inside CliPanel
  - Terminal left edge: `left: sidebarOpen ? 272 : 0` with transition
- `AppSidebar` — slide-out left sidebar (272px). Props: `open`, `onClose`, `onNewChat`, `onProject`
  - Sections: Recent chats, Projects (4 DEMOS), Folders
  - User footer: pyoonpyoon / Arbitrum Hackathon
- `VibeBlock` (main) — state: `stage`, `prompt`, `demoId`, `product`, `darkMode`, `cliOpen`, `panelHeight`, `sidebarOpen`
- Model dropdown in CliPanel opens DOWNWARD (top: calc(100%+6px)) — overflow:hidden parent clips upward

## Vite / Build Notes
- `resolve: { dedupe: ["react","react-dom"] }` in vite.config.js — required so files outside preview/ can resolve React
- Screenshot tool: puppeteer installed in preview/ — use Chrome at `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`

## Pitch Angle
"Arbitrum Everywhere" — Arbitrum is the engine, LayerZero onramps any chain, ERC-4337 removes wallets, Paymaster removes gas.
Hero: "Build anything. / Runs everywhere."
Badge: "BUILD ANYTHING · RUNS EVERYWHERE · NOBODY SEES THE BLOCKCHAIN"

## What Has Worked
- Single-file React artifacts — keep everything in one file until told otherwise
- Dark terminal aesthetic for VibeBlock shell, light mode for consumer product demos
- CSS grid (not flexbox) for layouts where text needs to span both columns at specific row positions
- Corner bracket decoration: 4 absolute divs with partial borders at each corner, zIndex 2, offset -6px
- Screenshot via puppeteer headless Chrome: toggle light mode by clicking button with title containing "light"

## Mistakes To Avoid
- Don't use purple gradients on white — already called out as generic
- Don't use Inter/Roboto/Arial/Space Grotesk — use distinctive fonts (Syne, DM Mono, DM Sans, Geist)
- Don't break JSX with stray closing braces
- Don't assume audit uses product.security[] — it uses product.auditFindings[]
- Don't put model dropdown opening upward inside overflow:hidden parent — it gets clipped
- Old green terminal colors (#080c08, #1a2e1a) are gone — always use Arbitrum blue palette

## Philip's Preferences
- Concise communication, no fluff
- Single-file outputs unless explicitly asked otherwise
- Light mode for consumer product UIs, dark mode for developer/infra tools
- Every product demo must feel like a real consumer app, not a crypto app
- Pitch slide ordering is deliberate — check before suggesting reorders
