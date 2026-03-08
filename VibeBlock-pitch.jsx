import { useState, useEffect } from "react";

const T = {
  bg: "#08090c",
  surface: "#0d1117",
  border: "#1a2332",
  text: "#e8eaf0",
  muted: "#6b7a99",
  accent: "#12AAFF",
  accentDim: "#0d7ab5",
  green: "#00C805",
  amber: "#f59e0b",
  purple: "#a855f7",
  red: "#ef4444",
};

const TOTAL_SLIDES = 11;

// ─── Slide 1: Cover ───────────────────────────────────────────────────────────

function Slide1() {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(${T.border}44 1px, transparent 1px), linear-gradient(90deg, ${T.border}44 1px, transparent 1px)`,
        backgroundSize: "60px 60px", opacity: 0.4, pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", width: 700, height: 350, borderRadius: "50%",
        background: `radial-gradient(ellipse, ${T.accent}18 0%, transparent 70%)`,
        top: "28%", left: "50%", transform: "translateX(-50%)", pointerEvents: "none",
      }} />
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22,
          letterSpacing: "0.3em", color: T.accent,
          textShadow: `0 0 40px ${T.accent}66`, marginBottom: 48, textTransform: "uppercase",
        }}>VibeBlock</div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(48px, 7vw, 96px)", lineHeight: 1.05, marginBottom: 32 }}>
          <div style={{ color: T.text }}>Build anything.</div>
          <div style={{ color: T.accent }}>Runs everywhere.</div>
        </div>
        <div style={{
          fontFamily: "'DM Mono', monospace", fontSize: 13, letterSpacing: "0.25em",
          color: T.muted, textTransform: "uppercase", marginBottom: 80,
        }}>Arbitrum Everywhere · Powered by LayerZero</div>
        <div style={{ display: "flex", gap: 48, alignItems: "center" }}>
          {["Arbitrum", "LayerZero", "Fhenix", "Robinhood Chain"].map((p) => (
            <div key={p} style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: T.muted, letterSpacing: "0.1em" }}>{p}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Slide 2: The Gap ─────────────────────────────────────────────────────────

function BrowserFrame({ src, url, label, isWall, cta }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
      {/* Step label */}
      <div style={{
        fontFamily: "'DM Mono', monospace", fontSize: 12,
        color: isWall ? T.red : T.accent,
        letterSpacing: "0.15em", textTransform: "uppercase",
        marginBottom: 10,
      }}>{label}</div>

      {/* Browser chrome */}
      <div style={{
        borderRadius: 14,
        overflow: "hidden",
        border: `1.5px solid ${isWall ? T.red + "88" : T.border}`,
        boxShadow: isWall ? `0 0 32px ${T.red}22` : "none",
        position: "relative",
      }}>
        {/* URL bar */}
        <div style={{
          background: "#111418",
          padding: "9px 14px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          borderBottom: `1px solid ${T.border}`,
        }}>
          {["#ff5f57","#febc2e","#28c840"].map((c) => (
            <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c, flexShrink: 0 }} />
          ))}
          <div style={{
            flex: 1, background: "#1a2030", borderRadius: 5,
            padding: "3px 10px", fontFamily: "'DM Mono', monospace",
            fontSize: 11, color: T.muted, textAlign: "center",
          }}>{url}</div>
        </div>

        {/* Screenshot */}
        <div style={{ position: "relative", overflow: "hidden" }}>
          <img
            src={src}
            alt={url}
            style={{ width: "100%", display: "block", objectFit: "cover", objectPosition: "top", maxHeight: 280 }}
          />
          {/* CTA callout overlay */}
          {cta && (
            <div style={{
              position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)",
              background: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)",
              border: `1px solid ${T.accent}66`, borderRadius: 20,
              padding: "6px 18px", whiteSpace: "nowrap",
              fontFamily: "'DM Mono', monospace", fontSize: 12,
              color: T.accent, letterSpacing: "0.08em",
            }}>← click: "{cta}"</div>
          )}
          {/* Wall overlay */}
          {isWall && (
            <>
              <div style={{
                position: "absolute", inset: 0,
                background: `linear-gradient(transparent 40%, ${T.red}28)`,
                pointerEvents: "none",
              }} />
              <div style={{
                position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)",
                background: T.red, color: "#fff",
                fontFamily: "'DM Mono', monospace", fontSize: 11,
                letterSpacing: "0.12em", textTransform: "uppercase",
                padding: "5px 16px", borderRadius: 20, whiteSpace: "nowrap",
              }}>Most builders stop here</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Slide2() {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 64px 28px" }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "0.25em", color: T.accent, textTransform: "uppercase", marginBottom: 28 }}>
        The Problem
      </div>

      <div style={{ display: "flex", flexDirection: "row", gap: 20, width: "100%", alignItems: "flex-start", marginBottom: 32 }}>
        <BrowserFrame
          src="/arb-screen-1.png"
          url="arbitrum.io"
          label="Step 1 — Homepage"
          cta="Build an App"
        />
        <div style={{ fontSize: 32, color: T.muted, display: "flex", alignItems: "center", paddingTop: 52, flexShrink: 0 }}>→</div>
        <BrowserFrame
          src="/arb-screen-2.png"
          url="arbitrum.io/build"
          label="Step 2 — Build Page"
          cta="Start Building"
        />
        <div style={{ fontSize: 32, color: T.muted, display: "flex", alignItems: "center", paddingTop: 52, flexShrink: 0 }}>→</div>
        <BrowserFrame
          src="/arb-screen-3.png"
          url="docs.arbitrum.io/get-started/overview"
          label="Step 3 — The Wall"
          isWall={true}
        />
      </div>

      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(22px, 3vw, 44px)", textAlign: "center", lineHeight: 1.15, color: T.text }}>
        Built for developers.{" "}
        <span style={{ color: T.accent }}>Now built for everyone.</span>
      </div>
    </div>
  );
}

// ─── Slide 3: The Solution ────────────────────────────────────────────────────

function Slide3() {
  const cards = [
    { num: "01", label: "Bring your idea", detail: "Rough prompt, PRD, or description — any format, any stage", color: T.muted, highlight: false },
    { num: "02", label: "VibeBlock scaffolds", detail: "Contract · Frontend · Security audit · Deploy pipeline", color: T.accent, highlight: true },
    { num: "03", label: "Refine and ship", detail: "Working foundation · Refine with AI · Deploy on your timeline", color: T.green, highlight: false },
  ];

  const C = 18; // corner bracket size
  const CW = 2; // corner bracket weight

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "24px 64px 20px" }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "0.25em", color: T.accent, textTransform: "uppercase", marginBottom: 20, flexShrink: 0 }}>
        The Solution
      </div>

      <div style={{ display: "flex", gap: 40, flex: 1, minHeight: 0, marginBottom: 14 }}>

        {/* Left: 3-step cards — vertically centered */}
        <div style={{ flex: "0 0 36%", display: "flex", flexDirection: "column", justifyContent: "center", gap: 0 }}>
          {cards.map((card, i) => (
            <div key={card.num}>
              <div style={{
                background: card.highlight ? `${T.accent}0d` : T.surface,
                border: `1px solid ${card.highlight ? T.accent : T.border}`,
                borderRadius: 16, padding: "20px 24px",
                display: "flex", flexDirection: "column",
              }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: card.color, letterSpacing: "0.15em", marginBottom: 8, textTransform: "uppercase" }}>{card.num}</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 22, color: T.text, marginBottom: 6, lineHeight: 1.2 }}>{card.label}</div>
                <div style={{ fontSize: 14, color: T.muted, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>{card.detail}</div>
              </div>
              {i < cards.length - 1 && (
                <div style={{ fontSize: 20, color: T.muted, textAlign: "center", padding: "6px 0" }}>↓</div>
              )}
            </div>
          ))}
          <div style={{ marginTop: 20 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 17, lineHeight: 1.5 }}>
              <span style={{ color: T.green }}>User sees: an app.</span>
              <br />
              <span style={{ color: T.muted, fontSize: 14 }}>Nobody sees: the blockchain.</span>
            </div>
          </div>
        </div>

        {/* Right: actual screenshot with corner brackets — vertically centered */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 0 }}>
          <div style={{ position: "relative", width: "100%", maxHeight: "100%" }}>

            {/* Corner brackets */}
            <div style={{ position: "absolute", top: -6, left: -6, width: C, height: C, borderTop: `${CW}px solid ${T.accent}`, borderLeft: `${CW}px solid ${T.accent}`, zIndex: 2 }} />
            <div style={{ position: "absolute", top: -6, right: -6, width: C, height: C, borderTop: `${CW}px solid ${T.accent}`, borderRight: `${CW}px solid ${T.accent}`, zIndex: 2 }} />
            <div style={{ position: "absolute", bottom: -6, left: -6, width: C, height: C, borderBottom: `${CW}px solid ${T.accent}`, borderLeft: `${CW}px solid ${T.accent}`, zIndex: 2 }} />
            <div style={{ position: "absolute", bottom: -6, right: -6, width: C, height: C, borderBottom: `${CW}px solid ${T.accent}`, borderRight: `${CW}px solid ${T.accent}`, zIndex: 2 }} />

            {/* Subtle glow behind image */}
            <div style={{ position: "absolute", inset: -1, borderRadius: 12, boxShadow: `0 0 40px ${T.accent}18, 0 0 0 1px ${T.border}`, pointerEvents: "none", zIndex: 1 }} />

            {/* Screenshot */}
            <img
              src="/vb-screenshot-light.png"
              alt="VibeBlock front page"
              style={{ width: "100%", display: "block", borderRadius: 10, objectFit: "cover", objectPosition: "top" }}
            />
          </div>
        </div>

      </div>

      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: T.muted, flexShrink: 0 }}>
        Not magic — months of blockchain infrastructure, eliminated from day one.{" "}
        <span style={{ color: T.text, fontWeight: 500 }}>The product iteration is still yours.</span>
      </div>
    </div>
  );
}

// ─── Slide 4: The Invisible Blockchain ───────────────────────────────────────

function Slide4() {
  const userSees = [
    { icon: "💵", label: "$4,829.14", sub: "Balance in dollars" },
    { icon: "👆", label: "Send", sub: "One tap. No wallet prompt" },
    { icon: "🛍️", label: "Checkout", sub: "Apple Pay or card" },
    { icon: "🎮", label: "Play", sub: "Earn real prizes" },
  ];

  const underneath = [
    { label: "Arbitrum One", color: T.accent, sub: "Settlement, 250ms" },
    { label: "LayerZero", color: T.purple, sub: "Any chain → Arbitrum" },
    { label: "ERC-4337", color: T.amber, sub: "No seed phrases" },
    { label: "Paymaster", color: T.green, sub: "Gas? What gas?" },
    { label: "USDC", color: T.muted, sub: "Dollars, not tokens" },
  ];

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 72px" }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "0.25em", color: T.accent, textTransform: "uppercase", marginBottom: 16 }}>
        The Real Opportunity
      </div>
      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(28px, 3.5vw, 48px)", textAlign: "center", marginBottom: 48, lineHeight: 1.1 }}>
        The blockchain is the engine.{" "}
        <span style={{ color: T.accent }}>The app is the product.</span>
      </div>

      <div style={{ display: "flex", gap: 48, width: "100%", alignItems: "stretch" }}>
        {/* Left: What users see */}
        <div style={{ flex: 1, background: T.surface, border: `1px solid ${T.green}44`, borderRadius: 20, padding: "40px 44px" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: T.green, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 28 }}>
            What users see
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {userSees.map((item) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ fontSize: 28, width: 44, textAlign: "center", flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 22, color: T.text }}>{item.label}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: T.muted, marginTop: 2 }}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, flexShrink: 0 }}>
          <div style={{ width: 1, flex: 1, background: T.border }} />
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: T.muted, letterSpacing: "0.1em", writingMode: "vertical-rl", transform: "rotate(180deg)", padding: "12px 0" }}>invisible layer</div>
          <div style={{ width: 1, flex: 1, background: T.border }} />
        </div>

        {/* Right: What's underneath */}
        <div style={{ flex: 1, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 20, padding: "40px 44px" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: T.muted, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 28 }}>
            What's underneath
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {underneath.map((item) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
                <div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 22, color: item.color }}>{item.label}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: T.muted, marginTop: 2 }}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: T.muted, textAlign: "center", marginTop: 36, lineHeight: 1.7, maxWidth: 800 }}>
        Nobody at the Genius Bar asks what chip is inside. They just tap, trust, and it works.{" "}
        <span style={{ color: T.text, fontWeight: 500 }}>That's what Arbitrum should be — infrastructure that powers everything, visible to no one.</span>
      </div>
    </div>
  );
}

// ─── Slide 5: Why VibeBlock? ──────────────────────────────────────────────────

const PITCH_CLI_LINES = [
  { delay: 0,    text: '$ vibeblock generate "P2P sneaker marketplace" --model claude', type: "cmd" },
  { delay: 700,  text: "→ Analyzing idea...", type: "info" },
  { delay: 1300, text: "→ Generating Solidity contract (0.8.24)...", type: "info" },
  { delay: 2100, text: "→ Running Slither + AI audit...", type: "info" },
  { delay: 2800, text: "✓ 0 critical vulnerabilities found", type: "success" },
  { delay: 3200, text: "→ Generating React frontend...", type: "info" },
  { delay: 4000, text: "→ Deploying to Arbitrum Sepolia...", type: "info" },
  { delay: 4700, text: "✓ Contract: 0x7f3a...e29c (Arbiscan ↗)", type: "success" },
  { delay: 5100, text: "✓ Gas: $0.00 — Paymaster sponsored", type: "success" },
  { delay: 5500, text: "✓ Done in 11.4s", type: "success" },
  { delay: 5900, text: "$ _", type: "cursor" },
];

function Slide5() {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const timers = PITCH_CLI_LINES.map((line, i) =>
      setTimeout(() => setVisibleLines(i + 1), line.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const tools = [
    { name: "Claude Code", for: "Any project, any code", crypto: false, deploy: false },
    { name: "Cursor", for: "Developer productivity", crypto: false, deploy: false },
    { name: "Replit", for: "Rapid prototyping", crypto: false, deploy: false },
    { name: "Lovable", for: "Consumer apps, fast", crypto: false, deploy: false },
    { name: "VibeBlock", for: "Arbitrum ecosystem", crypto: true, deploy: true, highlight: true },
  ];

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 64px" }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "0.25em", color: T.accent, textTransform: "uppercase", marginBottom: 10 }}>
        Why VibeBlock?
      </div>
      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(20px, 2.4vw, 34px)", textAlign: "center", marginBottom: 8, lineHeight: 1.15, maxWidth: 900 }}>
        Claude Code and Lovable created millions of new builders overnight.
      </div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: T.muted, textAlign: "center", marginBottom: 28, maxWidth: 800 }}>
        A teacher in Ohio can ship a web app. A designer in Lagos can prototype a SaaS.{" "}
        <span style={{ color: T.text, fontWeight: 500 }}>None of them know what a rollup is — and now they don't have to.</span>
      </div>

      {/* Two-column: table + terminal */}
      <div style={{ display: "flex", gap: 28, width: "100%", alignItems: "stretch" }}>

        {/* Left: comparison table */}
        <div style={{ flex: 1.1, display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", fontFamily: "'DM Sans', sans-serif", fontSize: 16 }}>
            <thead>
              <tr>
                {["Tool", "Built for", "Crypto-native", "Ships to Arbitrum"].map((h) => (
                  <th key={h} style={{
                    fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.15em",
                    color: T.muted, textTransform: "uppercase", padding: "8px 16px",
                    borderBottom: `1px solid ${T.border}`, textAlign: "left", fontWeight: 400,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tools.map((t) => (
                <tr key={t.name} style={{
                  background: t.highlight ? `${T.accent}0d` : "transparent",
                  borderBottom: t.highlight ? "none" : `1px solid ${T.border}44`,
                  border: t.highlight ? `1px solid ${T.accent}55` : undefined,
                }}>
                  <td style={{ padding: "13px 16px", fontFamily: "'Syne', sans-serif", fontWeight: t.highlight ? 800 : 600, fontSize: t.highlight ? 18 : 16, color: t.highlight ? T.accent : T.text }}>
                    {t.name}
                  </td>
                  <td style={{ padding: "13px 16px", color: t.highlight ? T.text : T.muted }}>{t.for}</td>
                  <td style={{ padding: "13px 16px" }}>
                    {t.crypto
                      ? <span style={{ color: T.green, fontWeight: 700, fontSize: 16 }}>✓ Built-in</span>
                      : <span style={{ color: T.muted, opacity: 0.5 }}>—</span>}
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    {t.deploy
                      ? <span style={{ color: T.green, fontWeight: 700, fontSize: 16 }}>✓ One click</span>
                      : <span style={{ color: T.muted, opacity: 0.5 }}>—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, color: T.text, marginTop: 24 }}>
            These tools built the wave.{" "}
            <span style={{ color: T.accent }}>VibeBlock rides it — straight to Arbitrum.</span>
          </div>
        </div>

        {/* Right: live CLI terminal */}
        <div style={{ flex: 0.9, background: "#08090c", border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {/* Terminal chrome */}
          <div style={{ background: "#111418", padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
            {["#ff5f57","#febc2e","#28c840"].map((c) => (
              <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c, flexShrink: 0 }} />
            ))}
            <div style={{ flex: 1, textAlign: "center", fontFamily: "'DM Mono', monospace", fontSize: 11, color: T.muted }}>
              vibeblock — zsh
            </div>
            <div style={{ background: `${T.accent}22`, border: `1px solid ${T.accent}55`, borderRadius: 6, padding: "2px 10px", fontFamily: "'DM Mono', monospace", fontSize: 10, color: T.accent, letterSpacing: "0.05em" }}>
              claude-sonnet-4-6
            </div>
          </div>
          {/* Terminal output */}
          <div style={{ flex: 1, padding: "18px 20px", fontFamily: "'DM Mono', monospace", fontSize: 13, lineHeight: 1.8, overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
            {PITCH_CLI_LINES.slice(0, visibleLines).map((line, i) => {
              const color = line.type === "success" ? T.green
                : line.type === "cmd" ? T.text
                : T.muted;
              return (
                <div key={i} style={{ color, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {line.type === "cursor"
                    ? <span>$ <span style={{ animation: "pitchBlink 1s step-end infinite", display: "inline-block" }}>▌</span></span>
                    : line.text}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Slide 6: For Everyone. For Anyone. ──────────────────────────────────────

function Slide6() {
  const guiSteps = [
    "Smart contract generated",
    "Frontend live at vibeblock.app/yield",
    "Deployed to Arbitrum One",
  ];

  const cliModels = [
    { label: "Claude Code", active: true },
    { label: "Codex",       active: false },
    { label: "Gemini",      active: false },
    { label: "Grok",        active: false },
  ];

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 72px" }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "0.25em", color: T.accent, textTransform: "uppercase", marginBottom: 14 }}>
        Built for Both
      </div>
      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(26px, 3.2vw, 46px)", textAlign: "center", marginBottom: 10, lineHeight: 1.1 }}>
        For everyone.{" "}
        <span style={{ color: T.accent }}>For anyone.</span>
      </div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: T.muted, textAlign: "center", marginBottom: 36, maxWidth: 720, lineHeight: 1.6 }}>
        Non-technical founders use the GUI. Engineers use the CLI with their model of choice.{" "}
        <span style={{ color: T.text, fontWeight: 500 }}>Both deploy to Arbitrum. Neither sees the blockchain.</span>
      </div>

      <div style={{ display: "flex", gap: 28, width: "100%", alignItems: "stretch" }}>

        {/* Left: GUI */}
        <div style={{ flex: 1, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 20, padding: "32px 36px", display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: T.accent, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 20 }}>
            No-code interface
          </div>
          <div style={{ background: T.bg, border: `1px solid ${T.accent}44`, borderRadius: 12, padding: "14px 16px", marginBottom: 14, fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: T.muted, lineHeight: 1.6, fontStyle: "italic" }}>
            "I need a DeFi yield optimizer for my users..."
          </div>
          <div style={{ background: T.accent, color: T.bg, borderRadius: 10, padding: "11px 20px", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14, textAlign: "center", marginBottom: 22, letterSpacing: "0.04em" }}>
            Build on Arbitrum →
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {guiSteps.map(line => (
              <div key={line} style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "'DM Mono', monospace", fontSize: 13, color: T.green }}>
                <span>✓</span><span>{line}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "auto", paddingTop: 20, fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: T.muted, fontStyle: "italic" }}>
            No wallet. No gas. No crypto jargon.
          </div>
        </div>

        {/* Divider */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0, gap: 8 }}>
          <div style={{ width: 1, flex: 1, background: T.border }} />
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: T.muted, letterSpacing: "0.1em", writingMode: "vertical-rl", transform: "rotate(180deg)", padding: "10px 0" }}>or</div>
          <div style={{ width: 1, flex: 1, background: T.border }} />
        </div>

        {/* Right: CLI */}
        <div style={{ flex: 1, background: "#000000", border: "1px solid #1e2d4a", borderRadius: 20, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {/* Terminal chrome */}
          <div style={{ background: "#000000", padding: "10px 16px", display: "flex", alignItems: "center", gap: 7, borderBottom: "1px solid #1e2d4a", flexShrink: 0 }}>
            {["#ff5f57","#febc2e","#28c840"].map(c => (
              <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />
            ))}
            <div style={{ flex: 1, textAlign: "center", fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#375280" }}>vibeblock — zsh</div>
          </div>

          {/* Model selector row */}
          <div style={{ padding: "12px 16px 10px", display: "flex", gap: 6, flexWrap: "wrap", borderBottom: "1px solid #1e2d4a", flexShrink: 0 }}>
            {cliModels.map(m => (
              <div key={m.label} style={{
                background: m.active ? "#12AAFF20" : "transparent",
                border: `1px solid ${m.active ? "#12AAFF66" : "#1e2d4a"}`,
                borderRadius: 6, padding: "3px 10px",
                fontFamily: "'DM Mono', monospace", fontSize: 10,
                color: m.active ? "#12AAFF" : "#375280",
              }}>{m.label}</div>
            ))}
            <div style={{ border: "1px dashed #1e2d4a", borderRadius: 6, padding: "3px 10px", fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#375280" }}>
              + Add Model
            </div>
          </div>

          {/* Terminal output */}
          <div style={{ flex: 1, padding: "14px 18px", fontFamily: "'DM Mono', monospace", fontSize: 12, lineHeight: 1.85, overflow: "hidden" }}>
            <div style={{ color: "#e8eaf0" }}>$ vibeblock generate "DeFi yield optimizer"</div>
            <div style={{ color: "#e8eaf0", paddingLeft: 2 }}>{"  "}--model claude-code --deploy arbitrum-one</div>
            <div style={{ color: "#1e2d4a", marginTop: 8 }}>{"  "}┌─ VibeBlock CLI v1.0.0 ──────────────┐</div>
            <div style={{ color: "#1e2d4a" }}>{"  "}│  Model  : Claude Code (Anthropic)   │</div>
            <div style={{ color: "#1e2d4a" }}>{"  "}└──────────────────────────────────────┘</div>
            <div style={{ color: "#12AAFF", marginTop: 10 }}>{"  "}✓ Contract deployed: 0x7fA3...c291</div>
            <div style={{ color: "#12AAFF" }}>{"  "}✓ Gas: $0.00 — Paymaster sponsored</div>
            <div style={{ color: "#12AAFF" }}>{"  "}✓ Done in 9.2s</div>
          </div>

          {/* Footer note */}
          <div style={{ padding: "10px 18px", borderTop: "1px solid #1e2d4a", fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#375280", flexShrink: 0 }}>
            Bring your own API key. Any model. Same Arbitrum result.
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Slide 7: Technical Depth ─────────────────────────────────────────────────

function Slide7() {
  const rows = [
    { tech: "Arbitrum One", role: "Settlement layer", why: "250ms blocks, Timeboost MEV protection" },
    { tech: "Timeboost", role: "MEV ordering", why: "Express Lane — 200ms priority advantage" },
    { tech: "LayerZero OFT", role: "Omnichain bridge", why: "User pays on any chain, settles on Arbitrum" },
    { tech: "ERC-4337", role: "Account abstraction", why: "No seed phrases — social login, smart recovery" },
    { tech: "Paymaster", role: "Gas abstraction", why: "Platform sponsors gas — users never see it" },
    { tech: "Fhenix CoFHE", role: "Privacy layer", why: "Encrypted state — private orders, private games" },
    { tech: "Robinhood Chain", role: "RWA Orbit", why: "Tokenized stocks, compliance at chain layer" },
    { tech: "Slither + AI", role: "Security audit", why: "Static analysis + AI second-pass on every contract" },
  ];

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 72px" }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "0.25em", color: T.accent, textTransform: "uppercase", marginBottom: 8 }}>
        Technical Depth
      </div>
      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 36, color: T.text, marginBottom: 40 }}>
        The Stack
      </div>
      <table style={{ borderCollapse: "collapse", width: "100%", maxWidth: 1100, fontFamily: "'DM Sans', sans-serif", fontSize: 19 }}>
        <thead>
          <tr>
            {["Technology", "Role", "Why it matters"].map((h) => (
              <th key={h} style={{
                fontFamily: "'DM Mono', monospace", fontSize: 13, letterSpacing: "0.15em",
                color: T.muted, textTransform: "uppercase", padding: "10px 20px",
                borderBottom: `1px solid ${T.border}`, textAlign: "left", fontWeight: 400,
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.tech} style={{ background: i % 2 === 1 ? `${T.surface}88` : "transparent", borderBottom: `1px solid ${T.border}44` }}>
              <td style={{ padding: "16px 20px", color: T.accent, fontWeight: 600 }}>{row.tech}</td>
              <td style={{ padding: "16px 20px", color: T.muted }}>{row.role}</td>
              <td style={{ padding: "16px 20px", color: T.text }}>{row.why}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Slide Partners ───────────────────────────────────────────────────────────

function SlidePartners() {
  const partners = [
    {
      name: "ZeroDev",
      tag: "Web2 UX on Web3 Rails",
      color: "#7c3aed",
      glow: "#7c3aed",
      featured: true,
      points: [
        "No wallets. No seed phrases. No gas popups.",
        "Session keys let the app act on the user's behalf — milestone releases without signing every tx.",
        "Social login, smart recovery, one-tap checkout.",
        "The single biggest reason non-crypto users can actually use this.",
      ],
    },
    {
      name: "LayerZero",
      tag: "You just transfer.",
      color: "#12AAFF",
      glow: "#12AAFF",
      featured: false,
      points: [
        "Pay on Ethereum, Base, Solana — arrive on Arbitrum.",
        "No bridge UI. No swap step. No 'wrong network' error.",
        "The user experience: tap a button, it works.",
      ],
    },
    {
      name: "Arbitrum One",
      tag: "The Invisible Engine",
      color: "#00C805",
      glow: "#00C805",
      featured: false,
      points: [
        "250ms block times — feels instant.",
        "Fraction of mainnet cost, same EVM security.",
        "Users never know it's a blockchain.",
      ],
    },
    {
      name: "Timeboost",
      tag: "MEV? Gone.",
      color: "#f59e0b",
      glow: "#f59e0b",
      featured: false,
      points: [
        "Trading bot gets express-lane ordering.",
        "Front-running eliminated — users get the price they see.",
      ],
    },
    {
      name: "Fhenix CoFHE",
      tag: "Privacy by Default",
      color: "#a855f7",
      glow: "#a855f7",
      featured: false,
      points: [
        "Encrypted on-chain state.",
        "Private orders, hidden game state — without a server.",
      ],
    },
    {
      name: "Robinhood Chain",
      tag: "Real-World Assets",
      color: "#00C805",
      glow: "#00C805",
      featured: false,
      points: [
        "Tokenized stocks and RWAs.",
        "Compliance baked into the chain layer — not bolted on.",
      ],
    },
  ];

  const featured = partners.find((p) => p.featured);
  const rest = partners.filter((p) => !p.featured);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 64px" }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "0.25em", color: T.accent, textTransform: "uppercase", marginBottom: 8 }}>
        Built With
      </div>
      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 36, color: T.text, marginBottom: 36 }}>
        Partner Integrations
      </div>

      <div style={{ display: "flex", gap: 24, width: "100%", maxWidth: 1200, alignItems: "flex-start" }}>

        {/* Featured: ZeroDev */}
        <div style={{
          flex: "0 0 360px",
          background: `${featured.glow}0d`,
          border: `1.5px solid ${featured.glow}66`,
          borderRadius: 20,
          padding: "32px 36px",
          boxShadow: `0 0 40px ${featured.glow}18`,
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: 0, right: 0,
            background: featured.glow, color: "#fff",
            fontFamily: "'DM Mono', monospace", fontSize: 10,
            letterSpacing: "0.15em", textTransform: "uppercase",
            padding: "6px 16px", borderBottomLeftRadius: 12,
          }}>Keystone</div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24, color: featured.color, marginBottom: 4 }}>
            {featured.name}
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: T.muted, marginBottom: 20, letterSpacing: "0.05em" }}>
            {featured.tag}
          </div>
          {featured.points.map((pt, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
              <div style={{ color: featured.color, fontSize: 16, lineHeight: 1.5, flexShrink: 0 }}>→</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: T.text, lineHeight: 1.55 }}>{pt}</div>
            </div>
          ))}
        </div>

        {/* Rest: 2×2+1 grid */}
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {rest.map((p) => (
            <div key={p.name} style={{
              background: `${p.glow}08`,
              border: `1px solid ${T.border}`,
              borderRadius: 16,
              padding: "22px 24px",
            }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 12 }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 17, color: p.color }}>{p.name}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: T.muted, letterSpacing: "0.08em" }}>{p.tag}</div>
              </div>
              {p.points.map((pt, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
                  <div style={{ color: p.color, fontSize: 13, lineHeight: 1.5, flexShrink: 0 }}>·</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: T.muted, lineHeight: 1.5 }}>{pt}</div>
                </div>
              ))}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

// ─── Slide 8: The Ask ─────────────────────────────────────────────────────────

function Slide8() {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", padding: "0 80px" }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(${T.border}44 1px, transparent 1px), linear-gradient(90deg, ${T.border}44 1px, transparent 1px)`,
        backgroundSize: "60px 60px", opacity: 0.25, pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "0.25em", color: T.accent, textTransform: "uppercase", marginBottom: 24 }}>
          The Ask
        </div>

        {/* Main statement */}
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(32px, 4.5vw, 60px)", textAlign: "center", lineHeight: 1.1, marginBottom: 16 }}>
          Arbitrum could build this.
        </div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(32px, 4.5vw, 60px)", textAlign: "center", lineHeight: 1.1, color: T.accent, marginBottom: 40 }}>
          I already did.
        </div>

        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, color: T.muted, textAlign: "center", marginBottom: 52, maxWidth: 760, lineHeight: 1.7 }}>
          This isn't a pitch against your roadmap — it IS your roadmap, shipped now.
          Every month without this is another month of the new wave of builders hitting that docs wall and leaving.
        </div>

        {/* Two paths */}
        <div style={{ display: "flex", gap: 32, width: "100%", maxWidth: 900 }}>
          <div style={{
            flex: 1, background: `${T.accent}0d`,
            border: `1px solid ${T.accent}55`, borderRadius: 20, padding: "36px 40px",
          }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: T.accent, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>Option A</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 26, color: T.text, marginBottom: 12, lineHeight: 1.2 }}>Grant to ship v1</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: T.muted, lineHeight: 1.6 }}>
              Fund VibeBlock as an official Arbitrum developer onboarding tool. Replace the docs wall with a product that ships what Arbitrum promises.
            </div>
          </div>

          <div style={{
            flex: 1, background: T.surface,
            border: `1px solid ${T.border}`, borderRadius: 20, padding: "36px 40px",
          }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: T.muted, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>Option B</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 26, color: T.text, marginBottom: 12, lineHeight: 1.2 }}>Build it together</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: T.muted, lineHeight: 1.6 }}>
              Bring me in to build VibeBlock under the Arbitrum brand. Own the developer onboarding narrative — and the next wave of builders who come with it.
            </div>
          </div>
        </div>

        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: T.muted, textAlign: "center", marginTop: 36, letterSpacing: "0.05em" }}>
          Either way — this is how I think about what you've built.{" "}
          <span style={{ color: T.text }}>Let's talk.</span>
        </div>
      </div>
    </div>
  );
}

