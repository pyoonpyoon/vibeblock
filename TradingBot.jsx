import { useState, useEffect, useRef } from "react";

// ─── SEED DATA ────────────────────────────────────────────────────────────────
const STRATEGIES = [
  {
    id: "timeboost",
    name: "Timing Advantage",
    badge: "TIMEBOOST",
    desc: "Uses Arbitrum's Timeboost Express Lane to execute 200ms ahead of standard transactions. Captures price gaps before competing bots can react.",
    dex: "Camelot · Uniswap V3",
    color: "#F59E0B",
    today: 341.20,
    allTime: 12840.50,
    winRate: 91,
    tradesToday: 58,
    active: true,
  },
  {
    id: "arb",
    name: "Cross-DEX Arb",
    badge: "ARBITRAGE",
    desc: "Scans price differences across Camelot, Uniswap V3, and Balancer continuously. Executes atomic swaps when spread exceeds 0.15%.",
    dex: "Camelot · Balancer",
    color: "#22C55E",
    today: 198.50,
    allTime: 8420.00,
    winRate: 87,
    tradesToday: 41,
    active: true,
  },
  {
    id: "flashloan",
    name: "Flash Loan Capture",
    badge: "FLASH LOAN",
    desc: "Borrows capital via Aave flash loans to amplify arbitrage on GMX and Trader Joe without tying up bot capital.",
    dex: "GMX · Trader Joe",
    color: "#818CF8",
    today: 89.10,
    allTime: 3210.80,
    winRate: 82,
    tradesToday: 19,
    active: true,
  },
  {
    id: "reinvest",
    name: "Auto Reinvest",
    badge: "COMPOUND",
    desc: "Compounds profits back into active strategies. Rebalances allocations weekly based on trailing performance.",
    dex: "—",
    color: "#4B5563",
    today: 0,
    allTime: 0,
    winRate: 0,
    tradesToday: 0,
    active: false,
  },
];

const PAIRS  = ["ETH/USDC","ARB/USDC","GMX/USDC","WBTC/USDC","LINK/USDC","PENDLE/USDC","RDNT/USDC"];
const DEXES  = ["Camelot","Uniswap V3","Balancer","GMX","Trader Joe"];

function generateCandles(n = 48) {
  let price = 2650;
  return Array.from({ length: n }, () => {
    const open  = price;
    const chg   = (Math.random() - 0.42) * 55;
    const close = open + chg;
    const high  = Math.max(open, close) + Math.random() * 28;
    const low   = Math.min(open, close) - Math.random() * 28;
    price = close;
    return { open, close, high, low };
  });
}

