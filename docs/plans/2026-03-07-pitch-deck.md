# VibeBlock Pitch Deck Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build `VibeBlock-pitch.jsx` — a single-file React slide deck for a 3–5 minute live presentation.

**Architecture:** Six full-bleed slides in a single React component, keyboard-navigable (left/right arrows + space), same dark VibeBlock aesthetic as the main app. No external deps beyond what the preview already has (React + Vite). The file lives alongside the other JSX files and can be previewed via the same Vite dev server.

**Tech Stack:** React (hooks), inline styles, Google Fonts (Syne, DM Mono, DM Sans — already loaded), no additional packages.

---

### Task 1: Scaffold the file with navigation shell

**Files:**
- Create: `/Users/phil/Local Renders/repos/vibeblock/VibeBlock-pitch.jsx`

**Step 1: Create the shell component**

```jsx
import React, { useState, useEffect } from "react";

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
};

const TOTAL_SLIDES = 6;

export default function VibeBlockPitch() {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        setSlide((s) => Math.min(s + 1, TOTAL_SLIDES - 1));
      }
      if (e.key === "ArrowLeft") {
        setSlide((s) => Math.max(s - 1, 0));
      }
      if (e.key === "Home") setSlide(0);
      if (e.key === "End") setSlide(TOTAL_SLIDES - 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const slides = [
    <Slide1 key={0} />,
    <Slide2 key={1} />,
    <Slide3 key={2} />,
    <Slide4 key={3} />,
    <Slide5 key={4} />,
    <Slide6 key={5} />,
  ];

  return (
    <div style={{
      width: "100vw", height: "100vh", overflow: "hidden",
      background: T.bg, color: T.text,
      fontFamily: "'DM Sans', sans-serif",
      position: "relative",
    }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow: hidden; }
      `}</style>

      {/* Current slide */}
      <div style={{ width: "100%", height: "100%", position: "relative" }}>
        {slides[slide]}
      </div>

      {/* Slide counter */}
      <div style={{
        position: "fixed", bottom: 24, right: 32,
        fontFamily: "'DM Mono', monospace", fontSize: 13,
        color: T.muted, letterSpacing: "0.1em",
        userSelect: "none",
      }}>
        {slide + 1} / {TOTAL_SLIDES}
      </div>

      {/* Nav dots */}
      <div style={{
        position: "fixed", bottom: 24, left: "50%",
        transform: "translateX(-50%)",
        display: "flex", gap: 8,
      }}>
        {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            style={{
              width: i === slide ? 24 : 8, height: 8,
              borderRadius: 4, border: "none", cursor: "pointer",
              background: i === slide ? T.accent : T.border,
              transition: "all 0.2s ease",
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}
```

**Step 2: Verify dev server still runs (it won't load pitch yet — that's fine)**

Open http://localhost:5173 — existing app still works. The pitch file is not yet wired as the entry point.

---

### Task 2: Slide 1 — Cover

**Files:**
- Modify: `/Users/phil/Local Renders/repos/vibeblock/VibeBlock-pitch.jsx`

**Design:**
- Full-bleed dark background with subtle grid overlay
- VibeBlock wordmark centered (large, Syne 800)
- Accent glow behind the logo
- Tagline: "Build anything. / Runs everywhere." (two lines, large)
- Sub-badge: "ARBITRUM EVERYWHERE · POWERED BY LAYERZERO" (DM Mono, muted, spaced)
- Partner logos row at bottom (text-based: Arbitrum | LayerZero | Fhenix | Robinhood Chain)

```jsx
function Slide1() {
  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      {/* Grid overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(${T.border}44 1px, transparent 1px), linear-gradient(90deg, ${T.border}44 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
        opacity: 0.4,
      }} />

      {/* Accent glow */}
      <div style={{
        position: "absolute",
        width: 600, height: 300,
        borderRadius: "50%",
        background: `radial-gradient(ellipse, ${T.accent}18 0%, transparent 70%)`,
        top: "30%", left: "50%", transform: "translateX(-50%)",
        pointerEvents: "none",
      }} />

      {/* Content */}
      <div style={{ position: "relative", textAlign: "center" }}>
        {/* Logo */}
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800, fontSize: 22,
          letterSpacing: "0.3em",
          color: T.accent,
          textTransform: "uppercase",
          marginBottom: 48,
          textShadow: `0 0 40px ${T.accent}66`,
        }}>
          VibeBlock
        </div>

        {/* Tagline */}
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800, fontSize: "clamp(48px, 7vw, 96px)",
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
          marginBottom: 40,
        }}>
          <div>Build anything.</div>
          <div style={{ color: T.accent }}>Runs everywhere.</div>
        </div>

        {/* Badge */}
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 13, letterSpacing: "0.25em",
          color: T.muted, textTransform: "uppercase",
          marginBottom: 80,
        }}>
          Arbitrum Everywhere · Powered by LayerZero
        </div>

        {/* Partner row */}
        <div style={{
          display: "flex", gap: 48, alignItems: "center",
          justifyContent: "center",
          fontFamily: "'DM Mono', monospace",
          fontSize: 12, letterSpacing: "0.15em",
          color: T.muted,
        }}>
          {["Arbitrum", "LayerZero", "Fhenix", "Robinhood Chain"].map((p) => (
            <span key={p}>{p}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

### Task 3: Slide 2 — The Gap

**Files:**
- Modify: `/Users/phil/Local Renders/repos/vibeblock/VibeBlock-pitch.jsx`

**Design:**
- Left side: arbitrum.io nav mockup with "Start Building →" button highlighted
- Arrow pointing right
- Right side: wall of raw Solidity/docs text (muted, overwhelming)
- Below: "Millions of builders never cross it." in large type

```jsx
function Slide2() {
  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "60px 80px",
    }}>
      {/* Label */}
      <div style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 12, letterSpacing: "0.25em",
        color: T.accent, textTransform: "uppercase",
        marginBottom: 40,
      }}>
        The Problem
      </div>

      {/* Flow diagram */}
      <div style={{
        display: "flex", alignItems: "center", gap: 32,
        marginBottom: 60, width: "100%", maxWidth: 900,
      }}>
        {/* Step 1: arbitrum.io */}
        <div style={{
          flex: 1, background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: 12, padding: "24px 28px",
        }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: T.muted, marginBottom: 12 }}>
            arbitrum.io
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
            "Start Building on Arbitrum"
          </div>
          <div style={{
            display: "inline-block",
            background: T.accent, color: "#000",
            fontWeight: 700, fontSize: 14,
            padding: "8px 20px", borderRadius: 6,
          }}>
            Start Building →
          </div>
        </div>

        {/* Arrow */}
        <div style={{ fontSize: 32, color: T.muted, flexShrink: 0 }}>→</div>

        {/* Step 2: raw docs */}
        <div style={{
          flex: 1, background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: 12, padding: "24px 28px",
          overflow: "hidden", position: "relative",
        }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: T.muted, marginBottom: 12 }}>
            docs.arbitrum.io
          </div>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11, color: T.muted, lineHeight: 1.6,
            opacity: 0.7,
          }}>
            {`pragma solidity ^0.8.0;\nimport "@arbitrum/nitro-contracts...";\n// L1 to L2 messaging...\n// Outbox.sol interface...\n// RetryableTicket...\nIBridge bridge = IBridge(...);\n// sequencer inbox...\nIArbSys constant arbSys =\n  IArbSys(address(100));`}
          </div>
          {/* fade out */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 60,
            background: `linear-gradient(transparent, ${T.surface})`,
          }} />
        </div>
      </div>

      {/* Headline */}
      <div style={{
        fontFamily: "'Syne', sans-serif",
        fontWeight: 800, fontSize: "clamp(32px, 4.5vw, 56px)",
        textAlign: "center", lineHeight: 1.1,
      }}>
        Millions of builders{" "}
        <span style={{ color: T.muted, textDecoration: "line-through" }}>never cross it.</span>
      </div>
    </div>
  );
}
```

---

### Task 4: Slide 3 — The Solution

**Files:**
- Modify: `/Users/phil/Local Renders/repos/vibeblock/VibeBlock-pitch.jsx`

**Design:**
- Three-step horizontal flow: [Plain English] → [VibeBlock generates] → [Complete product]
- Each step is a card
- Below the flow: two-line contrast statement
  - "User sees: an app."
  - "Nobody sees: the blockchain."

```jsx
function Slide3() {
  const steps = [
    {
      num: "01",
      label: "Describe it",
      detail: "\"I need a P2P marketplace where people can buy and sell sneakers safely\"",
      color: T.muted,
    },
    {
      num: "02",
      label: "VibeBlock generates",
      detail: "Smart contract · Frontend plan · Security audit · Deploy pipeline",
      color: T.accent,
      highlight: true,
    },
    {
      num: "03",
      label: "Complete product",
      detail: "Live preview · Arbitrum-deployed · LayerZero omnichain · Zero gas UX",
      color: T.green,
    },
  ];

  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "60px 80px",
    }}>
      <div style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 12, letterSpacing: "0.25em",
        color: T.accent, textTransform: "uppercase",
        marginBottom: 40,
      }}>
        The Solution
      </div>

      {/* Steps */}
      <div style={{ display: "flex", gap: 20, width: "100%", maxWidth: 960, marginBottom: 64 }}>
        {steps.map((s, i) => (
          <React.Fragment key={s.num}>
            <div style={{
              flex: 1,
              background: s.highlight ? `${T.accent}0d` : T.surface,
              border: `1px solid ${s.highlight ? T.accent : T.border}`,
              borderRadius: 12, padding: "28px 24px",
            }}>
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 11, color: s.color,
                letterSpacing: "0.15em", marginBottom: 12,
              }}>
                {s.num}
              </div>
              <div style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700, fontSize: 20, marginBottom: 12,
              }}>
                {s.label}
              </div>
              <div style={{ fontSize: 14, color: T.muted, lineHeight: 1.6 }}>
                {s.detail}
              </div>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                display: "flex", alignItems: "center",
                color: T.muted, fontSize: 24, flexShrink: 0,
              }}>→</div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Contrast statement */}
      <div style={{
        fontFamily: "'Syne', sans-serif",
        fontWeight: 700, fontSize: "clamp(24px, 3vw, 40px)",
        textAlign: "center", lineHeight: 1.3,
      }}>
        <span style={{ color: T.green }}>User sees: an app.</span>
        {"  "}
        <span style={{ color: T.muted }}>Nobody sees: the blockchain.</span>
      </div>
    </div>
  );
}
```

---

### Task 5: Slide 4 — Demo

**Files:**
- Modify: `/Users/phil/Local Renders/repos/vibeblock/VibeBlock-pitch.jsx`

**Design:**
- Almost nothing on the slide — the demo IS the content
- Large centered: "DEMO" in DM Mono, accent color
- Below: localhost:5173 URL in monospace (presenter opens it live)
- Subtle instruction text: "← arrow to return"

```jsx
function Slide4() {
  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      position: "relative",
    }}>
      {/* Grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(${T.border}44 1px, transparent 1px), linear-gradient(90deg, ${T.border}44 1px, transparent 1px)`,
        backgroundSize: "60px 60px", opacity: 0.3,
      }} />

      {/* Glow */}
      <div style={{
        position: "absolute",
        width: 500, height: 500, borderRadius: "50%",
        background: `radial-gradient(ellipse, ${T.accent}20 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", textAlign: "center" }}>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "clamp(64px, 12vw, 140px)",
          fontWeight: 500,
          color: T.accent,
          letterSpacing: "0.1em",
          textShadow: `0 0 80px ${T.accent}55`,
          marginBottom: 32,
        }}>
          DEMO
        </div>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 16, color: T.muted,
          letterSpacing: "0.05em",
        }}>
          localhost:5173
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 56,
        fontFamily: "'DM Mono', monospace",
        fontSize: 12, color: `${T.muted}88`,
        letterSpacing: "0.1em",
      }}>
        ← arrow to return
      </div>
    </div>
  );
}
```

---

### Task 6: Slide 5 — Technical Depth

**Files:**
- Modify: `/Users/phil/Local Renders/repos/vibeblock/VibeBlock-pitch.jsx`

**Design:**
- Left column: 8-row table (tech → what it does → why it matters)
- Minimal, dense, impressive
- Header: "The Stack"

Rows:
| Tech | Role | Why it matters |
|------|------|----------------|
| Arbitrum One | Settlement layer | 250ms blocks, Timeboost MEV protection |
| Timeboost | MEV ordering | 200ms Express Lane, sub-100ms auctions |
| LayerZero OFT | Omnichain bridge | User pays on any chain, settles on Arbitrum |
| ERC-4337 | Account abstraction | No seed phrases, social login, smart recovery |
| Paymaster | Gas abstraction | Users never pay gas — platform sponsors |
| Fhenix CoFHE | Privacy layer | Encrypted order books, private game state |
| Robinhood Chain | RWA orbit chain | Tokenized stocks, compliance at chain layer |
| Slither + AI | Security | Static analysis + AI second-pass on every contract |

```jsx
function Slide5() {
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
    <div style={{
      width: "100%", height: "100%",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "60px 80px",
    }}>
      <div style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 12, letterSpacing: "0.25em",
        color: T.accent, textTransform: "uppercase",
        marginBottom: 8,
      }}>
        Technical Depth
      </div>
      <div style={{
        fontFamily: "'Syne', sans-serif",
        fontWeight: 800, fontSize: 36,
        marginBottom: 40,
      }}>
        The Stack
      </div>

      <table style={{
        width: "100%", maxWidth: 900,
        borderCollapse: "collapse",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 15,
      }}>
        <thead>
          <tr>
            {["Technology", "Role", "Why it matters"].map((h) => (
              <th key={h} style={{
                textAlign: "left", padding: "8px 16px",
                fontFamily: "'DM Mono', monospace",
                fontSize: 11, letterSpacing: "0.15em",
                color: T.muted, textTransform: "uppercase",
                borderBottom: `1px solid ${T.border}`,
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.tech} style={{
              borderBottom: `1px solid ${T.border}44`,
              background: i % 2 === 0 ? "transparent" : `${T.surface}88`,
            }}>
              <td style={{ padding: "12px 16px", color: T.accent, fontWeight: 600 }}>{r.tech}</td>
              <td style={{ padding: "12px 16px", color: T.muted }}>{r.role}</td>
              <td style={{ padding: "12px 16px", color: T.text }}>{r.why}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

### Task 7: Slide 6 — The Ask

**Files:**
- Modify: `/Users/phil/Local Renders/repos/vibeblock/VibeBlock-pitch.jsx`

**Design:**
- Simple, confident, no clutter
- Large text: "This is how I think about what you've built."
- Below: two options styled differently
  - Option A (primary): "Grant to ship VibeBlock v1."
  - Divider: "or"
  - Option B (secondary): "Let's talk."
- Bottom: Philip's name (optional, can remove for anon)

```jsx
function Slide6() {
  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "60px 80px", textAlign: "center",
      position: "relative",
    }}>
      {/* Grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(${T.border}44 1px, transparent 1px), linear-gradient(90deg, ${T.border}44 1px, transparent 1px)`,
        backgroundSize: "60px 60px", opacity: 0.25,
      }} />

      <div style={{ position: "relative" }}>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 12, letterSpacing: "0.25em",
          color: T.accent, textTransform: "uppercase",
          marginBottom: 40,
        }}>
          The Ask
        </div>

        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: "clamp(28px, 4vw, 52px)",
          lineHeight: 1.2, marginBottom: 56,
          maxWidth: 700,
        }}>
          This is how I think about{" "}
          <span style={{ color: T.accent }}>what you've built.</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700, fontSize: 24,
            background: T.accent, color: "#000",
            padding: "14px 40px", borderRadius: 8,
          }}>
            Grant to ship VibeBlock v1.
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            color: T.muted, fontSize: 16,
          }}>
            or
          </div>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 600, fontSize: 22,
            color: T.text,
          }}>
            Let's talk.
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

### Task 8: Wire into Vite preview

**Files:**
- Modify: `/Users/phil/Local Renders/repos/vibeblock/preview/src/main.jsx` (or `App.jsx`)

**Step 1: Check current entry**

```bash
cat "/Users/phil/Local Renders/repos/vibeblock/preview/src/main.jsx"
```

**Step 2: Add pitch deck route**

The simplest approach: add `?pitch` query param check so the presenter can switch between app and deck.

```jsx
// In main.jsx or App.jsx
import VibeBlockPitch from "../../VibeBlock-pitch.jsx";
import VibeBlock from "../../VibeBlock-v3.jsx";

const isPitch = new URLSearchParams(window.location.search).has("pitch");

ReactDOM.createRoot(document.getElementById("root")).render(
  isPitch ? <VibeBlockPitch /> : <VibeBlock />
);
```

**Result:**
- `http://localhost:5173` → main VibeBlock app
- `http://localhost:5173?pitch` → pitch deck

---

### Task 9: Polish pass

**Files:**
- Modify: `/Users/phil/Local Renders/repos/vibeblock/VibeBlock-pitch.jsx`

Quick visual checks:
- [ ] All 6 slides render without scroll
- [ ] Keyboard nav works (→ advances, ← goes back, Space advances)
- [ ] Nav dots click correctly
- [ ] Fonts load (Syne headings, DM Mono labels, DM Sans body)
- [ ] Grid overlay on Cover, Demo, and Ask slides
- [ ] No overflow on any slide at 1440×900 viewport
- [ ] Slide counter shows "1 / 6" through "6 / 6"

---

## Summary

| Slide | Name | Key Element |
|-------|------|-------------|
| 1 | Cover | Logo glow + "Build anything. Runs everywhere." |
| 2 | The Gap | arbitrum.io → raw docs flow diagram |
| 3 | The Solution | 3-card flow + "User sees: an app." |
| 4 | DEMO | Full-screen DEMO prompt, localhost URL |
| 5 | Technical Depth | 8-row ecosystem table |
| 6 | The Ask | "This is how I think about what you've built." |

**Entry point:** `http://localhost:5173?pitch`