// ─── Slide: Wave Hook ─────────────────────────────────────────────────────────

function SlideWaveHook() {
  const eras = [
    { label: "Web",         year: "'95", done: true },
    { label: "Mobile",      year: "'07", done: true },
    { label: "Cloud",       year: "'12", done: true },
    { label: "AI Tools",    year: "'22", done: true },
    { label: "AI Builders", year: "Now", done: false, accent: true },
  ];

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", padding: "0 80px" }}>
      {/* Background grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(${T.border}44 1px, transparent 1px), linear-gradient(90deg, ${T.border}44 1px, transparent 1px)`,
        backgroundSize: "60px 60px", opacity: 0.3, pointerEvents: "none",
      }} />
      {/* Radial glow */}
      <div style={{
        position: "absolute", width: 800, height: 400, borderRadius: "50%",
        background: `radial-gradient(ellipse, ${T.accent}0d 0%, transparent 70%)`,
        top: "35%", left: "50%", transform: "translateX(-50%)", pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 960 }}>
        {/* Eyebrow */}
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "0.3em", color: T.muted, textTransform: "uppercase", marginBottom: 32 }}>
          Every generation gets one wave
        </div>

        {/* Era timeline */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 52, flexWrap: "nowrap" }}>
          {eras.map((era, i) => (
            <span key={era.label} style={{ display: "flex", alignItems: "center" }}>
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: era.accent ? 14 : 12,
                fontWeight: era.accent ? 700 : 400,
                color: era.accent ? T.accent : T.muted,
                padding: "6px 14px",
                borderRadius: 20,
                background: era.accent ? `${T.accent}14` : "transparent",
                border: era.accent ? `1px solid ${T.accent}44` : "none",
                letterSpacing: "0.06em",
              }}>
                <span style={{ opacity: 0.5, fontSize: 10, marginRight: 6 }}>{era.year}</span>
                {era.label}
              </span>
              {i < eras.length - 1 && (
                <span style={{ color: era.done ? T.muted : T.accent, fontSize: 14, margin: "0 4px", opacity: 0.5 }}>→</span>
              )}
            </span>
          ))}
        </div>

        {/* Main statement */}
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(38px, 5.5vw, 76px)", lineHeight: 1.05, marginBottom: 36 }}>
          <div style={{ color: T.text }}>A new kind of builder</div>
          <div style={{ color: T.text }}>is <span style={{ color: T.accent }}>waking up.</span></div>
        </div>

        {/* Supporting */}
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 20, color: T.muted, lineHeight: 1.75, maxWidth: 720, margin: "0 auto 40px" }}>
          They use Cursor. They ship with Lovable. They've launched apps without writing a line of code.
          <br />
          <span style={{ color: T.text, fontWeight: 500 }}>They have no idea what a gas fee is. And they're the majority.</span>
        </div>

        {/* Tension hook leading into next slide */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 22px", borderRadius: 24, border: `1px solid ${T.border}`, background: T.surface }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.amber, flexShrink: 0 }} />
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: T.muted, letterSpacing: "0.1em" }}>
            500M AI users · 23K on-chain devs · the gap is the opportunity
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Slide: The Agentic Wave ───────────────────────────────────────────────────

