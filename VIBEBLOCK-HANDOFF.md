# VibeBlock — Project Handoff
_Last updated: end of Session 3 · Resume at 6:00pm EST_

---

## What Is VibeBlock

**Elevator pitch:** "Lovable, but for Arbitrum."

A hackathon submission for the Arbitrum ecosystem. The core thesis: Arbitrum's "Start Building" CTA sends developers to raw documentation. VibeBlock is what that button should actually do — take anyone from a plain-English idea to a complete, secure, deployed product on Arbitrum without them needing to know what a rollup is.

**The demo story:** User describes a human problem in plain English → VibeBlock generates a complete product (smart contract + frontend plan + live interactive preview + security audit) → crypto infrastructure is entirely invisible to end users. Users see dollars, buttons, and plain English. They never see wallets, gas, chains, or transaction hashes.

**Hackathon goal:** Philip is not trying to win a product prize. He's showing Arbitrum how he thinks so they hire him or award a grant. The sophistication of the ecosystem thinking (Timeboost, LayerZero, Fhenix, Robinhood Chain integration) is the pitch, not the polish.

---

## Files

### `/mnt/user-data/outputs/VibeBlock-v3.jsx`
**1,368 lines. The main app.** Single-file React component. Fully self-contained — no external dependencies beyond Google Fonts and the Anthropic API.

### `/mnt/user-data/outputs/SmartWallet.jsx`
**548 lines. The standalone Smart Wallet demo (called "Flōw").** Premium fintech app aesthetic. Dark navy hero + clean white screens. Fully interactive — real send flow with numpad, animated balance count-up, contact picker, transaction history, request money screen. This is the *real* product demo that needs to replace `WalletPreview` inside VibeBlock-v3.

---

## VibeBlock-v3 Architecture Map

```
VibeBlock-v3.jsx
│
├── DESIGN SYSTEM (line 3)
│   └── T{} — color tokens: bg, surface, text, accent, green, purple, amber, red
│
├── DATA (lines 23–84)
│   ├── DEMOS[] — 4 demo products with id, emoji, title, prompt, color, tech[]
│   └── GEN_STEPS[] — 6 generation animation steps with durations
│
├── AI PROMPTS (lines 85–215)
│   ├── SYSTEM_CONTEXT — full Arbitrum ecosystem knowledge base fed to generation AI
│   └── AUDIT_SYSTEM — security auditor persona for second-pass AI audit
│
├── CORE FUNCTIONS (lines 174–280)
│   ├── generateProduct(prompt, demoId, onStatus) — calls Anthropic API, returns product JSON
│   ├── auditContract(code, name, onStatus) — second-pass AI security audit
│   └── runSlitherPatterns(code) — static pattern analysis (reentrancy, tx.origin, etc.)
│
├── PREVIEW COMPONENTS (lines 282–673)  ← THIS IS WHAT NEEDS REPLACING
│   ├── BotPreview       (line 284)  — animated PnL chart, strategy list, pause button
│   ├── WalletPreview    (line 377)  — PLACEHOLDER, replace with SmartWallet/Flōw
│   ├── GamePreview      (line 454)  — battle screen, character roster, tournaments
│   └── MarketplacePreview (line 573) — item listings, cart, checkout, orders
│
├── OUTPUT SCREEN (line 675)
│   ├── Tab: "🖥 Live Preview" — renders the appropriate XxxPreview component
│   ├── Tab: "📐 Frontend Plan" — pages, features, tech stack, user journey
│   ├── Tab: "📄 Contract" — full Solidity with syntax highlighting + copy
│   ├── Tab: "🔒 Security" — REAL audit dashboard (grade A-D, score/100, findings by severity)
│   └── Tab: "🚀 Launch" — deploy pipeline, Alchemy key input, Dune monitoring, checklist
│
├── GENERATION SCREEN (line 971)
│   └── Runs: 2 pre-steps → AI generateProduct → frontend step → REAL audit (Slither + AI) → deploy prep
│       Each step animates with progress bar. Audit runs two real API calls.
│
└── MAIN APP (line 1111) — VibeBlock()
    ├── stage: "home" | "prompt" | "generate" | "output" | "examples"
    ├── Home: hero with prompt textarea + 4 demo cards
    ├── Prompt: custom prompt entry
    ├── Generate: GenerationScreen with live step animation
    ├── Output: OutputScreen with 5 tabs
    └── Examples: all 4 demos with "Build This" buttons
```

---

