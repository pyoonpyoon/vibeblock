import { useState, useEffect, useRef } from "react";

// ─── DESIGN SYSTEM ────────────────────────────────────────────────────────────
const DARK_T = {
  bg: "#08090c", surface: "#0e1117", surfaceHover: "#13161f",
  border: "rgba(255,255,255,0.07)", borderHover: "rgba(255,255,255,0.14)",
  text: "#f0f2f7", textMuted: "rgba(240,242,247,0.45)", textDim: "rgba(240,242,247,0.22)",
  accent: "#12AAFF", accentGlow: "rgba(18,170,255,0.15)", accentBorder: "rgba(18,170,255,0.35)",
  green: "#00C805", purple: "#a855f7", amber: "#f59e0b", red: "#ef4444",
  grid: "rgba(18,170,255,0.025)", navBg: "rgba(8,9,12,0.85)", isDark: true,
};
const LIGHT_T = {
  bg: "#F2F4F8", surface: "#FFFFFF", surfaceHover: "#ECEEF3",
  border: "rgba(0,0,0,0.08)", borderHover: "rgba(0,0,0,0.15)",
  text: "#0A0F1E", textMuted: "rgba(10,15,30,0.65)", textDim: "rgba(10,15,30,0.45)",
  accent: "#0090E0", accentGlow: "rgba(0,144,224,0.08)", accentBorder: "rgba(0,144,224,0.22)",
  green: "#00A843", purple: "#7C3AED", amber: "#1B3270", red: "#DC2626",
  grid: "rgba(0,0,0,0.04)", navBg: "rgba(242,244,248,0.92)", isDark: false,
};
const T = { ...DARK_T };

// ─── 4 DEMO PRODUCTS ──────────────────────────────────────────────────────────
const DEMOS = [
  {
    id: "bot",
    emoji: "⚡",
    title: "Trading Bot",
    tagline: "Runs 24/7. Withdraws to any chain you're already on.",
    prompt: "I want a bot that automatically trades crypto to make me the most money possible, runs 24/7, and beats everyone else to the best trades",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.12)",
    tech: ["Timeboost MEV", "Flash Loans", "Omnichain Withdrawals"],
    userSees: "A dashboard showing profits, strategies, and one kill switch",
    neverSees: "MEV, mempool, Express Lane, bridge, gas, sandwich detection",
  },
  {
    id: "escrow",
    emoji: "🤝",
    title: "Freelancer Escrow",
    tagline: "Get paid on delivery. No middlemen. No waiting.",
    prompt: "I want a platform where freelancers and clients agree on project milestones, lock payment upfront, and release funds automatically when work is delivered — no PayPal holds, no Upwork fees, no bank delays",
    color: "#0EA5E9",
    glow: "rgba(14,165,233,0.12)",
    tech: ["ZeroDev Session Keys", "Milestone Escrow", "Instant USDC"],
    userSees: "Milestone checklist, a request payment button, instant USDC payout",
    neverSees: "Smart contracts, gas, wallets, USDC, chains, session keys",
  },
  {
    id: "game",
    emoji: "🎮",
    title: "Play-to-Earn Game",
    tagline: "Play on your phone. Win real prizes. Pay from anywhere.",
    prompt: "I want to build a mobile game where players collect and battle characters, earn real money when they win tournaments, and can sell their characters to other players",
    color: "#a855f7",
    glow: "rgba(168,85,247,0.12)",
    tech: ["Omnichain Payments", "Prize Pools", "Apple Pay / Google Pay"],
    userSees: "$12.50 prize, character cards, Apple Pay checkout",
    neverSees: "NFTs, USDT, chains, wallet addresses, gas, smart contracts",
  },
  {
    id: "marketplace",
    emoji: "🛍️",
    title: "P2P Marketplace",
    tagline: "Sell anything. Buyers pay from any app, any chain.",
    prompt: "I want to build a marketplace where people can buy and sell physical items — sneakers, art, collectibles — with no chargebacks, no PayPal holds, and no 20% platform fees",
    color: "#00C805",
    glow: "rgba(0,200,5,0.12)",
    tech: ["Omnichain Checkout", "Escrow Contract", "Instant Payout"],
    userSees: "Listings in dollars, a checkout button, instant payout",
    neverSees: "USDC, escrow, chains, wallets, bridges, smart contracts",
  },
];

// ─── GEN STEPS ────────────────────────────────────────────────────────────────
const GEN_STEPS = [
  { label: "Understanding your idea",           dur: 700  },
  { label: "Designing the product architecture", dur: 900  },
  { label: "Writing smart contracts",            dur: 0    }, // AI call
  { label: "Building the frontend",             dur: 1100 },
  { label: "Running security audit",            dur: 1300 },
  { label: "Preparing deployment",              dur: 700  },
];

// ─── ARBITRUM / ECOSYSTEM CONTEXT ─────────────────────────────────────────────
const SYSTEM_CONTEXT = `You are VibeBlock — an AI that turns ideas into complete, deployed products on Arbitrum. You generate everything needed for a real product: smart contracts, frontend scaffold, and a product preview.

CORE PHILOSOPHY:
- The user describes a human problem. You build the complete product.
- Crypto infrastructure is INVISIBLE. Users see dollars, not USDC. They see "send," not "bridge." They see a balance, not a wallet address.
- You are building for the NEXT BILLION USERS — people who have never touched a blockchain.

ECOSYSTEM KNOWLEDGE:
- Arbitrum One: Main L2 Rollup. EVM-compatible. 250ms block time.
- Timeboost MEV: Express Lane gives 200ms advantage for time-sensitive trades. Critical for MEV bots. Kairos operator runs sub-auctions every 100ms.
- Robinhood Chain: Arbitrum Orbit L2 for tokenized stocks/RWAs. Compliance at chain layer — no KYC code needed.
- LayerZero: Omnichain messaging. OFT standard for cross-chain tokens. lzSend/lzReceive pattern. 120+ chains.
- Fhenix CoFHE: FHE encryption for private contracts. euint32/euint64/ebool types. One line to encrypt state.
- GMX: Dominant perp DEX on Arbitrum. GM Pools for liquidity. $306B lifetime volume. Composable.
- Alchemy: RPC for Arbitrum Sepolia testnet. arb-sepolia.g.alchemy.com/v2/{key}
- Dune Analytics: SQL queries against on-chain events. Auto-generate contract monitoring dashboards.
- Account Abstraction (ERC-4337): No seed phrases. Social login. Gas sponsorship. Users never see gas.
- Gas Abstraction: Paymaster contracts cover gas. Users never pay gas directly.
- USDC/USDT → display as "$". Never show stablecoin names to end users.

PRODUCT TYPES:

MEV TRADING BOT:
- Timeboost Express Lane integration (Arbitrum-specific advantage)
- Flash loan arbitrage across Arbitrum DEXes (Camelot, Uniswap V3, Balancer)
- Sandwich detection and protection
- Auto-compounding profit strategy
- Dashboard: PnL chart, active strategies, kill switch, ROI percentage
- User sees: profit in dollars, strategy names in plain English, one button to pause

OMNICHAIN WALLET:
- LayerZero OFT routing — auto-detects cheapest/fastest path
- Account abstraction — no seed phrase, social login
- Gas abstraction — paymaster covers all fees
- All balances shown in USD equivalent
- Send to phone number or email (resolves to address via ENS/resolver)
- User sees: a balance, a send button, transaction history in plain English

PLAY-TO-EARN GAME:
- NFT characters with on-chain stats (displayed as game attributes, not "NFT")
- Tournament contracts with USDT prize pools (displayed as "$")
- Marketplace where character prices show in dollars
- Auto-settlement when tournament ends
- User sees: character cards, dollar prizes, a marketplace. Zero crypto terms.

P2P MARKETPLACE:
- Escrow contract: buyer deposits, funds release on delivery confirmation
- USDC settlement displayed as dollars throughout
- Dispute resolution: 3-of-5 arbitrator vote if disputed
- NFT-based provenance for high-value items
- 1.5% platform fee vs eBay 13% + PayPal 3%
- User sees: listings, dollar prices, checkout, seller gets paid instantly

SECURITY — ALWAYS INCLUDE:
- ReentrancyGuard on all fund-moving functions
- AccessControl for admin operations
- Slippage protection for DEX interactions
- Oracle manipulation protection
- Flash loan attack vectors addressed

RESPONSE FORMAT — return ONLY valid JSON:
{
  "productName": "...",
  "tagline": "one line, no crypto jargon",
  "productType": "bot" | "wallet" | "game" | "marketplace",
  "contract": {
    "name": "FileName.sol",
    "code": "full solidity contract, 80-160 lines, real and complete",
    "summary": "plain English, no jargon"
  },
  "frontend": {
    "pages": ["Home", "Dashboard", "..."],
    "keyFeatures": ["Feature in plain English", "..."],
    "techStack": "Next.js 14, Tailwind, wagmi, ethers.js",
    "userFlowSummary": "plain English user journey"
  },
  "security": [
    { "check": "...", "status": "pass"|"warn"|"fail", "note": "..." }
  ],
  "invisibleTech": ["what user never sees or knows about"],
  "visibleUX": ["what user actually experiences"],
  "chainExplanation": "why this chain/tech stack is perfect for this product",
  "deployTarget": "Arbitrum One" | "Robinhood Chain" | "Arbitrum + LayerZero",
  "estimatedLaunchTime": "e.g. 2 weeks to mainnet",
  "revenueModel": "how this product makes money",
  "duneQuery": "plain English description of what to monitor on-chain"
}`;

// ─── DEMO MODE — NO API KEY REQUIRED ──────────────────────────────────────────
let _fakeDemoType = "wallet";
function _detectType(p) {
  p = (p || "").toLowerCase();
  if (/bot|trad|arb|mev|swap|yield|defi/.test(p)) return "bot";
  if (/game|play|earn|nft|character|tournament|battle/.test(p)) return "game";
  if (/market|sell|buy|shop|escrow|p2p|list/.test(p)) return "marketplace";
  return "wallet";
}

const FAKE_PRODUCTS = {
  bot: {
    productName: "Apex Trading Bot",
    tagline: "Set it up once. Profits withdraw to any chain you're already on.",
    productType: "bot",
    deployTarget: "Arbitrum One",
    estimatedLaunchTime: "3 days to mainnet",
    revenueModel: "0.5% performance fee on profits above the high-water mark. No fee on losing months.",
    chainExplanation: "Arbitrum's Timeboost Express Lane gives the bot a 200ms execution edge — no other network offers this. Profits accumulate on Arbitrum, but LayerZero OFT lets users withdraw to ETH mainnet, Base, Polygon, or wherever their money already lives. The user never touches a bridge.",
    duneQuery: "Track executeArbitrage events, chart totalProfitUSDC over time, alert if executedTrades stalls 5+ minutes",
    visibleUX: [
      "Live P&L dashboard updating in real time",
      "One-click kill switch to pause all trading instantly",
      "Strategy breakdown: earnings per approach, win rate",
      "Withdraw profits to any chain — one tap, no bridging UI",
    ],
    invisibleTech: [
      "Timeboost Express Lane — 200ms execution edge, Arbitrum-exclusive",
      "Aave V3 flash loans — capital-efficient arb, 0.05% fee",
      "Camelot, Uniswap V3, GMX DEX routing",
      "LayerZero OFT — omnichain profit withdrawal to any chain",
      "Slippage protection + MEV sandwich detection on every swap",
    ],
    frontend: {
      pages: ["Dashboard", "Strategy Config", "Trade History", "Withdraw Profits", "Settings"],
      keyFeatures: [
        "Live PnL chart updating every 1.4 seconds",
        "Per-strategy breakdown with win rate and daily earnings",
        "Kill switch that immediately halts all active trades",
        "Trade history with Timeboost vs standard execution tags",
        "One-click profit withdrawal to any wallet address",
      ],
      techStack: "Next.js 14, Tailwind CSS, wagmi v2, ethers.js, Recharts",
      userFlowSummary: "User connects wallet → sets capital allocation and minimum profit threshold → activates bot → watches live P&L → withdraws profits at any time. No trading knowledge required.",
    },
    contract: {
      name: "ApexTradingBot.sol",
      code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ITimeboostExpressLane {
    function submitBid(uint256 bidAmount) external payable;
}
interface IAaveFlashLoan {
    function flashLoanSimple(
        address receiver, address asset, uint256 amount,
        bytes calldata params, uint16 ref
    ) external;
}

/// @title ApexTradingBot — Timeboost MEV arbitrage on Arbitrum One
contract ApexTradingBot is Ownable, ReentrancyGuard {
    ITimeboostExpressLane public immutable expressLane;
    IAaveFlashLoan        public immutable aaveLender;
    IERC20                public immutable usdc;

    uint256 public totalProfitUSDC;
    uint256 public executedTrades;
    uint256 public lastTradeAt;
    bool    public isRunning    = true;
    uint256 public minSpreadBps = 15; // 0.15% minimum

    mapping(address => bool) public approvedDEXes;

    event TradeExecuted(address indexed dex, uint256 profit, bool timeboostUsed);
    event RunningToggled(bool newState);

    modifier onlyRunning() { require(isRunning, "Bot paused"); _; }

    constructor(
        address _expressLane, address _aave, address _usdc
    ) Ownable(msg.sender) {
        require(
            _expressLane != address(0) && _aave != address(0) && _usdc != address(0),
            "Zero address"
        );
        expressLane = ITimeboostExpressLane(_expressLane);
        aaveLender  = IAaveFlashLoan(_aave);
        usdc        = IERC20(_usdc);
    }

    /// @notice Execute cross-DEX arbitrage, optionally via Timeboost Express Lane
    function executeArbitrage(
        address dexA, address dexB,
        uint256 amountIn, uint256 minAmountOut,
        bool    useTimeboost
    ) external onlyOwner onlyRunning nonReentrant {
        require(approvedDEXes[dexA] && approvedDEXes[dexB], "Unapproved DEX");
        require(amountIn > 0 && minAmountOut > amountIn, "Invalid amounts");

        if (useTimeboost) expressLane.submitBid{value: 2e14}(2e14);

        uint256 snapshot = usdc.balanceOf(address(this));
        aaveLender.flashLoanSimple(
            address(this), address(usdc), amountIn,
            abi.encode(dexA, dexB, minAmountOut), 0
        );

        uint256 profit = usdc.balanceOf(address(this)) - snapshot;
        require((profit * 10000) / amountIn >= minSpreadBps, "Spread too thin");

        totalProfitUSDC += profit;
        executedTrades++;
        lastTradeAt = block.timestamp;
        emit TradeExecuted(dexA, profit, useTimeboost);
    }

    /// @dev Aave flash loan callback
    function executeOperation(
        address asset, uint256 amount, uint256 premium, address, bytes calldata
    ) external nonReentrant returns (bool) {
        require(msg.sender == address(aaveLender), "Only Aave");
        IERC20(asset).approve(address(aaveLender), amount + premium);
        return true;
    }

    function setRunning(bool v)                  external onlyOwner { isRunning = v; emit RunningToggled(v); }
    function approveDEX(address dex, bool ok)    external onlyOwner { require(dex != address(0), "Zero address"); approvedDEXes[dex] = ok; }
    function setMinSpreadBps(uint256 bps)        external onlyOwner { require(bps >= 5, "Too low"); minSpreadBps = bps; }
    function withdrawProfit(address to, uint256 a) external onlyOwner nonReentrant {
        require(to != address(0), "Zero address");
        require(usdc.balanceOf(address(this)) >= a, "Low balance");
        usdc.transfer(to, a);
    }
    receive() external payable {}
}`,
      summary: "Flash loan arbitrage contract integrating Arbitrum's Timeboost Express Lane for a 200ms execution edge. Profits custody in USDC on-chain and are withdrawable at any time. ReentrancyGuard and onlyOwner protect all fund-moving functions.",
    },
  },

  escrow: {
    productName: "Scope",
    tagline: "Get paid on delivery. No middlemen. No bank delays.",
    productType: "escrow",
    deployTarget: "Arbitrum One",
    estimatedLaunchTime: "3 days to mainnet",
    revenueModel: "0% platform fee at launch. Optional 0.5% on disputed resolutions post-launch.",
    chainExplanation: "Client deposits USDC into a smart contract escrow. ZeroDev session keys let the client pre-approve milestone releases — when the freelancer submits work, the client's session key releases payment instantly with zero gas friction. No middleman, no hold period, no bank. Works for anyone with a phone.",
    duneQuery: "Track MilestoneReleased events, monitor average time-to-release per project, alert if disputed milestone ratio exceeds 5%",
    visibleUX: [
      "Milestones shown as a checklist — submit work, request payment",
      "Client approves with one tap — no wallet popup, no gas prompt",
      "Freelancer receives USDC instantly — displayed as dollars",
      "Session key dashboard: client can see and revoke permissions any time",
    ],
    invisibleTech: [
      "ZeroDev Kernel session keys — client pre-approves milestone releases",
      "Arbitrum One escrow contract — funds held on-chain, not by a company",
      "Paymaster sponsors 100% of gas — neither party ever pays gas",
      "USDC settlement — stable, instant, global, no exchange rate risk",
      "ERC-7579 modular account — extend with dispute resolution plugins",
    ],
    frontend: {
      pages: ["Dashboard / Projects", "Project Detail / Milestones", "Submit Milestone", "Payment History", "Session Key Manager"],
      keyFeatures: [
        "Milestone progress tracker with status badges",
        "One-tap payment release for clients via session key",
        "Real-time payout confirmation with gas fee display ($0.00)",
        "Session key manager: view, revoke, set spend limits",
        "Fee comparison: Scope 0% vs Upwork 20% vs PayPal 3.5%",
      ],
      techStack: "Next.js 14, Tailwind CSS, ZeroDev SDK, viem, Arbitrum One",
      userFlowSummary: "Client creates project → deposits USDC into escrow → grants session key to approve milestones → freelancer completes work → submits milestone → session key auto-releases payment → freelancer receives USDC instantly. No gas. No delay. No Upwork.",
    },
    contract: {
      name: "ScopeEscrow.sol",
      code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title ScopeEscrow — Milestone escrow with ZeroDev session key approvals
contract ScopeEscrow is Ownable, ReentrancyGuard {
    IERC20 public immutable usdc;

    enum Status { Pending, Funded, Released, Disputed }

    struct Milestone {
        string  description;
        uint256 amount;
        address freelancer;
        address client;
        Status  status;
        uint256 deadline;
    }

    mapping(uint256 => Milestone) public milestones;
    mapping(address => bool)      public sessionKeys;
    uint256 public milestoneCount;

    event MilestoneCreated(uint256 indexed id, address client, address freelancer, uint256 amount);
    event MilestoneReleased(uint256 indexed id, uint256 amount, bool viaSessionKey);
    event DisputeRaised(uint256 indexed id);
    event SessionKeyUpdated(address indexed key, bool active);

    constructor(address _usdc) Ownable(msg.sender) {
        require(_usdc != address(0), "Zero address");
        usdc = IERC20(_usdc);
    }

    function createMilestone(
        string calldata description,
        address freelancer,
        uint256 amount,
        uint256 deadline
    ) external returns (uint256 id) {
        require(freelancer != address(0) && freelancer != msg.sender, "Invalid freelancer");
        require(amount > 0, "Zero amount");
        require(deadline > block.timestamp, "Invalid deadline");
        require(usdc.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        id = milestoneCount++;
        milestones[id] = Milestone(description, amount, freelancer, msg.sender, Status.Funded, deadline);
        emit MilestoneCreated(id, msg.sender, freelancer, amount);
    }

    function releaseMilestone(uint256 id) external nonReentrant {
        Milestone storage m = milestones[id];
        require(m.status == Status.Funded, "Not funded");
        require(msg.sender == m.client || sessionKeys[msg.sender], "Unauthorized");
        m.status = Status.Released;
        require(usdc.transfer(m.freelancer, m.amount), "Transfer failed");
        emit MilestoneReleased(id, m.amount, sessionKeys[msg.sender]);
    }

    function raiseDispute(uint256 id) external {
        Milestone storage m = milestones[id];
        require(msg.sender == m.client || msg.sender == m.freelancer, "Unauthorized");
        require(m.status == Status.Funded, "Not funded");
        m.status = Status.Disputed;
        emit DisputeRaised(id);
    }

    function setSessionKey(address key, bool active) external {
        require(
            msg.sender == owner() || sessionKeys[msg.sender],
            "Unauthorized"
        );
        require(key != address(0), "Zero address");
        sessionKeys[key] = active;
        emit SessionKeyUpdated(key, active);
    }
}`,
      summary: "Milestone-based escrow contract with ZeroDev session key integration. Clients deposit USDC upfront; session keys allow pre-authorized milestone releases with zero gas friction. Dispute mechanism included. Platform fee is zero at launch.",
    },
  },

  game: {
    productName: "Brain Blast",
    tagline: "Play on your phone. Win real prizes. Pay from wherever you are.",
    productType: "game",
    deployTarget: "Arbitrum One",
    estimatedLaunchTime: "1 week to mainnet",
    revenueModel: "1.5% platform fee on tournament prize pools. In-app power-up sales. Character minting fee ($5 per brain).",
    chainExplanation: "Players pay with Apple Pay, Google Pay, ETH from mainnet, SOL, MATIC — anything. LayerZero converts it all to USDT on Arbitrum in one step. Characters are NFTs but look like Pokemon cards. Prize pools settle automatically when the tournament ends. No one needs a wallet or a bridge.",
    duneQuery: "Monitor TournamentSettled events, track prize pool volume over time, chart daily mintCharacter calls",
    visibleUX: [
      "Download and play — no wallet, no signup friction",
      "Characters shown as cartoon brains, not NFTs",
      "Pay for power-ups with Apple Pay, Google Pay, or any crypto",
      "Win prizes shown as dollars — paid out automatically",
    ],
    invisibleTech: [
      "LayerZero OFT — accept payment from any chain, any asset",
      "ERC-721 NFT characters with verifiable on-chain stats",
      "Chainlink VRF — provably fair character randomization",
      "Arbitrum One — mint for cents, trade in seconds",
      "Paymaster sponsors all gas — players never see a fee",
    ],
    frontend: {
      pages: ["Game", "Shop", "Leaderboard", "My Characters", "Tournament Bracket"],
      keyFeatures: [
        "Real-time worm enemy spawning with animated SVG battlefield",
        "HP and XP bars updating live during play",
        "Power-up shop with Apple Pay / Google Pay / crypto checkout",
        "Leaderboard with real USD prize payouts",
        "Tournament bracket visualization with live standings",
      ],
      techStack: "Next.js 14, Tailwind CSS, Framer Motion, wagmi v2, Stripe (fiat on-ramp)",
      userFlowSummary: "User launches game → brain character enters battlefield → defeats worm enemies → earns XP → enters tournament → buys power-ups if needed → wins prizes paid in dollars automatically.",
    },
    contract: {
      name: "BrainBlastGame.sol",
      code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title BrainBlastGame — On-chain tournament + NFT character progression
contract BrainBlastGame is ERC721, Ownable, ReentrancyGuard {
    IERC20 public immutable usdt;

    struct Character  { uint8 power; uint8 speed; uint8 shield; uint32 xp; uint16 wins; }
    struct Tournament { uint256 prizePool; uint256 startAt; uint256 endAt; address winner; bool settled; }

    mapping(uint256 => Character)  public characters;
    mapping(uint256 => Tournament) public tournaments;

    uint256 public nextTokenId;
    uint256 public nextTournamentId;
    uint256 public mintPrice      = 5e6;  // $5 USDT
    uint256 public tournamentFee  = 1e6;  // $1 USDT entry
    uint256 public platformFeeBps = 150;  // 1.5%
    address public gameOracle;

    event CharacterMinted(address indexed owner, uint256 tokenId, uint8 power, uint8 speed);
    event TournamentCreated(uint256 indexed id, uint256 endAt);
    event TournamentSettled(uint256 indexed id, address winner, uint256 payout);

    modifier onlyOracle() { require(msg.sender == gameOracle, "Only oracle"); _; }

    constructor(address _usdt, address _oracle) ERC721("BrainBlast", "BRAIN") Ownable(msg.sender) {
        require(_usdt != address(0) && _oracle != address(0), "Zero address");
        usdt       = IERC20(_usdt);
        gameOracle = _oracle;
    }

    function mintCharacter() external nonReentrant {
        require(usdt.balanceOf(msg.sender) >= mintPrice, "Insufficient funds");
        usdt.transferFrom(msg.sender, address(this), mintPrice);
        uint256 seed   = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, nextTokenId)));
        uint8   power  = uint8(50 + (seed % 50));
        uint8   speed  = uint8(50 + ((seed >> 8) % 50));
        uint8   shield = uint8(30 + ((seed >> 16) % 70));
        characters[nextTokenId] = Character(power, speed, shield, 0, 0);
        _safeMint(msg.sender, nextTokenId);
        emit CharacterMinted(msg.sender, nextTokenId, power, speed);
        nextTokenId++;
    }

    function createTournament(uint256 duration) external onlyOwner {
        require(duration >= 1 hours, "Too short");
        uint256 id    = nextTournamentId++;
        uint256 endAt = block.timestamp + duration;
        tournaments[id] = Tournament(0, block.timestamp, endAt, address(0), false);
        emit TournamentCreated(id, endAt);
    }

    function enterTournament(uint256 tId, uint256 charId) external nonReentrant {
        Tournament storage t = tournaments[tId];
        require(!t.settled && block.timestamp < t.endAt, "Inactive");
        require(ownerOf(charId) == msg.sender, "Not your character");
        usdt.transferFrom(msg.sender, address(this), tournamentFee);
        t.prizePool += tournamentFee;
    }

    function settleTournament(uint256 tId, address winner) external onlyOracle nonReentrant {
        Tournament storage t = tournaments[tId];
        require(!t.settled, "Already settled");
        require(block.timestamp >= t.endAt, "Not ended");
        require(winner != address(0), "Zero address");
        t.settled = true;
        t.winner  = winner;
        uint256 fee    = (t.prizePool * platformFeeBps) / 10000;
        uint256 payout = t.prizePool - fee;
        usdt.transfer(owner(), fee);
        usdt.transfer(winner, payout);
        emit TournamentSettled(tId, winner, payout);
    }

    function setMintPrice(uint256 p)   external onlyOwner { require(p > 0, "Zero"); mintPrice = p; }
    function setTournamentFee(uint256 f) external onlyOwner { require(f > 0, "Zero"); tournamentFee = f; }
    function setGameOracle(address o)  external onlyOwner { require(o != address(0), "Zero address"); gameOracle = o; }
}`,
      summary: "ERC-721 NFT characters with on-chain stats and tournament entry. Oracle-submitted match results trigger automatic USDT prize distribution with a 1.5% platform fee. Character stats are seeded from block data — upgrade to Chainlink VRF for mainnet randomness.",
    },
  },

  marketplace: {
    productName: "Tradeport",
    tagline: "Sell anything. Buyers pay from any app, any chain. You get dollars.",
    productType: "marketplace",
    deployTarget: "Arbitrum One",
    estimatedLaunchTime: "4 days to mainnet",
    revenueModel: "1.5% platform fee on every completed sale — deducted automatically at settlement. Dispute arbitration is free for both parties.",
    chainExplanation: "Buyers pay with whatever they have — card, Apple Pay, ETH on mainnet, USDC on Base, MATIC on Polygon. LayerZero routes everything to USDC on Arbitrum in one transaction. Escrow holds it. Seller gets paid instantly when delivery is confirmed. eBay charges 12.9% and holds your money for weeks. This costs 1.5% and settles in seconds. Neither party needs a wallet.",
    duneQuery: "Track EscrowReleased vs EscrowRefunded ratio, monitor dispute rate by item category, chart daily GMV",
    visibleUX: [
      "List an item in 60 seconds — no account needed",
      "Buyers pay by card, Apple Pay, or any crypto they already have",
      "Seller gets instant dollar payout on delivery confirmation",
      "1.5% fee vs eBay's 12.9% + PayPal's 3.5%",
    ],
    invisibleTech: [
      "LayerZero OFT — buyer pays from any chain, any asset",
      "USDC escrow on Arbitrum One — $0.01 gas, 2-second finality",
      "3-of-5 arbitrator vote for disputed trades",
      "Auto-release after 7-day delivery window",
      "NFT provenance for high-value collectibles",
    ],
    frontend: {
      pages: ["Browse", "Item Detail", "Checkout", "Sell", "Orders / Activity", "Dispute Center"],
      keyFeatures: [
        "Item grid with real photos and dollar prices",
        "Full checkout flow: add to cart → escrow confirmation",
        "Seller dashboard with active listings and payout history",
        "Fee comparison table vs eBay, PayPal, StockX",
        "Dispute resolution UI with arbitrator voting status",
      ],
      techStack: "Next.js 14, Tailwind CSS, wagmi v2, ethers.js, Stripe (card on-ramp)",
      userFlowSummary: "Buyer finds item → adds to cart → pays (card or crypto) → funds lock in escrow → seller ships → buyer confirms delivery → seller gets paid instantly minus 1.5% fee. Dispute? 3 arbitrators vote.",
    },
    contract: {
      name: "TradeportEscrow.sol",
      code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title TradeportEscrow — P2P marketplace with USDC escrow and dispute resolution
contract TradeportEscrow is Ownable, ReentrancyGuard {
    IERC20 public immutable usdc;

    enum EscrowState { Active, Released, Refunded, Disputed }
    struct Escrow {
        address buyer;
        address seller;
        uint256 amount;
        uint256 expiresAt;
        EscrowState state;
        string  itemId;
    }

    mapping(uint256 => Escrow)                       public escrows;
    mapping(address => bool)                         public arbitrators;
    mapping(uint256 => mapping(address => bool))     public arbitratorVotes;
    mapping(uint256 => uint8)                        public voteCount;

    uint256 public nextEscrowId;
    uint256 public platformFeeBps  = 150; // 1.5%
    uint256 public deliveryWindow  = 7 days;
    uint8   public constant VOTE_THRESHOLD = 3;

    event EscrowCreated(uint256 indexed id, address buyer, address seller, uint256 amount);
    event EscrowReleased(uint256 indexed id, address seller, uint256 payout);
    event EscrowRefunded(uint256 indexed id, address buyer, uint256 amount);
    event DisputeRaised(uint256 indexed id);

    constructor(address _usdc) Ownable(msg.sender) {
        require(_usdc != address(0), "Zero address");
        usdc = IERC20(_usdc);
    }

    function createEscrow(
        address seller, uint256 amount, string calldata itemId
    ) external nonReentrant returns (uint256 id) {
        require(seller != address(0) && seller != msg.sender, "Invalid seller");
        require(amount > 0, "Zero amount");
        usdc.transferFrom(msg.sender, address(this), amount);
        id = nextEscrowId++;
        escrows[id] = Escrow(
            msg.sender, seller, amount,
            block.timestamp + deliveryWindow,
            EscrowState.Active, itemId
        );
        emit EscrowCreated(id, msg.sender, seller, amount);
    }

    function confirmDelivery(uint256 id) external nonReentrant {
        Escrow storage e = escrows[id];
        require(msg.sender == e.buyer, "Only buyer");
        require(e.state == EscrowState.Active, "Not active");
        _release(id, e);
    }

    function autoRelease(uint256 id) external nonReentrant {
        Escrow storage e = escrows[id];
        require(e.state == EscrowState.Active, "Not active");
        require(block.timestamp > e.expiresAt, "Window still open");
        _release(id, e);
    }

    function _release(uint256 id, Escrow storage e) internal {
        e.state = EscrowState.Released;
        uint256 fee    = (e.amount * platformFeeBps) / 10000;
        uint256 payout = e.amount - fee;
        usdc.transfer(owner(), fee);
        usdc.transfer(e.seller, payout);
        emit EscrowReleased(id, e.seller, payout);
    }

    function raiseDispute(uint256 id) external {
        Escrow storage e = escrows[id];
        require(msg.sender == e.buyer || msg.sender == e.seller, "Not party");
        require(e.state == EscrowState.Active, "Not active");
        e.state = EscrowState.Disputed;
        emit DisputeRaised(id);
    }

    function voteOnDispute(uint256 id, bool refundBuyer) external nonReentrant {
        require(arbitrators[msg.sender], "Not arbitrator");
        require(!arbitratorVotes[id][msg.sender], "Already voted");
        arbitratorVotes[id][msg.sender] = true;
        voteCount[id]++;
        if (voteCount[id] >= VOTE_THRESHOLD) {
            Escrow storage e = escrows[id];
            require(e.state == EscrowState.Disputed, "Not disputed");
            if (refundBuyer) {
                e.state = EscrowState.Refunded;
                usdc.transfer(e.buyer, e.amount);
                emit EscrowRefunded(id, e.buyer, e.amount);
            } else {
                _release(id, e);
            }
        }
    }

    function setArbitrator(address arb, bool active) external onlyOwner {
        require(arb != address(0), "Zero address");
        arbitrators[arb] = active;
    }
    function setDeliveryWindow(uint256 w) external onlyOwner { require(w >= 1 days, "Too short"); deliveryWindow = w; }
    function setPlatformFee(uint256 bps)  external onlyOwner { require(bps <= 500, "Too high"); platformFeeBps = bps; }
}`,
      summary: "USDC escrow contract with 7-day auto-release and 3-of-5 arbitrator dispute resolution. 1.5% platform fee deducted automatically on release. Checks-effects-interactions pattern prevents reentrancy on all fund movements.",
    },
  },
};