function SlideAIStats() {
  const bars = [
    { label: "Monthly AI users", value: 500, max: 500, unit: "500M+", color: T.accent, sub: "ChatGPT, Gemini, Claude — combined" },
    { label: "\"Vibe coders\" using AI to build", value: 14, max: 500, unit: "~14M", color: T.amber, sub: "Cursor, Lovable, Replit, GitHub Copilot" },
    { label: "Active web2 developers", value: 27, max: 500, unit: "27M", color: T.purple, sub: "GitHub active devs, 2024" },
    { label: "Active web3 / on-chain devs", value: 0.23, max: 500, unit: "23K", color: T.red, sub: "Electric Capital Developer Report, 2024" },
  ];

  const wave = [
    { name: "Anthropic", act: "Made AI safe + trustworthy" },
    { name: "OpenAI", act: "Made AI mainstream" },
    { name: "Lovable", act: "Prompt → full-stack app" },
    { name: "Cursor", act: "AI as coding co-pilot" },
    { name: "Replit", act: "Browser → dev environment" },
    { name: "VibeBlock", act: "Your Arbitrum co-pilot — scaffold the hard parts, iterate to ship", highlight: true },
  ];

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 72px" }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "0.25em", color: T.accent, textTransform: "uppercase", marginBottom: 12 }}>
        The Agentic Wave
      </div>
      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(26px, 3vw, 42px)", marginBottom: 8, lineHeight: 1.1 }}>
        500 million people use AI.
        <span style={{ color: T.accent }}> Most just ask questions.</span>
      </div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: T.muted, marginBottom: 40 }}>
        The builders are next — and on-chain has no on-ramp for them.
      </div>

      <div style={{ display: "flex", gap: 48, alignItems: "flex-start" }}>
        {/* Left: Bar chart */}
        <div style={{ flex: 1.4 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: T.muted, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>Who's online</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {bars.map((b) => {
              const pct = Math.max((b.value / b.max) * 100, 0.5);
              return (
                <div key={b.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: T.text }}>{b.label}</div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: b.color, marginLeft: 12, flexShrink: 0 }}>{b.unit}</div>
                  </div>
                  <div style={{ height: 10, background: T.border, borderRadius: 6, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: b.color, borderRadius: 6, opacity: 0.85 }} />
                  </div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: T.muted, marginTop: 4 }}>{b.sub}</div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 28, background: T.surface, border: `1px solid ${T.accent}33`, borderRadius: 14, padding: "14px 20px" }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: T.muted, lineHeight: 1.7 }}>
              Web2 devs outnumber web3 devs{" "}
              <span style={{ color: T.accent, fontWeight: 700, fontSize: 17 }}>1,174×</span>.{" "}
              Every AI coding tool is accelerating that gap — unless the on-ramp exists.
            </div>
          </div>
        </div>

        {/* Right: Wave table */}
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: T.muted, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>Who paved the way</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {wave.map((w, i) => (
              <div key={w.name} style={{
                display: "flex", alignItems: "center", gap: 16,
                padding: "13px 18px",
                background: w.highlight ? `${T.accent}14` : i % 2 === 0 ? T.surface : "transparent",
                borderRadius: w.highlight ? 12 : 0,
                border: w.highlight ? `1px solid ${T.accent}44` : "none",
                marginBottom: w.highlight ? 0 : 0,
              }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 15, color: w.highlight ? T.accent : T.text, minWidth: 88, flexShrink: 0 }}>{w.name}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: w.highlight ? T.text : T.muted }}>{w.act}</div>
                {w.highlight && <div style={{ marginLeft: "auto", fontFamily: "'DM Mono', monospace", fontSize: 10, color: T.accent, letterSpacing: "0.1em", flexShrink: 0 }}>← YOU ARE HERE</div>}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, padding: "12px 18px", background: T.surface, borderRadius: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: T.muted, lineHeight: 1.6 }}>
              This isn't DeFi, memes, or NFTs.{" "}
              <span style={{ color: T.text }}>It's the next wave of everyday products — built by anyone, running on Arbitrum, trusted by users who never see a blockchain.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Slide: Roadmap ────────────────────────────────────────────────────────────