let _tradeId = 200;
function generateTrade() {
  const stratIdx  = Math.floor(Math.random() * 3);
  const strat     = STRATEGIES[stratIdx];
  const isTB      = stratIdx === 0;
  const profit    = +(0.6 + Math.random() * 11).toFixed(2);
  const execMs    = isTB ? 160 + Math.floor(Math.random() * 55) : 360 + Math.floor(Math.random() * 220);
  const dex       = isTB
    ? ["Camelot","Uniswap V3"][Math.floor(Math.random() * 2)]
    : DEXES[Math.floor(Math.random() * DEXES.length)];
  return {
    id: _tradeId++,
    pair:       PAIRS[Math.floor(Math.random() * PAIRS.length)],
    dex,
    profit,
    execMs,
    timeboost:  isTB,
    stratColor: strat.color,
    time: new Date().toLocaleTimeString("en-US", { hour12: false }),
  };
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt = (n) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── CANDLESTICK CHART ────────────────────────────────────────────────────────
function CandlestickChart({ candles, running }) {
  const W = 560, H = 110;
  const pad = { t: 6, b: 6, l: 2, r: 2 };
  const iW = W - pad.l - pad.r;
  const iH = H - pad.t - pad.b;
  const allP = candles.flatMap(c => [c.high, c.low]);
  const minP = Math.min(...allP);
  const maxP = Math.max(...allP);
  const range = maxP - minP || 1;
  const cw = Math.max(2, iW / candles.length - 1.5);
  const y  = p  => pad.t + iH - ((p - minP) / range) * iH;
  const cx = i  => pad.l + (i / candles.length) * iW + cw / 2;

  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="tb_areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#F59E0B" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.01" />
        </linearGradient>
      </defs>
      {/* Area fill under close line */}
      <path
        d={`M ${candles.map((c,i)=>`${cx(i)},${y(c.close)}`).join(" L ")} L ${cx(candles.length-1)},${H} L ${cx(0)},${H} Z`}
        fill="url(#tb_areaGrad)"
      />
      {/* Candles */}
      {candles.map((c, i) => {
        const green   = c.close >= c.open;
        const color   = green ? "#22C55E" : "#EF4444";
        const bodyTop = y(Math.max(c.open, c.close));
        const bodyH   = Math.max(1, Math.abs(y(c.open) - y(c.close)));
        const x       = cx(i);
        return (
          <g key={i}>
            <line x1={x} y1={y(c.high)} x2={x} y2={y(c.low)} stroke={color} strokeWidth={0.8} opacity={0.45} />
            <rect x={x - cw/2} y={bodyTop} width={cw} height={bodyH} fill={color} opacity={0.75} rx={0.4} />
          </g>
        );
      })}
      {/* Close price line */}
      <path
        d={`M ${candles.map((c,i)=>`${cx(i)},${y(c.close)}`).join(" L ")}`}
        fill="none" stroke="#F59E0B" strokeWidth={1.5} opacity={0.5}
      />
    </svg>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function TradingBot() {
  const [running,       setRunning]       = useState(true);
  const [selectedStrat, setSelectedStrat] = useState(null);
  const [profit,        setProfit]        = useState(2847.32);
  const [displayProfit, setDisplayProfit] = useState(0);
  const [strategies,    setStrategies]    = useState(() => STRATEGIES.map(s => ({ ...s })));
  const [candles,       setCandles]       = useState(() => generateCandles(48));
  const [trades,        setTrades]        = useState(() => Array.from({ length: 12 }, () => generateTrade()));

  // Count-up animation on mount
  useEffect(() => {
    const target = 2847.32, dur = 1300, start = Date.now();
    const tick = () => {
      const prog = Math.min((Date.now() - start) / dur, 1);
      const ease = 1 - Math.pow(1 - prog, 3);
      setDisplayProfit(ease * target);
      if (prog < 1) requestAnimationFrame(tick);
      else setDisplayProfit(target);
    };
    const t = setTimeout(() => requestAnimationFrame(tick), 300);
    return () => clearTimeout(t);
  }, []);

  // Live tick
  useEffect(() => {
    if (!running) return;
    const iv = setInterval(() => {
      const gain = +(0.6 + Math.random() * 7).toFixed(2);
      setProfit(p        => +(p + gain).toFixed(2));
      setDisplayProfit(p => +(p + gain).toFixed(2));

      const newTrade = generateTrade();
      setTrades(ts => [newTrade, ...ts.slice(0, 24)]);

      const si = Math.floor(Math.random() * 3);
      setStrategies(ss => ss.map((s, i) =>
        i === si ? { ...s, today: +(s.today + gain).toFixed(2), tradesToday: s.tradesToday + 1 } : s
      ));

      setCandles(cs => {
        const last = cs[cs.length - 1];
        const tick = (Math.random() - 0.42) * 22;
        const newClose = last.close + tick;
        const updated  = { ...last, close: newClose, high: Math.max(last.high, newClose), low: Math.min(last.low, newClose) };
        if (Math.random() > 0.72) {
          return [...cs.slice(1), { open: newClose, close: newClose + tick * 0.3, high: newClose + Math.abs(tick) * 0.6, low: newClose - Math.abs(tick) * 0.6 }];
        }
        return [...cs.slice(0, -1), updated];
      });
    }, 1400);
    return () => clearInterval(iv);
  }, [running]);

  const todayTotal = strategies.reduce((a, s) => a + s.today, 0);
  const totalTrades = strategies.reduce((a, s) => a + s.tradesToday, 0);

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes tb_fadeUp  { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)} }
        @keyframes tb_pulse   { 0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.55;transform:scale(1.35)} }
        @keyframes tb_blink   { 0%,100%{opacity:1}50%{opacity:0.25} }
        @keyframes tb_slideUp { from{opacity:0;transform:translateY(100%)}to{opacity:1;transform:translateY(0)} }
        @keyframes tb_newRow  { from{background:rgba(245,158,11,0.12)}to{background:transparent} }
      `}</style>

      <div style={{
        background: "#080B0F",
        borderRadius: 16,
        border: "1px solid rgba(245,158,11,0.12)",
        overflow: "hidden",
        boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 4px 20px rgba(0,0,0,0.3)",
      }}>

        {/* ── TOP BAR ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(245,158,11,0.03)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, background: "#F59E0B", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>⚡</div>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#F0F2F7", letterSpacing: "-0.02em" }}>Apex</span>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", marginLeft: 2 }}>Trading Bot</span>
            {running && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", animation: "tb_pulse 2s ease-in-out infinite", marginLeft: 4 }} />}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#F0F2F7", fontFamily: "'DM Mono',monospace", letterSpacing: "-0.03em" }}>
                ${fmt(displayProfit)}
              </div>
              <div style={{ fontSize: 11, color: "#22C55E", fontWeight: 600 }}>↑ +${fmt(todayTotal)} today</div>
            </div>
            <button
              onClick={() => setRunning(r => !r)}
              style={{ background: running ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)", border: `1px solid ${running ? "rgba(239,68,68,0.35)" : "rgba(34,197,94,0.35)"}`, borderRadius: 8, padding: "7px 14px", cursor: "pointer", color: running ? "#EF4444" : "#22C55E", fontSize: 11, fontWeight: 800, letterSpacing: "0.06em", whiteSpace: "nowrap" }}
            >
              {running ? "⏸ KILL SWITCH" : "▶ RESUME"}
            </button>
          </div>
        </div>

        {/* ── MAIN GRID ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", minHeight: 440 }}>

          {/* LEFT: chart + strategies */}
          <div style={{ borderRight: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column" }}>

            {/* Chart */}
            <div style={{ padding: "14px 20px 10px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>ETH/USDC · 1M</div>
                <div style={{ display: "flex", gap: 14 }}>
                  {[
                    { label: "TRADES", val: totalTrades + 142 },
                    { label: "WIN RATE", val: "87%" },
                    { label: "TIMEBOOST EDGE", val: "200ms", amber: true },
                  ].map(s => (
                    <div key={s.label} style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: s.amber ? "#F59E0B" : "#F0F2F7", fontFamily: "'DM Mono',monospace" }}>{s.val}</div>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", letterSpacing: "0.07em" }}>{s.label}</div>
                    </div>
                  ))}
                  {running && <div style={{ fontSize: 10, color: "#F59E0B", alignSelf: "center", animation: "tb_blink 1.4s ease-in-out infinite", marginLeft: 4 }}>● LIVE</div>}
                </div>
              </div>
              <CandlestickChart candles={candles} running={running} />
            </div>

            {/* Strategies */}
            <div style={{ flex: 1, padding: "14px 20px" }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em", marginBottom: 10 }}>STRATEGIES</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {strategies.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStrat(selectedStrat?.id === s.id ? null : s)}
                    style={{ display: "flex", alignItems: "center", padding: "10px 12px", background: selectedStrat?.id === s.id ? "rgba(255,255,255,0.05)" : "#0D1017", borderRadius: 10, border: `1px solid ${selectedStrat?.id === s.id ? s.color + "40" : "rgba(255,255,255,0.05)"}`, cursor: "pointer", gap: 10, animation: `tb_fadeUp 0.3s ease ${i * 0.05}s both`, textAlign: "left" }}
                    onMouseEnter={e => { if (selectedStrat?.id !== s.id) e.currentTarget.style.borderColor = s.color + "30"; }}
                    onMouseLeave={e => { if (selectedStrat?.id !== s.id) e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; }}
                  >
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: s.color, flexShrink: 0, animation: s.active && running ? "tb_pulse 2.2s ease-in-out infinite" : "none" }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: s.active ? "#F0F2F7" : "rgba(255,255,255,0.3)" }}>{s.name}</span>
                        {s.id === "timeboost" && <span style={{ fontSize: 9, color: "#F59E0B", background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 4, padding: "1px 5px", fontWeight: 800, letterSpacing: "0.05em" }}>⚡ TIMEBOOST</span>}
                      </div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", marginTop: 2 }}>{s.dex}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: s.active ? "#22C55E" : "rgba(255,255,255,0.2)", fontFamily: "'DM Mono',monospace" }}>{s.active ? `+$${fmt(s.today)}` : "—"}</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 1 }}>{s.active ? `${s.tradesToday} trades` : "idle"}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Strategy detail panel */}
              {selectedStrat && (
                <div style={{ marginTop: 12, padding: "14px 16px", background: "rgba(255,255,255,0.025)", borderRadius: 12, border: `1px solid ${selectedStrat.color}20`, animation: "tb_fadeUp 0.25s ease both" }}>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, marginBottom: selectedStrat.id === "timeboost" ? 10 : 0 }}>
                    {selectedStrat.desc}
                  </div>
                  {selectedStrat.id === "timeboost" && (
                    <div style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 8, padding: "10px 12px" }}>
                      <div style={{ fontSize: 10, color: "#F59E0B", fontWeight: 800, letterSpacing: "0.08em", marginBottom: 4 }}>⚡ TIMEBOOST · EXPRESS LANE</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
                        Arbitrum's Express Lane gives this strategy a 200ms head start. By the time standard-lane bots see an opportunity, we've already closed it.
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: live feed */}
          <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em" }}>LIVE TRADES</div>
              {running && <div style={{ fontSize: 9, color: "#22C55E", fontWeight: 700, animation: "tb_pulse 2s infinite" }}>● LIVE</div>}
            </div>
            <div style={{ flex: 1, overflowY: "auto" }}>
              {trades.map((t, i) => (
                <div
                  key={t.id}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 16px", borderBottom: "1px solid rgba(255,255,255,0.03)", animation: i === 0 ? "tb_newRow 1.2s ease both" : "none" }}
                >
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: t.stratColor, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#F0F2F7", fontFamily: "'DM Mono',monospace" }}>{t.pair}</span>
                      {t.timeboost && <span style={{ fontSize: 8, color: "#F59E0B", fontWeight: 800 }}>⚡</span>}
                    </div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", marginTop: 1 }}>{t.dex} · {t.execMs}ms</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#22C55E", fontFamily: "'DM Mono',monospace" }}>+${fmt(t.profit)}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>{t.time}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* Footer disclosure */}
            <div style={{ padding: "10px 16px", borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#F59E0B", opacity: 0.4 }} />
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.18)", letterSpacing: "0.06em" }}>ALL TRADES EXECUTE ON ARBITRUM ONE · NO GAS FEES</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