const FAKE_AUDIT_FINDINGS = {
  bot: [
    { id:"AUDIT-001", tool:"AI Audit", severity:"high",   title:"MEV Sandwich Exposure",            location:"executeArbitrage() line ~52", description:"The spread check happens after the flash loan is drawn. A sandwich bot could observe the pending transaction, front-run the first swap to move the price, then back-run after the flash loan repays — extracting value the bot expected to capture.", recommendation:"Route all arbitrage calls through Timeboost Express Lane (already integrated) to ensure sub-200ms execution windows. Consider commit-reveal or private mempool (Flashbots Protect).", status:"vulnerable" },
    { id:"AUDIT-002", tool:"AI Audit", severity:"medium", title:"Flash Loan Callback Validation",    location:"executeOperation() line ~65", description:"The callback validates msg.sender against the Aave address but does not validate the initiator parameter. A future malicious Aave pool upgrade could invoke this callback with attacker-controlled data.", recommendation:"Add `require(initiator == address(this), 'Bad initiator')` at the top of executeOperation.", status:"patched" },
    { id:"AUDIT-003", tool:"AI Audit", severity:"low",    title:"Single Admin Key",                  location:"onlyOwner throughout",        description:"All privileged functions — including withdrawProfit — route through a single owner key. Compromise of this key gives full control over all bot funds.", recommendation:"Implement 2-of-3 multisig (Safe) for fund withdrawal, with a 24h time-lock. Leave strategy config on a hot key with a per-tx cap.", status:"acknowledged" },
    { id:"AUDIT-004", tool:"AI Audit", severity:"info",   title:"Express Lane Bid Hardcoded",        location:"executeArbitrage() line ~50",  description:"The Timeboost bid amount is hardcoded at 2e14 (0.0002 ETH). During high-competition periods this may be insufficient to secure the express slot, degrading the bot's edge.", recommendation:"Make bid amount a configurable parameter, adjustable by the owner based on current market conditions and profitability per trade.", status:"acknowledged" },
  ],
  escrow: [
    { id:"AUDIT-001", tool:"Slither",   severity:"medium", title:"Session Key Privilege Escalation",          location:"ScopeEscrow.sol — setSessionKey()",       description:"A session key holder can grant new session keys to arbitrary addresses, potentially creating an unbounded chain of privileged approvers beyond the original client's intent.", recommendation:"Restrict setSessionKey() to owner() only. Session keys should be issued by the contract owner/client, not delegatable by other session keys.", status:"fixed" },
    { id:"AUDIT-002", tool:"AI Audit",  severity:"low",    title:"Missing Deadline Enforcement on Release",   location:"ScopeEscrow.sol — releaseMilestone()",    description:"The releaseMilestone function does not check whether the milestone deadline has passed. A client could indefinitely delay approval, holding freelancer funds hostage beyond the agreed timeline.", recommendation:"Add an auto-release mechanism: if block.timestamp > milestone.deadline + GRACE_PERIOD, allow the freelancer to self-release.", status:"acknowledged" },
  ],
  game: [
    { id:"AUDIT-001", tool:"AI Audit", severity:"medium", title:"Tournament Timestamp Manipulation", location:"settleTournament() line ~68",  description:"Tournament end time is enforced via block.timestamp. On Arbitrum, the sequencer sets block.timestamp and can shift it within a ~15s window. A colluding sequencer could delay or accelerate tournament settlement to affect prize outcomes.", recommendation:"Use ArbSys.arbBlockNumber() as the primary tournament clock. Block numbers are strictly monotonic and cannot be manipulated by the sequencer.", status:"vulnerable" },
    { id:"AUDIT-002", tool:"AI Audit", severity:"medium", title:"Character Stat Seed Manipulation",  location:"mintCharacter() line ~45",     description:"Character stats are seeded from keccak256(block.timestamp, msg.sender, nextTokenId). A miner/sequencer who controls block.timestamp can time their mint to bias power and speed stats in their favor.", recommendation:"Integrate Chainlink VRF for character stat randomization before mainnet launch. Commit-reveal with a minimum 5-block delay is an acceptable interim solution.", status:"vulnerable" },
    { id:"AUDIT-003", tool:"AI Audit", severity:"low",    title:"Oracle Centralization",             location:"settleTournament() / onlyOracle", description:"Match results are submitted by a single trusted oracle address. Compromise of this key allows fraudulent tournament settlement — paying prizes to any address.", recommendation:"Migrate to a multi-signature oracle (3-of-5 game validators) or integrate with a decentralized oracle network for match result finality.", status:"acknowledged" },
    { id:"AUDIT-004", tool:"AI Audit", severity:"info",   title:"Prize Distribution Logic",          location:"settleTournament() line ~75",  description:"Integer division in fee calculation may leave 1 wei dust in the contract. Over thousands of tournaments this is negligible (less than $0.01 total).", recommendation:"No action required for current scale. Add a sweepDust() function if operating at high volume.", status:"patched" },
  ],
  marketplace: [
    { id:"AUDIT-001", tool:"AI Audit", severity:"low",    title:"Arbitrator Appointment Risk",       location:"setArbitrator() line ~98",    description:"Arbitrators are appointed by the contract owner. A coordinated malicious owner could appoint colluding arbitrators, enabling systematic theft from dispute pools.", recommendation:"Transition to a DAO-appointed arbitrator set with reputation staking, or integrate Kleros Protocol for decentralized dispute resolution.", status:"acknowledged" },
    { id:"AUDIT-002", tool:"AI Audit", severity:"low",    title:"Delivery Window Fixed at 7 Days",   location:"autoRelease() line ~71",      description:"The 7-day auto-release window is reasonable but may disadvantage buyers on international transactions. Buyers who lose wallet access during this window cannot prevent automatic seller payout.", recommendation:"Allow buyers to extend the delivery window once (up to 14 days) via a signed transaction. Pair with guardian recovery for lost-access scenarios.", status:"acknowledged" },
    { id:"AUDIT-003", tool:"AI Audit", severity:"info",   title:"Escrow Pattern Correctly Implemented", location:"createEscrow() / _release()", description:"Funds are transferred into the contract before escrow state is written. The _release() internal function follows checks-effects-interactions strictly. ReentrancyGuard covers all external entry points.", recommendation:"No action required. Escrow logic is sound.", status:"patched" },
    { id:"AUDIT-004", tool:"AI Audit", severity:"info",   title:"USDC 6-Decimal Handling",           location:"createEscrow() / _release()", description:"Fee and payout arithmetic is correct for USDC's 6-decimal precision. At 1.5% fee on a $100 sale, fee = 1,500,000 units, payout = 98,500,000 units — no rounding loss.", recommendation:"No action required. Add explicit decimals() validation in the constructor if multi-token support is added in the future.", status:"patched" },
  ],
};

async function generateProduct(prompt, demoId, onStatus) {
  _fakeDemoType = demoId || _detectType(prompt);
  onStatus("Thinking...");
  await new Promise(r => setTimeout(r, 500));
  onStatus("Designing architecture...");
  await new Promise(r => setTimeout(r, 450));
  onStatus("Writing smart contract...");
  await new Promise(r => setTimeout(r, 600));
  onStatus("Building frontend plan...");
  await new Promise(r => setTimeout(r, 300));
  return { ...FAKE_PRODUCTS[_fakeDemoType] };
}

// ─── AI SELF-AUDIT (second pass) — DEMO MODE ──────────────────────────────────
async function auditContract(_code, _name, onStatus) {
  onStatus("Running AI security audit...");
  await new Promise(r => setTimeout(r, 900));
  onStatus("Analyzing attack vectors...");
  await new Promise(r => setTimeout(r, 600));
  return [...(FAKE_AUDIT_FINDINGS[_fakeDemoType] || [])];
}

// ─── SLITHER PATTERN ANALYSIS (static) ────────────────────────────────────────
function runSlitherPatterns(code) {
  const findings = [];
  const lines = code.split("\n");
  const lineOf = (str) => lines.findIndex(l => l.includes(str)) + 1 || "unknown";

  // ── Vulnerabilities ───────────────────────────────────────────────────────────

  if (code.includes(".call{value") && !code.includes("nonReentrant"))
    findings.push({ id:"SLI-001", tool:"Slither", severity:"high", title:"Potential Reentrancy", location:"Fund transfer functions", description:"External .call{value} detected without ReentrancyGuard. An attacker contract can recursively re-enter before state updates complete.", recommendation:"Import OpenZeppelin ReentrancyGuard and add `nonReentrant` modifier to all functions that send ETH or tokens.", status:"vulnerable" });

  if (code.includes("tx.origin"))
    findings.push({ id:"SLI-002", tool:"Slither", severity:"high", title:"tx.origin Authentication", location:`Line ~${lineOf("tx.origin")}`, description:"tx.origin allows phishing attacks. A malicious contract can trick the original signer into authorizing actions they didn't intend.", recommendation:"Replace all tx.origin with msg.sender for authorization checks.", status:"vulnerable" });

  if (code.includes(".call(") && !code.includes("bool success"))
    findings.push({ id:"SLI-003", tool:"Slither", severity:"medium", title:"Unchecked Return Value", location:"External call sites", description:"Low-level .call() return value is not checked. Failed calls silently continue, potentially leaving funds stuck.", recommendation:"Always destructure: `(bool success,) = addr.call{...}(...); require(success, 'Call failed');`", status:"vulnerable" });

  if (!code.includes("address(0)"))
    findings.push({ id:"SLI-004", tool:"Slither", severity:"low", title:"Missing Zero-Address Checks", location:"Constructor / setters", description:"No address(0) validation found. Setting a critical address to the zero address can permanently brick the contract.", recommendation:"Add `require(addr != address(0), 'Zero address')` in constructor and all setter functions.", status:"vulnerable" });

  if (code.includes("unchecked {") || code.includes("unchecked{"))
    findings.push({ id:"SLI-005", tool:"Slither", severity:"medium", title:"Unchecked Arithmetic Block", location:`Line ~${lineOf("unchecked")}`, description:"Unchecked blocks bypass Solidity 0.8 overflow protection. Math inside can silently wrap around.", recommendation:"Only use unchecked{} for operations proven safe (e.g., `i++` in for loops). Audit every line inside.", status:"vulnerable" });

  if (code.includes("selfdestruct") || code.includes("suicide("))
    findings.push({ id:"SLI-006", tool:"Slither", severity:"critical", title:"Self-Destruct Present", location:`Line ~${lineOf("selfdestruct")}`, description:"selfdestruct() can permanently destroy the contract and drain all funds if the authorized key is compromised.", recommendation:"Remove entirely unless strictly required. If kept, require multi-sig + time-lock.", status:"vulnerable" });

  if (code.includes("block.timestamp"))
    findings.push({ id:"SLI-007", tool:"Slither", severity:"low", title:"Timestamp Dependence", location:`Line ~${lineOf("block.timestamp")}`, description:"Validators can manipulate block.timestamp by ~15s. Avoid for critical logic like auction deadlines or random seeds.", recommendation:"Use block.number on Arbitrum, add tolerance buffers, or use Chainlink VRF for randomness.", status:"vulnerable" });

  if (code.includes("Ownable") && !code.includes("Ownable2Step"))
    findings.push({ id:"SLI-008", tool:"Slither", severity:"info", title:"Single-Step Ownership Transfer", location:"Contract-level", description:"Ownable allows transferring ownership to any address in one step. Typos can permanently lock admin access.", recommendation:"Replace Ownable with Ownable2Step — requires new owner to accept, preventing accidental loss.", status:"acknowledged" });

  if (/1e18|10\*\*18|\* 10\*\*18/.test(code))
    findings.push({ id:"SLI-009", tool:"Slither", severity:"critical", title:"Hardcoded 18-Decimal Assumption", location:`Line ~${lineOf("1e18") || lineOf("10**18")}`, description:"Amount scaled with 1e18 (18 decimals hardcoded). USDC and USDT use 6 decimals — a 1e18-scaled amount sends 1 trillion USDC, draining the contract instantly.", recommendation:"Always read decimals() from the token contract. Scale dynamically: `amount * 10**token.decimals()`. Never assume 18.", status:"vulnerable" });

  if (/\/\s*\d+[^;]*\*\s*\d+|\/\s*[a-zA-Z_]\w*[^;]*\*\s*[a-zA-Z_]\w*/.test(code))
    findings.push({ id:"SLI-010", tool:"Slither", severity:"high", title:"Precision Loss — Division Before Multiplication", location:"Fee/ratio arithmetic", description:"Division truncates to zero in integer math before multiplication. `(a / b) * c` loses precision; `(a * c) / b` preserves it.", recommendation:"Always multiply before dividing: `(amount * feeBps) / 10000`, not `(amount / 10000) * feeBps`.", status:"vulnerable" });

  if ((code.includes(".transfer(") || code.includes(".transferFrom(")) && !code.includes("SafeERC20") && !code.includes("safeTransfer"))
    findings.push({ id:"SLI-011", tool:"Slither", severity:"medium", title:"Non-Standard Token Risk (No SafeERC20)", location:"ERC-20 transfer calls", description:"Direct .transfer() and .transferFrom() revert on non-standard tokens like USDT (mainnet) and BNB that return void instead of bool. Contract will be bricked with these tokens.", recommendation:"Use OpenZeppelin SafeERC20: `using SafeERC20 for IERC20;` then replace all transfer calls with safeTransfer / safeTransferFrom.", status:"vulnerable" });

  if (code.includes("getReserves") || code.includes("token0()") || (code.includes(".slot0()") && !code.includes("TWAP")))
    findings.push({ id:"SLI-012", tool:"Slither", severity:"high", title:"Spot Price Oracle Manipulation", location:`Line ~${lineOf("getReserves") || lineOf("slot0")}`, description:"Uniswap/Curve spot price (getReserves or slot0) is used for on-chain pricing. A flash loan can move the pool price within the same transaction, then exploit the manipulated value.", recommendation:"Use a TWAP with ≥ 30-min observation window (UniswapV3OracleLibrary) or Chainlink price feed. Never use spot price for value-bearing calculations.", status:"vulnerable" });

  if (code.includes("type(uint256).max") && code.includes("approve"))
    findings.push({ id:"SLI-013", tool:"Slither", severity:"medium", title:"Unlimited Token Approval", location:`Line ~${lineOf("type(uint256).max")}`, description:"Approving type(uint256).max grants permanent unrestricted access to the user's full token balance — including future deposits — long after the current interaction ends.", recommendation:"Approve only the exact amount needed per transaction. Reset allowance to 0 after the call.", status:"vulnerable" });

  if (code.includes("amountOutMin: 0") || code.includes("amountOutMinimum: 0") || (code.includes("swap") && /,\s*0\s*,/.test(code) && !code.includes("slippage")))
    findings.push({ id:"SLI-014", tool:"Slither", severity:"medium", title:"MEV Sandwich — Zero Slippage Protection", location:"Swap call sites", description:"Swap executed with amountOutMin = 0. A sandwich bot can front-run the tx to move the price, then back-run after — the victim receives near-zero output and the bot captures the difference.", recommendation:"Set amountOutMin to ≥ 99% of expected output using a TWAP. On Arbitrum, route swaps through Timeboost Express Lane for sub-200ms execution that invalidates sandwich windows.", status:"vulnerable" });

  if (code.includes("delegatecall"))
    findings.push({ id:"SLI-015", tool:"Slither", severity:"critical", title:"Unsafe delegatecall", location:`Line ~${lineOf("delegatecall")}`, description:"delegatecall executes foreign bytecode in this contract's storage context. A malicious or compromised implementation can overwrite any storage slot — including ownership and token balances.", recommendation:"Never delegatecall to untrusted or upgradeable addresses. If using a proxy pattern, ensure the implementation address is immutable or behind a multi-sig + time-lock.", status:"vulnerable" });

  if ((code.includes("ecrecover") || code.includes("ECDSA.recover")) && !code.includes("nonce") && !code.includes("deadline"))
    findings.push({ id:"SLI-016", tool:"Slither", severity:"medium", title:"Signature Replay Attack", location:`Line ~${lineOf("ecrecover") || lineOf("ECDSA")}`, description:"Signature-based auth without nonce or deadline. A valid signed message can be replayed indefinitely across blocks, chains, or contract versions — each replay authorizes the same action.", recommendation:"Always include nonce + expiry in the signed payload: `keccak256(abi.encode(chainId, nonce, action, deadline))`. Increment nonce on use; reject expired signatures.", status:"vulnerable" });

  if (code.includes("block.number") && !code.includes("arbBlockNumber") && !code.includes("ArbSys"))
    findings.push({ id:"SLI-017", tool:"Slither", severity:"medium", title:"Arbitrum: block.number Returns L1 Block", location:`Line ~${lineOf("block.number")}`, description:"On Arbitrum, block.number returns the approximate L1 block number (~12s resolution), NOT the L2 block number (~250ms resolution). Timing logic using block.number runs ~50x slower than expected. Also: multiple L2 transactions share the same block.number, so `block.number > lastBlock` does NOT guarantee uniqueness.", recommendation:"Use `ArbSys(0x64).arbBlockNumber()` for L2 block numbers. For short-interval timing, use `block.timestamp` with Arbitrum's 250ms blocks.", status:"vulnerable" });

  if ((code.includes("latestRoundData") || code.includes("latestAnswer")) && !code.includes("sequencerUptimeFeed") && !code.includes("sequencer"))
    findings.push({ id:"SLI-018", tool:"Slither", severity:"high", title:"Arbitrum: Missing Sequencer Uptime Check", location:`Line ~${lineOf("latestRoundData") || lineOf("latestAnswer")}`, description:"Chainlink price feed used without checking the Arbitrum sequencer uptime feed. When the sequencer is down, price feeds become stale. When it resumes, all pending liquidations and trades execute against stale prices — enabling risk-free attacks.", recommendation:"Before trusting any Chainlink price: check IChainlinkAggregator(SEQ_UPTIME_FEED).latestRoundData() — require answer == 0 (sequencer is up) and block.timestamp - startedAt > GRACE_PERIOD (e.g. 3600s). Also validate answer > minAnswer && answer < maxAnswer to handle circuit breakers.", status:"vulnerable" });

  // ── Positive patterns ─────────────────────────────────────────────────────────

  if (code.includes("ReentrancyGuard"))
    findings.push({ id:"SLI-P01", tool:"Slither", severity:"info", title:"ReentrancyGuard Active", location:"Contract-level", description:"OpenZeppelin ReentrancyGuard imported and used. Primary reentrancy attack surface is mitigated.", recommendation:"Verify nonReentrant is on ALL fund-moving functions, not just entry points.", status:"patched" });

  if (code.includes("AccessControl") || code.includes("onlyOwner"))
    findings.push({ id:"SLI-P02", tool:"Slither", severity:"info", title:"Access Control Present", location:"Contract-level", description:"Role-based or ownership access control detected on admin functions.", recommendation:"Audit all role grant paths. Ensure no role can be self-granted by untrusted callers.", status:"patched" });

  if (/pragma solidity \^?0\.[89]/.test(code))
    findings.push({ id:"SLI-P03", tool:"Slither", severity:"info", title:"Safe Solidity Version", location:"Line 1", description:"Solidity 0.8+ used. Native overflow/underflow protection active by default.", recommendation:"Pin to an exact version (e.g. 0.8.24) rather than ^0.8.x for production deployments.", status:"patched" });

  if (code.includes("SafeERC20") || code.includes("safeTransfer"))
    findings.push({ id:"SLI-P04", tool:"Slither", severity:"info", title:"SafeERC20 Wrapper Used", location:"Token transfer calls", description:"OpenZeppelin SafeERC20 detected. Handles non-standard token return values (USDT, BNB) correctly and prevents silent failed transfers.", recommendation:"Ensure ALL token interactions go through safeTransfer — including any future token integrations.", status:"patched" });

  if (code.includes("TWAP") || code.includes("consult(") || code.includes("OracleLibrary"))
    findings.push({ id:"SLI-P05", tool:"Slither", severity:"info", title:"TWAP Oracle Detected", location:"Price feed calls", description:"Time-weighted average price oracle detected. TWAP resists single-block flash loan manipulation — exploiting it requires sustained multi-block capital at punishing cost.", recommendation:"Ensure observation window is ≥ 30 minutes for critical price feeds. Consider Chainlink as a secondary fallback.", status:"patched" });

  return findings;
}

// ─── PRODUCT PREVIEW COMPONENTS ───────────────────────────────────────────────

// ─── BOT SEED DATA ────────────────────────────────────────────────────────────
const BOT_STRATEGIES = [
  { id: "timeboost",  name: "Timing Advantage",   badge: "TIMEBOOST",  desc: "Uses Arbitrum's Timeboost Express Lane to execute 200ms ahead of standard transactions. Captures price gaps before competing bots can react.", dex: "Camelot · Uniswap V3", color: "#F59E0B", today: 341.20, allTime: 12840.50, winRate: 91, tradesToday: 58, active: true },
  { id: "arb",        name: "Cross-DEX Arb",       badge: "ARBITRAGE",  desc: "Scans price differences across Camelot, Uniswap V3, and Balancer continuously. Executes atomic swaps when spread exceeds 0.15%.",              dex: "Camelot · Balancer",   color: "#22C55E", today: 198.50, allTime:  8420.00, winRate: 87, tradesToday: 41, active: true },
  { id: "flashloan",  name: "Flash Loan Capture",  badge: "FLASH LOAN", desc: "Borrows capital via Aave flash loans to amplify arbitrage on GMX and Trader Joe without tying up bot capital.",                               dex: "GMX · Trader Joe",     color: "#818CF8", today:  89.10, allTime:  3210.80, winRate: 82, tradesToday: 19, active: true },
  { id: "reinvest",   name: "Auto Reinvest",        badge: "COMPOUND",   desc: "Compounds profits back into active strategies. Rebalances allocations weekly based on trailing performance.",                                     dex: "—",                    color: "#4B5563", today:   0,    allTime:     0,    winRate:  0, tradesToday:  0, active: false },
];
const BOT_PAIRS = ["ETH/USDC","ARB/USDC","GMX/USDC","WBTC/USDC","LINK/USDC","PENDLE/USDC","RDNT/USDC"];
const BOT_DEXES = ["Camelot","Uniswap V3","Balancer","GMX","Trader Joe"];
let _botTradeId = 200;
function _genBotTrade() {
  const si = Math.floor(Math.random() * 3), s = BOT_STRATEGIES[si], isTB = si === 0;
  return { id: _botTradeId++, pair: BOT_PAIRS[Math.floor(Math.random() * BOT_PAIRS.length)], dex: isTB ? ["Camelot","Uniswap V3"][Math.floor(Math.random()*2)] : BOT_DEXES[Math.floor(Math.random()*BOT_DEXES.length)], profit: +(0.6 + Math.random() * 11).toFixed(2), execMs: isTB ? 160 + Math.floor(Math.random()*55) : 360 + Math.floor(Math.random()*220), timeboost: isTB, stratColor: s.color, time: new Date().toLocaleTimeString("en-US", { hour12: false }) };
}
function _genBotCandles(n = 48) {
  let p = 2650;
  return Array.from({ length: n }, () => { const o = p, chg = (Math.random()-0.42)*55, c = o+chg, h = Math.max(o,c)+Math.random()*28, l = Math.min(o,c)-Math.random()*28; p=c; return {open:o,close:c,high:h,low:l}; });
}

function BotCandlestickChart({ candles }) {
  const W=560, H=110, pt={t:6,b:6,l:2,r:2}, iW=W-pt.l-pt.r, iH=H-pt.t-pt.b;
  const allP=candles.flatMap(c=>[c.high,c.low]), minP=Math.min(...allP), maxP=Math.max(...allP), rng=maxP-minP||1;
  const cw=Math.max(2,iW/candles.length-1.5);
  const y=p=>pt.t+iH-((p-minP)/rng)*iH, cx=i=>pt.l+(i/candles.length)*iW+cw/2;
  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <defs><linearGradient id="bot_areaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F59E0B" stopOpacity="0.18"/><stop offset="100%" stopColor="#F59E0B" stopOpacity="0.01"/></linearGradient></defs>
      <path d={`M ${candles.map((c,i)=>`${cx(i)},${y(c.close)}`).join(" L ")} L ${cx(candles.length-1)},${H} L ${cx(0)},${H} Z`} fill="url(#bot_areaGrad)"/>
      {candles.map((c,i)=>{ const g=c.close>=c.open, col=g?"#22C55E":"#EF4444", bt=y(Math.max(c.open,c.close)), bh=Math.max(1,Math.abs(y(c.open)-y(c.close))), x=cx(i); return (<g key={i}><line x1={x} y1={y(c.high)} x2={x} y2={y(c.low)} stroke={col} strokeWidth={0.8} opacity={0.45}/><rect x={x-cw/2} y={bt} width={cw} height={bh} fill={col} opacity={0.75} rx={0.4}/></g>); })}
      <path d={`M ${candles.map((c,i)=>`${cx(i)},${y(c.close)}`).join(" L ")}`} fill="none" stroke="#F59E0B" strokeWidth={1.5} opacity={0.5}/>
    </svg>
  );
}