function SlideRoadmap() {
  const phases = [
    {
      tag: "v0.1 — Shipped",
      title: "Foundation",
      color: T.green,
      items: [
        "AI-generated Solidity contracts (4 product types)",
        "React frontend scaffold + live demo preview",
        "Slither static analysis + AI second-pass audit",
        "Deploy to Arbitrum Sepolia — one click",
      ],
    },
    {
      tag: "v0.2 — Next  3–6 mo",
      title: "Security & Scale",
      color: T.accent,
      items: [
        "Echidna / Medusa fuzzing — automated exploit discovery",
        "Stylus (Rust) contract generation for gas-critical products",
        "ZeroDev session keys auto-wired to every product type",
        "Formal verification pass before any mainnet deploy",
      ],
    },
    {
      tag: "v0.3 — Later  6–12 mo",
      title: "Autonomy",
      color: T.amber,
      items: [
        "Autonomous security agent — continuous on-chain monitoring",
        "Full mainnet pipeline: deploy, verify, monitor, alert",
        "Custom product types — describe anything, ship anything",
        "AI audit score as on-chain verifiable credential",
      ],
    },
    {
      tag: "Vision",
      title: "The Unlock",
      color: T.purple,
      items: [
        "Every AI-generated contract is formally verified",
        "27M web2 devs become on-chain builders",
        "Users never see a wallet, gas fee, or chain ID",
        "Arbitrum powers it all — invisible, everywhere",
      ],
    },
  ];

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 72px" }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "0.25em", color: T.accent, textTransform: "uppercase", marginBottom: 12 }}>
        Roadmap
      </div>
      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(26px, 3vw, 40px)", marginBottom: 6, lineHeight: 1.1 }}>
        Maximum security. Minimum friction.
        <span style={{ color: T.accent }}> Every step of the way.</span>
      </div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: T.muted, marginBottom: 36 }}>
        The audit gets deeper, the contracts get safer, the UX stays invisible.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {phases.map((p) => (
          <div key={p.tag} style={{ background: T.surface, border: `1px solid ${p.color}44`, borderRadius: 16, padding: "24px 22px", display: "flex", flexDirection: "column", gap: 0 }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: p.color, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>{p.tag}</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: p.color, marginBottom: 16 }}>{p.title}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
              {p.items.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: p.color, flexShrink: 0, marginTop: 6, opacity: 0.7 }} />
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: T.muted, lineHeight: 1.5 }}>{item}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, display: "flex", justifyContent: "center" }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: T.muted, textAlign: "center", lineHeight: 1.7, maxWidth: 800 }}>
          The goal isn't more DeFi protocols. It's{" "}
          <span style={{ color: T.text, fontWeight: 600 }}>the next generation of everyday products</span>
          {" "}— healthcare, freelancing, gaming, logistics — running on Arbitrum because it's the best infrastructure, not because the builder knew it was there.
        </div>
      </div>
    </div>
  );
}

