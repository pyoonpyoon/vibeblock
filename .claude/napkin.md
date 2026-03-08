# VibeBlock — Napkin
_Project memory for Claude Code. Updated continuously._

## What This Project Is
VibeBlock — "Lovable for Arbitrum." A hackathon submission showing Arbitrum how Philip thinks.
Takes a plain-English idea → generates complete product (smart contract + frontend + security audit).
Crypto is invisible to end users. They see dollars and buttons, never wallets or gas.

## Files
- `VibeBlock-v3.jsx` — ~1,900 lines now. Main app. Single-file React. DO NOT break into multiple files yet.
- `SmartWallet.jsx` — 548 lines. Standalone "Flōw" wallet demo. NOW WIRED INTO v3 as WalletPreview.
- `VIBEBLOCK-HANDOFF.md` — Full project context. Read this first before touching anything.

## Pitch Angle
"Arbitrum Everywhere" — build anything, runs everywhere, nobody sees the blockchain. Arbitrum is the engine, LayerZero is the onramp from any chain. ERC-4337 removes wallets. Paymaster removes gas. Users just have an app.
Hero: "Build anything. / Runs everywhere."
Badge: "BUILD ANYTHING · RUNS EVERYWHERE · NOBODY SEES THE BLOCKCHAIN"

## ethskills enrichment (all done):
1. ✅ Addresses — real protocol addresses embedded (Aave V3, Camelot, Uniswap V3, GMX, LZ, EntryPoint)
2. ✅ Security — runSlitherPatterns expanded from 8→16 checks + 3→5 positive patterns; AUDIT_SYSTEM prompt enriched with full vulnerability taxonomy
3. ✅ building-blocks — SYSTEM_CONTEXT enriched: Uniswap V4 hooks, ERC-4626 vaults, Aave flash loans (0.05%), GMX V2 GM pools, Pendle PT/YT, Stylus (Rust), composability patterns; all 4 product types updated with richer DeFi lego suggestions
4. ✅ audit/ — evm-audit-master routing table + chain-specific checklist applied: SLI-017 (block.number L1 vs L2) + SLI-018 (Chainlink sequencer uptime) added to runSlitherPatterns; AUDIT_SYSTEM ARBITRUM-SPECIFIC section expanded with 10 specific checklist items (aliasing, retryable tickets, sequencer downtime, minAnswer/maxAnswer, Orbit fee decimals, L2→L1 7-day delay)

## Option 1 Deploy — DONE
- 4 contracts compiled with Foundry (Solc 0.8.24) in `contracts/`
- Bytecode + constructor ABIs embedded in `VibeBlock-demo.jsx` as `DEPLOY_DATA`
- `DeployPanel` component: Connect MetaMask → Switch to Arbitrum Sepolia (421614) → Sign deploy tx → Arbiscan link
- ethers.js dynamically imported (`await import("ethers")`) on first connect
- `npm install ethers` done in `preview/`
- Constructor arg addresses: USDC = 0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d, LZ endpoint = 0x6098e96a28E02f27B1e6BD381f870F1C8Cbccfa1, EntryPoint = 0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789; game oracle = deployer address

## Completed
- SmartWallet.jsx → WalletPreview (phone shell, Flōw app)
- TradingBot.jsx → BotPreview (dashboard card: candlestick chart + live feed + strategy detail)
  - Trading bot form factor: dashboard card (NOT phone shell)
  - Timeboost callout lives in strategy detail expandable panel
- Marketplace.jsx → MarketplacePreview (phone shell, Tradeport)
  - Screens: browse grid → item detail → escrow checkout → sell flow → orders/activity
  - Fee comparison table: Tradeport 1.5% vs eBay 12.9% vs StockX 9–10%
  - Keyframes prefixed mp_ and registered in v3 global style tag
- Game.jsx → GamePreview (phone shell, Brain Blast — survivor.io style)
  - GmBrain (pink SVG cartoon brain), GmWorm (green segmented enemy), GmField (animated battlefield)
  - Screens: game (battlefield + HP/XP bars) | shop (5 power-ups) | leaderboard (prize payouts in USD)
  - Payment sheet: Apple Pay / Google Pay / Connect Wallet — purchases in USDT displayed as USD
  - Fine print: "All purchases processed in USDT on Arbitrum One. Displayed in USD. No gas fees."
  - Keyframes gm_pulse + gm_blast added to v3 global style tag

## What Has Worked
- Single-file React artifacts — keep everything in one file until told otherwise
- Dark terminal aesthetic for VibeBlock shell, each product demo has its own distinct visual identity
- AI generation → Slither patterns + AI second-pass audit runs on every contract

## Mistakes To Avoid
- Don't use purple gradients on white — already called out as generic
- Don't use Inter/Roboto/Arial/Space Grotesk — use distinctive fonts
- Don't break the JSX with stray closing braces — caused a syntax error in v3 previously
- Don't assume the audit uses product.security[] — it uses product.auditFindings[]

## Philip's Preferences
- Concise communication, no fluff
- Single-file outputs unless explicitly asked otherwise
- Light mode for consumer product UIs, dark mode for developer/infra tools
- Every product demo must feel like a real consumer app, not a crypto app