function BotPreview({ product }) {
  const [running,       setRunning]       = useState(true);
  const [selectedStrat, setSelectedStrat] = useState(null);
  const [profit,        setProfit]        = useState(2847.32);
  const [displayProfit, setDisplayProfit] = useState(0);
  const [strategies,    setStrategies]    = useState(() => BOT_STRATEGIES.map(s => ({ ...s })));
  const [candles,       setCandles]       = useState(() => _genBotCandles(48));
  const [trades,        setTrades]        = useState(() => Array.from({ length: 12 }, () => _genBotTrade()));

  useEffect(() => {
    const target=2847.32, dur=1300, start=Date.now();
    const tick=()=>{ const prog=Math.min((Date.now()-start)/dur,1), ease=1-Math.pow(1-prog,3); setDisplayProfit(ease*target); if(prog<1)requestAnimationFrame(tick); else setDisplayProfit(target); };
    const t=setTimeout(()=>requestAnimationFrame(tick),300); return ()=>clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!running) return;
    const iv = setInterval(() => {
      const gain = +(0.6 + Math.random() * 7).toFixed(2);
      setProfit(p => +(p+gain).toFixed(2));
      setDisplayProfit(p => +(p+gain).toFixed(2));
      const nt = _genBotTrade(); setTrades(ts => [nt, ...ts.slice(0,24)]);
      const si = Math.floor(Math.random()*3);
      setStrategies(ss => ss.map((s,i) => i===si ? {...s, today:+(s.today+gain).toFixed(2), tradesToday:s.tradesToday+1} : s));
      setCandles(cs => { const last=cs[cs.length-1], tick=(Math.random()-0.42)*22, nc=last.close+tick, up={...last,close:nc,high:Math.max(last.high,nc),low:Math.min(last.low,nc)}; return Math.random()>0.72 ? [...cs.slice(1),{open:nc,close:nc+tick*0.3,high:nc+Math.abs(tick)*0.6,low:nc-Math.abs(tick)*0.6}] : [...cs.slice(0,-1),up]; });
    }, 1400);
    return () => clearInterval(iv);
  }, [running]);

  const todayTotal  = strategies.reduce((a,s) => a+s.today, 0);
  const totalTrades = strategies.reduce((a,s) => a+s.tradesToday, 0);
  const fmtB = n => n.toLocaleString("en-US", { minimumFractionDigits:2, maximumFractionDigits:2 });

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:"#080B0F", borderRadius:16, border:"1px solid rgba(245,158,11,0.12)", overflow:"hidden", boxShadow:"0 24px 80px rgba(0,0,0,0.5)" }}>
      {/* Top bar */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 20px", borderBottom:"1px solid rgba(255,255,255,0.05)", background:"rgba(245,158,11,0.03)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:28, height:28, background:"#F59E0B", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>⚡</div>
          <span style={{ fontSize:15, fontWeight:800, color:"#F0F2F7", letterSpacing:"-0.02em" }}>Apex</span>
          <span style={{ fontSize:10, color:"rgba(255,255,255,0.25)", marginLeft:2 }}>Trading Bot</span>
          {running && <div style={{ width:6, height:6, borderRadius:"50%", background:"#22C55E", animation:"vb3Pulse 2s ease-in-out infinite", marginLeft:4 }}/>}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:20, fontWeight:900, color:"#F0F2F7", fontFamily:"'DM Mono',monospace", letterSpacing:"-0.03em" }}>${fmtB(displayProfit)}</div>
            <div style={{ fontSize:11, color:"#22C55E", fontWeight:600 }}>↑ +${fmtB(todayTotal)} today</div>
          </div>
          <button onClick={() => setRunning(r=>!r)} style={{ background:running?"rgba(239,68,68,0.1)":"rgba(34,197,94,0.1)", border:`1px solid ${running?"rgba(239,68,68,0.35)":"rgba(34,197,94,0.35)"}`, borderRadius:8, padding:"7px 14px", cursor:"pointer", color:running?"#EF4444":"#22C55E", fontSize:11, fontWeight:800, letterSpacing:"0.06em", whiteSpace:"nowrap" }}>
            {running ? "⏸ KILL SWITCH" : "▶ RESUME"}
          </button>
        </div>
      </div>

      {/* Main grid */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 260px", minHeight:420 }}>
        {/* Left: chart + strategies */}
        <div style={{ borderRight:"1px solid rgba(255,255,255,0.05)", display:"flex", flexDirection:"column" }}>
          <div style={{ padding:"14px 20px 10px", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)", letterSpacing:"0.1em" }}>ETH/USDC · 1M</div>
              <div style={{ display:"flex", gap:14, alignItems:"center" }}>
                {[{label:"TRADES",val:totalTrades+142},{label:"WIN RATE",val:"87%"},{label:"TIMEBOOST EDGE",val:"200ms",amber:true}].map(s=>(
                  <div key={s.label} style={{ textAlign:"right" }}>
                    <div style={{ fontSize:13, fontWeight:800, color:s.amber?"#F59E0B":"#F0F2F7", fontFamily:"'DM Mono',monospace" }}>{s.val}</div>
                    <div style={{ fontSize:9, color:"rgba(255,255,255,0.25)", letterSpacing:"0.07em" }}>{s.label}</div>
                  </div>
                ))}
                {running && <div style={{ fontSize:10, color:"#F59E0B", animation:"vb3Blink 1.4s ease-in-out infinite" }}>● LIVE</div>}
              </div>
            </div>
            <BotCandlestickChart candles={candles}/>
          </div>

          <div style={{ flex:1, padding:"14px 20px" }}>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.25)", letterSpacing:"0.1em", marginBottom:10 }}>STRATEGIES</div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {strategies.map((s,i) => (
                <button key={s.id} onClick={()=>setSelectedStrat(selectedStrat?.id===s.id?null:s)} style={{ display:"flex", alignItems:"center", padding:"10px 12px", background:selectedStrat?.id===s.id?"rgba(255,255,255,0.05)":"#0D1017", borderRadius:10, border:`1px solid ${selectedStrat?.id===s.id?s.color+"40":"rgba(255,255,255,0.05)"}`, cursor:"pointer", gap:10, textAlign:"left" }}
                  onMouseEnter={e=>{ if(selectedStrat?.id!==s.id) e.currentTarget.style.borderColor=s.color+"30"; }}
                  onMouseLeave={e=>{ if(selectedStrat?.id!==s.id) e.currentTarget.style.borderColor="rgba(255,255,255,0.05)"; }}
                >
                  <div style={{ width:7, height:7, borderRadius:"50%", background:s.color, flexShrink:0, animation:s.active&&running?"vb3Pulse 2.2s ease-in-out infinite":"none" }}/>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ fontSize:13, fontWeight:600, color:s.active?"#F0F2F7":"rgba(255,255,255,0.3)" }}>{s.name}</span>
                      {s.id==="timeboost" && <span style={{ fontSize:9, color:"#F59E0B", background:"rgba(245,158,11,0.12)", border:"1px solid rgba(245,158,11,0.25)", borderRadius:4, padding:"1px 5px", fontWeight:800, letterSpacing:"0.05em" }}>⚡ TIMEBOOST</span>}
                    </div>
                    <div style={{ fontSize:10, color:"rgba(255,255,255,0.25)", marginTop:2 }}>{s.dex}</div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:s.active?"#22C55E":"rgba(255,255,255,0.2)", fontFamily:"'DM Mono',monospace" }}>{s.active?`+$${fmtB(s.today)}`:"—"}</div>
                    <div style={{ fontSize:10, color:"rgba(255,255,255,0.2)", marginTop:1 }}>{s.active?`${s.tradesToday} trades`:"idle"}</div>
                  </div>
                </button>
              ))}
            </div>
            {selectedStrat && (
              <div style={{ marginTop:12, padding:"14px 16px", background:"rgba(255,255,255,0.025)", borderRadius:12, border:`1px solid ${selectedStrat.color}20` }}>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.55)", lineHeight:1.65, marginBottom:selectedStrat.id==="timeboost"?10:0 }}>{selectedStrat.desc}</div>
                {selectedStrat.id==="timeboost" && (
                  <div style={{ background:"rgba(245,158,11,0.06)", border:"1px solid rgba(245,158,11,0.2)", borderRadius:8, padding:"10px 12px" }}>
                    <div style={{ fontSize:10, color:"#F59E0B", fontWeight:800, letterSpacing:"0.08em", marginBottom:4 }}>⚡ TIMEBOOST · EXPRESS LANE</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", lineHeight:1.6 }}>Arbitrum's Express Lane gives this strategy a 200ms head start. By the time standard-lane bots see an opportunity, we've already closed it.</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: live feed */}
        <div style={{ display:"flex", flexDirection:"column", overflow:"hidden" }}>
          <div style={{ padding:"14px 16px 10px", borderBottom:"1px solid rgba(255,255,255,0.04)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.25)", letterSpacing:"0.1em" }}>LIVE TRADES</div>
            {running && <div style={{ fontSize:9, color:"#22C55E", fontWeight:700, animation:"vb3Pulse 2s infinite" }}>● LIVE</div>}
          </div>
          <div style={{ flex:1, overflowY:"auto" }}>
            {trades.map((t,i) => (
              <div key={t.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 16px", borderBottom:"1px solid rgba(255,255,255,0.03)" }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:t.stratColor, flexShrink:0 }}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                    <span style={{ fontSize:12, fontWeight:700, color:"#F0F2F7", fontFamily:"'DM Mono',monospace" }}>{t.pair}</span>
                    {t.timeboost && <span style={{ fontSize:8, color:"#F59E0B", fontWeight:800 }}>⚡</span>}
                  </div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.25)", marginTop:1 }}>{t.dex} · {t.execMs}ms</div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:"#22C55E", fontFamily:"'DM Mono',monospace" }}>+${fmtB(t.profit)}</div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.2)" }}>{t.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding:"10px 16px", borderTop:"1px solid rgba(255,255,255,0.04)", display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:4, height:4, borderRadius:"50%", background:"#F59E0B", opacity:0.4 }}/>
            <span style={{ fontSize:9, color:"rgba(255,255,255,0.18)", letterSpacing:"0.06em" }}>ALL TRADES ON ARBITRUM ONE · NO GAS FEES</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SCOPE PREVIEW (Freelancer Escrow) ────────────────────────────────────────

const SCOPE_PROJECTS = [
  {
    id: "acme",
    client: "Acme Corp",
    title: "Mobile App Redesign",
    total: 4000,
    color: "#0EA5E9",
    milestones: [
      { id: 1, label: "Discovery & wireframes", amount: 800,  status: "paid" },
      { id: 2, label: "Frontend development",   amount: 2400, status: "ready" },
      { id: 3, label: "Launch & handoff",        amount: 800,  status: "locked" },
    ],
  },
  {
    id: "vercel",
    client: "Vercel Inc",
    title: "API Integration",
    total: 1200,
    color: "#8B5CF6",
    milestones: [
      { id: 1, label: "Spec & architecture", amount: 400,  status: "paid" },
      { id: 2, label: "Implementation",       amount: 800,  status: "inprogress" },
    ],
  },
];

function ScopePreview({ product }) {
  const [screen, setScreen]     = useState("home");
  const [project, setProject]   = useState(null);
  const [paying, setPaying]     = useState(false);
  const [paid, setPaid]         = useState(false);
  const SC = "#0EA5E9"; // Scope blue

  const requestPayment = () => {
    setPaying(true);
    setTimeout(() => { setPaying(false); setPaid(true); }, 1600);
  };

  const statusBadge = (s) => {
    if (s === "paid")       return { label: "Paid",        bg: "#D1FAE5", color: "#065F46" };
    if (s === "ready")      return { label: "Ready",       bg: "#DBEAFE", color: "#1E40AF" };
    if (s === "inprogress") return { label: "In progress", bg: "#FEF3C7", color: "#92400E" };
    if (s === "locked")     return { label: "Locked",      bg: "#F3F4F6", color: "#6B7280" };
    return { label: s, bg: "#F3F4F6", color: "#6B7280" };
  };

  return (
    <>
      <style>{`
        @keyframes sc_up   { from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)} }
        @keyframes sc_in   { from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)} }
        @keyframes sc_pop  { from{opacity:0;transform:scale(0.7)}to{opacity:1;transform:scale(1)} }
        @keyframes sc_check { from{stroke-dashoffset:32}to{stroke-dashoffset:0} }
      `}</style>

      {/* Phone shell */}
      <div style={{ width: 390, minHeight: 720, maxHeight: "90vh", background: "#fff", borderRadius: 44, boxShadow: "0 40px 100px rgba(0,0,0,0.18), 0 8px 32px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.9)", overflow: "hidden", display: "flex", flexDirection: "column", fontFamily: "'Geist',sans-serif" }}>

        {/* Status bar */}
        <div style={{ background: "#fff", padding: "14px 28px 6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0A0F1E" }}>9:41</div>
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            {[3,4,4,5].map((h,i) => <div key={i} style={{ width: 3, height: h+6, background: "#0A0F1E", borderRadius: 2, opacity: i < 3 ? 1 : 0.3 }} />)}
            <div style={{ width: 22, height: 11, border: "1.5px solid rgba(0,0,0,0.3)", borderRadius: 3, marginLeft: 4, display: "flex", alignItems: "center", padding: "0 2px" }}>
              <div style={{ width: "70%", height: 7, background: "#0A0F1E", borderRadius: 1.5 }} />
            </div>
          </div>
        </div>

        {/* ── HOME ── */}
        {screen === "home" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
            {/* Header */}
            <div style={{ padding: "8px 24px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 30, height: 30, background: SC, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 12px ${SC}44` }}>
                  <span style={{ color: "#fff", fontSize: 15, fontWeight: 900 }}>S</span>
                </div>
                <span style={{ fontSize: 16, fontWeight: 800, color: "#0A0F1E", letterSpacing: "-0.02em" }}>Scope</span>
              </div>
              <div style={{ fontSize: 12, color: "#8892A4", fontWeight: 500 }}>Freelancer view</div>
            </div>

            {/* Summary strip */}
            <div style={{ margin: "0 20px 20px", background: `linear-gradient(135deg, #0369A1 0%, #0EA5E9 100%)`, borderRadius: 20, padding: "20px 22px" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", letterSpacing: "0.06em", marginBottom: 6 }}>IN ESCROW</div>
              <div style={{ fontSize: 38, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1 }}>$5,200</div>
              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "4px 12px", fontSize: 11, color: "#fff", fontWeight: 600 }}>2 active projects</div>
                <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "4px 12px", fontSize: 11, color: "#fff", fontWeight: 600 }}>Gas: $0.00</div>
              </div>
            </div>

            {/* Project cards */}
            <div style={{ padding: "0 20px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0A0F1E", marginBottom: 10 }}>Active Projects</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {SCOPE_PROJECTS.map((p, i) => {
                  const ready = p.milestones.filter(m => m.status === "ready");
                  return (
                    <button key={p.id} onClick={() => { setProject(p); setScreen("project"); setPaid(false); }}
                      style={{ background: "#FAFAFA", border: "1.5px solid #F0F0F0", borderRadius: 18, padding: "16px 18px", cursor: "pointer", textAlign: "left", transition: "all 0.15s", animation: `sc_up 0.3s ease ${i * 0.08}s both`, opacity: 0 }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = p.color + "66"; e.currentTarget.style.background = "#fff"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "#F0F0F0"; e.currentTarget.style.background = "#FAFAFA"; }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 800, color: "#0A0F1E" }}>{p.client}</div>
                          <div style={{ fontSize: 12, color: "#8892A4", marginTop: 2 }}>{p.title}</div>
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: p.color }}>${p.total.toLocaleString()}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ fontSize: 11, color: "#8892A4" }}>{p.milestones.filter(m => m.status === "paid").length}/{p.milestones.length} milestones complete</div>
                        {ready.length > 0 && (
                          <div style={{ background: "#DBEAFE", borderRadius: 20, padding: "3px 10px", fontSize: 10, color: "#1E40AF", fontWeight: 700 }}>Ready to claim ↗</div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recent payouts */}
            <div style={{ padding: "20px 20px 20px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0A0F1E", marginBottom: 10 }}>Recent Payouts</div>
              {[
                { client: "Acme Corp",  label: "M1: Discovery",   amount: 800,  time: "5 days ago" },
                { client: "Stripe Inc", label: "Full project",    amount: 3200, time: "2 weeks ago" },
              ].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: i < 1 ? "1px solid #F4F6FA" : "none" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#D1FAE5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#10B981", flexShrink: 0 }}>↓</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0A0F1E" }}>{t.client}</div>
                    <div style={{ fontSize: 11, color: "#8892A4" }}>{t.label}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#10B981" }}>+${t.amount.toLocaleString()}</div>
                    <div style={{ fontSize: 11, color: "#8892A4" }}>{t.time}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: "0 20px 20px", fontSize: 10, color: "#C0C8D8", textAlign: "center" }}>
              Powered by ZeroDev Session Keys · Arbitrum One · Gas sponsored
            </div>
          </div>
        )}

        {/* ── PROJECT DETAIL ── */}
        {screen === "project" && project && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", animation: "sc_in 0.25s ease both" }}>
            <div style={{ padding: "8px 24px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <button onClick={() => setScreen("home")} style={{ width: 36, height: 36, borderRadius: 12, background: "#F4F6FA", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>←</button>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#0A0F1E" }}>{project.client}</div>
                <div style={{ fontSize: 12, color: "#8892A4" }}>{project.title}</div>
              </div>
            </div>

            {/* Project total + session key badge */}
            <div style={{ margin: "0 20px 20px", background: "#F8FAFF", border: `1.5px solid ${project.color}22`, borderRadius: 18, padding: "16px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 11, color: "#8892A4", marginBottom: 3 }}>Project total</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: "#0A0F1E" }}>${project.total.toLocaleString()}</div>
                </div>
                <div style={{ background: "#EDE9FE", borderRadius: 10, padding: "6px 12px", textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: "#7B4DFF", fontWeight: 700, letterSpacing: "0.05em" }}>ZERODEV</div>
                  <div style={{ fontSize: 10, color: "#7B4DFF", fontWeight: 600 }}>Session key ✓</div>
                </div>
              </div>
              <div style={{ fontSize: 11, color: "#8892A4" }}>Funds held in smart contract · Gas: $0.00 · No platform fee</div>
            </div>

            {/* Milestones */}
            <div style={{ padding: "0 20px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0A0F1E", marginBottom: 12 }}>Milestones</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {project.milestones.map((m, i) => {
                  const badge = statusBadge(m.status);
                  const isReady = m.status === "ready" && !paid;
                  return (
                    <div key={m.id} style={{ background: isReady ? "#F0F9FF" : "#FAFAFA", border: `1.5px solid ${isReady ? project.color + "44" : "#F0F0F0"}`, borderRadius: 16, padding: "14px 16px", animation: `sc_up 0.3s ease ${i * 0.07}s both`, opacity: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: isReady ? 12 : 0 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#0A0F1E" }}>{m.label}</div>
                          <div style={{ fontSize: 12, color: "#8892A4", marginTop: 2 }}>${m.amount.toLocaleString()}</div>
                        </div>
                        <div style={{ background: badge.bg, borderRadius: 20, padding: "3px 10px", fontSize: 10, color: badge.color, fontWeight: 700, flexShrink: 0 }}>{badge.label}</div>
                      </div>
                      {isReady && (
                        <button onClick={requestPayment} disabled={paying}
                          style={{ width: "100%", background: paying ? "#E0F2FE" : project.color, border: "none", borderRadius: 12, padding: "11px", color: paying ? project.color : "#fff", fontFamily: "'Geist',sans-serif", fontWeight: 800, fontSize: 13, cursor: paying ? "not-allowed" : "pointer", transition: "all 0.2s" }}>
                          {paying ? "Requesting..." : "Request Payment →"}
                        </button>
                      )}
                      {paid && m.status === "ready" && (
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, animation: "sc_pop 0.3s ease both" }}>
                          <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#D1FAE5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>✓</div>
                          <span style={{ fontSize: 11, color: "#10B981", fontWeight: 700 }}>$2,400 USDC sent · Gas: $0.00</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Fee comparison */}
            <div style={{ margin: "20px 20px", background: "#F8FAFF", borderRadius: 14, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, color: "#8892A4", marginBottom: 8, fontWeight: 600 }}>PLATFORM FEE COMPARISON</div>
              {[
                { name: "Scope",  fee: "0%",   color: "#10B981", bold: true },
                { name: "Upwork", fee: "20%",  color: "#EF4444" },
                { name: "PayPal", fee: "3.5%", color: "#F59E0B" },
              ].map(f => (
                <div key={f.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0" }}>
                  <span style={{ fontSize: 12, color: f.bold ? "#0A0F1E" : "#8892A4", fontWeight: f.bold ? 700 : 400 }}>{f.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: f.color }}>{f.fee}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  );
}



// ─── GAME SEED DATA ───────────────────────────────────────────────────────────
const GM_SHOP = [
  { id:"boost",  name:"Brain Boost",    desc:"Speed +20% for 3 waves", price:0.99, emoji:"⚡", color:"#F59E0B" },
  { id:"shield", name:"Plasma Shield",  desc:"+5 HP, absorbs next hit", price:2.99, emoji:"🛡", color:"#3B82F6" },
  { id:"repel",  name:"Worm Repellent", desc:"Slows enemies 40%",       price:1.99, emoji:"🧪", color:"#10B981" },
  { id:"mega",   name:"Mega Brain",     desc:"2× damage for 2 waves",   price:4.99, emoji:"🧠", color:"#A855F7" },
  { id:"pass",   name:"Season Pass",    desc:"All power-ups + no ads",  price:9.99, emoji:"👑", color:"#EC4899" },
];
const GM_LEADERBOARD = [
  { rank:1, name:"neuron99",   score:142800, wave:88, prize:"$48.00", you:false },
  { rank:2, name:"BrainBlast", score:138400, wave:84, prize:"$32.00", you:false },
  { rank:3, name:"YOU",        score:121200, wave:71, prize:"$18.00", you:true  },
  { rank:4, name:"wormslayer", score:98600,  wave:62, prize:"$8.00",  you:false },
  { rank:5, name:"cortex_x",   score:87300,  wave:55, prize:"$4.00",  you:false },
  { rank:6, name:"axon_king",  score:76100,  wave:49, prize:"$2.00",  you:false },
];
const GM_WORM_ANGLES = [15,72,130,190,255,310];

function GmBrain({ size=52, pulse=false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" style={{ filter:"drop-shadow(0 0 8px rgba(168,85,247,0.7))", animation:pulse?"gm_pulse 0.8s ease-in-out infinite":"none" }}>
      <ellipse cx="26" cy="28" rx="18" ry="16" fill="#E879F9"/>
      <ellipse cx="26" cy="27" rx="16" ry="14" fill="#F0ABFC"/>
      <path d="M14 24 Q18 20 22 24 Q26 28 30 24 Q34 20 38 24" stroke="#C026D3" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <path d="M15 30 Q19 26 23 30 Q27 34 31 30 Q35 26 38 30" stroke="#C026D3" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <path d="M17 19 Q20 16 24 18" stroke="#C026D3" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <path d="M28 18 Q32 16 35 19" stroke="#C026D3" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <circle cx="21" cy="22" r="4" fill="white"/><circle cx="31" cy="22" r="4" fill="white"/>
      <circle cx="22" cy="23" r="2.2" fill="#1a0030"/><circle cx="32" cy="23" r="2.2" fill="#1a0030"/>
      <circle cx="23" cy="22" r="0.8" fill="white"/><circle cx="33" cy="22" r="0.8" fill="white"/>
      <path d="M20 34 Q26 38 32 34" stroke="#C026D3" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

function GmWorm({ x, y, angle, size=1 }) {
  const s=size*7, rad=(angle*Math.PI)/180, dx=Math.cos(rad)*s*1.2, dy=Math.sin(rad)*s*1.2;
  return (
    <g transform={`translate(${x},${y})`}>
      {[3,2,1].map(i=><circle key={i} cx={dx*i*0.45} cy={dy*i*0.45} r={s*0.55-i*0.4} fill="#4ADE80" opacity={0.7-i*0.12}/>)}
      <circle cx={dx*0.7} cy={dy*0.7} r={s*0.72} fill="#22C55E"/>
      <circle cx={0} cy={0} r={s} fill="#16A34A"/>
      <circle cx={-s*0.35} cy={-s*0.2} r={s*0.28} fill="white"/><circle cx={s*0.35} cy={-s*0.2} r={s*0.28} fill="white"/>
      <circle cx={-s*0.3} cy={-s*0.15} r={s*0.16} fill="#1a1a1a"/><circle cx={s*0.4} cy={-s*0.15} r={s*0.16} fill="#1a1a1a"/>
      <line x1={-s*0.55} y1={-s*0.52} x2={-s*0.15} y2={-s*0.38} stroke="#14532D" strokeWidth={s*0.18} strokeLinecap="round"/>
      <line x1={s*0.55} y1={-s*0.52} x2={s*0.15} y2={-s*0.38} stroke="#14532D" strokeWidth={s*0.18} strokeLinecap="round"/>
    </g>
  );
}

function GmField({ running, wave, kills }) {
  const [wormDist, setWormDist] = useState(85);
  const [blasts,   setBlasts]   = useState([]);
  const blastId = useRef(0);
  useEffect(() => {
    if (!running) return;
    const iv1 = setInterval(() => setWormDist(d => Math.max(38, d-0.9)), 120);
    const iv2 = setInterval(() => {
      const id=blastId.current++; setBlasts(bs=>[...bs,{id,angle:Math.random()*360}]);
      setTimeout(()=>setBlasts(bs=>bs.filter(b=>b.id!==id)),400);
    }, 600);
    return ()=>{ clearInterval(iv1); clearInterval(iv2); };
  }, [running]);
  useEffect(()=>{ setWormDist(85); }, [wave]);
  const W=310, H=260, cx=W/2, cy=H/2, wormR=(wormDist/100)*(Math.min(W,H)/2-14);
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ background:"#07001A" }}>
      {Array.from({length:10},(_,i)=><line key={`h${i}`} x1={0} y1={i*(H/9)} x2={W} y2={i*(H/9)} stroke="rgba(168,85,247,0.06)" strokeWidth={1}/>)}
      {Array.from({length:13},(_,i)=><line key={`v${i}`} x1={i*(W/12)} y1={0} x2={i*(W/12)} y2={H} stroke="rgba(168,85,247,0.06)" strokeWidth={1}/>)}
      <circle cx={cx} cy={cy} r={wormR+4} fill="none" stroke="rgba(239,68,68,0.06)" strokeWidth={8}/>
      <circle cx={cx} cy={cy} r={52} fill="rgba(168,85,247,0.04)" stroke="rgba(168,85,247,0.15)" strokeWidth={1} strokeDasharray="4 4"/>
      {blasts.map(b=>{ const r=(b.angle*Math.PI)/180; return <line key={b.id} x1={cx} y1={cy} x2={cx+Math.cos(r)*62} y2={cy+Math.sin(r)*62} stroke="#E879F9" strokeWidth={2} opacity={0.8} style={{ animation:"gm_blast 0.4s ease-out both" }}/>; })}
      {GM_WORM_ANGLES.map((angle,i)=>{ const rad=(angle*Math.PI)/180, wx=cx+Math.cos(rad)*wormR, wy=cy+Math.sin(rad)*wormR; return <GmWorm key={i} x={wx} y={wy} angle={(angle+180)%360} size={1+wave*0.04}/>; })}
      <foreignObject x={cx-26} y={cy-26} width={52} height={52}><div xmlns="http://www.w3.org/1999/xhtml"><GmBrain size={52} pulse={running}/></div></foreignObject>
      <text x={W-8} y={16} textAnchor="end" fill="rgba(168,85,247,0.6)" fontSize={10} fontFamily="DM Mono" fontWeight={600}>WAVE {wave}</text>
      <text x={8} y={16} fill="rgba(255,255,255,0.4)" fontSize={10} fontFamily="DM Mono">{kills} kills</text>
    </svg>
  );
}

function GamePreview({ product }) {
  const [screen,    setScreen]    = useState("game");
  const [running,   setRunning]   = useState(true);
  const [wave,      setWave]      = useState(1);
  const [kills,     setKills]     = useState(0);
  const [hp,        setHp]        = useState(18);
  const [xp,        setXp]        = useState(34);
  const [score,     setScore]     = useState(4200);
  const [payItem,   setPayItem]   = useState(null);
  const [payStep,   setPayStep]   = useState("choose");
  const [owned,     setOwned]     = useState([]);

  useEffect(() => {
    if (!running || screen !== "game") return;
    const iv = setInterval(() => {
      setKills(k => k + (Math.random()>0.35?1:0));
      setXp(x => { if(x>=100){setWave(w=>w+1);return 10;} return Math.min(100,x+Math.floor(Math.random()*6+2)); });
      setScore(s => s + Math.floor(Math.random()*120+40));
      if(Math.random()>0.97) setHp(h=>Math.max(0,h-1));
    }, 900);
    return ()=>clearInterval(iv);
  }, [running, screen]);

  const handlePay = () => {
    setPayStep("processing");
    setTimeout(()=>{ setPayStep("done"); setOwned(o=>[...o,payItem.id]); setTimeout(()=>{ setPayItem(null); setPayStep("choose"); },1800); },1800);
  };

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", width:390, minHeight:620, maxHeight:"90vh", background:"#07001A", borderRadius:44, boxShadow:"0 40px 100px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(168,85,247,0.15)", overflow:"hidden", display:"flex", flexDirection:"column", position:"relative" }}>

      {/* Status bar */}
      <div style={{ padding:"14px 28px 8px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.6)" }}>9:41</div>
        <div style={{ display:"flex", gap:5 }}>{[3,4,4,5].map((h,i)=><div key={i} style={{ width:3, height:h+6, background:"rgba(255,255,255,0.4)", borderRadius:2, opacity:i<3?1:0.3 }}/>)}</div>
      </div>

      {/* ── GAME ── */}
      {screen==="game" && (
        <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
          <div style={{ padding:"6px 20px 10px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ fontSize:14, fontWeight:900, color:"#E879F9", letterSpacing:"-0.02em" }}>Brain Blast</div>
              <div style={{ fontSize:10, background:"rgba(168,85,247,0.15)", border:"1px solid rgba(168,85,247,0.3)", borderRadius:4, padding:"1px 6px", color:"#C084FC", fontWeight:700 }}>WAVE {wave}</div>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={()=>setRunning(r=>!r)} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"5px 10px", cursor:"pointer", color:"rgba(255,255,255,0.6)", fontSize:11, fontWeight:700 }}>{running?"⏸":"▶"}</button>
              <button onClick={()=>setScreen("shop")} style={{ background:"rgba(168,85,247,0.15)", border:"1px solid rgba(168,85,247,0.3)", borderRadius:8, padding:"5px 10px", cursor:"pointer", color:"#C084FC", fontSize:11, fontWeight:700 }}>🛒</button>
            </div>
          </div>
          <div style={{ padding:"0 20px 8px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
              <div style={{ display:"flex", gap:4 }}><span style={{ fontSize:10, color:"rgba(255,255,255,0.4)" }}>HP</span><span style={{ fontSize:11, fontWeight:800, color:hp<=5?"#EF4444":"#F0F2F7" }}>{hp}/20</span></div>
              <div style={{ display:"flex", gap:4 }}><span style={{ fontSize:10, color:"rgba(168,85,247,0.6)" }}>XP</span><span style={{ fontSize:11, fontWeight:700, color:"#C084FC" }}>{xp}%</span></div>
            </div>
            <div style={{ height:5, background:"rgba(255,255,255,0.07)", borderRadius:3, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${(hp/20)*100}%`, background:hp<=5?"#EF4444":"linear-gradient(90deg,#7C3AED,#E879F9)", borderRadius:3, transition:"width 0.4s" }}/>
            </div>
            <div style={{ height:3, background:"rgba(255,255,255,0.05)", borderRadius:2, overflow:"hidden", marginTop:3 }}>
              <div style={{ height:"100%", width:`${xp}%`, background:"rgba(168,85,247,0.5)", borderRadius:2, transition:"width 0.6s" }}/>
            </div>
          </div>
          <div style={{ flex:1 }}><GmField running={running} wave={wave} kills={kills}/></div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", borderTop:"1px solid rgba(168,85,247,0.1)", background:"rgba(0,0,0,0.3)" }}>
            {[{label:"SCORE",val:score.toLocaleString()},{label:"KILLS",val:kills},{label:"WAVE",val:wave},{label:"RANK",val:"#3"}].map(s=>(
              <div key={s.label} style={{ padding:"10px 0", textAlign:"center" }}>
                <div style={{ fontSize:14, fontWeight:900, color:"#F0F2F7", fontFamily:"'DM Mono',monospace" }}>{s.val}</div>
                <div style={{ fontSize:9, color:"rgba(255,255,255,0.3)", letterSpacing:"0.08em", marginTop:1 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SHOP ── */}
      {screen==="shop" && !payItem && (
        <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
          <div style={{ display:"flex", alignItems:"center", padding:"10px 20px", borderBottom:"1px solid rgba(168,85,247,0.1)" }}>
            <button onClick={()=>setScreen("game")} style={{ background:"none", border:"none", cursor:"pointer", padding:"4px 8px 4px 0", fontSize:14, color:"#A855F7", fontWeight:600 }}>← Back</button>
            <div style={{ flex:1, textAlign:"center", fontSize:15, fontWeight:800, color:"#F0F2F7", marginRight:40 }}>Power-Ups</div>
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:"14px 16px 24px" }}>
            <div style={{ background:"linear-gradient(135deg,rgba(124,58,237,0.3),rgba(168,85,247,0.15))", border:"1px solid rgba(168,85,247,0.2)", borderRadius:14, padding:"14px 16px", marginBottom:16, display:"flex", alignItems:"center", gap:12 }}>
              <GmBrain size={44}/>
              <div><div style={{ fontSize:14, fontWeight:800, color:"#F0F2F7", marginBottom:2 }}>Level up your brain</div><div style={{ fontSize:11, color:"rgba(255,255,255,0.45)", lineHeight:1.5 }}>Pay with Apple Pay, Google Pay, or crypto wallet.</div></div>
            </div>
            {GM_SHOP.map((item,i)=>{
              const isOwned=owned.includes(item.id);
              return (
                <div key={item.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px", background:"rgba(255,255,255,0.03)", border:`1px solid ${isOwned?"rgba(34,197,94,0.3)":"rgba(255,255,255,0.07)"}`, borderRadius:14, marginBottom:10 }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:`${item.color}18`, border:`1px solid ${item.color}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{item.emoji}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:"#F0F2F7" }}>{item.name}</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:2 }}>{item.desc}</div>
                  </div>
                  <div style={{ flexShrink:0 }}>
                    {isOwned ? <div style={{ fontSize:11, color:"#22C55E", fontWeight:700 }}>✓ Active</div> : (
                      <button onClick={()=>{ setPayItem(item); setPayStep("choose"); }} style={{ background:item.color, border:"none", borderRadius:10, padding:"7px 14px", color:"#fff", fontSize:13, fontWeight:800, cursor:"pointer" }}>${item.price.toFixed(2)}</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── PAYMENT SHEET ── */}
      {screen==="shop" && payItem && (
        <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
          <div style={{ flex:1, background:"rgba(0,0,0,0.4)" }} onClick={()=>{ if(payStep==="choose") setPayItem(null); }}/>
          <div style={{ background:"#0F0A2A", borderTop:"1px solid rgba(168,85,247,0.2)", borderRadius:"24px 24px 0 0", padding:"20px 24px 40px" }}>
            {payStep==="choose" && (
              <>
                <div style={{ width:36, height:4, background:"rgba(255,255,255,0.15)", borderRadius:2, margin:"0 auto 20px" }}/>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
                  <div style={{ width:48, height:48, borderRadius:14, background:`${payItem.color}18`, border:`1px solid ${payItem.color}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>{payItem.emoji}</div>
                  <div style={{ flex:1 }}><div style={{ fontSize:15, fontWeight:800, color:"#F0F2F7" }}>{payItem.name}</div><div style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>{payItem.desc}</div></div>
                  <div style={{ fontSize:22, fontWeight:900, color:"#F0F2F7" }}>${payItem.price.toFixed(2)}</div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}>
                  <button onClick={handlePay} style={{ width:"100%", background:"#000", border:"none", borderRadius:14, padding:"14px 0", color:"#fff", fontSize:16, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M13.5 9.3c0-2 1.6-2.9 1.7-3-1-1.4-2.5-1.5-3-1.6-1.3-.1-2.5.8-3.1.8-.6 0-1.6-.7-2.7-.7C4.8 4.8 3 6.1 3 8.9c0 1.7.7 3.6 1.5 4.7.8 1.1 1.5 2 2.5 2 1 0 1.4-.6 2.6-.6 1.2 0 1.5.6 2.6.6s1.8-.9 2.5-2c.8-1.1 1.1-2.2 1.1-2.3-.1 0-2.3-.9-2.3-3z" fill="white"/><path d="M11.5 3c.6-.8 1.1-1.8 1-2.9-1 0-2.2.7-2.9 1.4-.6.7-1.1 1.8-1 2.8 1.1.1 2.3-.6 2.9-1.3z" fill="white"/></svg>
                    Apple Pay
                  </button>
                  <button onClick={handlePay} style={{ width:"100%", background:"#fff", border:"1px solid #e0e0e0", borderRadius:14, padding:"14px 0", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:2, fontSize:15, fontWeight:700 }}>
                    <span style={{ color:"#4285F4" }}>G</span><span style={{ color:"#EA4335" }}>o</span><span style={{ color:"#FBBC04" }}>o</span><span style={{ color:"#34A853" }}>g</span><span style={{ color:"#4285F4" }}>l</span><span style={{ color:"#EA4335" }}>e</span><span style={{ marginLeft:4, color:"#3c4043" }}>Pay</span>
                  </button>
                  <button onClick={handlePay} style={{ width:"100%", background:"rgba(168,85,247,0.12)", border:"1px solid rgba(168,85,247,0.3)", borderRadius:14, padding:"14px 0", color:"#C084FC", fontSize:14, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="2" stroke="#C084FC" strokeWidth="1.5"/><path d="M1 6h14" stroke="#C084FC" strokeWidth="1.5"/><circle cx="11.5" cy="9.5" r="1" fill="#C084FC"/></svg>
                    Connect Wallet
                  </button>
                </div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.2)", textAlign:"center", lineHeight:1.6 }}>All purchases are processed in USDT on Arbitrum One and displayed in USD. No gas fees.</div>
              </>
            )}
            {payStep==="processing" && (
              <div style={{ textAlign:"center", padding:"24px 0" }}>
                <div style={{ width:52, height:52, border:"3px solid rgba(168,85,247,0.2)", borderTopColor:"#A855F7", borderRadius:"50%", margin:"0 auto 16px", animation:"vb3Rotate 0.8s linear infinite" }}/>
                <div style={{ fontSize:15, fontWeight:700, color:"#F0F2F7", marginBottom:4 }}>Processing...</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.3)" }}>Settling via USDT on Arbitrum</div>
              </div>
            )}
            {payStep==="done" && (
              <div style={{ textAlign:"center", padding:"16px 0" }}>
                <div style={{ width:64, height:64, borderRadius:"50%", background:"rgba(34,197,94,0.12)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", animation:"mp_popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M5 14L12 21L23 8" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div style={{ fontSize:18, fontWeight:900, color:"#F0F2F7", marginBottom:4 }}>Power-up activated!</div>
                <div style={{ fontSize:13, color:"rgba(255,255,255,0.4)" }}>{payItem?.name} is live in your game</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── LEADERBOARD ── */}
      {screen==="leaderboard" && (
        <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
          <div style={{ display:"flex", alignItems:"center", padding:"10px 20px", borderBottom:"1px solid rgba(168,85,247,0.1)" }}>
            <button onClick={()=>setScreen("game")} style={{ background:"none", border:"none", cursor:"pointer", padding:"4px 8px 4px 0", fontSize:14, color:"#A855F7", fontWeight:600 }}>← Back</button>
            <div style={{ flex:1, textAlign:"center", fontSize:15, fontWeight:800, color:"#F0F2F7", marginRight:40 }}>Leaderboard</div>
          </div>
          <div style={{ padding:"14px 16px", background:"rgba(168,85,247,0.06)", borderBottom:"1px solid rgba(168,85,247,0.1)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div><div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginBottom:2 }}>YOUR RANK</div><div style={{ fontSize:24, fontWeight:900, color:"#E879F9" }}>#3</div></div>
            <div style={{ textAlign:"right" }}><div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginBottom:2 }}>PRIZE</div><div style={{ fontSize:20, fontWeight:900, color:"#22C55E" }}>$18.00</div></div>
            <div style={{ textAlign:"right" }}><div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginBottom:2 }}>SCORE</div><div style={{ fontSize:16, fontWeight:800, color:"#F0F2F7", fontFamily:"'DM Mono',monospace" }}>121,200</div></div>
          </div>
          <div style={{ flex:1, overflowY:"auto" }}>
            {GM_LEADERBOARD.map((p,i)=>(
              <div key={p.rank} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 20px", background:p.you?"rgba(168,85,247,0.08)":"transparent", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ width:24, textAlign:"center" }}>{p.rank<=3?<span style={{ fontSize:16 }}>{["🥇","🥈","🥉"][p.rank-1]}</span>:<span style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.25)" }}>{p.rank}</span>}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:p.you?800:600, color:p.you?"#E879F9":"#F0F2F7" }}>{p.name}{p.you?" (you)":""}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:1 }}>Wave {p.wave} · {p.score.toLocaleString()} pts</div>
                </div>
                <div style={{ fontSize:14, fontWeight:800, color:"#22C55E" }}>{p.prize}</div>
              </div>
            ))}
            <div style={{ padding:"16px 20px 32px", display:"flex", gap:8 }}>
              <div style={{ width:5, height:5, borderRadius:"50%", background:"#A855F7", marginTop:4, opacity:0.5, flexShrink:0 }}/>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.18)", lineHeight:1.65 }}>Prize payouts in USDT on Arbitrum One. Displayed in USD. Paid instantly at end of each weekly season.</div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom nav */}
      {!payItem && (
        <div style={{ display:"flex", background:"rgba(0,0,0,0.4)", borderTop:"1px solid rgba(168,85,247,0.1)", padding:"10px 0 20px", backdropFilter:"blur(10px)" }}>
          {[{id:"game",label:"Play",icon:"🎮"},{id:"shop",label:"Shop",icon:"🛒"},{id:"leaderboard",label:"Ranks",icon:"🏆"}].map(n=>(
            <button key={n.id} onClick={()=>{ setPayItem(null); setScreen(n.id); }} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3, background:"none", border:"none", cursor:"pointer", padding:"4px 0" }}>
              <span style={{ fontSize:18, lineHeight:1 }}>{n.icon}</span>
              <span style={{ fontSize:10, fontWeight:700, color:screen===n.id?"#E879F9":"rgba(255,255,255,0.3)" }}>{n.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MARKETPLACE SEED DATA ────────────────────────────────────────────────────
const MP_LISTINGS = [
  { id:1, name:"Nike SB Dunk Low Travis Scott", cat:"Sneakers",    price:1240,  condition:"New w/ Box",  seller:"SneakerVault", verified:true,  sales:142, color:"#E8F4E8", emoji:"👟" },
  { id:2, name:"Rolex Submariner Date 2023",    cat:"Watches",     price:14800, condition:"Like New",    seller:"LuxWatches",   verified:true,  sales:89,  color:"#E8EAF4", emoji:"⌚" },
  { id:3, name:"Banksy — Girl with Balloon",    cat:"Art",         price:3200,  condition:"Mint",        seller:"ArtHouse",     verified:true,  sales:34,  color:"#F4E8E8", emoji:"🎨" },
  { id:4, name:"Supreme Box Logo Hoodie FW23",  cat:"Streetwear",  price:680,   condition:"New",         seller:"DropArchive",  verified:false, sales:28,  color:"#F0E8F4", emoji:"👕" },
  { id:5, name:"Jordan 4 Retro Military Black", cat:"Sneakers",    price:340,   condition:"DS",          seller:"KicksOnly",    verified:true,  sales:205, color:"#E8EEF4", emoji:"👟" },
  { id:6, name:"KAWS Companion Figure (Open)",  cat:"Collectibles",price:850,   condition:"Mint in Box", seller:"ModernArts",   verified:true,  sales:61,  color:"#F4EDE8", emoji:"🗿" },
];
const MP_CATS = ["All","Sneakers","Watches","Art","Streetwear","Collectibles"];
const MP_MY_LISTINGS = [
  { id:10, name:"Air Jordan 1 Retro High OG", price:420,  status:"sold",       views:84,  date:"Mar 4" },
  { id:11, name:"Vintage Rolex Datejust 36",  price:8200, status:"in_transit", views:231, date:"Mar 2" },
  { id:12, name:"Supreme Jacket FW22",        price:310,  status:"active",     views:47,  date:"Feb 28" },
];
const MP_MY_PURCHASES = [
  { id:20, name:"Yeezy Boost 350 V2 Cream", price:290, status:"delivered",  date:"Mar 3" },
  { id:21, name:"Stüssy 8-Ball Tee",        price:85,  status:"in_transit", date:"Mar 5" },
];
const MP_STATUS_LABEL = { sold:"Paid out", in_transit:"In transit", active:"Listed", delivered:"Delivered" };
const MP_STATUS_COLOR = { sold:"#00B07D", in_transit:"#F59E0B", active:"#0057FF", delivered:"#00B07D" };
const fmtMP = n => n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});

function MPItemCard({ item, onSelect }) {
  return (
    <button onClick={() => onSelect(item)} style={{ background:"#fff", border:"1px solid #EAECF0", borderRadius:14, overflow:"hidden", cursor:"pointer", textAlign:"left", padding:0 }}
      onMouseEnter={e => e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,0.09)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow="none"}
    >
      <div style={{ height:100, background:item.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:40 }}>{item.emoji}</div>
      <div style={{ padding:"10px 12px 12px" }}>
        <div style={{ fontSize:11, fontWeight:700, color:"#0D1117", lineHeight:1.3, marginBottom:4, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{item.name}</div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontSize:13, fontWeight:900, color:"#0D1117" }}>${fmtMP(item.price)}</span>
          {item.verified && <span style={{ fontSize:8, color:"#00B07D", background:"rgba(0,176,125,0.1)", border:"1px solid rgba(0,176,125,0.2)", borderRadius:4, padding:"1px 4px", fontWeight:800 }}>✓ VERIFIED</span>}
        </div>
        <div style={{ fontSize:10, color:"#8892A4", marginTop:2 }}>{item.condition}</div>
      </div>
    </button>
  );
}

function MarketplacePreview({ product }) {
  const [screen,    setScreen]    = useState("browse");
  const [cat,       setCat]       = useState("All");
  const [query,     setQuery]     = useState("");
  const [selected,  setSelected]  = useState(null);
  const [orderTab,  setOrderTab]  = useState("selling");
  const [checking,  setChecking]  = useState(false);
  const [sellStep,  setSellStep]  = useState("form");
  const [sellForm,  setSellForm]  = useState({ name:"", condition:"", price:"", desc:"" });

  const filtered = MP_LISTINGS.filter(l => (cat==="All"||l.cat===cat) && (!query||l.name.toLowerCase().includes(query.toLowerCase())));

  const handleBuy = () => {
    setChecking(true);
    setTimeout(() => { setChecking(false); setScreen("confirmed"); }, 2000);
  };

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", width:390, minHeight:620, maxHeight:"90vh", background:"#F8F9FA", borderRadius:44, boxShadow:"0 40px 100px rgba(0,0,0,0.15), 0 8px 32px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(0,0,0,0.06)", overflow:"hidden", display:"flex", flexDirection:"column", position:"relative" }}>

      {/* Status bar */}
      <div style={{ background:"#fff", padding:"14px 28px 8px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontSize:13, fontWeight:700, color:"#0D1117" }}>9:41</div>
        <div style={{ display:"flex", gap:5 }}>{[3,4,4,5].map((h,i)=><div key={i} style={{ width:3, height:h+6, background:"#0D1117", borderRadius:2, opacity:i<3?0.6:0.2 }}/>)}</div>
      </div>

      {/* ── BROWSE ── */}
      {screen==="browse" && (
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflowY:"auto" }}>
          <div style={{ padding:"4px 20px 12px", background:"#fff", borderBottom:"1px solid #F0F2F8" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
              <div>
                <div style={{ fontSize:20, fontWeight:900, color:"#0D1117", letterSpacing:"-0.03em" }}>Tradeport</div>
                <div style={{ fontSize:11, color:"#8892A4", marginTop:1 }}>P2P · No holds · Instant payout</div>
              </div>
              <button onClick={()=>setScreen("sell")} style={{ background:"#0D1117", border:"none", borderRadius:10, padding:"8px 14px", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>+ Sell</button>
            </div>
            <div style={{ background:"#F4F6FA", borderRadius:12, display:"flex", alignItems:"center", gap:8, padding:"10px 14px", marginBottom:10 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke="#8892A4" strokeWidth="1.5"/><path d="M10 10L13 13" stroke="#8892A4" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search listings..." style={{ border:"none", background:"transparent", flex:1, fontSize:13, color:"#0D1117", fontFamily:"'DM Sans',sans-serif", outline:"none" }}/>
            </div>
            <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:2 }}>
              {MP_CATS.map(c=><button key={c} onClick={()=>setCat(c)} style={{ flexShrink:0, background:cat===c?"#0D1117":"#F4F6FA", border:"none", borderRadius:20, padding:"5px 12px", fontSize:11, fontWeight:700, color:cat===c?"#fff":"#6B7385", cursor:"pointer" }}>{c}</button>)}
            </div>
          </div>
          <div style={{ margin:"12px 16px 0", background:"rgba(0,200,5,0.05)", border:"1px solid rgba(0,200,5,0.18)", borderRadius:10, padding:"9px 12px", display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:13 }}>💸</span>
            <div style={{ fontSize:11, color:"#00A804", fontWeight:700 }}>1.5% fee — vs eBay (12.9%) or PayPal (3.49%+). Sellers keep more.</div>
          </div>
          <div style={{ padding:"12px 16px 24px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {filtered.map((item,i)=><div key={item.id} style={{ animation:`mp_fadeUp 0.3s ease ${i*0.04}s both` }}><MPItemCard item={item} onSelect={it=>{setSelected(it);setScreen("item");}}/></div>)}
            {filtered.length===0 && <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"40px 0", color:"#8892A4", fontSize:13 }}>No listings found</div>}
          </div>
        </div>
      )}

      {/* ── ITEM DETAIL ── */}
      {screen==="item" && selected && (
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflowY:"auto" }}>
          <div style={{ display:"flex", alignItems:"center", padding:"10px 16px", background:"#fff", borderBottom:"1px solid #F0F2F8" }}>
            <button onClick={()=>setScreen("browse")} style={{ background:"none", border:"none", cursor:"pointer", padding:"4px 8px 4px 0", fontSize:14, color:"#0057FF", fontWeight:600 }}>← Back</button>
            <div style={{ flex:1, textAlign:"center", fontSize:14, fontWeight:700, color:"#0D1117", marginRight:40 }}>{selected.cat}</div>
          </div>
          <div style={{ height:180, background:selected.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:72 }}>{selected.emoji}</div>
          <div style={{ flex:1, padding:"20px 20px 0" }}>
            <div style={{ fontSize:17, fontWeight:900, color:"#0D1117", letterSpacing:"-0.02em", lineHeight:1.3, marginBottom:8 }}>{selected.name}</div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
              <span style={{ fontSize:11, color:"#6B7385", background:"#F4F6FA", borderRadius:6, padding:"3px 8px", fontWeight:600 }}>{selected.condition}</span>
              {selected.verified && <span style={{ fontSize:10, color:"#00B07D", background:"rgba(0,176,125,0.08)", border:"1px solid rgba(0,176,125,0.2)", borderRadius:6, padding:"3px 8px", fontWeight:800 }}>✓ VERIFIED SELLER</span>}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 14px", background:"#F8F9FA", borderRadius:12, marginBottom:16 }}>
              <div style={{ width:38, height:38, borderRadius:"50%", background:"#E4E8F4", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:700, color:"#4B5563" }}>{selected.seller[0]}</div>
              <div><div style={{ fontSize:13, fontWeight:700, color:"#0D1117" }}>{selected.seller}</div><div style={{ fontSize:11, color:"#8892A4", marginTop:1 }}>{selected.sales} completed sales</div></div>
            </div>
            <div style={{ background:"#fff", border:"1px solid #EAECF0", borderRadius:14, overflow:"hidden", marginBottom:16 }}>
              {[{label:"Item price",val:`$${fmtMP(selected.price)}`},{label:"Platform fee",val:<span>$0.00 <span style={{fontSize:10,color:"#00B07D",fontWeight:700}}>(paid by seller)</span></span>},{label:"You pay",val:`$${fmtMP(selected.price)}`,bold:true}].map((r,i)=>(
                <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"12px 16px", background:r.bold?"#F8F9FA":"#fff", borderBottom:i<2?"1px solid #F4F6FA":"none" }}>
                  <span style={{ fontSize:r.bold?14:13, fontWeight:r.bold?800:400, color:r.bold?"#0D1117":"#6B7385" }}>{r.label}</span>
                  <span style={{ fontSize:r.bold?15:13, fontWeight:r.bold?900:700, color:"#0D1117" }}>{r.val}</span>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:8, padding:"10px 12px", background:"rgba(0,87,255,0.04)", border:"1px solid rgba(0,87,255,0.1)", borderRadius:10, marginBottom:20 }}>
              <span style={{ fontSize:14, flexShrink:0 }}>🔒</span>
              <div style={{ fontSize:11, color:"#4B5693", lineHeight:1.6 }}>Your payment is held in escrow until you confirm delivery. If the item doesn't arrive, you get a full refund.</div>
            </div>
          </div>
          <div style={{ padding:"0 20px 32px", background:"#F8F9FA" }}>
            <button onClick={handleBuy} disabled={checking} style={{ width:"100%", background:checking?"rgba(0,200,5,0.5)":"#00C805", border:"none", borderRadius:14, padding:"16px 0", color:"#fff", fontSize:16, fontWeight:800, cursor:checking?"not-allowed":"pointer" }}>
              {checking ? <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}><span style={{ width:16, height:16, border:"2.5px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", display:"inline-block", animation:"mp_spin 0.7s linear infinite" }}/>Processing...</span> : `Buy Now · $${fmtMP(selected.price)}`}
            </button>
          </div>
        </div>
      )}

      {/* ── CONFIRMED ── */}
      {screen==="confirmed" && selected && (
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 32px" }}>
          <div style={{ width:80, height:80, borderRadius:"50%", background:"rgba(0,200,5,0.1)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:24, animation:"mp_popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M7 18L15 26L29 10" stroke="#00C805" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div style={{ fontSize:24, fontWeight:900, color:"#0D1117", letterSpacing:"-0.03em", marginBottom:6 }}>Order placed!</div>
          <div style={{ fontSize:14, color:"#6B7385", marginBottom:6, textAlign:"center" }}>{selected.name}</div>
          <div style={{ fontSize:22, fontWeight:800, color:"#0D1117", marginBottom:28 }}>${fmtMP(selected.price)}</div>
          <div style={{ width:"100%", background:"rgba(0,87,255,0.04)", border:"1px solid rgba(0,87,255,0.12)", borderRadius:14, padding:"16px", marginBottom:16 }}>
            <div style={{ fontSize:12, fontWeight:800, color:"#0057FF", marginBottom:8, letterSpacing:"0.04em" }}>🔒 ESCROW ACTIVE</div>
            <div style={{ fontSize:12, color:"#4B5693", lineHeight:1.65 }}>Your ${fmtMP(selected.price)} is held securely. When you confirm delivery, the seller is paid instantly.</div>
          </div>
          <div style={{ fontSize:10, color:"#A0A8B8", textAlign:"center", lineHeight:1.7, marginBottom:28 }}>Settlement via USDC on Arbitrum One · No gas fees charged</div>
          <button onClick={()=>{setScreen("browse");setSelected(null);setChecking(false);}} style={{ width:"100%", background:"#0D1117", border:"none", borderRadius:14, padding:"14px 0", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer" }}>Continue Shopping</button>
        </div>
      )}

      {/* ── SELL ── */}
      {screen==="sell" && (
        <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
          <div style={{ display:"flex", alignItems:"center", padding:"10px 16px", background:"#fff", borderBottom:"1px solid #F0F2F8" }}>
            <button onClick={()=>{setScreen("browse");setSellStep("form");}} style={{ background:"none", border:"none", cursor:"pointer", padding:"4px 8px 4px 0", fontSize:14, color:"#0057FF", fontWeight:600 }}>← Back</button>
            <div style={{ flex:1, textAlign:"center", fontSize:14, fontWeight:700, color:"#0D1117", marginRight:40 }}>List an Item</div>
          </div>
          {sellStep==="form" ? (
            <div style={{ flex:1, overflowY:"auto", padding:"20px 20px 32px" }}>
              <div style={{ background:"#fff", border:"1px solid #EAECF0", borderRadius:14, overflow:"hidden", marginBottom:20 }}>
                <div style={{ padding:"12px 16px", borderBottom:"1px solid #F4F6FA", fontSize:12, fontWeight:800, color:"#0D1117" }}>Why sell here?</div>
                {[{p:"Tradeport",f:"1.5%",g:true},{p:"StockX",f:"9–10%"},{p:"eBay",f:"12.9%"},{p:"PayPal",f:"3.49%+"}].map((r,i)=>(
                  <div key={r.p} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 16px", background:r.g?"rgba(0,200,5,0.03)":"#fff", borderBottom:i<3?"1px solid #F4F6FA":"none" }}>
                    <span style={{ fontSize:13, fontWeight:r.g?700:400, color:r.g?"#0D1117":"#8892A4" }}>{r.p}{r.g?" ✓":""}</span>
                    <span style={{ fontSize:13, fontWeight:800, color:r.g?"#00C805":"#8892A4" }}>{r.f}</span>
                  </div>
                ))}
              </div>
              {[{k:"name",p:"Item name",t:"text"},{k:"condition",p:"Condition",t:"text"},{k:"price",p:"Your asking price ($)",t:"number"},{k:"desc",p:"Description (optional)",t:"text"}].map(f=>(
                <input key={f.k} type={f.t} placeholder={f.p} value={sellForm[f.k]} onChange={e=>setSellForm(prev=>({...prev,[f.k]:e.target.value}))} style={{ width:"100%", padding:"13px 16px", background:"#fff", border:"1.5px solid #E4E8F0", borderRadius:12, fontSize:14, color:"#0D1117", outline:"none", marginBottom:10, boxSizing:"border-box", fontFamily:"'DM Sans',sans-serif" }} onFocus={e=>e.target.style.borderColor="#0057FF"} onBlur={e=>e.target.style.borderColor="#E4E8F0"}/>
              ))}
              <button onClick={()=>setSellStep("listed")} disabled={!sellForm.name||!sellForm.price} style={{ width:"100%", background:sellForm.name&&sellForm.price?"#0D1117":"#E4E8F4", border:"none", borderRadius:14, padding:"16px 0", color:sellForm.name&&sellForm.price?"#fff":"#A0A8B8", fontSize:15, fontWeight:800, cursor:sellForm.name&&sellForm.price?"pointer":"not-allowed" }}>List for Sale →</button>
              <div style={{ fontSize:11, color:"#A0A8B8", textAlign:"center", marginTop:10, lineHeight:1.6 }}>You receive {sellForm.price?`$${fmtMP(sellForm.price*(0.985))}`:"—"} after the 1.5% fee. Paid instantly on delivery confirmation.</div>
            </div>
          ) : (
            <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 32px" }}>
              <div style={{ width:72, height:72, borderRadius:"50%", background:"rgba(0,200,5,0.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, marginBottom:20, animation:"mp_popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}>🎉</div>
              <div style={{ fontSize:22, fontWeight:900, color:"#0D1117", letterSpacing:"-0.02em", marginBottom:6 }}>Item Listed!</div>
              <div style={{ fontSize:14, color:"#6B7385", textAlign:"center", marginBottom:6 }}>{sellForm.name}</div>
              <div style={{ fontSize:20, fontWeight:800, color:"#0D1117", marginBottom:28 }}>{sellForm.price?`$${fmtMP(parseFloat(sellForm.price))}`:"—"}</div>
              <div style={{ fontSize:11, color:"#A0A8B8", textAlign:"center", lineHeight:1.7, marginBottom:28 }}>You'll be notified when someone buys. Payout is instant once they confirm delivery.</div>
              <button onClick={()=>{setScreen("orders");setSellStep("form");setSellForm({name:"",condition:"",price:"",desc:""}); }} style={{ width:"100%", background:"#0D1117", border:"none", borderRadius:14, padding:"14px 0", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", marginBottom:10 }}>View My Listings</button>
              <button onClick={()=>{setScreen("browse");setSellStep("form");setSellForm({name:"",condition:"",price:"",desc:""});}} style={{ width:"100%", background:"transparent", border:"1.5px solid #E4E8F0", borderRadius:14, padding:"14px 0", color:"#6B7385", fontSize:14, fontWeight:600, cursor:"pointer" }}>Back to Browse</button>
            </div>
          )}
        </div>
      )}

      {/* ── ORDERS ── */}
      {screen==="orders" && (
        <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
          <div style={{ display:"flex", alignItems:"center", padding:"10px 16px", background:"#fff", borderBottom:"1px solid #F0F2F8" }}>
            <button onClick={()=>setScreen("browse")} style={{ background:"none", border:"none", cursor:"pointer", padding:"4px 8px 4px 0", fontSize:14, color:"#0057FF", fontWeight:600 }}>← Back</button>
            <div style={{ flex:1, textAlign:"center", fontSize:14, fontWeight:700, color:"#0D1117", marginRight:40 }}>Activity</div>
          </div>
          <div style={{ display:"flex", margin:"12px 16px 0", background:"#F4F6FA", borderRadius:12, padding:3 }}>
            {["selling","buying"].map(t=><button key={t} onClick={()=>setOrderTab(t)} style={{ flex:1, background:orderTab===t?"#fff":"transparent", border:"none", borderRadius:10, padding:"8px 0", fontSize:12, fontWeight:700, color:orderTab===t?"#0D1117":"#8892A4", cursor:"pointer", boxShadow:orderTab===t?"0 1px 4px rgba(0,0,0,0.08)":"none", textTransform:"capitalize" }}>{t}</button>)}
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:"14px 16px 32px" }}>
            {(orderTab==="selling"?MP_MY_LISTINGS:MP_MY_PURCHASES).map((o,i)=>(
              <div key={o.id} style={{ background:"#fff", border:"1px solid #EAECF0", borderRadius:14, padding:"14px 16px", marginBottom:10, animation:`mp_fadeUp 0.3s ease ${i*0.06}s both` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                  <div style={{ flex:1, marginRight:10 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:"#0D1117", lineHeight:1.3, marginBottom:4 }}>{o.name}</div>
                    <div style={{ fontSize:11, color:"#8892A4" }}>{o.date}{orderTab==="selling"?` · ${o.views} views`:""}</div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontSize:15, fontWeight:900, color:"#0D1117" }}>${fmtMP(o.price)}</div>
                    <div style={{ fontSize:10, fontWeight:700, color:MP_STATUS_COLOR[o.status], marginTop:3 }}>{MP_STATUS_LABEL[o.status]}</div>
                  </div>
                </div>
                {o.status==="in_transit" && <button style={{ width:"100%", background:"rgba(0,200,5,0.08)", border:"1px solid rgba(0,200,5,0.25)", borderRadius:10, padding:"9px 0", color:"#00A804", fontSize:12, fontWeight:700, cursor:"pointer" }}>{orderTab==="selling"?"Awaiting delivery confirmation":"✓ Confirm Delivery"}</button>}
                {o.status==="sold" && <div style={{ fontSize:11, color:"#00B07D", fontWeight:600 }}>✓ Payout sent instantly</div>}
                {o.status==="active" && <button style={{ background:"transparent", border:"1px solid #E4E8F0", borderRadius:8, padding:"6px 12px", fontSize:11, color:"#6B7385", cursor:"pointer", fontWeight:600 }}>Edit listing</button>}
              </div>
            ))}
            <div style={{ background:"#F4F6FA", borderRadius:12, padding:"12px 14px", display:"flex", gap:8 }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:"#00B07D", marginTop:4, flexShrink:0 }}/>
              <div style={{ fontSize:10, color:"#A0A8B8", lineHeight:1.65 }}>All payments settle via USDC on Arbitrum One. Displayed in USD. No gas fees charged to buyers or sellers.</div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom nav */}
      {(screen==="browse"||screen==="orders") && (
        <div style={{ display:"flex", background:"#fff", borderTop:"1px solid #F0F2F8", padding:"10px 0 20px" }}>
          {[{id:"browse",label:"Browse",icon:"🏠"},{id:"sell",label:"Sell",icon:"+"},{id:"orders",label:"Activity",icon:"📦"}].map(n=>(
            <button key={n.id} onClick={()=>setScreen(n.id)} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3, background:"none", border:"none", cursor:"pointer", padding:"4px 0" }}>
              <span style={{ ...(n.id==="sell"?{width:32,height:32,background:"#0D1117",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:18}:{fontSize:18,lineHeight:1}) }}>{n.icon}</span>
              <span style={{ fontSize:10, fontWeight:700, color:screen===n.id?"#0D1117":"#A0A8B8" }}>{n.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── DEPLOY DATA ──────────────────────────────────────────────────────────────
const _ARB_USDC   = "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d"; // Circle USDC on Arbitrum Sepolia
const _LZ_ARB     = "0x6098e96a28E02f27B1e6BD381f870F1C8Cbccfa1"; // LayerZero v1 endpoint
const _ENTRYPOINT = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"; // ERC-4337 EntryPoint v0.6
const _AAVE_V3    = "0x794a61358D6845594F94dc1DB02A252b5b4814aD"; // Aave V3 Pool — Arbitrum One
const _CAMELOT    = "0x4ee15342d6Deb297c3A2aA7CFFd451f788675F53"; // Camelot SwapRouter V4 — Arbitrum One
const _UNISWAP_V3 = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45"; // Uniswap V3 SwapRouter02 — Arbitrum One
const _GMX_ROUTER = "0x1C3fa76e6E1088bCE750f23a5BFcffa1efEF6A41"; // GMX V2 Exchange Router — Arbitrum One
const _TIMEBOOST  = "0x0000000000000000000000000000000000000001"; // Timeboost ExpressLane — no public testnet address yet

const DEPLOY_DATA = {
  bot: {
    name: "ApexTradingBot",
    abi: [{"type":"constructor","inputs":[{"name":"_expressLane","type":"address"},{"name":"_aave","type":"address"},{"name":"_usdc","type":"address"}],"stateMutability":"nonpayable"}],
    bytecode: "0x60e06040526004805460ff19166001179055600f60055534801562000022575f80fd5b50604051620012c8380380620012c8833981016040819052620000459162000198565b33806200006c57604051631e4fbdf760e01b81525f60048201526024015b60405180910390fd5b62000077816200012d565b5060017f9b779b17422d0df92223018b32b4d1fa46e071723d6817e2486d003becc55f00556001600160a01b03831615801590620000bd57506001600160a01b03821615155b8015620000d257506001600160a01b03811615155b6200010f5760405162461bcd60e51b815260206004820152600c60248201526b5a65726f206164647265737360a01b604482015260640162000063565b6001600160a01b0392831660805290821660a0521660c052620001df565b5f80546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b80516001600160a01b038116811462000193575f80fd5b919050565b5f805f60608486031215620001ab575f80fd5b620001b6846200017c565b9250620001c6602085016200017c565b9150620001d6604085016200017c565b90509250925092565b60805160a05160c05161107f620002495f395f818161019401528181610608015281816106db0152818161096101528181610a480152610ac301525f8181610212015281816103a1015281816104100152610a1701525f81816101df01526108e8015261107f5ff3fe608060405260043610610108575f3560e01c8063808ac72a11610092578063b19aedf711610062578063b19aedf7146102fc578063d35c9a0714610311578063dfd200c514610330578063ef07e2411461034f578063f2fde38b1461036e575f80fd5b8063808ac72a146102745780638da5cb5b146102a25780639699c734146102be578063a48126db146102dd575f80fd5b8063438ac06d116100d8578063438ac06d146101ce578063664628cb146102015780636b26d48214610234578063715018a61461024957806374452ec31461025f575f80fd5b80631b11d0ff146101135780631dc0b2db146101475780632014e5d11461016a5780633e413bee14610183575f80fd5b3661010f57005b5f80fd5b34801561011e575f80fd5b5061013261012d366004610d42565b61038d565b60405190151581526020015b60405180910390f35b348015610152575f80fd5b5061015c60015481565b604051908152602001610138565b348015610175575f80fd5b506004546101329060ff1681565b34801561018e575f80fd5b506101b67f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b03909116815260200161013e565b3480156101d9575f80fd5b506101b67f000000000000000000000000000000000000000000000000000000000000000081565b34801561020c575f80fd5b506101b67f000000000000000000000000000000000000000000000000000000000000000081565b34801561023f575f80fd5b5061015c60025481565b348015610254575f80fd5b5061025d6104ca565b005b34801561026a575f80fd5b5061015c60035481565b34801561027f575f80fd5b5061013261028e366004610de0565b60066020525f908152604090205460ff1681565b3480156102ad575f80fd5b505f546001600160a01b03166101b6565b3480156102c9575f80fd5b5061025d6102d8366004610e0d565b6104dd565b3480156102e8575f80fd5b5061025d6102f7366004610e42565b610554565b348015610307575f80fd5b5061015c60055481565b34801561031c575f80fd5b5061025d61032b366004610e59565b61059c565b34801561033b575f80fd5b5061025d61034a366004610e81565b610760565b34801561035a575f80fd5b5061025d610369366004610e9c565b6107af565b348015610379575f80fd5b5061025d610388366004610de0565b610c25565b5f610396610c62565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146103ff5760405162461bcd60e51b81526020600482015260096024820152684f6e6c79204161766560b81b60448201526064015b60405180910390fd5b6001600160a01b03871663095ea7b37f0000000000000000000000000000000000000000000000000000000000000000610439888a610f07565b6040516001600160e01b031960e085901b1681526001600160a01b03909216600483015260248201526044016020604051808303815f875af1158015610481573d5f803e3d5ffd5b505050506040513d601f19601f820116820180604052508101906104a59190610f20565b50600190506104c060015f8051602061102a83398151915255565b9695505050505050565b6104d2610c7d565b6104db5f610ca9565b565b6104e5610c7d565b6001600160a01b03821661052a5760405162461bcd60e51b815260206004820152600c60248201526b5a65726f206164647265737360a01b60448201526064016103f6565b6001600160a01b03919091165f908152600660205260409020805460ff1916911515919091179055565b61055c610c7d565b60058110156105975760405162461bcd60e51b8152602060048201526007602482015266546f6f206c6f7760c81b60448201526064016103f6565b600555565b6105a4610c7d565b6105ac610c62565b6001600160a01b0382166105f15760405162461bcd60e51b815260206004820152600c60248201526b5a65726f206164647265737360a01b60448201526064016103f6565b6040516370a0823160e01b815230600482015281907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906370a0823190602401602060405180830381865afa158015610655573d5f803e3d5ffd5b505050506040513d601f19601f820116820180604052508101906106799190610f3b565b10156106b55760405162461bcd60e51b815260206004820152600b60248201526a4c6f772062616c616e636560a81b60448201526064016103f6565b60405163a9059cbb60e01b81526001600160a01b038381166004830152602482018390527f0000000000000000000000000000000000000000000000000000000000000000169063a9059cbb906044016020604051808303815f875af1158015610721573d5f803e3d5ffd5b505050506040513d601f19601f820116820180604052508101906107459190610f20565b5061075c60015f8051602061102a83398151915255565b5050565b610768610c7d565b6004805460ff19168215159081179091556040519081527fa8b5b5aec910fb274e8276fb25bf715b1184fc314bf7bebb76981a6f03bc0fe19060200160405180910390a150565b6107b7610c7d565b60045460ff166107f65760405162461bcd60e51b815260206004820152600a602482015269109bdd081c185d5cd95960b21b60448201526064016103f6565b6107fe610c62565b6001600160a01b0385165f9081526006602052604090205460ff16801561083c57506001600160a01b0384165f9081526006602052604090205460ff165b6108795760405162461bcd60e51b815260206004820152600e60248201526d0aadcc2e0e0e4deeccac840888ab60931b60448201526064016103f6565b5f8311801561088757508282115b6108c55760405162461bcd60e51b815260206004820152600f60248201526e496e76616c696420616d6f756e747360881b60448201526064016103f6565b801561094a576040516374bdda1560e01b815265b5e620f48000600482018190527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316916374bdda1591906024015f604051808303818588803b158015610932575f80fd5b505af1158015610944573d5f803e3d5ffd5b50505050505b6040516370a0823160e01b81523060048201525f907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906370a0823190602401602060405180830381865afa1580156109ae573d5f803e3d5ffd5b505050506040513d601f19601f820116820180604052508101906109d29190610f3b565b604080516001600160a01b0389811660208301528881168284015260608083018890528351808403909101815260808301938490526310ac2ddf60e21b9093529293507f0000000000000000000000000000000000000000000000000000000000000000909216916342b0b77c91610a759130917f0000000000000000000000000000000000000000000000000000000000000000918a91905f90608401610f52565b5f604051808303815f87803b158015610a8c575f80fd5b505af1158015610a9e573d5f803e3d5ffd5b50506040516370a0823160e01b81523060048201525f92508391506001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016906370a0823190602401602060405180830381865afa158015610b08573d5f803e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610b2c9190610f3b565b610b369190610fc8565b60055490915085610b4983612710610fdb565b610b539190610ff2565b1015610b935760405162461bcd60e51b815260206004820152600f60248201526e29b83932b0b2103a37b7903a3434b760891b60448201526064016103f6565b8060015f828254610ba49190610f07565b909155505060028054905f610bb883611011565b9091555050426003556040805182815284151560208201526001600160a01b038916917fe49fa075e2ee6f0aa00f444401601caba13b299045daef3ea2eef6462d052eac910160405180910390a25050610c1e60015f8051602061102a83398151915255565b5050505050565b610c2d610c7d565b6001600160a01b038116610c5657604051631e4fbdf760e01b81525f60048201526024016103f6565b610c5f81610ca9565b50565b610c6a610cf8565b60025f8051602061102a83398151915255565b5f546001600160a01b031633146104db5760405163118cdaa760e01b81523360048201526024016103f6565b5f80546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b5f8051602061102a833981519152546002036104db57604051633ee5aeb560e01b815260040160405180910390fd5b80356001600160a01b0381168114610d3d575f80fd5b919050565b5f805f805f8060a08789031215610d57575f80fd5b610d6087610d27565b95506020870135945060408701359350610d7c60608801610d27565b9250608087013567ffffffffffffffff80821115610d98575f80fd5b818901915089601f830112610dab575f80fd5b813581811115610db9575f80fd5b8a6020828501011115610dca575f80fd5b6020830194508093505050509295509295509295565b5f60208284031215610df0575f80fd5b610df982610d27565b9392505050565b8015158114610c5f575f80fd5b5f8060408385031215610e1e575f80fd5b610e2783610d27565b91506020830135610e3781610e00565b809150509250929050565b5f60208284031215610e52575f80fd5b5035919050565b5f8060408385031215610e6a575f80fd5b610e7383610d27565b946020939093013593505050565b5f60208284031215610e91575f80fd5b8135610df981610e00565b5f805f805f60a08688031215610eb0575f80fd5b610eb986610d27565b9450610ec760208701610d27565b935060408601359250606086013591506080860135610ee581610e00565b809150509295509295909350565b634e487b7160e01b5f52601160045260245ffd5b80820180821115610f1a57610f1a610ef3565b92915050565b5f60208284031215610f30575f80fd5b8151610df981610e00565b5f60208284031215610f4b575f80fd5b5051919050565b5f60018060a01b0380881683526020818816602085015286604085015260a06060850152855191508160a08501525f5b82811015610f9e5786810182015185820160c001528101610f82565b50505f60c0828501015260c0601f19601f8301168401019150506104c0608083018461ffff169052565b81810381811115610f1a57610f1a610ef3565b8082028115828204841417610f1a57610f1a610ef3565b5f8261100c57634e487b7160e01b5f52601260045260245ffd5b500490565b5f6001820161102257611022610ef3565b506001019056fe9b779b17422d0df92223018b32b4d1fa46e071723d6817e2486d003becc55f00a26469706673582212206d6b15bd3e07724c806322e60e6e6b8c23731a32fbc06a9e835c97ce0dc569e864736f6c63430008180033",
    args: () => [_TIMEBOOST, _AAVE_V3, _ARB_USDC],
  },
  escrow: {
    name: "ScopeEscrow",
    abi: [{"type":"constructor","inputs":[{"name":"_usdc","type":"address"}],"stateMutability":"nonpayable"}],
    bytecode: "0x60e060405234801562000010575f80fd5b50604051620013ee380380620013ee833981016040819052620000339162000186565b33806200005a57604051631e4fbdf760e01b81525f60048201526024015b60405180910390fd5b62000065816200011b565b5060017f9b779b17422d0df92223018b32b4d1fa46e071723d6817e2486d003becc55f00556001600160a01b03831615801590620000ab57506001600160a01b03821615155b8015620000c057506001600160a01b03811615155b620000fd5760405162461bcd60e51b815260206004820152600c60248201526b5a65726f206164647265737360a01b604482015260640162000051565b6001600160a01b0392831660805290821660a0521660c052620001cd565b5f80546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b80516001600160a01b038116811462000181575f80fd5b919050565b5f805f6060848603121562000199575f80fd5b620001a4846200016a565b9250620001b4602085016200016a565b9150620001c4604085016200016a565b90509250925092565b60805160a05160c0516111b7620002375f395f81816101ef015281816104f50152818161072c015281816108060152818161097d0152610a7701525f818161029d015261063501525f81816102d0015281816103a801528181610a480152610ae401526111b75ff3fe6080604052600436106100fc575f3560e01c8063a2d85a1b11610092578063cc2b785811610062578063cc2b7858146102f2578063d0679d3414610319578063e129729b14610338578063e257a33614610363578063f2fde38b14610376575f80fd5b8063a2d85a1b14610259578063ae9bb69214610284578063b0d691fe1461028c578063b353aaa7146102bf575f80fd5b80632b8a1c5a116100cd5780632b8a1c5a146101bf5780633e413bee146101de578063715018a6146102295780638da5cb5b1461023d575f80fd5b80621d3567146101075780630633b14a14610128578063248ec3261461016b5780632aead18414610191575f80fd5b3661010357005b5f80fd5b348015610112575f80fd5b50610126610121366004610e31565b610395565b005b348015610133575f80fd5b50610156610142366004610ed8565b60046020525f908152604090205460ff1681565b60405190151581526020015b60405180910390f35b348015610176575f80fd5b506101836402540be40081565b604051908152602001610162565b34801561019c575f80fd5b506101566101ab366004610efa565b60016020525f908152604090205460ff1681565b3480156101ca575f80fd5b506101266101d9366004610f1e565b610581565b3480156101e9575f80fd5b506102117f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b039091168152602001610162565b348015610234575f80fd5b5061012661060d565b348015610248575f80fd5b505f546001600160a01b0316610211565b348015610264575f80fd5b50610183610273366004610ed8565b60026020525f908152604090205481565b610126610620565b348015610297575f80fd5b506102117f000000000000000000000000000000000000000000000000000000000000000081565b3480156102ca575f80fd5b506102117f000000000000000000000000000000000000000000000000000000000000000081565b3480156102fd575f80fd5b50610306606e81565b60405161ffff9091168152602001610162565b348015610324575f80fd5b50610126610333366004610f55565b610699565b348015610343575f80fd5b50610183610352366004610ed8565b60036020525f908152604090205481565b610126610371366004610f7f565b6108d6565b348015610381575f80fd5b50610126610390366004610ed8565b610c06565b61039d610c43565b336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161461040c5760405162461bcd60e51b815260206004820152600f60248201526e139bdd08131688195b991c1bda5b9d608a1b60448201526064015b60405180910390fd5b5f828260405161041d929190610fdf565b60408051918290039091205f8181526001602052919091205490915060ff161561047d5760405162461bcd60e51b8152602060048201526011602482015270105b1c9958591e481c1c9bd8d95cdcd959607a1b6044820152606401610403565b5f8181526001602081905260408220805460ff19169091179055806104a484860186610f55565b90925090506001600160a01b0382166104cf5760405162461bcd60e51b815260040161040390610fee565b60405163a9059cbb60e01b81526001600160a01b038381166004830152602482018390527f0000000000000000000000000000000000000000000000000000000000000000169063a9059cbb906044016020604051808303815f875af115801561053b573d5f803e3d5ffd5b505050506040513d601f19601f8201168201806040525081019061055f9190611014565b5050505061057960015f8051602061116283398151915255565b505050505050565b610589610c5e565b6001600160a01b0382166105af5760405162461bcd60e51b815260040161040390610fee565b6001600160a01b0382165f81815260046020908152604091829020805460ff191685151590811790915591519182527f6fff6b51fc7f6641dd270e7981bc5cfcdf76fef18faa559aef714e9934c38743910160405180910390a25050565b610615610c5e565b61061e5f610c8a565b565b60405163b760faf960e01b81523060048201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063b760faf99034906024015f604051808303818588803b158015610680575f80fd5b505af1158015610692573d5f803e3d5ffd5b5050505050565b6106a1610c5e565b6106a9610c43565b6001600160a01b0382166106cf5760405162461bcd60e51b815260040161040390610fee565b5f811161070c5760405162461bcd60e51b815260206004820152600b60248201526a16995c9bc8185b5bdd5b9d60aa1b6044820152606401610403565b61071581610cd9565b6040516370a0823160e01b815230600482015281907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906370a0823190602401602060405180830381865afa158015610779573d5f803e3d5ffd5b505050506040513d601f19601f8201168201806040525081019061079d919061102f565b10156107e05760405162461bcd60e51b8152602060048201526012602482015271496e73756666696369656e742066756e647360701b6044820152606401610403565b60405163a9059cbb60e01b81526001600160a01b038381166004830152602482018390527f0000000000000000000000000000000000000000000000000000000000000000169063a9059cbb906044016020604051808303815f875af115801561084c573d5f803e3d5ffd5b505050506040513d601f19601f820116820180604052508101906108709190611014565b5060408051828152606e60208201525f8183015290516001600160a01b038416917f434d1cc1e624e9ee3e37f6ff8644b3cf1e43e32de5979edf0a87a80b9d87c8a8919081900360600190a26108d260015f8051602061116283398151915255565b5050565b6108de610c5e565b6108e6610c43565b804211156109205760405162461bcd60e51b8152602060048201526007602482015266115e1c1a5c995960ca1b6044820152606401610403565b5f821161095d5760405162461bcd60e51b815260206004820152600b60248201526a16995c9bc8185b5bdd5b9d60aa1b6044820152606401610403565b61096682610cd9565b6040516370a0823160e01b815230600482015282907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906370a0823190602401602060405180830381865afa1580156109ca573d5f803e3d5ffd5b505050506040513d601f19601f820116820180604052508101906109ee919061102f565b1015610a315760405162461bcd60e51b8152602060048201526012602482015271496e73756666696369656e742066756e647360701b6044820152606401610403565b60405163095ea7b360e01b81526001600160a01b037f000000000000000000000000000000000000000000000000000000000000000081166004830152602482018490527f0000000000000000000000000000000000000000000000000000000000000000169063095ea7b3906044016020604051808303815f875af1158015610abd573d5f803e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610ae19190611014565b507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663c580310034878787898989604051602001610b2a9392919061106e565b604051602081830303815290604052610b4a5f546001600160a01b031690565b5f60405180602001604052805f8152506040518963ffffffff1660e01b8152600401610b7c97969594939291906110d4565b5f604051808303818588803b158015610b93575f80fd5b505af1158015610ba5573d5f803e3d5ffd5b50506040805186815261ffff8a16602082015260018183015290515f94507f434d1cc1e624e9ee3e37f6ff8644b3cf1e43e32de5979edf0a87a80b9d87c8a89350908190036060019150a261069260015f8051602061116283398151915255565b610c0e610c5e565b6001600160a01b038116610c3757604051631e4fbdf760e01b81525f6004820152602401610403565b610c4081610c8a565b50565b610c4b610da7565b60025f8051602061116283398151915255565b5f546001600160a01b0316331461061e5760405163118cdaa760e01b8152336004820152602401610403565b5f80546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b335f90815260036020526040902054610cf5906201518061113c565b421115610d1b57335f908152600260209081526040808320839055600390915290204290555b335f908152600260205260409020546402540be40090610d3c90839061113c565b1115610d815760405162461bcd60e51b815260206004820152601460248201527311185a5b1e481b1a5b5a5d08195e18d95959195960621b6044820152606401610403565b335f9081526002602052604081208054839290610d9f90849061113c565b909155505050565b5f805160206111628339815191525460020361061e57604051633ee5aeb560e01b815260040160405180910390fd5b803561ffff81168114610de7575f80fd5b919050565b5f8083601f840112610dfc575f80fd5b50813567ffffffffffffffff811115610e13575f80fd5b602083019150836020828501011115610e2a575f80fd5b9250929050565b5f805f805f8060808789031215610e46575f80fd5b610e4f87610dd6565b9550602087013567ffffffffffffffff80821115610e6b575f80fd5b610e778a838b01610dec565b9097509550604089013591508082168214610e90575f80fd5b90935060608801359080821115610ea5575f80fd5b50610eb289828a01610dec565b979a9699509497509295939492505050565b6001600160a01b0381168114610c40575f80fd5b5f60208284031215610ee8575f80fd5b8135610ef381610ec4565b9392505050565b5f60208284031215610f0a575f80fd5b5035919050565b8015158114610c40575f80fd5b5f8060408385031215610f2f575f80fd5b8235610f3a81610ec4565b91506020830135610f4a81610f11565b809150509250929050565b5f8060408385031215610f66575f80fd5b8235610f7181610ec4565b946020939093013593505050565b5f805f805f60808688031215610f93575f80fd5b610f9c86610dd6565b9450602086013567ffffffffffffffff811115610fb7575f80fd5b610fc388828901610dec565b9699909850959660408101359660609091013595509350505050565b818382375f9101908152919050565b6020808252600c908201526b5a65726f206164647265737360a01b604082015260600190565b5f60208284031215611024575f80fd5b8151610ef381610f11565b5f6020828403121561103f575f80fd5b5051919050565b81835281816020850137505f828201602090810191909152601f909101601f19169091010190565b604081525f611081604083018587611046565b9050826020830152949350505050565b5f81518084525f5b818110156110b557602081850181015186830182015201611099565b505f602082860101526020601f19601f83011685010191505092915050565b61ffff8816815260c060208201525f6110f160c08301888a611046565b82810360408401526111038188611091565b6001600160a01b0387811660608601528616608085015283810360a0850152905061112e8185611091565b9a9950505050505050505050565b8082018082111561115b57634e487b7160e01b5f52601160045260245ffd5b9291505056fe9b779b17422d0df92223018b32b4d1fa46e071723d6817e2486d003becc55f00a264697066735822122059dffb4571067e5789ccdeed6c1b8ee334a9dd02de684fa0fac59815c493791864736f6c63430008180033",
    args: () => [_LZ_ARB, _ENTRYPOINT, _ARB_USDC],
  },
  game: {
    name: "BrainBlastGame",
    abi: [{"type":"constructor","inputs":[{"name":"_usdt","type":"address"},{"name":"_oracle","type":"address"}],"stateMutability":"nonpayable"}],
    bytecode: "0x60a0604052624c4b40600b55620f4240600c556096600d5534801562000023575f80fd5b50604051620022c1380380620022c18339810160408190526200004691620001fd565b336040518060400160405280600a815260200169109c985a5b909b185cdd60b21b81525060405180604001604052806005815260200164212920a4a760d91b815250815f9081620000989190620002d1565b506001620000a78282620002d1565b5050506001600160a01b038116620000d957604051631e4fbdf760e01b81525f60048201526024015b60405180910390fd5b620000e48162000190565b5060017f9b779b17422d0df92223018b32b4d1fa46e071723d6817e2486d003becc55f00556001600160a01b038216158015906200012a57506001600160a01b03811615155b620001675760405162461bcd60e51b815260206004820152600c60248201526b5a65726f206164647265737360a01b6044820152606401620000d0565b6001600160a01b03918216608052600e80546001600160a01b031916919092161790556200039d565b600680546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0905f90a35050565b80516001600160a01b0381168114620001f8575f80fd5b919050565b5f80604083850312156200020f575f80fd5b6200021a83620001e1565b91506200022a60208401620001e1565b90509250929050565b634e487b7160e01b5f52604160045260245ffd5b600181811c908216806200025c57607f821691505b6020821081036200027b57634e487b7160e01b5f52602260045260245ffd5b50919050565b601f821115620002cc57805f5260205f20601f840160051c81016020851015620002a85750805b601f840160051c820191505b81811015620002c9575f8155600101620002b4565b50505b505050565b81516001600160401b03811115620002ed57620002ed62000233565b6200030581620002fe845462000247565b8462000281565b602080601f8311600181146200033b575f8415620003235750858301515b5f19600386901b1c1916600185901b17855562000395565b5f85815260208120601f198616915b828110156200036b578886015182559484019460019091019084016200034a565b50858210156200038957878501515f19600388901b60f8161c191681555b505060018460011b0185555b505050505050565b608051611ee8620003d95f395f81816102c50152818161088b01528181610d8d01528181610e6101528181610f4901526110230152611ee85ff3fe608060405234801561000f575f80fd5b50600436106101e6575f3560e01c80637503e1b711610109578063b88d4fde1161009e578063f2fde38b1161006e578063f2fde38b146104e7578063f4a0a528146104fa578063f7c59d8e1461050d578063faf039f414610520575f80fd5b8063b88d4fde1461049b578063c87b56dd146104ae578063dd20a53e146104c1578063e985e9c5146104d4575f80fd5b806395d89b41116100d957806395d89b411461045a57806397b0cb8014610462578063a22cb46514610475578063a5275ebd14610488575f80fd5b80637503e1b7146103bb57806375794a3c1461043757806385a2efc3140610440578063852efc3d1461044057806308da5cb5b14610449575f80fd5b806323b872dd1161017f5780636352211e1161014f5780636352211e146103845780636817c76c1461039757806370a082311461039057806370a08231146103a0578063715018a6146103b3575f80fd5b806323b872dd146102ad5780632f48ab7d146102c057806342842e0e146102e75780634810bc59146102fa575f80fd5b8063081812fc116101ba578063081812fc14610269578063095ea7b31461027c5780631800a3491461029157806322dcd13e146102a4575f80fd5b806234c8e3146101ea57806301ffc9a71461021a578063027754101461023d57806306fdde0314610254575b5f80fd5b600e546101fd906001600160a01b031681565b6040516001600160a01b0390911681526020015b60405180910390f35b61022d610228366004611a3d565b610528565b6040519015158152602001610211565b610246600c5481565b604051908152602001610211565b61025c610579565b6040516102119190611aa5565b6101fd610277366004611ab7565b610608565b61028f61028a366004611ae9565b61062f565b005b61028f61029f366004611ab7565b61063e565b610246600d5481565b61028f6102bb366004611b11565b61068c565b6101fd7f000000000000000000000000000000000000000000000000000000000000000081565b61028f6102f5366004611b11565b610715565b610348610308366004611ab7565b60076020525f908152604090205460ff80821691610100810482169162010000820416906301000000810463ffffffff1690600160381b900461ffff1685565b6040805160ff96871681529486166020860152929094169183019190915263ffffffff16606082015261ffff909116608082015260a001610211565b6101fd610392366004611ab7565b610734565b610246600b5481565b6102466103ae366004611b4a565b61073e565b61028f610783565b6104046103c9366004611ab7565b60086020525f90815260409020805460018201546002830154600390930154919290916001600160a01b03811690600160a01b900460ff1685565b604080519586526020860194909452928401919091526001600160a01b031660608301521515608082015260a001610211565b61024660095481565b610246600a5481565b6006546001600160a01b03166101fd565b61025c610796565b61028f610470366004611b63565b6107a5565b61028f610483366004611b90565b61092d565b61028f610496366004611b4a565b610938565b61028f6104a9366004611bd9565b6109a7565b61025c6104bc366004611ab7565b6109bf565b61028f6104cf366004611ab7565b610a30565b61022d6104e2366004611cae565b610b54565b61028f6104f5366004611b4a565b610b81565b61028f610508366004611ab7565b610bbe565b61028f61051b366004611cdf565b610c03565b61028f610f29565b5f6001600160e01b031982166380ac58cd60e01b148061055857506001600160e01b03198216635b5e139f60e01b145b8061057357506301ffc9a760e01b6001600160e01b03198316145b92915050565b60605f805461058790611d00565b80601f01602080910402602001604051908101604052809291908181526020018280546105b390611d00565b80156105fe5780601f106105d5576101008083540402835291602001916105fe565b820191905f5260205f20905b8154815290600101906020018083116105e157829003601f168201915b5050505050905090565b5f61061282611276565b505f828152600460205260409020546001600160a01b0316610573565b61063a8282336112ae565b5050565b6106466112bb565b5f81116106875760405162461bcd60e51b815260040161067e906020808252600490820152635a65726f60e01b604082015260600190565b60405180910390fd5b600c55565b6001600160a01b0382166106b557604051633250574960e11b81525f600482015260240161067e565b5f6106c18383336112e8565b9050836001600160a01b0316816001600160a01b03161461070f576040516364283d7b60e01b81526001600160a01b038086166004830152602482018490528216604482015260640161067e565b50505050565b61072f83838360405180602001604052805f8152506109a7565b505050565b5f61057382611276565b5f6001600160a01b038216610768576040516322718ad960e21b81525f600482015260240161067e565b506001600160a01b03165f9081526003602052604090205490565b61078b6112bb565b6107945f6113da565b565b60606001805461058790611d00565b6107ad61142b565b5f8281526008602052604090206003810154600160a01b900460ff161580156107d95750806002015442105b6108105760405162461bcd60e51b8152602060048201526008602482015267496e61637469766560c01b604482015260640161067e565b3361081a83610734565b6001600160a01b0316146108655760405162461bcd60e51b81526020600482015260126024820152712737ba103cb7bab91031b430b930b1ba32b960711b604482015260640161067e565b600c546040516323b872dd60e01b815233600482015230602482015260448101919091527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906323b872dd906064016020604051808303815f875af11580156108d9573d5f803e3d5ffd5b505050506040513d601f19601f820116820180604052508101906108fd9190611d38565b50600c54815f015f8282546109129190611d67565b909155505060015f80516020611e9383398151915255505050565b61063a338383611446565b6109406112bb565b6001600160a01b0381166109855760405162461bcd60e51b815260206004820152600c60248201526b5a65726f206164647265737360a01b604482015260640161067e565b600e80546001600160a01b0319166001600160a01b0392909216919091179055565b6109b284848461068c565b61070f338585858561150d565b60606109ca82611276565b505f6109e060408051602081019091525f815290565b90505f8151116109fe5760405180602001604052805f815250610a29565b80610a0884611635565b604051602001610a19929190611d7a565b6040516020818303038152906040525b9392505050565b610a386112bb565b610e10811015610a765760405162461bcd60e51b8152602060048201526009602482015268151bdbc81cda1bdc9d60ba1b604482015260640161067e565b600a80545f9182610a8683611da8565b9091555090505f610a978342611d67565b6040805160a0810182525f80825242602080840191825283850186815260608501848152608086018581528a865260089093529386902094518555915160018501559051600284015590516003909201805491511515600160a01b026001600160a81b03199092166001600160a01b0393909316929092171790555190915082907fcbdd4006f4a0ca378f1c5d1f11060ba15bc180a12590dd3ea3c219454582939e90610b479084815260200190565b60405180910390a2505050565b6001600160a01b039182165f90815260056020908152604080832093909416825291909152205460ff1690565b610b896112bb565b6001600160a01b038116610bb257604051631e4fbdf760e01b81525f600482015260240161067e565b610bbb816113da565b50565b610bc66112bb565b5f8111610bfe5760405162461bcd60e51b815260040161067e906020808252600490820152635a65726f60e01b604082015260600190565b600b55565b600e546001600160a01b03163314610c4b5760405162461bcd60e51b815260206004820152600b60248201526a4f6e6c79206f7261636c6560a81b604482015260640161067e565b610c5361142b565b5f8281526008602052604090206003810154600160a01b900460ff1615610cae5760405162461bcd60e51b815260206004820152600f60248201526e105b1c9958591e481cd95d1d1b1959608a1b604482015260640161067e565b8060020154421015610cee5760405162461bcd60e51b8152602060048201526009602482015268139bdd08195b99195960ba1b604482015260640161067e565b6001600160a01b038216610d335760405162461bcd60e51b815260206004820152600c60248201526b5a65726f206164647265737360a01b604482015260640161067e565b6003810180546001600160a01b0384166001600160a81b031990911617600160a01b179055600d5481545f9161271091610d6d9190611dc0565b610d779190611deb565b90505f81835f0154610d899190611dfe565b90507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663a9059cbb610dcc6006546001600160a01b031690565b6040516001600160e01b031960e084901b1681526001600160a01b039091166004820152602481018590526044016020604051808303815f875af1158015610e16573d5f803e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610e3a9190611d38565b5060405163a9059cbb60e01b81526001600160a01b038581166004830152602482018390527f0000000000000000000000000000000000000000000000000000000000000000169063a9059cbb906044016020604051808303815f875af1158015610ea7573d5f803e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610ecb9190611d38565b50604080516001600160a01b03861681526020810183905286917fd2229b64b8173a9bdbc587584f008d394fbbf86deca3f504c250886b9c78feaa910160405180910390a250505061063a60015f80516020611e9383398151915255565b610f3161142b565b600b546040516370a0823160e01b81523360048201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906370a0823190602401602060405180830381865afa158015610f96573d5f803e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610fba9190611e11565b1015610ffd5760405162461bcd60e51b8152602060048201526012602482015271496e73756666696369656e742066756e647360701b6044820152606401610403565b600b546040516323b872dd60e01b815233600482015230602482015260448101919091527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906323b872dd906064016020604051808303815f875af1158015611071573d5f803e3d5ffd5b505050506040513d601f19601f820116820180604052508101906110959190611d38565b5060095460408051426020808301919091523360601b6bffffffffffffffffffffffff19168284015260548083019490945282518083039094018452607490910190915281519101205f6110ea603283611e28565b6110f5906032611d67565b90505f6111076032600885901c611e28565b611112906032611d67565b90505f6111246046601086901c611e28565b61112f90601e611d67565b6040805160a08101825260ff808716825285811660208084019182528286168486019081525f606086018181526080870182815260098054845260079095529790912095518654945192519151975161ffff16600160381b0268ffff000000000000001963ffffffff9990991663010000000266ffffffff0000001993881662010000029390931666ffffffffff0000199488166101000261ffff1990971692909716919091179490941791909116939093179290921793909316929092179055549091506111ff9033906116c5565b6009546040805191825260ff808616602084015284169082015233907f3743c0e20f4981631bacdc247daee9f3d55217a1386fb293b48a6f75d9d907569060600160405180910390a260098054905f61125783611da8565b91905055505050505061079460015f80516020611e9383398151915255565b5f818152600260205260408120546001600160a01b03168061057357604051637e27328960e01b81526004810184905260240161067e565b61072f83838360016116de565b6006546001600160a01b031633146107945760405163118cdaa760e01b815233600482015260240161067e565b5f828152600260205260408120546001600160a01b0390811690831615611314576113148184866117e2565b6001600160a01b0381161561134e5761132f5f855f806116de565b6001600160a01b0381165f90815260036020526040902080545f190190555b6001600160a01b0385161561137c576001600160a01b0385165f908152600360205260409020805460010190555b5f8481526002602052604080822080546001600160a01b0319166001600160a01b0389811691821790925591518793918516917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4949350505050565b600680546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0905f90a35050565b611433611846565b60025f80516020611e9383398151915255565b6001600160a01b03831661146f5760405163a9fbf51f60e01b81525f600482015260240161067e565b6001600160a01b0382166114a157604051630b61174360e31b81526001600160a01b038316600482015260240161067e565b6001600160a01b038381165f81815260056020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b6001600160a01b0383163b1561162e57604051630a85bd0160e11b81526001600160a01b0384169063150b7a029061154f908890889087908790600401611e3b565b6020604051808303815f875af1925050508015611589575060408051601f3d908101601f1916820190925261158691810190611e77565b60015b6115f0573d8080156115b6576040519150601f19603f3d011682016040523d82523d5f602084013e6115bb565b606091505b5080515f036115e857604051633250574960e11b81526001600160a01b038516600482015260240161067e565b805160208201fd5b6001600160e01b03198116630a85bd0160e11b1461162c57604051633250574960e11b81526001600160a01b038516600482015260240161067e565b505b5050505050565b60605f61164183611875565b60010190505f8167ffffffffffffffff81111561166057611660611bc5565b6040519080825280601f01601f19166020018201604052801561168a576020820181803683370190505b5090508181016020015b5f19016f181899199a1a9b1b9c1cb0b131b232b360811b600a86061a8153600a850494508461169457509392505050565b61063a828260405180602001604052805f81525061194c565b80806116f257506001600160a01b03821615155b156117b3575f61170184611276565b90506001600160a01b0383161580159061172d5750826001600160a01b0316816001600160a01b031614155b8015611740575061173e8184610b54565b155b156117695760405163a9fbf51f60e01b81526001600160a01b038416600482015260240161067e565b81156117b15783856001600160a01b0316826001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45b505b50505f90815260046020526040902080546001600160a01b0319166001600160a01b0392909216919091179055565b6117ed838383611963565b61072f576001600160a01b03831661181b57604051637e27328960e01b81526004810182905260240161067e565b60405163177e802f60e01b81526001600160a01b03831660048201526024810182905260440161067e565b5f80516020611e938339815191525460020361079457604051633ee5aeb560e01b815260040160405180910390fd5b5f8072184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b83106118b35772184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b830492506040015b6d04ee2d6d415b85acef810000000083106118df576d04ee2d6d415b85acef8100000000830492506020015b662386f26fc1000083106118fd57662386f26fc10000830492506010015b6305f5e1008310611915576305f5e100830492506008015b612710831061192957612710830492506004015b6064831061193b576064830492506002015b600a83106105735760010192915050565b61195683836119c7565b61072f335f85858561150d565b5f6001600160a01b038316158015906119bf5750826001600160a01b0316846001600160a01b0316148061199c575061199c8484610b54565b806119bf57505f828152600460205260409020546001600160a01b038481169116145b949350505050565b6001600160a01b0382166119f057604051633250574960e11b81525f600482015260240161067e565b5f6119fc83835f6112e8565b90506001600160a01b0381161561072f576040516339e3563760e11b81525f600482015260240161067e565b6001600160e01b031981168114610bbb575f80fd5b5f60208284031215611a4d575f80fd5b8135610a2981611a28565b5f5b83811015611a72578181015183820152602001611a5a565b50505f910152565b5f8151808452611a91816020860160208601611a58565b601f01601f19169290920160200192915050565b602081525f610a296020830184611a7a565b5f60208284031215611ac7575f80fd5b5035919050565b80356001600160a01b0381168114611ae4575f80fd5b919050565b5f8060408385031215611afa575f80fd5b611b0383611ace565b946020939093013593505050565b5f805f60608486031215611b23575f80fd5b611b2c84611ace565b9250611b3a60208501611ace565b9150604084013590509250925092565b5f60208284031215611b5a575f80fd5b610a2982611ace565b5f8060408385031215611b74575f80fd5b50508035926020909101359150565b8015158114610bbb575f80fd5b5f8060408385031215611ba1575f80fd5b611baa83611ace565b91506020830135611bba81611b83565b809150509250929050565b634e487b7160e01b5f52604160045260245ffd5b5f805f8060808587031215611bec575f80fd5b611bf585611ace565b9350611c0360208601611ace565b925060408501359150606085013567ffffffffffffffff80821115611c26575f80fd5b818701915087601f830112611c39575f80fd5b813581811115611c4b57611c4b611bc5565b604051601f8201601f19908116603f01168101908382118183101715611c7357611c73611bc5565b816040528281528a6020848701011115611c8b575f80fd5b826020860160208301375f60208483010152809550505050505092959194509250565b5f8060408385031215611cbf575f80fd5b611cc883611ace565b9150611cd660208401611ace565b90509250929050565b5f8060408385031215611cf0575f80fd5b82359150611cd660208401611ace565b600181811c90821680611d1457607f821691505b602082108103611d3257634e487b7160e01b5f52602260045260245ffd5b50919050565b5f60208284031215611d48575f80fd5b8151610a2981611b83565b634e487b7160e01b5f52601160045260245ffd5b8082018082111561057357610573611d53565b5f8351611d8b818460208801611a58565b835190830190611d9f818360208801611a58565b01949350505050565b5f60018201611db957611db9611d53565b5060010190565b808202811582820484141761057357610573611d53565b634e487b7160e01b5f52601260045260245ffd5b5f82611df957611df9611dd7565b500490565b8181038181111561057357610573611d53565b5f60208284031215611e21575f80fd5b5051919050565b5f82611e3657611e36611dd7565b500690565b6001600160a01b03858116825284166020820152604081018390526080606082018190525f90611e6d90830184611a7a565b9695505050505050565b5f60208284031215611e87575f80fd5b8151610a2981611a2856fe9b779b17422d0df92223018b32b4d1fa46e071723d6817e2486d003becc55f00a2646970667358221220a1a51f014f94cc04a0ec32a7ca8ea4caa34b908b0d7c27ea34cd0416a011da4364736f6c63430008180033",
    args: (deployer) => [_ARB_USDC, deployer],
  },
  marketplace: {
    name: "TradeportEscrow",
    abi: [{"type":"constructor","inputs":[{"name":"_usdc","type":"address"}],"stateMutability":"nonpayable"}],
    bytecode: "0x60a0604052609660065562093a8060075534801561001b575f80fd5b50604051620015d3380380620015d383398101604081905261003c91610135565b338061006257604051631e4fbdf760e01b81525f60048201526024015b60405180910390fd5b61006b816100e6565b5060017f9b779b17422d0df92223018b32b4d1fa46e071723d6817e2486d003becc55f00556001600160a01b0381166100d55760405162461bcd60e51b815260206004820152600c60248201526b5a65726f206164647265737360a01b6044820152606401610059565b6001600160a01b0316608052610162565b5f80546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b5f60208284031215610145575f80fd5b81516001600160a01b038116811461015b575f80fd5b9392505050565b60805161143c620001975f395f81816101da0152818161079401528181610a1a01528181610d820152610e5a015261143c5ff3fe608060405234801561000f575f80fd5b5060043610610127575f3560e01c8063715018a6116100a9578063a5c1674e1161006e578063a5c1674e146102cc578063e334e8dd146102df578063f2fde38b146102f2578063fd637a9414610305578063fd84cb971461030e575f80fd5b8063715018a61461029057806389cb29dd146102985780638da5cb5b146102a1578063a0ef4d0e146102b1578063a4f5df12146102b9575f80fd5b80633e413bee116100ef5780633e413bee146101d5578063459b860e146102145780634e0dd096146102275780634fc8a20d1461023a57806351d0ea371461026e575f80fd5b8063012f52ee1461012b57806312e8e2c31461015957806318f7f0881461016e57806322dcd13e146101ab5780632bc0b076146101c2575b5f80fd5b61013e610139366004610f95565b610321565b60405161015096959493929190610fc0565b60405180910390f35b61016c610167366004610f95565b6103f0565b005b61019b61017c366004611074565b600360209081525f928352604080842090915290825290205460ff1681565b6040519015158152602001610150565b6101b460065481565b604051908152602001610150565b61016c6101d03660046110ab565b61043f565b6101fc7f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b039091168152602001610150565b61016c610222366004610f95565b6104b6565b61016c610235366004610f95565b61056d565b61025c610248366004610f95565b60046020525f908152604090205460ff1681565b60405160ff9091168152602001610150565b61019b61027c3660046110e0565b60026020525f908152604090205460ff1681565b61016c6105b9565b6101b460055481565b5f546001600160a01b03166101fc565b61025c600381565b61016c6102c7366004611100565b6105cc565b61016c6102da366004610f95565b610877565b6101b46102ed366004611123565b610954565b61016c6103003660046110e0565b610c27565b6101b460075481565b61016c61031c366004610f95565b610c61565b600160208190525f91825260409091208054918101546002820154600383015460048401546005850180546001600160a01b0397881697909516959394929360ff9092169261036f906111a3565b80601f016020809104026020016040519081016040528092919081815260200182805461039b906111a3565b80156103e65780601f106103bd576101008083540402835291602001916103e6565b820191905f5260205f20905b8154815290600101906020018083116103c957829003601f168201915b5050505050905086565b6103f8610cf3565b6101f481111561043a5760405162461bcd60e51b81526020600482015260086024820152670a8dede40d0d2ced60c31b60448201526064015b60405180910390fd5b600655565b610447610cf3565b6001600160a01b03821661048c5760405162461bcd60e51b815260206004820152600c60248201526b5a65726f206164647265737360a01b6044820152606401610431565b6001600160a01b03919091165f908152600260205260409020805460ff1916911515919091179055565b6104be610d1f565b5f81815260016020526040812090600482015460ff1660038111156104e5576104e5610fac565b146105025760405162461bcd60e51b8152600401610431906111db565b806003015442116105495760405162461bcd60e51b81526020600482015260116024820152702bb4b73237bb9039ba34b6361037b832b760791b6044820152606401610431565b6105538282610d3a565b5061056a60015f805160206113e783398151915255565b50565b610575610cf3565b620151808110156105b45760405162461bcd60e51b8152602060048201526009602482015268151bdbc81cda1bdc9d60ba1b6044820152606401610431565b600755565b6105c1610cf3565b6105ca5f610f17565b565b6105d4610d1f565b335f9081526002602052604090205460ff166106235760405162461bcd60e51b815260206004820152600e60248201526d2737ba1030b93134ba3930ba37b960911b6044820152606401610431565b5f82815260036020908152604080832033845290915290205460ff161561067c5760405162461bcd60e51b815260206004820152600d60248201526c105b1c9958591e481d9bdd1959609a1b6044820152606401610431565b5f8281526003602090815260408083203384528252808320805460ff1916600117905584835260049091528120805460ff16916106b883611213565b82546101009290920a60ff8181021990931691831602179091555f848152600460205260409020546003911610905061085d575f8281526001602052604090206003600482015460ff16600381111561071357610713610fac565b1461074f5760405162461bcd60e51b815260206004820152600c60248201526b139bdd08191a5cdc1d5d195960a21b6044820152606401610431565b8115610851576004818101805460ff1916600290811790915582549083015460405163a9059cbb60e01b81526001600160a01b039283169381019390935260248301527f0000000000000000000000000000000000000000000000000000000000000000169063a9059cbb906044016020604051808303815f875af11580156107da573d5f803e3d5ffd5b505050506040513d601f19601f820116820180604052508101906107fe9190611231565b5080546002820154604080516001600160a01b039093168352602083019190915284917feac97bc1917fcedc984e3d0671d4e83b359890323d5d1c2de32b28d17c356ced910160405180910390a261085b565b61085b8382610d3a565b505b61087360015f805160206113e783398151915255565b5050565b5f81815260016020526040902080546001600160a01b03163314806108a8575060018101546001600160a01b031633145b6108e05760405162461bcd60e51b81526020600482015260096024820152684e6f7420706172747960b81b6044820152606401610431565b5f600482015460ff1660038111156108fa576108fa610fac565b146109175760405162461bcd60e51b8152600401610431906111db565b60048101805460ff1916600317905560405182907f04901f83201c8724eadf084436db8aa391820bae6d11f9f78a17edb6f2eef3cf905f90a25050565b5f61095d610d1f565b6001600160a01b0385161580159061097e57506001600160a01b0385163314155b6109bb5760405162461bcd60e51b815260206004820152600e60248201526d24b73b30b634b21039b2b63632b960911b6044820152606401610431565b5f84116109f85760405162461bcd60e51b815260206004820152600b60248201526a16995c9bc8185b5bdd5b9d60aa1b6044820152606401610431565b6040516323b872dd60e01b8152336004820152306024820152604481018590527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906323b872dd906064016020604051808303815f875af1158015610a68573d5f803e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610a8c9190611231565b5060058054905f610a9c8361124c565b9190505590506040518060c00160405280336001600160a01b03168152602001866001600160a01b0316815260200185815260200160075442610adf9190611264565b81526020015f815260200184848080601f0160208091040260200160405190810160405280939291908181526020018383808284375f92018290525093909452505083815260016020818152604092839020855181546001600160a01b03199081166001600160a01b03928316178355928701518285018054909416911617909155918401516002830155606084015160038084019190915560808501516004840180549495509093909260ff19909116918490811115610ba257610ba2610fac565b021790555060a08201516005820190610bbb90826112dd565b5050604080513381526001600160a01b03881660208201529081018690528291507f9405ad0a6208539879349284d71265479b1623846f70303da1f9890d6e8c10a79060600160405180910390a2610c1f60015f805160206113e783398151915255565b949350505050565b610c2f610cf3565b6001600160a01b038116610c5857604051631e4fbdf760e01b81525f6004820152602401610431565b61056a81610f17565b610c69610d1f565b5f81815260016020526040902080546001600160a01b03163314610cbc5760405162461bcd60e51b815260206004820152600a60248201526927b7363c90313abcb2b960b11b6044820152606401610431565b5f600482015460ff166003811115610cd657610cd6610fac565b146105495760405162461bcd60e51b8152600401610431906111db565b5f546001600160a01b031633146105ca5760405163118cdaa760e01b8152336004820152602401610431565b610d27610f66565b60025f805160206113e783398151915255565b60048101805460ff1916600117905560065460028201545f9161271091610d61919061139d565b610d6b91906113b4565b90505f818360020154610d7e91906113d3565b90507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663a9059cbb610dc05f546001600160a01b031690565b6040516001600160e01b031960e084901b1681526001600160a01b039091166004820152602481018590526044016020604051808303815f875af1158015610e0a573d5f803e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610e2e9190611231565b50600183015460405163a9059cbb60e01b81526001600160a01b039182166004820152602481018390527f00000000000000000000000000000000000000000000000000000000000000009091169063a9059cbb906044016020604051808303815f875af1158015610ea2573d5f803e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610ec69190611231565b506001830154604080516001600160a01b0390921682526020820183905285917f6244ed823ca6be0f11bc890c3fafcf3c29cb23420c14243642e930b5e07e6d0a910160405180910390a250505050565b5f80546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b5f805160206113e7833981519152546002036105ca57604051633ee5aeb560e01b815260040160405180910390fd5b5f60208284031215610fa5575f80fd5b5035919050565b634e487b7160e01b5f52602160045260245ffd5b5f60018060a01b0380891683526020818916602085015287604085015286606085015260048610610fff57634e487b7160e01b5f52602160045260245ffd5b85608085015260c060a0850152845191508160c08501525f5b828110156110345785810182015185820160e001528101611018565b50505f60e0828501015260e0601f19601f830116840101915050979650505050505050565b80356001600160a01b038116811461106f575f80fd5b919050565b5f8060408385031215611085575f80fd5b8235915061109560208401611059565b90509250929050565b801515811461056a575f80fd5b5f80604083850312156110bc575f80fd5b6110c583611059565b915060208301356110d58161109e565b809150509250929050565b5f602082840312156110f0575f80fd5b6110f982611059565b9392505050565b5f8060408385031215611111575f80fd5b8235915060208301356110d58161109e565b5f805f8060608587031215611136575f80fd5b61113f85611059565b935060208501359250604085013567ffffffffffffffff80821115611162575f80fd5b818701915087601f830112611175575f80fd5b813581811115611183575f80fd5b886020828501011115611194575f80fd5b95989497505060200194505050565b600181811c908216806111b757607f821691505b6020821081036111d557634e487b7160e01b5f52602260045260245ffd5b50919050565b6020808252600a90820152694e6f742061637469766560b01b604082015260600190565b634e487b7160e01b5f52601160045260245ffd5b5f60ff821660ff8103611228576112286111ff565b60010192915050565b5f60208284031215611241575f80fd5b81516110f98161109e565b5f6001820161125d5761125d6111ff565b5060010190565b80820180821115611277576112776111ff565b92915050565b634e487b7160e01b5f52604160045260245ffd5b601f8211156112d857805f5260205f20601f840160051c810160208510156112b65750805b601f840160051c820191505b818110156112d5575f81556001016112c2565b50505b505050565b815167ffffffffffffffff8111156112f7576112f761127d565b61130b8161130584546111a3565b84611291565b602080601f83116001811461133e575f84156113275750858301515b5f19600386901b1c1916600185901b178555611395565b5f85815260208120601f198616915b8281101561136c5788860151825594840194600190910190840161134d565b508582101561138957878501515f19600388901b60f8161c191681555b505060018460011b0185555b505050505050565b8082028115828204841417611277576112776111ff565b5f826113ce57634e487b7160e01b5f52601260045260245ffd5b500490565b81810381811115611277576112776111ff56fe9b779b17422d0df92223018b32b4d1fa46e071723d6817e2486d003becc55f00a26469706673582212200b52ae38755fb47c5394fda9523877185a577f9dba520e2dabb4cd9241afd28864736f6c63430008180033",
    args: () => [_ARB_USDC],
  },
};

// ─── DEPLOY PANEL ─────────────────────────────────────────────────────────────
function DeployPanel({ demoType }) {
  const [phase, setPhase] = useState("idle");
  const [walletAddr, setWalletAddr] = useState(null);
  const [networkOk, setNetworkOk] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [contractAddr, setContractAddr] = useState(null);
  const [errMsg, setErrMsg] = useState(null);

  const ARB_CHAIN = 421614n;
  const ARB_HEX   = "0x66eee";
  const SCAN      = "https://sepolia.arbiscan.io";
  const short     = (a) => a ? `${a.slice(0,6)}...${a.slice(-4)}` : "";

  async function connect() {
    if (!window.ethereum) { setErrMsg("MetaMask not found. Install MetaMask to deploy."); setPhase("err"); return; }
    setPhase("connecting"); setErrMsg(null);
    try {
      const { ethers } = await import("https://esm.sh/ethers@6");
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();
      const net  = await provider.getNetwork();
      setWalletAddr(addr);
      setNetworkOk(net.chainId === ARB_CHAIN);
      setPhase("connected");
    } catch(e) { setErrMsg(e.message?.slice(0, 120) || "Connection failed"); setPhase("err"); }
  }

  async function switchNetwork() {
    setPhase("switching");
    try {
      await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: ARB_HEX }] });
      setNetworkOk(true); setPhase("connected");
    } catch(e) {
      if (e.code === 4902) {
        try {
          await window.ethereum.request({ method: "wallet_addEthereumChain", params: [{ chainId: ARB_HEX, chainName: "Arbitrum Sepolia", nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 }, rpcUrls: ["https://sepolia-rollup.arbitrum.io/rpc"], blockExplorerUrls: [SCAN] }] });
          setNetworkOk(true); setPhase("connected");
        } catch(e2) { setErrMsg(e2.message?.slice(0, 120)); setPhase("err"); }
      } else { setErrMsg(e.message?.slice(0, 120)); setPhase("err"); }
    }
  }

  async function deployContract() {
    setPhase("deploying"); setErrMsg(null);
    try {
      const { ethers } = await import("https://esm.sh/ethers@6");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer   = await provider.getSigner();
      const deployer = await signer.getAddress();
      const d    = DEPLOY_DATA[demoType] || DEPLOY_DATA.marketplace;
      const args = d.args(deployer);
      const factory  = new ethers.ContractFactory(d.abi, d.bytecode, signer);
      const contract = await factory.deploy(...args);
      setTxHash(contract.deploymentTransaction().hash);
      setPhase("pending");
      await contract.waitForDeployment();
      setContractAddr(await contract.getAddress());
      setPhase("done");
    } catch(e) { setErrMsg(e.message?.slice(0, 150) || "Deploy failed"); setPhase("connected"); }
  }

  const d = DEPLOY_DATA[demoType] || DEPLOY_DATA.marketplace;

  if (phase === "done") return (
    <div style={{ background: "rgba(0,200,5,0.06)", border: "1px solid rgba(0,200,5,0.2)", borderRadius: 12, padding: 20 }}>
      <div style={{ fontSize: 10, color: T.green, letterSpacing: "0.1em", marginBottom: 14, fontWeight: 700 }}>CONTRACT DEPLOYED ✓</div>
      <div style={{ fontSize: 11, color: T.textDim, marginBottom: 4, fontFamily: "'DM Mono',monospace" }}>CONTRACT ADDRESS</div>
      <div style={{ fontSize: 11, color: T.accent, fontFamily: "'DM Mono',monospace", wordBreak: "break-all", marginBottom: 14 }}>{contractAddr}</div>
      <a href={`${SCAN}/address/${contractAddr}`} target="_blank" rel="noreferrer" style={{ display: "block", textAlign: "center", color: T.accent, fontSize: 12, textDecoration: "none", background: T.accentGlow, border: `1px solid ${T.accentBorder}`, borderRadius: 7, padding: "10px 0", marginBottom: 8, fontWeight: 700, fontFamily: "'Syne',sans-serif" }}>View on Arbiscan →</a>
      <a href={`${SCAN}/tx/${txHash}`} target="_blank" rel="noreferrer" style={{ display: "block", textAlign: "center", color: T.textDim, fontSize: 10, textDecoration: "none" }}>Deploy tx: {short(txHash)}</a>
    </div>
  );

  if (phase === "pending") return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20 }}>
      <div style={{ fontSize: 10, color: T.textDim, letterSpacing: "0.1em", marginBottom: 14 }}>DEPLOY TO TESTNET</div>
      <div style={{ textAlign: "center", padding: "16px 0" }}>
        <div style={{ fontSize: 13, color: T.text, marginBottom: 10 }}>⏳ Confirming on-chain...</div>
        <a href={`${SCAN}/tx/${txHash}`} target="_blank" rel="noreferrer" style={{ color: T.accent, fontSize: 11, textDecoration: "none", border: `1px solid ${T.accentBorder}`, borderRadius: 6, padding: "6px 14px" }}>View tx on Arbiscan →</a>
      </div>
    </div>
  );

  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20 }}>
      <div style={{ fontSize: 10, color: T.textDim, letterSpacing: "0.1em", marginBottom: 14 }}>DEPLOY TO TESTNET</div>
      {(phase === "idle" || phase === "connecting" || phase === "err") && (
        <>
          <button onClick={connect} disabled={phase === "connecting"} style={{ width: "100%", background: T.accentGlow, border: `1px solid ${T.accentBorder}`, borderRadius: 8, padding: "12px 0", color: T.accent, fontSize: 12, fontWeight: 800, cursor: phase === "connecting" ? "not-allowed" : "pointer", fontFamily: "'Syne',sans-serif", letterSpacing: "0.08em", opacity: phase === "connecting" ? 0.6 : 1 }}>
            {phase === "connecting" ? "Connecting..." : "Connect MetaMask"}
          </button>
          <div style={{ fontSize: 10, color: T.textDim, marginTop: 8, textAlign: "center" }}>MetaMask required — deploying {d.name} to Arbitrum Sepolia</div>
        </>
      )}
      {(phase === "connected" || phase === "switching" || phase === "deploying") && (
        <>
          <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 7, padding: "8px 12px", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 9, color: T.textDim, letterSpacing: "0.08em" }}>WALLET</div>
              <div style={{ fontSize: 11, color: T.text, fontFamily: "'DM Mono',monospace" }}>{short(walletAddr)}</div>
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, color: networkOk ? T.green : T.amber }}>
              {networkOk ? "✓ Arb Sepolia" : "⚠ Wrong Network"}
            </div>
          </div>
          {!networkOk ? (
            <button onClick={switchNetwork} disabled={phase === "switching"} style={{ width: "100%", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 8, padding: "12px 0", color: T.amber, fontSize: 12, fontWeight: 800, cursor: phase === "switching" ? "not-allowed" : "pointer", fontFamily: "'Syne',sans-serif", letterSpacing: "0.08em", opacity: phase === "switching" ? 0.6 : 1 }}>
              {phase === "switching" ? "Switching..." : "Switch to Arbitrum Sepolia"}
            </button>
          ) : (
            <button onClick={deployContract} disabled={phase === "deploying"} style={{ width: "100%", background: T.accentGlow, border: `1px solid ${T.accentBorder}`, borderRadius: 8, padding: "12px 0", color: T.accent, fontSize: 12, fontWeight: 800, cursor: phase === "deploying" ? "not-allowed" : "pointer", fontFamily: "'Syne',sans-serif", letterSpacing: "0.08em", opacity: phase === "deploying" ? 0.6 : 1 }}>
              {phase === "deploying" ? "Sign in MetaMask..." : `Deploy ${d.name} →`}
            </button>
          )}
          <div style={{ fontSize: 10, color: T.textDim, marginTop: 8, textAlign: "center" }}>Arbitrum Sepolia testnet · chain ID 421614</div>
        </>
      )}
      {errMsg && (
        <div style={{ fontSize: 11, color: T.red, marginTop: 10, padding: "8px 10px", background: "rgba(239,68,68,0.07)", borderRadius: 6, border: "1px solid rgba(239,68,68,0.15)" }}>
          {errMsg}
          <button onClick={() => { setPhase("idle"); setErrMsg(null); }} style={{ display: "block", marginTop: 6, background: "none", border: "none", color: T.accent, cursor: "pointer", fontSize: 11, padding: 0 }}>Try again</button>
        </div>
      )}
    </div>
  );
}

// ─── OUTPUT SCREEN ─────────────────────────────────────────────────────────────
function OutputScreen({ product, prompt, demoId, t, onReset }) {
  const [tab, setTab] = useState("preview");
  const [copied, setCopied] = useState(false);

  const previewMap = { bot: BotPreview, escrow: ScopePreview, game: GamePreview, marketplace: MarketplacePreview };
  const Preview = previewMap[product.productType] || previewMap[demoId] || BotPreview;

  const deployColor = {
    "Arbitrum One": T.accent,
    "Robinhood Chain": T.green,
    "Arbitrum + LayerZero": T.amber,
  }[product.deployTarget] || T.accent;

  const auditFindings = product.auditFindings || [];
  const auditScore = product.auditScore ?? null;
  const auditGrade = product.auditGrade ?? "?";
  const hasVulns = auditFindings.some(f => f.status === "vulnerable" && (f.severity === "critical" || f.severity === "high"));
  const hasMedium = auditFindings.some(f => f.status === "vulnerable" && f.severity === "medium");
  const secColor = hasVulns ? T.red : hasMedium ? T.amber : T.green;

  return (
    <div style={{ animation: "vb3FadeUp 0.5s ease both" }}>
      {/* Product header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 10, color: T.accent, letterSpacing: "0.12em", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.green, display: "inline-block", animation: "vb3Pulse 2s ease-in-out infinite" }} />
              PRODUCT READY
            </div>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 28, color: T.text, margin: 0, letterSpacing: "-0.02em" }}>{product.productName}</h2>
            <p style={{ color: T.textMuted, fontSize: 14, margin: "6px 0 0", lineHeight: 1.5 }}>{product.tagline}</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <div style={{ background: `${deployColor}12`, border: `1px solid ${deployColor}30`, borderRadius: 8, padding: "6px 12px", fontSize: 11, color: deployColor, fontWeight: 700, letterSpacing: "0.06em" }}>
              {product.deployTarget}
            </div>
            <div style={{ background: `${secColor}12`, border: `1px solid ${secColor}30`, borderRadius: 8, padding: "6px 12px", fontSize: 11, color: secColor, fontWeight: 700 }}>
              🔒 {auditScore !== null ? `Grade ${auditGrade} · ${auditScore}/100` : "Security Audit"}
            </div>
            <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 8, padding: "6px 12px", fontSize: 11, color: T.green, fontWeight: 700 }}>
              ⏱ {product.estimatedLaunchTime}
            </div>
          </div>
        </div>
      </div>

      {/* Tab row */}
      <div style={{ display: "flex", gap: 6, marginBottom: 18, borderBottom: `1px solid ${T.border}`, paddingBottom: 0 }}>
        {[
          { id: "preview",  label: "🖥 Live Preview" },
          { id: "frontend", label: "📐 Frontend Plan" },
          { id: "contract", label: "📄 Contract" },
          { id: "security", label: "🔒 Security" },
          { id: "launch",   label: "🚀 Launch" },
        ].map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)} style={{ background: "none", border: "none", borderBottom: `2px solid ${tab === tb.id ? T.accent : "transparent"}`, padding: "8px 14px", cursor: "pointer", color: tab === tb.id ? T.accent : T.textMuted, fontSize: 12, fontWeight: tab === tb.id ? 700 : 400, fontFamily: "'DM Mono',monospace", letterSpacing: "0.03em", transition: "all 0.15s", marginBottom: -1 }}>{tb.label}</button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "preview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: 10, color: T.textDim, letterSpacing: "0.1em", marginBottom: 10, alignSelf: "flex-start" }}>LIVE PRODUCT PREVIEW</div>
            <Preview product={product} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* What users see */}
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 10, color: T.green, letterSpacing: "0.1em", marginBottom: 10, fontWeight: 700 }}>✓ WHAT USERS EXPERIENCE</div>
              {(product.visibleUX || []).map((ux, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 7, fontSize: 12, color: T.textMuted, lineHeight: 1.5 }}>
                  <span style={{ color: T.green, flexShrink: 0 }}>→</span> {ux}
                </div>
              ))}
            </div>
            {/* What's invisible */}
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 10, color: T.textDim, letterSpacing: "0.1em", marginBottom: 10, fontWeight: 700 }}>🔒 INVISIBLE INFRASTRUCTURE</div>
              {(product.invisibleTech || []).map((tech, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 7, fontSize: 12, color: T.textDim, lineHeight: 1.5 }}>
                  <span style={{ flexShrink: 0 }}>·</span> {tech}
                </div>
              ))}
            </div>
            {/* Revenue */}
            {product.revenueModel && (
              <div style={{ background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 10, color: T.green, letterSpacing: "0.1em", marginBottom: 8, fontWeight: 700 }}>💰 REVENUE MODEL</div>
                <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.6 }}>{product.revenueModel}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "frontend" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 10, color: T.textDim, letterSpacing: "0.1em", marginBottom: 14 }}>PAGES & SCREENS</div>
            {(product.frontend?.pages || []).map((page, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, marginBottom: 7 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.accent, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: T.text }}>{page}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 10, color: T.textDim, letterSpacing: "0.1em", marginBottom: 14 }}>KEY FEATURES</div>
              {(product.frontend?.keyFeatures || []).map((f, i) => (
                <div key={i} style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.6, marginBottom: 8, display: "flex", gap: 8 }}>
                  <span style={{ color: T.accent, flexShrink: 0 }}>✓</span> {f}
                </div>
              ))}
            </div>
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 10, color: T.textDim, letterSpacing: "0.1em", marginBottom: 8 }}>TECH STACK</div>
              <div style={{ fontSize: 12, color: T.textMuted }}>{product.frontend?.techStack}</div>
            </div>
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 10, color: T.textDim, letterSpacing: "0.1em", marginBottom: 8 }}>USER JOURNEY</div>
              <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.7 }}>{product.frontend?.userFlowSummary}</div>
            </div>
          </div>
        </div>
      )}

      {tab === "contract" && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: T.text, fontWeight: 600 }}>{product.contract?.name}</span>
              <span style={{ fontSize: 11, color: T.textDim }}>{(product.contract?.code || "").split("\n").length} lines</span>
            </div>
            <button onClick={() => { navigator.clipboard.writeText(product.contract?.code || ""); setCopied(true); setTimeout(() => setCopied(false), 1800); }} style={{ background: "transparent", border: `1px solid ${T.border}`, borderRadius: 6, padding: "4px 12px", cursor: "pointer", fontFamily: "'DM Mono',monospace", fontSize: 10, color: copied ? T.green : T.textDim, letterSpacing: "0.05em" }}>{copied ? "✓ COPIED" : "COPY"}</button>
          </div>
          <div style={{ background: "#060810", border: `1px solid ${T.border}`, borderRadius: 12, padding: "14px 0", maxHeight: 440, overflowY: "auto" }}>
            <pre style={{ fontFamily: "'DM Mono',monospace", fontSize: 11.5, lineHeight: 1.75, margin: 0 }}>
              {(product.contract?.code || "// No contract generated").split("\n").map((line, i) => (
                <div key={i} style={{ display: "flex", paddingLeft: 12 }}>
                  <span style={{ color: "rgba(255,255,255,0.15)", minWidth: 30, userSelect: "none", fontSize: 10, paddingTop: 1, flexShrink: 0 }}>{i + 1}</span>
                  <span style={{ color: "#e2e8f0" }}>{line || " "}</span>
                </div>
              ))}
            </pre>
          </div>
          <div style={{ marginTop: 12, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 16px", fontSize: 12, color: T.textMuted, lineHeight: 1.6 }}>
            {product.contract?.summary}
          </div>
        </div>
      )}


      {tab === "security" && (() => {
        const findings = product.auditFindings || product.security || [];
        const score = product.auditScore ?? 72;
        const grade = product.auditGrade ?? "B";
        const sevColor = { critical:"#ef4444", high:"#f97316", medium:"#f59e0b", low:"#12AAFF", info:"rgba(255,255,255,0.35)" };
        const sevBg    = { critical:"rgba(239,68,68,0.07)", high:"rgba(249,115,22,0.07)", medium:"rgba(245,158,11,0.06)", low:"rgba(18,170,255,0.06)", info:"rgba(255,255,255,0.02)" };
        const sevBorder= { critical:"rgba(239,68,68,0.25)", high:"rgba(249,115,22,0.22)", medium:"rgba(245,158,11,0.2)", low:"rgba(18,170,255,0.2)", info:"rgba(255,255,255,0.06)" };
        const statusColors = { vulnerable:{ bg:"rgba(239,68,68,0.1)", text:"#ef4444", label:"VULNERABLE" }, patched:{ bg:"rgba(34,197,94,0.08)", text:"#22c55e", label:"PATCHED" }, acknowledged:{ bg:"rgba(245,158,11,0.08)", text:"#f59e0b", label:"NOTED" } };
        const gradeColor = grade === "A" ? T.green : grade === "B" ? T.amber : T.red;
        const vulnCount = findings.filter(f => f.status === "vulnerable").length;
        const critCount = findings.filter(f => f.severity === "critical" && f.status === "vulnerable").length;
        const patchCount = findings.filter(f => f.status === "patched").length;
        return (
          <div>
            {/* Score header */}
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto auto auto", gap: 12, alignItems: "center", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: "18px 22px", marginBottom: 16 }}>
              <div style={{ textAlign: "center", padding: "0 16px 0 0", borderRight: `1px solid ${T.border}` }}>
                <div style={{ fontSize: 42, fontWeight: 900, color: gradeColor, fontFamily: "'Syne',sans-serif", lineHeight: 1 }}>{grade}</div>
                <div style={{ fontSize: 9, color: T.textDim, letterSpacing: "0.1em", marginTop: 4 }}>AUDIT GRADE</div>
              </div>
              <div style={{ paddingLeft: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 6 }}>Security Audit Complete</div>
                <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden", marginBottom: 5 }}>
                  <div style={{ height: "100%", width: `${score}%`, background: `linear-gradient(90deg,${score>80?T.green:score>60?T.amber:T.red},${score>80?"#00ff88":score>60?"#fbbf24":"#f87171"})`, borderRadius: 3, transition: "width 1s ease" }} />
                </div>
                <div style={{ fontSize: 11, color: T.textMuted }}>{score}/100 security score · Slither static analysis + AI second-pass audit</div>
              </div>
              {[
                { val: findings.length, label: "Total Findings", color: T.textMuted },
                { val: vulnCount, label: "Needs Fix", color: vulnCount > 0 ? T.red : T.green },
                { val: patchCount, label: "Secure", color: T.green },
              ].map(s => (
                <div key={s.label} style={{ textAlign: "center", padding: "0 16px", borderLeft: `1px solid ${T.border}` }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: 9, color: T.textDim, letterSpacing: "0.08em" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Mainnet warning if issues */}
            {(critCount > 0 || vulnCount > 2) && (
              <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 16, display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#ef4444", marginBottom: 3 }}>Do not deploy to mainnet until vulnerabilities are resolved</div>
                  <div style={{ fontSize: 11, color: T.textMuted, lineHeight: 1.6 }}>For contracts handling real funds, we recommend a professional audit from <a href="https://www.trailofbits.com" target="_blank" rel="noreferrer" style={{ color: T.accent }}>Trail of Bits</a>, <a href="https://zellic.io" target="_blank" rel="noreferrer" style={{ color: T.accent }}>Zellic</a>, or <a href="https://cantina.xyz" target="_blank" rel="noreferrer" style={{ color: T.accent }}>Cantina</a> before launch.</div>
                </div>
              </div>
            )}

            {/* Findings list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {["critical","high","medium","low","info"].map(sev => {
                const sevFindings = findings.filter(f => f.severity === sev);
                if (!sevFindings.length) return null;
                return (
                  <div key={sev}>
                    <div style={{ fontSize: 9, color: sevColor[sev], letterSpacing: "0.12em", fontWeight: 700, marginBottom: 6, marginTop: 4, textTransform: "uppercase" }}>
                      {sev === "info" ? "ℹ" : sev === "low" ? "▸" : sev === "medium" ? "▲" : "●"} {sev} · {sevFindings.length} finding{sevFindings.length > 1 ? "s" : ""}
                    </div>
                    {sevFindings.map((f, i) => {
                      const sc = statusColors[f.status] || statusColors.acknowledged;
                      return (
                        <div key={i} style={{ background: sevBg[sev], border: `1px solid ${sevBorder[sev]}`, borderRadius: 10, padding: "14px 16px", marginBottom: 8 }}>
                          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontSize: 9, color: sevColor[sev], background: `${sevColor[sev]}18`, border: `1px solid ${sevColor[sev]}30`, borderRadius: 3, padding: "2px 6px", fontWeight: 700, letterSpacing: "0.06em", flexShrink: 0 }}>{f.id}</span>
                              <span style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{f.title}</span>
                            </div>
                            <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                              <span style={{ fontSize: 9, color: "#888", fontFamily: "'DM Mono',monospace" }}>{f.tool}</span>
                              <span style={{ fontSize: 9, color: sc.text, background: sc.bg, borderRadius: 3, padding: "2px 7px", fontWeight: 700, letterSpacing: "0.06em" }}>{sc.label}</span>
                            </div>
                          </div>
                          <div style={{ fontSize: 11, color: T.textDim, fontFamily: "'DM Mono',monospace", marginBottom: 8 }}>📍 {f.location}</div>
                          <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.65, marginBottom: 8 }}>{f.description}</div>
                          {f.status === "vulnerable" && (
                            <div style={{ background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.1)", borderRadius: 7, padding: "9px 12px" }}>
                              <div style={{ fontSize: 9, color: T.green, letterSpacing: "0.08em", fontWeight: 700, marginBottom: 4 }}>→ RECOMMENDATION</div>
                              <div style={{ fontSize: 11, color: T.textMuted, lineHeight: 1.6 }}>{f.recommendation}</div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {tab === "launch" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <DeployPanel demoType={product.id} />
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 10, color: T.textDim, letterSpacing: "0.1em", marginBottom: 14 }}>LAUNCH CHECKLIST</div>
              {["Smart contract deployed", "Frontend connected to contract", "Wallet integration tested", "Security audit reviewed", "Testnet user testing", "Mainnet deployment"].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${i < 4 ? T.green : T.border}`, background: i < 4 ? "rgba(34,197,94,0.1)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {i < 4 && <span style={{ fontSize: 9, color: T.green }}>✓</span>}
                  </div>
                  <span style={{ fontSize: 12, color: i < 4 ? T.text : T.textDim }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 10, color: T.green, letterSpacing: "0.1em", marginBottom: 14, fontWeight: 700 }}>WHY THIS CHAIN</div>
              <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.7 }}>{product.chainExplanation}</div>
            </div>
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 14, height: 14, background: "linear-gradient(135deg,#ff6b35,#f7931a)", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "#fff", fontWeight: 900 }}>D</div>
                <div style={{ fontSize: 10, color: T.textDim, letterSpacing: "0.1em", fontWeight: 700 }}>DUNE MONITORING</div>
              </div>
              <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.6, marginBottom: 10 }}>{product.duneQuery}</div>
              <a href="https://dune.com/queries/new" target="_blank" rel="noreferrer" style={{ fontSize: 11, color: "#ff6b35", textDecoration: "none", border: "1px solid rgba(255,107,53,0.2)", borderRadius: 6, padding: "6px 12px", display: "inline-block" }}>Open Dune →</a>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => navigator.clipboard.writeText(product.contract?.code || "")} style={{ flex: 1, background: "transparent", border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 0", cursor: "pointer", fontFamily: "'DM Mono',monospace", fontSize: 11, color: T.textMuted }}>↓ Download Contract</button>
              <button onClick={onReset} style={{ flex: 1, background: "transparent", border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 0", cursor: "pointer", fontFamily: "'DM Mono',monospace", fontSize: 11, color: T.textMuted }}>← Start Over</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── GENERATION SCREEN ────────────────────────────────────────────────────────
function GenerationScreen({ prompt, demoId, onComplete, onError }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [done, setDone] = useState([]);
  const [pct, setPct] = useState(0);
  const [status, setStatus] = useState("");
  const demo = DEMOS.find(d => d.id === demoId);
  const rawColor = demo?.color || T.accent;
  const color = T.isDark ? rawColor : T.accent;

  useEffect(() => {
    let cancelled = false;
    async function run() {
      const totalPre = GEN_STEPS.slice(0, 2).reduce((a, s) => a + s.dur, 0);
      const totalPost = GEN_STEPS.slice(3).reduce((a, s) => a + s.dur, 0);
      const totalEst = totalPre + 5000 + totalPost;
      let elapsed = 0;

      for (let i = 0; i < 2; i++) {
        if (cancelled) return;
        setStepIdx(i);
        const dur = GEN_STEPS[i].dur;
        await new Promise(res => {
          const start = Date.now();
          const iv = setInterval(() => {
            setPct(Math.round(((elapsed + Date.now() - start) / totalEst) * 100));
            if (Date.now() - start >= dur) { clearInterval(iv); res(); }
          }, 30);
        });
        setDone(d => [...d, i]); elapsed += dur;
        await new Promise(r => setTimeout(r, 80));
      }

      if (cancelled) return;
      setStepIdx(2); setStatus("Generating...");
      try {
        const result = await generateProduct(prompt, demoId, setStatus);
        if (cancelled) return;
        setDone(d => [...d, 2]); elapsed += 4000;
        setPct(Math.round((elapsed / totalEst) * 100));
        await new Promise(r => setTimeout(r, 100));

        // Step 3: Build frontend (timed)
        if (cancelled) return;
        setStepIdx(3);
        await new Promise(res => {
          const start = Date.now(); const dur = GEN_STEPS[3].dur;
          const iv = setInterval(() => {
            setPct(Math.min(Math.round(((elapsed + Date.now() - start) / totalEst) * 100), 85));
            if (Date.now() - start >= dur) { clearInterval(iv); res(); }
          }, 30);
        });
        setDone(d => [...d, 3]); elapsed += GEN_STEPS[3].dur;
        await new Promise(r => setTimeout(r, 80));

        // Step 4: REAL audit — Slither patterns + AI second pass
        if (cancelled) return;
        setStepIdx(4); setStatus("Scanning...");
        const slitherFindings = runSlitherPatterns(result.contract?.code || "");
        const aiFindings = await auditContract(result.contract?.code || "", result.contract?.name || "Contract.sol", setStatus);
        if (cancelled) return;
        const allTitles = new Set(slitherFindings.map(f => f.title));
        const mergedAI = (Array.isArray(aiFindings) ? aiFindings : []).filter(f => !allTitles.has(f.title));
        const auditFindings = [...slitherFindings, ...mergedAI];
        const critical = auditFindings.filter(f => f.severity === "critical" && f.status === "vulnerable").length;
        const high = auditFindings.filter(f => f.severity === "high" && f.status === "vulnerable").length;
        const medium = auditFindings.filter(f => f.severity === "medium" && f.status === "vulnerable").length;
        const auditScore = Math.max(0, 100 - critical * 30 - high * 15 - medium * 8);
        const auditGrade = auditScore >= 90 ? "A" : auditScore >= 75 ? "B" : auditScore >= 60 ? "C" : "D";
        result.auditFindings = auditFindings;
        result.auditScore = auditScore;
        result.auditGrade = auditGrade;
        setDone(d => [...d, 4]); elapsed += GEN_STEPS[4].dur;
        setPct(Math.min(Math.round((elapsed / totalEst) * 100), 98));
        await new Promise(r => setTimeout(r, 80));

        // Step 5: Deploy prep
        if (cancelled) return;
        setStepIdx(5);
        await new Promise(res => {
          const start = Date.now(); const dur = GEN_STEPS[5].dur;
          const iv = setInterval(() => {
            setPct(Math.min(Math.round(((elapsed + Date.now() - start) / totalEst) * 100), 99));
            if (Date.now() - start >= dur) { clearInterval(iv); res(); }
          }, 30);
        });
        setDone(d => [...d, 5]); elapsed += GEN_STEPS[5].dur;
        setPct(100);
        await new Promise(r => setTimeout(r, 500));
        if (!cancelled) onComplete(result);
      } catch (e) { if (!cancelled) onError(e.message); }
    }
    run();
    return () => { cancelled = true; };
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "75vh", padding: "0 24px" }}>
      <div style={{ position: "relative", width: 80, height: 80, marginBottom: 28 }}>
        <svg viewBox="0 0 80 80" style={{ width: 80, height: 80, animation: "vb3Rotate 10s linear infinite" }}>
          <polygon points="40,4 73,22 73,58 40,76 7,58 7,22" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="5 3" opacity="0.4" />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, animation: "vb3Pulse 2s ease-in-out infinite" }}>{demo?.emoji || "⚡"}</div>
      </div>
      <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 22, color: T.text, marginBottom: 8, textAlign: "center" }}>Building your product.</h2>
      <p style={{ fontSize: 13, color: T.textMuted, marginBottom: 32, textAlign: "center", maxWidth: 340, lineHeight: 1.6 }}>
        {demo ? `Creating ${demo.title} — the crypto parts are handled automatically.` : "Analyzing your idea and generating a complete product."}
      </p>

      <div style={{ width: "100%", maxWidth: 400, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 10, color: T.textDim, letterSpacing: "0.08em" }}>BUILDING</span>
          <span style={{ fontSize: 10, color }}>{pct}%</span>
        </div>
        <div style={{ height: 3, background: T.border, borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${color},${color}cc)`, borderRadius: 3, transition: "width 0.15s linear" }} />
        </div>
      </div>

      <div style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 6 }}>
        {GEN_STEPS.map((step, i) => {
          const isDone = done.includes(i), isActive = stepIdx === i && !isDone;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", borderRadius: 8, background: isDone ? `${color}0e` : isActive ? `${color}08` : "transparent", border: `1px solid ${isDone ? `${color}33` : isActive ? `${color}20` : T.border}`, transition: "all 0.3s" }}>
              <div style={{ width: 16, height: 16, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: isDone ? color : "transparent", border: isDone ? "none" : `1.5px solid ${isActive ? color : T.border}` }}>
                {isDone && <span style={{ fontSize: 8, color: T.isDark ? T.bg : "#fff", fontWeight: 900 }}>✓</span>}
                {isActive && <div style={{ width: 5, height: 5, borderRadius: "50%", background: color, animation: "vb3Pulse 0.8s ease-in-out infinite" }} />}
              </div>
              <span style={{ fontSize: 12, color: isDone ? color : isActive ? color : T.textDim, fontWeight: isActive ? 500 : 400 }}>
                {step.label}{isActive && i === 2 && status ? ` — ${status}` : ""}
              </span>
              {isDone && <span style={{ marginLeft: "auto", fontSize: 10, color, opacity: 0.6 }}>done</span>}
              {isActive && <span style={{ marginLeft: "auto", fontSize: 10, color, animation: "vb3Blink 1s step-end infinite" }}>●</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── CLI PANEL ────────────────────────────────────────────────────────────────

const CLI_MODELS = [
  { id: "claude",  label: "Claude Code", tag: "Anthropic", flag: "claude-code", placeholder: "sk-ant-api03-..." },
  { id: "codex",   label: "Codex",       tag: "OpenAI",    flag: "codex",       placeholder: "sk-proj-..." },
  { id: "gemini",  label: "Gemini",      tag: "Google",    flag: "gemini",      placeholder: "AIzaSy..." },
  { id: "grok",    label: "Grok",        tag: "xAI",       flag: "grok",        placeholder: "xai-..." },
];

const CLI_LINES = [
  { delay: 0,    text: '$ vibeblock generate "P2P sneaker marketplace" --model claude-code --deploy arbitrum-sepolia', type: "cmd" },
  { delay: 600,  text: "", type: "gap" },
  { delay: 700,  text: "  ┌─ VibeBlock CLI v1.0.0 ──────────────────────┐", type: "dim" },
  { delay: 750,  text: "  │  Model  : Claude Code (Anthropic)            │", type: "dim" },
  { delay: 800,  text: "  │  Target : Arbitrum One + LayerZero OFT       │", type: "dim" },
  { delay: 850,  text: "  └─────────────────────────────────────────────┘", type: "dim" },
  { delay: 950,  text: "", type: "gap" },
  { delay: 1000, text: "  Analyzing prompt...", type: "muted" },
  { delay: 1400, text: "  ✓ Product type  : P2P Marketplace", type: "green" },
  { delay: 1600, text: "  ✓ Chain         : Arbitrum One + LayerZero OFT", type: "green" },
  { delay: 1800, text: "  ✓ Auth          : ERC-4337 + Paymaster (zero gas)", type: "green" },
  { delay: 2000, text: "", type: "gap" },
  { delay: 2100, text: "  Generating smart contract...", type: "muted" },
  { delay: 2800, text: "  ✓ TradeportEscrow.sol (152 lines)", type: "green" },
  { delay: 3000, text: "", type: "gap" },
  { delay: 3100, text: "  Running security audit...", type: "muted" },
  { delay: 3600, text: "  ✓ Slither  : 0 critical  1 medium", type: "green" },
  { delay: 3800, text: "  ✓ AI audit : Grade A (91/100)", type: "green" },
  { delay: 4000, text: "", type: "gap" },
  { delay: 4100, text: "  Deploying to Arbitrum Sepolia...", type: "muted" },
  { delay: 4800, text: "  ✓ Contract : 0x7fA3...c291", type: "green" },
  { delay: 5000, text: "  ✓ Arbiscan : https://sepolia.arbiscan.io/address/0x7fA3...c291", type: "accent" },
  { delay: 5200, text: "", type: "gap" },
  { delay: 5300, text: "  ✓ Done in 9.2s", type: "success" },
  { delay: 5500, text: "", type: "gap" },
  { delay: 5600, text: "$ _", type: "cursor" },
];

function CliPanel({ onClose, panelHeight, setPanelHeight }) {
  const [selectedModel, setSelectedModel] = useState(null);
  const [customModels, setCustomModels] = useState([]);
  const [addingModel, setAddingModel] = useState(false);
  const [newModelName, setNewModelName] = useState("");
  const [modelOpen, setModelOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [connected, setConnected] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const [running, setRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("terminal");
  const [activeActivity, setActiveActivity] = useState("explorer");
  const [activeSession, setActiveSession] = useState("vibeblock");
  // panelHeight is lifted to parent VibeBlock
  const [sidebarWidth, setSidebarWidth] = useState(148);
  const bottomRef = useRef(null);
  const modelRef = useRef(null);
  const dragState = useRef(null);

  const allModels = [...CLI_MODELS, ...customModels];
  const isDone = connected && !running && visibleLines >= CLI_LINES.length;

  useEffect(() => {
    const handler = (e) => { if (modelRef.current && !modelRef.current.contains(e.target)) setModelOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [visibleLines]);

  // Drag-to-resize for panel height and sidebar width
  useEffect(() => {
    const onMove = (e) => {
      const d = dragState.current;
      if (!d) return;
      if (d.type === "panel") {
        const newH = Math.max(120, Math.min(window.innerHeight * 0.9, d.startH + (d.startY - e.clientY)));
        setPanelHeight(Math.round(newH));
      } else {
        const newW = Math.max(0, Math.min(320, d.startW + (d.startX - e.clientX)));
        setSidebarWidth(newW < 48 ? 0 : Math.round(newW));
      }
    };
    const onUp = () => {
      if (!dragState.current) return;
      // snap sidebar back to default if dragged to 0
      dragState.current = null;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => { document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
  }, []);

  const startPanelDrag = (e) => {
    e.preventDefault();
    dragState.current = { type: "panel", startY: e.clientY, startH: panelHeight };
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
  };

  const startSidebarDrag = (e) => {
    e.preventDefault();
    dragState.current = { type: "sidebar", startX: e.clientX, startW: sidebarWidth || 148 };
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  const connect = () => {
    if (!selectedModel || !apiKey.trim()) return;
    setConnected(true);
    setVisibleLines(0);
    setRunning(true);
    setActiveTab("terminal");
    CLI_LINES.forEach((line, i) => { setTimeout(() => setVisibleLines(i + 1), line.delay); });
    setTimeout(() => setRunning(false), CLI_LINES[CLI_LINES.length - 1].delay + 200);
  };

  const addModel = () => {
    if (!newModelName.trim()) return;
    const m = { id: `custom-${Date.now()}`, label: newModelName.trim(), tag: "Custom", flag: newModelName.trim().toLowerCase().replace(/\s+/g, "-"), placeholder: "api-key-..." };
    setCustomModels(prev => [...prev, m]);
    setSelectedModel(m);
    setAddingModel(false);
    setNewModelName("");
  };

  const lineColor = (type) => {
    if (type === "cmd")     return "#e8eaf0";
    if (type === "green")   return "#00C805";
    if (type === "accent")  return "#12AAFF";
    if (type === "success") return "#00C805";
    if (type === "muted")   return "#6b7a99";
    if (type === "dim")     return "#3a4a5a";
    return "transparent";
  };

  const displayedLines = CLI_LINES.slice(0, visibleLines).map(l => ({
    ...l,
    text: selectedModel
      ? l.text
          .replace("Claude Code (Anthropic)", `${selectedModel.label} (${selectedModel.tag})`)
          .replace("--model claude-code", `--model ${selectedModel.flag}`)
      : l.text,
  }));

  const problems = isDone ? [
    { severity: "warning", file: "TradeportEscrow.sol", line: 47, col: 5,  message: "Single admin key — consider multisig for fund withdrawal" },
    { severity: "info",    file: "TradeportEscrow.sol", line: 23, col: 1,  message: "ReentrancyGuard active — nonReentrant on all fund-moving functions" },
    { severity: "info",    file: "TradeportEscrow.sol", line: 89, col: 3,  message: "Escrow pattern correctly implemented — checks-effects-interactions" },
  ] : [];

  const outputLogs = isDone ? [
    "[vibeblock]  Starting generation pipeline...",
    `[model]      Routing to ${selectedModel?.label || "claude-code"}`,
    "[analyzer]   Product type → P2P Marketplace",
    "[compiler]   Solc 0.8.24 → TradeportEscrow.sol (152 lines)",
    "[slither]    Running 16-pattern static analysis",
    "[slither]    0 critical  1 medium  2 low",
    "[ai-audit]   Second-pass review → Grade A  91/100",
    "[deployer]   Broadcasting to Arbitrum Sepolia (chainId 421614)",
    "[deployer]   Gas: 312,441 units — sponsored by Paymaster ($0.00 to user)",
    "[deployer]   Confirmed in block 94,281,003 (250ms)",
    "[vibeblock]  ✓ Done in 9.2s",
  ] : [];

  const warningCount = problems.filter(p => p.severity === "warning").length;
  const infoCount    = problems.filter(p => p.severity === "info").length;

  const ACTIVITY_ICONS = [
    { id: "explorer", label: "Explorer", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/>
      </svg>
    )},
    { id: "search", label: "Search", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    )},
    { id: "git", label: "Source Control", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
        <path d="M6 9v6M15.4 6.6L8.6 17.4"/>
      </svg>
    )},
    { id: "extensions", label: "Extensions", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="10" height="10" rx="1"/>
        <path d="M12 10h3l2-3 2 3v10l-2 3-2-3h-3"/><path d="M12 14h2"/>
      </svg>
    )},
  ];

  const panelTabs = [
    { id: "terminal", label: "TERMINAL", badge: null },
    { id: "problems", label: "PROBLEMS", badge: isDone && warningCount > 0 ? warningCount : null },
    { id: "output",   label: "OUTPUT",   badge: null },
  ];

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      height: panelHeight, zIndex: 300,
      background: "#000000",
      borderTop: "1px solid #1e2d4a",
      boxShadow: "0 -16px 64px rgba(18,170,255,0.06)",
      display: "flex", flexDirection: "column",
      animation: "cliSlideUp 0.3s cubic-bezier(0.16,1,0.3,1) both",
    }}>
      <style>{`
        @keyframes cliSlideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes cliBlink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes vscProgress { 0%{left:-35%;width:35%} 60%{left:60%;width:35%} 100%{left:100%;width:10%} }
        .cli-drag-top:hover { background: #12AAFF55 !important; }
        .cli-drag-side:hover::before { opacity: 1 !important; }
      `}</style>

      {/* ── Top drag handle ─────────────────────────────────────────────── */}
      <div
        className="cli-drag-top"
        onMouseDown={startPanelDrag}
        style={{
          height: 4, flexShrink: 0, cursor: "row-resize",
          background: "transparent", transition: "background 0.15s",
          position: "relative", zIndex: 10,
        }}
      />

      {/* Progress bar — 2px sweep while running */}
      <div style={{ height: 2, background: "#0d1626", position: "relative", overflow: "hidden", flexShrink: 0 }}>
        {running && <div style={{ position: "absolute", top: 0, height: "100%", background: "#12AAFF", animation: "vscProgress 1.4s ease-in-out infinite" }} />}
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ── Activity Bar ─────────────────────────────────────────────── */}
        <div style={{
          width: 44, flexShrink: 0,
          background: "#000000",
          borderRight: "1px solid #1e2d4a",
          display: "flex", flexDirection: "column",
          alignItems: "center", paddingTop: 6, gap: 2,
        }}>
          {ACTIVITY_ICONS.map(act => (
            <button key={act.id} onClick={() => setActiveActivity(act.id)} title={act.label} style={{
              width: 44, height: 44,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "none", border: "none",
              borderLeft: `2px solid ${activeActivity === act.id ? "#12AAFF" : "transparent"}`,
              color: activeActivity === act.id ? "#c8d0d8" : "#375280",
              cursor: "pointer", transition: "color 0.15s",
            }}>{act.icon}</button>
          ))}
        </div>

        {/* ── Main Panel ───────────────────────────────────────────────── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Tab strip + controls */}
          <div style={{
            display: "flex", alignItems: "center",
            background: "#000000",
            borderBottom: "1px solid #1e2d4a",
            flexShrink: 0, flexWrap: "wrap",
          }}>
            {/* Traffic lights */}
            <div style={{ display: "flex", gap: 6, padding: "10px 14px 10px 14px" }}>
              {["#ff5f57","#febc2e","#28c840"].map(c => (
                <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
              ))}
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", alignItems: "stretch" }}>
              {panelTabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                  background: "none", border: "none",
                  borderBottom: `2px solid ${activeTab === tab.id ? "#12AAFF" : "transparent"}`,
                  padding: "9px 16px 7px",
                  fontFamily: "'DM Mono',monospace", fontSize: 11,
                  color: activeTab === tab.id ? "#c8d0d8" : "#375280",
                  cursor: "pointer", letterSpacing: "0.08em",
                  display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap",
                }}>
                  {tab.label}
                  {tab.badge != null && (
                    <span style={{
                      background: "#f59e0b22", border: "1px solid #f59e0b55",
                      color: "#f59e0b", borderRadius: 8,
                      fontSize: 9, padding: "1px 5px", lineHeight: 1.5,
                    }}>{tab.badge}</span>
                  )}
                </button>
              ))}
            </div>

            <div style={{ flex: 1 }} />

            {/* Right controls: model picker, API key, connected, close */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", flexWrap: "wrap" }}>
              {addingModel ? (
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <input autoFocus value={newModelName} onChange={e => setNewModelName(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") addModel(); if (e.key === "Escape") { setAddingModel(false); setNewModelName(""); } }}
                    placeholder="model name..."
                    style={{ background: "#0d1626", border: "1px solid #1e2d4a", borderRadius: 6, padding: "4px 10px", fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#e8eaf0", width: 160, outline: "none" }} />
                  <button onClick={addModel} style={{ background: "#12AAFF20", border: "1px solid #12AAFF66", borderRadius: 6, padding: "4px 10px", fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#12AAFF", cursor: "pointer" }}>add</button>
                  <button onClick={() => { setAddingModel(false); setNewModelName(""); }} style={{ background: "none", border: "1px solid #1e2d4a", borderRadius: 6, padding: "4px 10px", fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#375280", cursor: "pointer" }}>cancel</button>
                </div>
              ) : (
                <div ref={modelRef} style={{ position: "relative" }}>
                  <button onClick={() => !connected && setModelOpen(o => !o)} style={{
                    background: selectedModel ? "#12AAFF10" : "#0d1626",
                    border: `1px solid ${selectedModel ? "#12AAFF44" : "#1e2d4a"}`,
                    borderRadius: 6, padding: "4px 12px",
                    fontFamily: "'DM Mono',monospace", fontSize: 11,
                    color: selectedModel ? "#12AAFF" : "#375280",
                    cursor: connected ? "default" : "pointer",
                    display: "flex", alignItems: "center", gap: 6, minWidth: 130,
                  }}>
                    {selectedModel ? selectedModel.label : "select model"}
                    {!connected && <span style={{ fontSize: 8, opacity: 0.5 }}>{modelOpen ? "▲" : "▼"}</span>}
                  </button>
                  {modelOpen && (
                    <div style={{ position: "absolute", bottom: "calc(100% + 6px)", left: 0, background: "#0d1626", border: "1px solid #1e2d4a", borderRadius: 10, padding: 6, minWidth: 170, zIndex: 500, boxShadow: "0 -8px 24px rgba(0,0,0,0.5)" }}>
                      {allModels.map(m => (
                        <button key={m.id} onClick={() => { setSelectedModel(m); setModelOpen(false); setApiKey(""); setConnected(false); setVisibleLines(0); setRunning(false); }}
                          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: selectedModel?.id === m.id ? "#12AAFF12" : "none", border: "none", borderRadius: 7, padding: "7px 12px", fontFamily: "'DM Mono',monospace", fontSize: 11, color: selectedModel?.id === m.id ? "#12AAFF" : "#6b7a99", cursor: "pointer", textAlign: "left" }}>
                          <span>{m.label}</span>
                          <span style={{ fontSize: 9, opacity: 0.5 }}>{m.tag}</span>
                        </button>
                      ))}
                      <div style={{ height: 1, background: "#1e2d4a", margin: "4px 0" }} />
                      <button onClick={() => { setModelOpen(false); setAddingModel(true); }}
                        style={{ display: "flex", alignItems: "center", gap: 6, width: "100%", background: "none", border: "none", borderRadius: 7, padding: "7px 12px", fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#375280", cursor: "pointer" }}>
                        <span>+</span> Add Model
                      </button>
                    </div>
                  )}
                </div>
              )}

              {selectedModel && !addingModel && (
                connected ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#12AAFF10", border: "1px solid #12AAFF33", borderRadius: 6, padding: "4px 12px" }}>
                    <span style={{ color: "#12AAFF", fontSize: 10 }}>●</span>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#12AAFF" }}>Connected</span>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <input value={apiKey} onChange={e => setApiKey(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") connect(); }}
                      placeholder={selectedModel.placeholder}
                      type="password"
                      style={{ background: "#0d1626", border: "1px solid #1e2d4a", borderRadius: 6, padding: "4px 10px", fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#e8eaf0", width: 180, outline: "none" }} />
                    <button onClick={connect} disabled={!apiKey.trim()} style={{
                      background: apiKey.trim() ? "#12AAFF20" : "transparent",
                      border: `1px solid ${apiKey.trim() ? "#12AAFF66" : "#1e2d4a"}`,
                      borderRadius: 6, padding: "4px 16px",
                      fontFamily: "'DM Mono',monospace", fontSize: 11,
                      color: apiKey.trim() ? "#12AAFF" : "#375280",
                      cursor: apiKey.trim() ? "pointer" : "not-allowed",
                    }}>Connect</button>
                  </div>
                )
              )}

              {/* VS Code terminal action buttons */}
              <div style={{ display: "flex", alignItems: "center", borderLeft: "1px solid #1e2d4a", marginLeft: 4, paddingLeft: 8, gap: 0 }}>
                {[
                  { title: "New Terminal",   label: "+" },
                  { title: "Launch Profile", label: "∨" },
                  { title: "More Actions",   label: "···" },
                  { title: "Split Terminal", label: "⊟" },
                ].map(({ title, label }) => (
                  <button key={title} title={title} style={{ background: "none", border: "none", color: "#375280", cursor: "pointer", padding: "3px 7px", fontSize: 13, lineHeight: 1, fontFamily: "'DM Mono',monospace" }}>{label}</button>
                ))}
                <div style={{ width: 1, height: 13, background: "#1e2d4a", margin: "0 6px" }} />
                <button onClick={onClose} title="Close Panel" style={{ background: "none", border: "none", color: "#375280", cursor: "pointer", padding: "2px 5px", fontSize: 17, lineHeight: 1 }}>×</button>
              </div>
            </div>
          </div>

          {/* ── Content area + Terminal Instances sidebar ─────────────── */}
          <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

            {/* Scrollable terminal content */}
            <div style={{ flex: 1, overflow: "auto", padding: "14px 20px", fontFamily: "'DM Mono',monospace", fontSize: 13, lineHeight: 1.8 }}>

              {activeTab === "terminal" && (
                <>
                  {!selectedModel && <div style={{ color: "#375280" }}>Select a model to get started.</div>}
                  {selectedModel && !connected && (
                    <div style={{ color: "#375280" }}>
                      Enter your {selectedModel.label} API key and press <span style={{ color: "#12AAFF" }}>Connect</span>.
                    </div>
                  )}
                  {displayedLines.map((line, i) => (
                    <div key={i} style={{ color: lineColor(line.type), whiteSpace: "pre" }}>
                      {line.type === "cursor"
                        ? <span>$ <span style={{ animation: "cliBlink 1s step-end infinite" }}>▌</span></span>
                        : line.text}
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </>
              )}

              {activeTab === "problems" && (
                <div>
                  {problems.length === 0 && (
                    <div style={{ color: "#375280" }}>{isDone ? "No problems detected." : "Run the generation to see problems."}</div>
                  )}
                  {problems.map((p, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "7px 0", borderBottom: "1px solid #1e2d4a33" }}>
                      <span style={{ color: p.severity === "warning" ? "#f59e0b" : "#3a7aaa", fontSize: 15, lineHeight: 1.4, flexShrink: 0 }}>
                        {p.severity === "warning" ? "⚠" : "ℹ"}
                      </span>
                      <div>
                        <div style={{ color: "#c8d0d8", fontSize: 13 }}>{p.message}</div>
                        <div style={{ color: "#375280", fontSize: 11, marginTop: 2 }}>{p.file} · line {p.line}, col {p.col}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "output" && (
                <div>
                  {outputLogs.length === 0 && <div style={{ color: "#375280" }}>No output yet.</div>}
                  {outputLogs.map((line, i) => (
                    <div key={i} style={{ color: "#4a6a9a", whiteSpace: "pre", fontSize: 12, lineHeight: 1.7 }}>{line}</div>
                  ))}
                </div>
              )}

            </div>

            {/* ── Terminal Instances Sidebar ──────────────────────────── */}
            <div style={{
              width: sidebarWidth, flexShrink: 0,
              background: "#000000",
              display: "flex", flexDirection: "row",
              overflow: "hidden",
              transition: sidebarWidth === 0 ? "width 0.15s ease" : "none",
            }}>
              {/* Left drag handle */}
              <div
                onMouseDown={startSidebarDrag}
                onDoubleClick={() => setSidebarWidth(w => w === 0 ? 148 : 0)}
                style={{
                  width: 4, flexShrink: 0, cursor: "col-resize",
                  background: "transparent", position: "relative",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#12AAFF55"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              />
              {/* Session list — hidden when collapsed */}
              <div style={{
                flex: 1, overflowY: "auto", overflowX: "hidden",
                borderLeft: "1px solid #1e2d4a",
                opacity: sidebarWidth < 48 ? 0 : 1,
                transition: "opacity 0.1s",
              }}>
                {[
                  { id: "vibeblock", name: "vibeblock — zsh" },
                  { id: "node",      name: "node" },
                ].map(sess => (
                  <button key={sess.id} onClick={() => setActiveSession(sess.id)} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "8px 10px",
                    background: activeSession === sess.id ? "#1e2d4a" : "none",
                    border: "none",
                    borderLeft: `2px solid ${activeSession === sess.id ? "#12AAFF" : "transparent"}`,
                    cursor: "pointer", textAlign: "left", width: "100%",
                  }}>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke={activeSession === sess.id ? "#12AAFF" : "#375280"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="1" width="14" height="14" rx="2"/>
                      <polyline points="4,5 7,8 4,11"/><line x1="8" y1="11" x2="12" y2="11"/>
                    </svg>
                    <span style={{
                      fontFamily: "'DM Mono',monospace", fontSize: 11,
                      color: activeSession === sess.id ? "#c8d0d8" : "#375280",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>{sess.name}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Status Bar ───────────────────────────────────────────────────── */}
      <div style={{
        height: 24, background: "#1B6FE4",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 12px", flexShrink: 0,
        fontFamily: "'DM Mono',monospace", fontSize: 11,
        color: "#ffffffcc", letterSpacing: "0.04em",
      }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
              <path d="M6 9v6M15.4 6.6L8.6 17.4"/>
            </svg>
            main
          </span>
          {isDone && warningCount > 0 && <span>⚠ {warningCount}</span>}
          {isDone && infoCount > 0    && <span>ℹ {infoCount}</span>}
        </div>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          {isDone && <span>152 lines</span>}
          <span>UTF-8</span>
          <span>Solidity</span>
          <span style={{ background: "#ffffff22", padding: "1px 7px", borderRadius: 3 }}>Arbitrum Sepolia</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            Prettier
          </span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

const DOCS_LINKS = [
  { label: "Arbitrum",        url: "https://docs.arbitrum.io/get-started/overview" },
  { label: "Robinhood Chain", url: "https://docs.robinhood.com/chain/" },
  { label: "Fhenix",          url: "https://docs.fhenix.io" },
  { label: "LayerZero",       url: "https://docs.layerzero.network" },
  { label: "Alchemy",         url: "https://docs.alchemy.com" },
  { label: "Dune",            url: "https://docs.dune.com" },
  { label: "GMX",             url: "https://docs.gmx.io" },
];

function DocsDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  return (
    <div ref={ref} style={{ position: "relative" }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen(o => !o)}
        style={{ background: open ? T.surface : "none", border: "none", padding: "6px 14px", cursor: "pointer", color: open ? T.text : T.textMuted, fontSize: 13, fontWeight: 400, borderRadius: 7, transition: "all 0.15s", display: "flex", alignItems: "center", gap: 5 }}
      >
        Docs <span style={{ fontSize: 9, opacity: 0.6, marginTop: 1 }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "100%", left: 0,
          background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: 10, padding: "6px", minWidth: 200,
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          zIndex: 200,
        }}>
          {DOCS_LINKS.map(({ label, url }) => (
            <a key={label} href={url} target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderRadius: 7, color: T.textMuted, fontSize: 13, textDecoration: "none", transition: "all 0.12s" }}
              onMouseEnter={e => { e.currentTarget.style.background = T.surfaceHover; e.currentTarget.style.color = T.text; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.textMuted; }}
            >
              <span>{label}</span>
              <span style={{ fontSize: 10, opacity: 0.4 }}>↗</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function VibeBlock() {
  const [stage, setStage] = useState("home");
  const [prompt, setPrompt] = useState("");
  const [demoId, setDemoId] = useState(null);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [promptFocused, setPromptFocused] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [cliOpen, setCliOpen] = useState(false);
  const [panelHeight, setPanelHeight] = useState(() => Math.round(window.innerHeight * 0.52));
  const textareaRef = useRef(null);

  Object.assign(T, darkMode ? DARK_T : LIGHT_T);

  const reset = () => { setStage("home"); setPrompt(""); setDemoId(null); setProduct(null); setError(null); };

  const startDemo = (demo) => {
    setDemoId(demo.id);
    setPrompt(demo.prompt);
    setStage("generate");
  };

  const startCustom = () => {
    if (prompt.trim().length < 10) return;
    setDemoId(null);
    setStage("generate");
  };

  const navItems = [
    { label: "Home",     id: "home" },
    { label: "Build",    id: "prompt" },
    { label: "Examples", id: "examples" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'DM Mono',monospace", color: T.text, position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@400;500;600;700;800;900&family=Syne:wght@700;800;900&family=Geist:wght@400;500;600;700;800;900&display=swap');
        @keyframes vb3Blink   { 0%,100%{opacity:1}50%{opacity:0} }
        @keyframes mp_fadeUp  { from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)} }
        @keyframes mp_popIn   { from{opacity:0;transform:scale(0.5)}to{opacity:1;transform:scale(1)} }
        @keyframes mp_spin    { to{transform:rotate(360deg)} }
        @keyframes gm_pulse   { 0%,100%{transform:scale(1)}50%{transform:scale(1.12)} }
        @keyframes gm_blast   { from{opacity:1;transform:translate(-50%,-50%) scale(0)}to{opacity:0;transform:translate(-50%,-50%) scale(1)} }
        @keyframes vb3FadeUp { from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)} }
        @keyframes vb3Rotate { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }
        @keyframes vb3Pulse  { 0%,100%{opacity:0.7;transform:scale(1)}50%{opacity:1;transform:scale(1.08)} }
        @keyframes vb3Drift  { 0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)} }
        @keyframes vb3Scan   { 0%{top:-2px}100%{top:100%} }
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(18,170,255,0.2);border-radius:2px}
        textarea::placeholder,input::placeholder{opacity:0.35}
        textarea:focus,input:focus{outline:none}
        a{text-decoration:none}
      `}</style>

      {/* Grid */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", backgroundImage: `linear-gradient(${T.grid} 1px,transparent 1px),linear-gradient(90deg,${T.grid} 1px,transparent 1px)`, backgroundSize: "56px 56px" }} />
      {/* Scan line */}
      <div style={{ position: "fixed", left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,rgba(18,170,255,0.06),transparent)`, animation: "vb3Scan 14s linear infinite", pointerEvents: "none" }} />
      {/* Ambient glow */}
      <div style={{ position: "fixed", top: -200, left: "50%", transform: "translateX(-50%)", width: 600, height: 400, background: "radial-gradient(ellipse,rgba(18,170,255,0.04),transparent 70%)", pointerEvents: "none" }} />

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: T.navBg, backdropFilter: "blur(20px)", borderBottom: `1px solid ${T.border}`, height: 60, display: "flex", alignItems: "center", padding: "0 28px" }}>
        {/* Logo */}
        <button onClick={reset} style={{ display: "flex", alignItems: "center", gap: 9, background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0 }}>
          <div style={{ width: 28, height: 28, background: T.accent, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 12px ${T.accent}55` }}>
            <div style={{ width: 11, height: 11, background: T.bg, borderRadius: 2.5 }} />
          </div>
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 15, color: T.text, letterSpacing: "0.08em" }}>VIBEBLOCK</span>
        </button>

        {/* Nav links */}
        <div style={{ display: "flex", gap: 1, marginLeft: 28 }}>
          {[["Build", "prompt"], ["Examples", "examples"]].map(([l, s]) => (
            <button key={l} onClick={() => setStage(s)}
              style={{ background: stage === s ? `${T.accent}12` : "none", border: "none", padding: "6px 14px", cursor: "pointer", color: stage === s ? T.accent : T.textMuted, fontSize: 13, fontWeight: stage === s ? 600 : 400, borderRadius: 7, transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.color = T.text; e.currentTarget.style.background = T.surface; }}
              onMouseLeave={e => { e.currentTarget.style.color = stage === s ? T.accent : T.textMuted; e.currentTarget.style.background = stage === s ? `${T.accent}12` : "none"; }}
            >{l}</button>
          ))}
          <DocsDropdown />
        </div>

        <div style={{ flex: 1 }} />

        {/* Ecosystem badges */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 14 }}>
          <span style={{ fontSize: 10, color: T.textDim, fontFamily: "'DM Mono',monospace", letterSpacing: "0.06em" }}>BUILT ON</span>
          <div style={{ width: 1, height: 14, background: T.border }} />
          {[
            { label: "Arbitrum", dot: T.accent },
            { label: "LayerZero", dot: "#A78BFA" },
            { label: "Robinhood Chain", dot: T.green },
            { label: "Fhenix", dot: T.purple },
          ].map(p => (
            <span key={p.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: T.textMuted, fontWeight: 500, letterSpacing: "0.02em" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: p.dot, flexShrink: 0, boxShadow: `0 0 5px ${p.dot}88` }} />
              {p.label}
            </span>
          ))}
        </div>

        {/* Right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button onClick={() => setDarkMode(d => !d)} title={darkMode ? "Switch to light mode" : "Switch to dark mode"} style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: 7, width: 32, height: 32, cursor: "pointer", color: T.textMuted, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {darkMode
              ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
            }
          </button>
          {stage !== "home" && stage !== "generate" && (
            <button onClick={reset} style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: 7, padding: "5px 13px", cursor: "pointer", color: T.textMuted, fontSize: 12 }}>← Home</button>
          )}
        </div>
      </nav>

      <div style={{ paddingTop: 56 }}>

        {/* ── HOME ── */}
        {stage === "home" && (
          <div style={{ maxWidth: 900, margin: "0 auto", padding: "64px 24px 48px" }}>
            {/* Hero */}
            <div style={{ textAlign: "center", marginBottom: 64, animation: "vb3FadeUp 0.6s ease both" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: T.accentGlow, border: `1px solid ${T.accentBorder}`, borderRadius: 20, padding: "6px 16px", marginBottom: 28 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.green, animation: "vb3Pulse 2s ease-in-out infinite" }} />
                <span style={{ fontSize: 11, color: T.accent, fontWeight: 700, letterSpacing: "0.1em" }}>BUILD ANYTHING · RUNS EVERYWHERE · NOBODY SEES THE BLOCKCHAIN</span>
              </div>
              <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "clamp(28px,4.5vw,52px)", color: T.text, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 20 }}>
                Build anything.<br />
                <span style={{ color: T.accent, whiteSpace: "nowrap" }}>Runs everywhere.</span>
              </h1>
              <p style={{ fontSize: 16, color: T.textMuted, maxWidth: 520, margin: "0 auto 36px", lineHeight: 1.75 }}>
                Describe any product. Get a complete, deployed app your users can access from any chain, any device, any country — with no wallet, no gas, no crypto knowledge required.
              </p>

              {/* Main prompt input */}
              <div style={{ maxWidth: 600, margin: "0 auto", position: "relative" }}>
                <div style={{ background: T.surface, border: `1px solid ${promptFocused ? T.accentBorder : T.border}`, borderRadius: 14, padding: "18px 20px 14px", transition: "border-color 0.2s", boxShadow: promptFocused ? `0 0 0 3px ${T.accentGlow}` : "none" }}>
                  <textarea
                    ref={textareaRef}
                    rows={3}
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    onFocus={() => setPromptFocused(true)}
                    onBlur={() => setPromptFocused(false)}
                    onKeyDown={e => { if (e.key === "Enter" && e.metaKey) startCustom(); }}
                    placeholder="Describe your product idea in plain English. E.g. 'I want a marketplace where people buy and sell sneakers with instant payments and no fees'"
                    style={{ resize: "none", background: "transparent", border: "none", color: T.text, fontFamily: "'DM Sans',sans-serif", fontSize: 15, lineHeight: 1.7, width: "100%", caretColor: T.accent }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                    <span style={{ fontSize: 11, color: T.textDim }}>⌘ + Enter to build</span>
                    <button
                      onClick={startCustom}
                      disabled={prompt.trim().length < 10}
                      style={{ background: prompt.trim().length >= 10 ? T.accent : T.isDark ? "rgba(255,255,255,0.06)" : T.surfaceHover, border: "none", borderRadius: 8, padding: "10px 24px", color: prompt.trim().length >= 10 ? "#fff" : T.textDim, fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 13, letterSpacing: "0.08em", cursor: prompt.trim().length >= 10 ? "pointer" : "not-allowed", transition: "all 0.2s" }}
                    >Build It →</button>
                  </div>
                </div>
              </div>
            </div>

            {/* How it works */}
            <div style={{ marginBottom: 56, animation: "vb3FadeUp 0.5s ease 0.1s both", opacity: 0 }}>
              <div style={{ fontSize: 10, color: T.textDim, letterSpacing: "0.12em", textAlign: "center", marginBottom: 28 }}>HOW IT WORKS</div>
              <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
                {[
                  { num: "01", label: "Bring your idea", body: "A rough prompt, a PRD, or a product description. Any format, any stage.", color: T.accent },
                  { num: "02", label: "VibeBlock scaffolds", body: "Production-grade contract, frontend foundation, security audit baseline, and deploy pipeline — wired for Arbitrum.", color: T.accent, highlight: true },
                  { num: "03", label: "Refine and ship", body: "A working foundation to build on. Refine with AI until it's ready. Deploy on your timeline.", color: T.green },
                ].map((step, i) => (
                  <span key={step.num} style={{ display: "contents" }}>
                    <div style={{
                      flex: 1,
                      background: step.highlight ? T.accentGlow : T.surface,
                      border: `1px solid ${step.highlight ? T.accentBorder : T.border}`,
                      borderRadius: 14, padding: "24px 24px 22px",
                      display: "flex", flexDirection: "column", gap: 10,
                    }}>
                      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: step.color, letterSpacing: "0.15em", opacity: 0.7 }}>{step.num}</div>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 16, color: T.text, lineHeight: 1.2 }}>{step.label}</div>
                      <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.65 }}>{step.body}</div>
                    </div>
                    {i < 2 && (
                      <div style={{ display: "flex", alignItems: "center", padding: "0 10px", color: T.textDim, fontSize: 16, flexShrink: 0 }}>→</div>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Demo cards */}
            <div style={{ marginBottom: 16, animation: "vb3FadeUp 0.6s ease 0.15s both", opacity: 0 }}>
              <div style={{ fontSize: 10, color: T.textDim, letterSpacing: "0.12em", textAlign: "center", marginBottom: 20 }}>OR START WITH A DEMO</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {DEMOS.map((demo, i) => (
                  <button key={demo.id} onClick={() => startDemo(demo)} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: "20px", cursor: "pointer", textAlign: "left", transition: "all 0.2s", animation: `vb3FadeUp 0.5s ease ${0.1 + i * 0.08}s both`, opacity: 0, position: "relative", overflow: "hidden" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = demo.color + "50"; e.currentTarget.style.background = T.surfaceHover; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = T.surface; e.currentTarget.style.transform = "none"; }}
                  >
                    {/* glow */}
                    <div style={{ position: "absolute", top: -40, right: -40, width: 120, height: 120, borderRadius: "50%", background: demo.glow, pointerEvents: "none" }} />
                    <div style={{ fontSize: 28, marginBottom: 10, animation: `vb3Drift ${3 + i * 0.4}s ease-in-out infinite` }}>{demo.emoji}</div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 15, color: T.text, marginBottom: 4 }}>{demo.title}</div>
                    <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 14, lineHeight: 1.5 }}>{demo.tagline}</div>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                      {demo.tech.map(t => (
                        <span key={t} style={{ fontSize: 9, color: T.isDark ? demo.color : T.text, background: `${demo.color}12`, border: `1px solid ${demo.color}25`, borderRadius: 4, padding: "2px 7px", fontWeight: 700, letterSpacing: "0.05em" }}>{t}</span>
                      ))}
                    </div>
                    <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 11, color: T.isDark ? demo.color : T.text, fontWeight: 700 }}>Build this →</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Value prop strip */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 40, animation: "vb3FadeUp 0.5s ease 0.4s both", opacity: 0 }}>
              {[
                { icon: "👁", title: "Crypto stays invisible", body: "Your users see dollars and buttons. They never touch a wallet or know what a blockchain is." },
                { icon: "🔒", title: "Security built in", body: "Every product is audited before delivery. Reentrancy guards, access controls, and MEV protection by default." },
                { icon: "🚀", title: "From idea to live product", body: "Not just a contract. A complete product with frontend, deploy pipeline, and monitoring." },
              ].map(v => (
                <div key={v.title} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: 18 }}>
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{v.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 6, fontFamily: "'Syne',sans-serif" }}>{v.title}</div>
                  <div style={{ fontSize: 11, color: T.textMuted, lineHeight: 1.65 }}>{v.body}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CUSTOM PROMPT ── */}
        {stage === "prompt" && (
          <div style={{ maxWidth: 620, margin: "60px auto", padding: "0 24px", animation: "vb3FadeUp 0.4s ease both" }}>
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 36 }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 22, color: T.text, marginBottom: 8 }}>Describe your product</div>
              <p style={{ fontSize: 13, color: T.textMuted, marginBottom: 24, lineHeight: 1.6 }}>Speak naturally. Don't worry about the technical details — that's VibeBlock's job.</p>
              <div style={{ background: T.bg, border: `1px solid ${T.accentBorder}`, borderRadius: 10, padding: "16px 18px", marginBottom: 16 }}>
                <textarea autoFocus rows={5} value={prompt} onChange={e => setPrompt(e.target.value)}
                  placeholder={"e.g. I run events and hate scalpers. I want tickets that can only resell at face value.\n\nor: A loyalty program for my barbershop where points are actually worth something.\n\nor: A group investment club where everyone votes on what to buy."}
                  style={{ resize: "none", background: "transparent", border: "none", color: T.text, fontFamily: "'DM Sans',sans-serif", fontSize: 14, lineHeight: 1.75, width: "100%", caretColor: T.accent }}
                />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={startCustom} disabled={prompt.trim().length < 10} style={{ flex: 1, background: prompt.trim().length >= 10 ? T.accent : T.isDark ? "rgba(255,255,255,0.06)" : T.surfaceHover, border: "none", borderRadius: 8, padding: "13px 0", color: prompt.trim().length >= 10 ? "#fff" : T.textDim, fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 13, letterSpacing: "0.08em", cursor: prompt.trim().length >= 10 ? "pointer" : "not-allowed" }}>Build This Product →</button>
                <button onClick={reset} style={{ background: "transparent", border: `1px solid ${T.border}`, borderRadius: 8, padding: "13px 18px", color: T.textMuted, fontSize: 12, cursor: "pointer" }}>← Back</button>
              </div>
            </div>
          </div>
        )}

        {/* ── GENERATE ── */}
        {stage === "generate" && (
          <GenerationScreen
            prompt={prompt}
            demoId={demoId}
            onComplete={(result) => { setProduct(result); setStage("output"); }}
            onError={(msg) => { setError(msg); setStage("home"); }}
          />
        )}

        {/* ── OUTPUT ── */}
        {stage === "output" && product && (
          <div style={{ maxWidth: 1060, margin: "0 auto", padding: "32px 24px 60px", animation: "vb3FadeUp 0.5s ease both" }}>
            {error && (
              <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 8, padding: "12px 16px", marginBottom: 16, fontSize: 12, color: T.red }}>
                ⚠ {error}
              </div>
            )}
            <OutputScreen product={product} prompt={prompt} demoId={demoId} t={T} onReset={reset} />
          </div>
        )}

        {/* ── EXAMPLES ── */}
        {stage === "examples" && (
          <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px", animation: "vb3FadeUp 0.4s ease both" }}>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 28, color: T.text, marginBottom: 8 }}>Example Products</h2>
            <p style={{ color: T.textMuted, fontSize: 14, marginBottom: 36, lineHeight: 1.6 }}>Click any example to see the full product VibeBlock would build.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {DEMOS.map(demo => (
                <div key={demo.id} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: 24 }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>{demo.emoji}</div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 17, color: T.text, marginBottom: 6 }}>{demo.title}</div>
                  <div style={{ fontSize: 13, color: T.textMuted, marginBottom: 14, lineHeight: 1.6 }}>{demo.tagline}</div>
                  <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
                    <div style={{ fontSize: 10, color: T.textDim, letterSpacing: "0.08em", marginBottom: 6 }}>USER SEES</div>
                    <div style={{ fontSize: 12, color: T.textMuted }}>{demo.userSees}</div>
                  </div>
                  <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 14px", marginBottom: 16 }}>
                    <div style={{ fontSize: 10, color: T.textDim, letterSpacing: "0.08em", marginBottom: 6 }}>NEVER SEES</div>
                    <div style={{ fontSize: 12, color: T.textDim }}>{demo.neverSees}</div>
                  </div>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 16 }}>
                    {demo.tech.map(t => (
                      <span key={t} style={{ fontSize: 9, color: demo.color, background: `${demo.color}12`, border: `1px solid ${demo.color}25`, borderRadius: 4, padding: "2px 7px", fontWeight: 700 }}>{t}</span>
                    ))}
                  </div>
                  <button onClick={() => startDemo(demo)} style={{ width: "100%", background: `${demo.color}12`, border: `1px solid ${demo.color}30`, borderRadius: 8, padding: "11px 0", color: demo.color, fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 12, cursor: "pointer", letterSpacing: "0.06em" }}>
                    Build {demo.title} →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CLI floating trigger */}
      <button
        onClick={() => setCliOpen(o => !o)}
        title="VibeBlock CLI"
        style={{
          position: "fixed", bottom: cliOpen ? panelHeight + 16 : 20, right: 24,
          background: cliOpen ? "#12AAFF20" : T.surface,
          border: `1px solid ${cliOpen ? "#12AAFF66" : T.border}`,
          borderRadius: 10, padding: "8px 16px",
          display: "flex", alignItems: "center", gap: 8,
          fontFamily: "'DM Mono',monospace", fontSize: 12,
          color: cliOpen ? "#12AAFF" : T.textMuted,
          cursor: "pointer", zIndex: 400,
          boxShadow: cliOpen ? "0 0 20px rgba(0,200,5,0.15)" : "0 4px 16px rgba(0,0,0,0.3)",
          transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <span style={{ fontSize: 14 }}>{">"}_</span>
        <span>CLI</span>
      </button>

      {/* CLI panel */}
      {cliOpen && <CliPanel onClose={() => setCliOpen(false)} panelHeight={panelHeight} setPanelHeight={setPanelHeight} />}
    </div>
  );
}