## The 4 Demo Products

| ID | Title | Color | Invisible tech | User sees |
|----|-------|-------|----------------|-----------|
| `bot` | ⚡ Trading Bot | #f59e0b amber | Timeboost MEV, Flash loans, Arbitrum DEX routing | PnL dashboard, strategy names, kill switch |
| `wallet` | 💳 Smart Wallet | #12AAFF blue | LayerZero, Account abstraction, Gas abstraction | Balance in dollars, send button |
| `game` | 🎮 Play-to-Earn Game | #a855f7 purple | NFT characters, USDT prize pools, on-chain tournaments | Character cards, dollar prizes, marketplace |
| `marketplace` | 🛍️ P2P Marketplace | #00C805 green | Escrow contract, USDC settlement, dispute resolution | Listings, dollar prices, instant checkout |

---

## Security Audit System (fully built, working)

Two real passes run on every generated contract:

1. **Slither pattern analysis** (`runSlitherPatterns`, line 239) — 8 vulnerability checks + 3 positive pattern checks. Detects: reentrancy without guard, tx.origin auth, unchecked .call() returns, missing zero-address validation, unchecked arithmetic blocks, selfdestruct, timestamp dependence, single-step ownership transfer.

2. **AI second-pass** (`auditContract`, line 217) — sends contract back to Claude with a pure security auditor persona. Finds economic attack vectors, oracle manipulation, flash loan surface area, Arbitrum-specific MEV exposure.

Findings are merged, deduplicated by title, then scored:
- Critical = -30pts, High = -15pts, Medium = -8pts
- Grade A (90+) / B (75+) / C (60+) / D (<60)
- Red "do not deploy to mainnet" banner if critical/high vulns found
- Links to Trail of Bits, Zellic, Cantina for professional audits

Output header badge shows: `🔒 Grade B · 77/100`

---

## Arbitrum Ecosystem Knowledge (in SYSTEM_CONTEXT)

The AI generation prompt includes deep knowledge of:
- **Arbitrum One** — main L2, EVM-compatible, 250ms block time
- **Timeboost MEV** — Express Lane gives 200ms advantage, Kairos operator, sub-100ms auctions
- **Robinhood Chain** — Arbitrum Orbit L2 for tokenized stocks/RWAs, compliance at chain layer
- **LayerZero** — OFT standard, lzSend/lzReceive, 120+ chains, Arbitrum endpoint ID 110
- **Fhenix CoFHE** — FHE encryption, euint32/euint64/ebool types, coprocessor pattern
- **GMX** — $306B volume, GM Pools, composable perpetuals, V2 isolated markets
- **Alchemy** — RPC for Arbitrum Sepolia, arb-sepolia.g.alchemy.com/v2/{key}
- **Dune Analytics** — SQL event monitoring, auto-suggest queries post-deploy
- **Account Abstraction (ERC-4337)** — no seed phrases, social login, gas sponsorship
- **Gas Abstraction / Paymaster** — users never pay gas directly

---

## SmartWallet.jsx ("Flōw") — What It Does

Premium fintech aesthetic. Navy/white. Font: Geist.

**Screens:**
- **Home** — balance animates from $0 to $4,829.14 on load, monthly in/out stats, quick-send contact row, recent activity feed, 4 action buttons (Send, Request, History, Add)
- **Send** — contact picker with search → numpad amount entry with live validation → animated send confirmation → balance updates live + new transaction added to feed
- **Request** — contact picker → numpad → confirmation state
- **History** — all transactions grouped by date (Today / Yesterday / This week). Bottom disclosure: *"All transfers settle via USDC on Arbitrum One and LayerZero. Displayed in USD. No gas fees charged."*

**Key interactions:**
- Send success: full-screen checkmark animation, balance decrements, transaction prepends to list
- Amount over balance: red warning, send button disabled
- Numpad: handles decimals correctly, 2 decimal max

---

## Next Session Build Order

### Priority 1: Wire SmartWallet into VibeBlock
Replace `WalletPreview` (line 377–452 in VibeBlock-v3.jsx) with the full Flōw app.

**How to do it:**
1. Copy everything from SmartWallet.jsx except the `export default` wrapper and the outer `<div style={{ minHeight:"100vh"... }}>` phone-centering shell
2. Rename `export default function SmartWallet()` → `function WalletPreview({ product })`
3. Remove the outermost centering div (keep just the phone shell inner content)
4. The phone shell in SmartWallet already renders at 390px width — it'll embed perfectly in the preview column
5. Remove the Google Fonts `@import` from the inner `<style>` tag since VibeBlock-v3 should handle that at the top level