// ─── Shell / Navigation ───────────────────────────────────────────────────────

export default function VibeBlockPitch() {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); setSlide((s) => Math.min(s + 1, TOTAL_SLIDES - 1)); }
      if (e.key === "ArrowLeft") { setSlide((s) => Math.max(s - 1, 0)); }
      if (e.key === "Home") setSlide(0);
      if (e.key === "End") setSlide(TOTAL_SLIDES - 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const slides = [
    <Slide1 key={0} />,
    <SlideWaveHook key={1} />,
    <SlideAIStats key={2} />,
    <Slide5 key={3} />,
    <Slide2 key={4} />,
    <Slide3 key={5} />,
    <Slide4 key={6} />,
    <Slide6 key={7} />,
    <Slide7 key={8} />,
    <SlidePartners key={9} />,
    <SlideRoadmap key={10} />,
  ];

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", background: T.bg, color: T.text, fontFamily: "'DM Sans', sans-serif", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow: hidden; }
        @keyframes pitchBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
      <div style={{ width: "100%", height: "100%", position: "relative" }}>{slides[slide]}</div>
      <div style={{ position: "fixed", bottom: 24, right: 32, fontFamily: "'DM Mono', monospace", fontSize: 13, color: T.muted, letterSpacing: "0.1em", userSelect: "none" }}>
        {slide + 1} / {TOTAL_SLIDES}
      </div>
      <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8 }}>
        {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
          <button key={i} onClick={() => setSlide(i)} style={{
            width: i === slide ? 24 : 8, height: 8, borderRadius: 4, border: "none",
            cursor: "pointer", background: i === slide ? T.accent : T.border,
            transition: "all 0.2s ease", padding: 0,
          }} />
        ))}
      </div>
    </div>
  );
}