### Priority 2: Build BotPreview as a real standalone (TradingBot.jsx)
Current `BotPreview` is decent but thin. Upgrade to:
- WebSocket-simulated live trade feed (fake but realistic)
- Candlestick-style chart using recharts or pure SVG
- Strategy cards that show real Arbitrum DEX names (Camelot, Uniswap V3, Balancer)
- Actual kill switch that pauses all tickers
- "Timing Advantage" strategy explicitly references Timeboost — this is the demo moment

### Priority 3: Build standalone P2P Marketplace (Marketplace.jsx)
Most relatable to non-crypto audience. Build as:
- Grid of listings (sneakers, art, collectibles) with real photos via placeholder images
- Full checkout flow: add to cart → confirm → escrow confirmation screen
- Seller dashboard: active listings, pending delivery confirmations, payout history
- "1.5% fee" vs eBay/PayPal comparison callout
- Dispute resolution UI

### Priority 4: Build standalone Game (Game.jsx)
Already the most complete preview in v3. Upgrade:
- Richer battle animation (HP bars animating down, attack flash)
- Character marketplace with real sort/filter
- Tournament bracket visualization
- Earnings history showing dollar amounts

### Priority 5: Final VibeBlock integration + demo polish
- Wire all 4 standalone previews into VibeBlock's `previewMap`
- Add "Open Full Demo →" button on preview tab that pops the standalone app
- Pre-seed button: one click loads the wallet demo prompt and fast-tracks through generation
- 60-second demo flow: intro → demo card → generation animation → output with live preview

---

## Design Language

**VibeBlock shell:** Dark. `#08090c` background. `#12AAFF` accent. `DM Mono` for code/labels, `Syne` for headings, `DM Sans` for body. Grid overlay + scan line animation. Partner badges in nav (Arbitrum, Robinhood Chain, LayerZero, Fhenix).

**SmartWallet/Flōw:** Light. `#F4F6FA` background, `#0A0F1E` navy for dark elements, `#0057FF` blue accent, `#00B07D` green for received. Font: `Geist`. Phone shell: 390px wide, 44px border radius, deep box shadow. Feels like a real iOS app.

**Rule for all demo product UIs:** The product apps should NOT look like VibeBlock. They should look like the real consumer product they represent. Each has its own distinct visual identity.

---

## What Philip Knows / Context

- Philip is a web developer: Next.js, TypeScript, Shopify, Klaviyo
- His wife Jen is a senior PM specializing in Shopify/web dev projects
- He's building Anders — an autonomous AI agent on OpenClaw running on his M4 Mac mini
- VibeBlock is a hackathon submission to show Arbitrum how he thinks, not a sellable product today
- His definition of success: "build wealth and secure generational freedom for my family without public visibility" — no personal brand, no founder story, just results
- He manages two Claude accounts (personal + team) for rate limit workarounds
- He noticed the gap: arbitrum.io "Start Building" button → raw docs. VibeBlock fills that gap.

---

## Open Questions / Decisions Deferred

1. **Deploy button** — currently shows an Alchemy API key input but doesn't actually deploy. Next step: real testnet deploy using Alchemy RPC + ethers.js. Requires user to have an Alchemy key.

2. **Live product URLs** — the vision is that after generation, VibeBlock gives you a real hosted URL for your product. This would require a backend. Out of scope for hackathon but worth mentioning in the pitch.

3. **Fhenix + Robinhood Chain routing** — the generation AI knows about these chains but the preview components don't adapt to them. When a product routes to Robinhood Chain (tokenized assets detected), the preview should have a different visual treatment.

4. **Mobile layout of VibeBlock shell** — currently optimized for desktop/tablet. The product previews (SmartWallet especially) are already mobile-first. The outer VibeBlock chrome needs a responsive pass.

---

## One-Line Pitch to Paste at Session Start

> "Resume building VibeBlock — a 'Lovable for Arbitrum' hackathon demo. Files are in outputs: VibeBlock-v3.jsx (1,368 lines, full app with AI generation + real security audit) and SmartWallet.jsx (548 lines, standalone Flōw wallet demo). First task: replace WalletPreview component (line 377) in VibeBlock-v3 with the full SmartWallet/Flōw app. Then build TradingBot.jsx and Marketplace.jsx as standalone demos and wire them all into VibeBlock's previewMap."
