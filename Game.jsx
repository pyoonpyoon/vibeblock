import { useState, useEffect, useRef } from "react";

// ─── SEED DATA ────────────────────────────────────────────────────────────────
const SHOP_ITEMS = [
  { id:"boost",   name:"Brain Boost",      desc:"Speed +20% for 3 waves",  price:0.99,  emoji:"⚡", color:"#F59E0B" },
  { id:"shield",  name:"Plasma Shield",    desc:"+5 HP, absorbs next hit",  price:2.99,  emoji:"🛡", color:"#3B82F6" },
  { id:"repel",   name:"Worm Repellent",   desc:"Slows enemies 40%",        price:1.99,  emoji:"🧪", color:"#10B981" },
  { id:"mega",    name:"Mega Brain",       desc:"2× damage for 2 waves",    price:4.99,  emoji:"🧠", color:"#A855F7" },
  { id:"pass",    name:"Season Pass",      desc:"All power-ups + no ads",   price:9.99,  emoji:"👑", color:"#EC4899" },
];

const LEADERBOARD = [
  { rank:1,  name:"neuron99",    score:142800, wave:88, prize:"$48.00",  you:false },
  { rank:2,  name:"BrainBlast",  score:138400, wave:84, prize:"$32.00",  you:false },
  { rank:3,  name:"YOU",         score:121200, wave:71, prize:"$18.00",  you:true  },
  { rank:4,  name:"wormslayer",  score:98600,  wave:62, prize:"$8.00",   you:false },
  { rank:5,  name:"cortex_x",    score:87300,  wave:55, prize:"$4.00",   you:false },
  { rank:6,  name:"axon_king",   score:76100,  wave:49, prize:"$2.00",   you:false },
];

// Worm starting positions (angle in degrees from center)
const WORM_ANGLES = [15, 72, 130, 190, 255, 310];

// ─── SVG: BRAIN CHARACTER ─────────────────────────────────────────────────────
function Brain({ size = 52, pulse = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" style={{ filter:"drop-shadow(0 0 8px rgba(168,85,247,0.7))", animation: pulse ? "gm_pulse 0.8s ease-in-out infinite" : "none" }}>
      {/* Body */}
      <ellipse cx="26" cy="28" rx="18" ry="16" fill="#E879F9"/>
      <ellipse cx="26" cy="27" rx="16" ry="14" fill="#F0ABFC"/>
      {/* Brain fold lines */}
      <path d="M14 24 Q18 20 22 24 Q26 28 30 24 Q34 20 38 24" stroke="#C026D3" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <path d="M15 30 Q19 26 23 30 Q27 34 31 30 Q35 26 38 30" stroke="#C026D3" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <path d="M17 19 Q20 16 24 18" stroke="#C026D3" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <path d="M28 18 Q32 16 35 19" stroke="#C026D3" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      {/* Eyes */}
      <circle cx="21" cy="22" r="4" fill="white"/>
      <circle cx="31" cy="22" r="4" fill="white"/>
      <circle cx="22" cy="23" r="2.2" fill="#1a0030"/>
      <circle cx="32" cy="23" r="2.2" fill="#1a0030"/>
      {/* Eye shine */}
      <circle cx="23" cy="22" r="0.8" fill="white"/>
      <circle cx="33" cy="22" r="0.8" fill="white"/>
      {/* Mouth — determined smile */}
      <path d="M20 34 Q26 38 32 34" stroke="#C026D3" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

// ─── SVG: WORM ENEMY ──────────────────────────────────────────────────────────
function Worm({ x, y, angle, size = 1 }) {
  const s = size * 7;
  // Body segments follow the angle
  const rad = (angle * Math.PI) / 180;
  const dx = Math.cos(rad) * s * 1.2;
  const dy = Math.sin(rad) * s * 1.2;
  return (
    <g transform={`translate(${x},${y})`}>
      {/* Tail segments */}
      {[3,2,1].map(i => (
        <circle key={i} cx={dx*i*0.45} cy={dy*i*0.45} r={s*0.55 - i*0.4} fill="#4ADE80" opacity={0.7 - i*0.12}/>
      ))}
      {/* Body */}
      <circle cx={dx*0.7} cy={dy*0.7} r={s*0.72} fill="#22C55E"/>
      {/* Head */}
      <circle cx={0} cy={0} r={s} fill="#16A34A"/>
      {/* Eyes — angry */}
      <circle cx={-s*0.35} cy={-s*0.2} r={s*0.28} fill="white"/>
      <circle cx={s*0.35}  cy={-s*0.2} r={s*0.28} fill="white"/>
      <circle cx={-s*0.3}  cy={-s*0.15} r={s*0.16} fill="#1a1a1a"/>
      <circle cx={s*0.4}   cy={-s*0.15} r={s*0.16} fill="#1a1a1a"/>
      {/* Angry brows */}
      <line x1={-s*0.55} y1={-s*0.52} x2={-s*0.15} y2={-s*0.38} stroke="#14532D" strokeWidth={s*0.18} strokeLinecap="round"/>
      <line x1={s*0.55}  y1={-s*0.52} x2={s*0.15}  y2={-s*0.38} stroke="#14532D" strokeWidth={s*0.18} strokeLinecap="round"/>
    </g>
  );
}

// ─── GAME FIELD ───────────────────────────────────────────────────────────────
function GameField({ running, wave, kills, hp, maxHp }) {
  const [wormDist, setWormDist] = useState(85); // distance from center %
  const [blasts,   setBlasts]   = useState([]);
  const blastId = useRef(0);

  useEffect(() => {
    if (!running) return;
    // Worms creep in
    const iv1 = setInterval(() => setWormDist(d => Math.max(38, d - 0.9)), 120);
    // Blast pulses
    const iv2 = setInterval(() => {
      const id = blastId.current++;
      setBlasts(bs => [...bs, { id, angle: Math.random() * 360 }]);
      setTimeout(() => setBlasts(bs => bs.filter(b => b.id !== id)), 400);
    }, 600);
    return () => { clearInterval(iv1); clearInterval(iv2); };
  }, [running]);

  // Reset worms each wave
  useEffect(() => { setWormDist(85); }, [wave]);

  const W = 310, H = 260, cx = W/2, cy = H/2;
  const wormR = (wormDist / 100) * (Math.min(W,H)/2 - 14);

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ background:"#07001A", borderRadius:0 }}>
      {/* Grid */}
      {Array.from({length:10},(_,i)=>(
        <line key={`h${i}`} x1={0} y1={i*(H/9)} x2={W} y2={i*(H/9)} stroke="rgba(168,85,247,0.06)" strokeWidth={1}/>
      ))}
      {Array.from({length:13},(_,i)=>(
        <line key={`v${i}`} x1={i*(W/12)} y1={0} x2={i*(W/12)} y2={H} stroke="rgba(168,85,247,0.06)" strokeWidth={1}/>
      ))}

      {/* Danger zone ring */}
      <circle cx={cx} cy={cy} r={wormR + 4} fill="none" stroke="rgba(239,68,68,0.06)" strokeWidth={8}/>

      {/* Blast radius */}
      <circle cx={cx} cy={cy} r={52} fill="rgba(168,85,247,0.04)" stroke="rgba(168,85,247,0.15)" strokeWidth={1} strokeDasharray="4 4"/>

      {/* Blast projectiles */}
      {blasts.map(b => {
        const r = (b.angle * Math.PI) / 180;
        return (
          <line key={b.id}
            x1={cx} y1={cy}
            x2={cx + Math.cos(r)*62} y2={cy + Math.sin(r)*62}
            stroke="#E879F9" strokeWidth={2} opacity={0.8}
            style={{ animation:"gm_blast 0.4s ease-out both" }}
          />
        );
      })}

      {/* Worms */}
      {WORM_ANGLES.map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const wx = cx + Math.cos(rad) * wormR;
        const wy = cy + Math.sin(rad) * wormR;
        const facingAngle = (angle + 180) % 360; // face toward center
        return <Worm key={i} x={wx} y={wy} angle={facingAngle} size={1 + wave * 0.04}/>;
      })}

      {/* Brain (center) */}
      <foreignObject x={cx-26} y={cy-26} width={52} height={52}>
        <div xmlns="http://www.w3.org/1999/xhtml">
          <Brain size={52} pulse={running}/>
        </div>
      </foreignObject>

      {/* Wave label */}
      <text x={W-8} y={16} textAnchor="end" fill="rgba(168,85,247,0.6)" fontSize={10} fontFamily="DM Mono" fontWeight={600}>WAVE {wave}</text>
      <text x={8} y={16} fill="rgba(255,255,255,0.4)" fontSize={10} fontFamily="DM Mono">{kills} kills</text>
    </svg>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Game() {
  const [screen,      setScreen]      = useState("game");
  const [running,     setRunning]     = useState(true);
  const [wave,        setWave]        = useState(1);
  const [kills,       setKills]       = useState(0);
  const [hp,          setHp]          = useState(18);
  const [xp,          setXp]          = useState(34);
  const [score,       setScore]       = useState(4200);
  const [payItem,     setPayItem]     = useState(null);  // shop item being purchased
  const [payStep,     setPayStep]     = useState("choose"); // choose | processing | done
  const [owned,       setOwned]       = useState([]);

  const maxHp = 20;

  // Game tick
  useEffect(() => {
    if (!running || screen !== "game") return;
    const iv = setInterval(() => {
      setKills(k => k + (Math.random() > 0.35 ? 1 : 0));
      setXp(x  => { if (x >= 100) { setWave(w => w+1); return 10; } return Math.min(100, x + Math.floor(Math.random()*6+2)); });
      setScore(s => s + Math.floor(Math.random()*120+40));
      if (Math.random() > 0.97) setHp(h => Math.max(0, h-1));
    }, 900);
    return () => clearInterval(iv);
  }, [running, screen]);

  const handlePay = (method) => {
    setPayStep("processing");
    setTimeout(() => {
      setPayStep("done");
      setOwned(o => [...o, payItem.id]);
      setTimeout(() => { setPayItem(null); setPayStep("choose"); }, 1800);
    }, 1800);
  };

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes gm_fadeUp  { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)} }
        @keyframes gm_popIn   { from{opacity:0;transform:scale(0.5)}to{opacity:1;transform:scale(1)} }
        @keyframes gm_slideUp { from{opacity:0;transform:translateY(100%)}to{opacity:1;transform:translateY(0)} }
        @keyframes gm_pulse   { 0%,100%{filter:drop-shadow(0 0 8px rgba(168,85,247,0.7))}50%{filter:drop-shadow(0 0 18px rgba(232,121,249,1))} }
        @keyframes gm_blast   { from{opacity:0.9;stroke-width:3}to{opacity:0;stroke-width:1} }
        @keyframes gm_spin    { to{transform:rotate(360deg)} }
        ::-webkit-scrollbar{width:0}
      `}</style>

      {/* Phone shell */}
      <div style={{ width:390, minHeight:720, maxHeight:"90vh", background:"#07001A", borderRadius:44, boxShadow:"0 40px 100px rgba(0,0,0,0.6), 0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(168,85,247,0.15)", overflow:"hidden", display:"flex", flexDirection:"column", position:"relative" }}>

        {/* Status bar */}
        <div style={{ padding:"14px 28px 8px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.6)" }}>9:41</div>
          <div style={{ display:"flex", gap:5 }}>{[3,4,4,5].map((h,i)=><div key={i} style={{ width:3, height:h+6, background:"rgba(255,255,255,0.4)", borderRadius:2, opacity:i<3?1:0.3 }}/>)}</div>
        </div>

        {/* ── GAME SCREEN ── */}
        {screen === "game" && (
          <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
            {/* Top HUD */}
            <div style={{ padding:"6px 20px 10px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ fontSize:14, fontWeight:900, color:"#E879F9", letterSpacing:"-0.02em" }}>Brain Blast</div>
                <div style={{ fontSize:10, background:"rgba(168,85,247,0.15)", border:"1px solid rgba(168,85,247,0.3)", borderRadius:4, padding:"1px 6px", color:"#C084FC", fontWeight:700 }}>WAVE {wave}</div>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={()=>setRunning(r=>!r)} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"5px 10px", cursor:"pointer", color:"rgba(255,255,255,0.6)", fontSize:11, fontWeight:700 }}>
                  {running ? "⏸" : "▶"}
                </button>
                <button onClick={()=>setScreen("shop")} style={{ background:"rgba(168,85,247,0.15)", border:"1px solid rgba(168,85,247,0.3)", borderRadius:8, padding:"5px 10px", cursor:"pointer", color:"#C084FC", fontSize:11, fontWeight:700 }}>🛒</button>
              </div>
            </div>

            {/* HP bar */}
            <div style={{ padding:"0 20px 8px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <div style={{ display:"flex", gap:4, alignItems:"center" }}>
                  <span style={{ fontSize:10, color:"rgba(255,255,255,0.4)" }}>HP</span>
                  <span style={{ fontSize:11, fontWeight:800, color:hp <= 5 ? "#EF4444" : "#F0F2F7" }}>{hp}/{maxHp}</span>
                </div>
                <div style={{ display:"flex", gap:4, alignItems:"center" }}>
                  <span style={{ fontSize:10, color:"rgba(168,85,247,0.6)" }}>XP</span>
                  <span style={{ fontSize:11, fontWeight:700, color:"#C084FC" }}>{xp}%</span>
                </div>
              </div>
              <div style={{ height:5, background:"rgba(255,255,255,0.07)", borderRadius:3, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${(hp/maxHp)*100}%`, background:hp<=5?"#EF4444":"linear-gradient(90deg,#7C3AED,#E879F9)", borderRadius:3, transition:"width 0.4s" }}/>
              </div>
              <div style={{ height:3, background:"rgba(255,255,255,0.05)", borderRadius:2, overflow:"hidden", marginTop:3 }}>
                <div style={{ height:"100%", width:`${xp}%`, background:"rgba(168,85,247,0.5)", borderRadius:2, transition:"width 0.6s" }}/>
              </div>
            </div>

            {/* Battlefield */}
            <div style={{ flex:1, display:"flex", alignItems:"stretch" }}>
              <GameField running={running} wave={wave} kills={kills} hp={hp} maxHp={maxHp}/>
            </div>

            {/* Bottom stats */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", borderTop:"1px solid rgba(168,85,247,0.1)", background:"rgba(0,0,0,0.3)" }}>
              {[
                { label:"SCORE",  val:score.toLocaleString() },
                { label:"KILLS",  val:kills },
                { label:"WAVE",   val:wave },
                { label:"RANK",   val:"#3" },
              ].map(s=>(
                <div key={s.label} style={{ padding:"10px 0", textAlign:"center" }}>
                  <div style={{ fontSize:14, fontWeight:900, color:"#F0F2F7", fontFamily:"'DM Mono',monospace" }}>{s.val}</div>
                  <div style={{ fontSize:9, color:"rgba(255,255,255,0.3)", letterSpacing:"0.08em", marginTop:1 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SHOP SCREEN ── */}
        {screen === "shop" && !payItem && (
          <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
            <div style={{ display:"flex", alignItems:"center", padding:"10px 20px", borderBottom:"1px solid rgba(168,85,247,0.1)" }}>
              <button onClick={()=>setScreen("game")} style={{ background:"none", border:"none", cursor:"pointer", padding:"4px 8px 4px 0", fontSize:14, color:"#A855F7", fontWeight:600 }}>← Back</button>
              <div style={{ flex:1, textAlign:"center", fontSize:15, fontWeight:800, color:"#F0F2F7", marginRight:40 }}>Power-Ups</div>
            </div>

            <div style={{ flex:1, overflowY:"auto", padding:"14px 16px 24px" }}>
              {/* Banner */}
              <div style={{ background:"linear-gradient(135deg,rgba(124,58,237,0.3),rgba(168,85,247,0.15))", border:"1px solid rgba(168,85,247,0.2)", borderRadius:14, padding:"14px 16px", marginBottom:16, display:"flex", alignItems:"center", gap:12 }}>
                <Brain size={44}/>
                <div>
                  <div style={{ fontSize:14, fontWeight:800, color:"#F0F2F7", marginBottom:2 }}>Level up your brain</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)", lineHeight:1.5 }}>Power-ups activate instantly. Pay with Apple Pay, Google Pay, or your wallet.</div>
                </div>
              </div>

              {SHOP_ITEMS.map((item,i)=>{
                const isOwned = owned.includes(item.id);
                return (
                  <div key={item.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px", background:"rgba(255,255,255,0.03)", border:`1px solid ${isOwned?"rgba(34,197,94,0.3)":"rgba(255,255,255,0.07)"}`, borderRadius:14, marginBottom:10, animation:`gm_fadeUp 0.3s ease ${i*0.05}s both` }}>
                    <div style={{ width:44, height:44, borderRadius:12, background:`${item.color}18`, border:`1px solid ${item.color}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{item.emoji}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:14, fontWeight:700, color:"#F0F2F7" }}>{item.name}</div>
                      <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:2 }}>{item.desc}</div>
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0 }}>
                      {isOwned ? (
                        <div style={{ fontSize:11, color:"#22C55E", fontWeight:700 }}>✓ Active</div>
                      ) : (
                        <button onClick={()=>{ setPayItem(item); setPayStep("choose"); }} style={{ background:item.color, border:"none", borderRadius:10, padding:"7px 14px", color:"#fff", fontSize:13, fontWeight:800, cursor:"pointer" }}>
                          ${item.price.toFixed(2)}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── PAYMENT SHEET ── */}
        {screen === "shop" && payItem && (
          <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
            {/* Dimmed backdrop area */}
            <div style={{ flex:1, background:"rgba(0,0,0,0.4)" }} onClick={()=>{ if(payStep==="choose"){ setPayItem(null); }}}/>

            {/* Sheet */}
            <div style={{ background:"#0F0A2A", borderTop:"1px solid rgba(168,85,247,0.2)", borderRadius:"24px 24px 0 0", padding:"20px 24px 40px", animation:"gm_slideUp 0.3s cubic-bezier(0.22,1,0.36,1) both" }}>
              {payStep === "choose" && (
                <>
                  <div style={{ width:36, height:4, background:"rgba(255,255,255,0.15)", borderRadius:2, margin:"0 auto 20px" }}/>
                  <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
                    <div style={{ width:48, height:48, borderRadius:14, background:`${payItem.color}18`, border:`1px solid ${payItem.color}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>{payItem.emoji}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:15, fontWeight:800, color:"#F0F2F7" }}>{payItem.name}</div>
                      <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>{payItem.desc}</div>
                    </div>
                    <div style={{ fontSize:22, fontWeight:900, color:"#F0F2F7" }}>${payItem.price.toFixed(2)}</div>
                  </div>

                  {/* Payment options */}
                  <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}>
                    {/* Apple Pay */}
                    <button onClick={()=>handlePay("apple")} style={{ width:"100%", background:"#000", border:"none", borderRadius:14, padding:"14px 0", color:"#fff", fontSize:16, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M13.5 9.3c0-2 1.6-2.9 1.7-3-1-1.4-2.5-1.5-3-1.6-1.3-.1-2.5.8-3.1.8-.6 0-1.6-.7-2.7-.7C4.8 4.8 3 6.1 3 8.9c0 1.7.7 3.6 1.5 4.7.8 1.1 1.5 2 2.5 2 1 0 1.4-.6 2.6-.6 1.2 0 1.5.6 2.6.6s1.8-.9 2.5-2c.8-1.1 1.1-2.2 1.1-2.3-.1 0-2.3-.9-2.3-3z" fill="white"/><path d="M11.5 3c.6-.8 1.1-1.8 1-2.9-1 0-2.2.7-2.9 1.4-.6.7-1.1 1.8-1 2.8 1.1.1 2.3-.6 2.9-1.3z" fill="white"/></svg>
                      Apple Pay
                    </button>

                    {/* Google Pay */}
                    <button onClick={()=>handlePay("google")} style={{ width:"100%", background:"#fff", border:"1px solid #e0e0e0", borderRadius:14, padding:"14px 0", color:"#3c4043", fontSize:15, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                      <span style={{ fontSize:16, fontWeight:900 }}>G</span>
                      <span style={{ color:"#4285F4", fontWeight:700 }}>o</span>
                      <span style={{ color:"#EA4335", fontWeight:700 }}>o</span>
                      <span style={{ color:"#FBBC04", fontWeight:700 }}>g</span>
                      <span style={{ color:"#34A853", fontWeight:700 }}>l</span>
                      <span style={{ color:"#4285F4", fontWeight:700 }}>e</span>
                      <span style={{ marginLeft:4 }}>Pay</span>
                    </button>

                    {/* Crypto wallet */}
                    <button onClick={()=>handlePay("wallet")} style={{ width:"100%", background:"rgba(168,85,247,0.12)", border:"1px solid rgba(168,85,247,0.3)", borderRadius:14, padding:"14px 0", color:"#C084FC", fontSize:14, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="2" stroke="#C084FC" strokeWidth="1.5"/><path d="M1 6h14" stroke="#C084FC" strokeWidth="1.5"/><circle cx="11.5" cy="9.5" r="1" fill="#C084FC"/></svg>
                      Connect Wallet
                    </button>
                  </div>

                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.2)", textAlign:"center", lineHeight:1.6 }}>
                    All purchases are processed in USDT on Arbitrum One and displayed in USD. No gas fees.
                  </div>
                </>
              )}

              {payStep === "processing" && (
                <div style={{ textAlign:"center", padding:"24px 0" }}>
                  <div style={{ width:52, height:52, border:"3px solid rgba(168,85,247,0.2)", borderTopColor:"#A855F7", borderRadius:"50%", margin:"0 auto 16px", animation:"gm_spin 0.8s linear infinite" }}/>
                  <div style={{ fontSize:15, fontWeight:700, color:"#F0F2F7", marginBottom:4 }}>Processing...</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.3)" }}>Settling via USDT on Arbitrum</div>
                </div>
              )}

              {payStep === "done" && (
                <div style={{ textAlign:"center", padding:"16px 0", animation:"gm_fadeUp 0.4s ease both" }}>
                  <div style={{ width:64, height:64, borderRadius:"50%", background:"rgba(34,197,94,0.12)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", animation:"gm_popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}>
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
        {screen === "leaderboard" && (
          <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
            <div style={{ display:"flex", alignItems:"center", padding:"10px 20px", borderBottom:"1px solid rgba(168,85,247,0.1)" }}>
              <button onClick={()=>setScreen("game")} style={{ background:"none", border:"none", cursor:"pointer", padding:"4px 8px 4px 0", fontSize:14, color:"#A855F7", fontWeight:600 }}>← Back</button>
              <div style={{ flex:1, textAlign:"center", fontSize:15, fontWeight:800, color:"#F0F2F7", marginRight:40 }}>Leaderboard</div>
            </div>

            <div style={{ padding:"14px 16px", background:"rgba(168,85,247,0.06)", borderBottom:"1px solid rgba(168,85,247,0.1)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginBottom:2 }}>YOUR RANK</div>
                <div style={{ fontSize:24, fontWeight:900, color:"#E879F9" }}>#3</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginBottom:2 }}>PRIZE</div>
                <div style={{ fontSize:20, fontWeight:900, color:"#22C55E" }}>$18.00</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginBottom:2 }}>SCORE</div>
                <div style={{ fontSize:16, fontWeight:800, color:"#F0F2F7", fontFamily:"'DM Mono',monospace" }}>121,200</div>
              </div>
            </div>

            <div style={{ flex:1, overflowY:"auto" }}>
              {LEADERBOARD.map((p,i)=>(
                <div key={p.rank} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 20px", background:p.you?"rgba(168,85,247,0.08)":"transparent", borderBottom:"1px solid rgba(255,255,255,0.04)", animation:`gm_fadeUp 0.3s ease ${i*0.05}s both` }}>
                  <div style={{ width:24, textAlign:"center" }}>
                    {p.rank<=3 ? <span style={{ fontSize:16 }}>{["🥇","🥈","🥉"][p.rank-1]}</span> : <span style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.25)" }}>{p.rank}</span>}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:p.you?800:600, color:p.you?"#E879F9":"#F0F2F7" }}>{p.name}{p.you?" (you)":""}</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:1 }}>Wave {p.wave} · {p.score.toLocaleString()} pts</div>
                  </div>
                  <div style={{ fontSize:14, fontWeight:800, color:"#22C55E" }}>{p.prize}</div>
                </div>
              ))}
              <div style={{ padding:"16px 20px 32px", display:"flex", gap:8, alignItems:"flex-start" }}>
                <div style={{ width:5, height:5, borderRadius:"50%", background:"#A855F7", marginTop:4, opacity:0.5, flexShrink:0 }}/>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.18)", lineHeight:1.65 }}>
                  Prize payouts sent in USDT on Arbitrum One. Displayed in USD. Paid instantly at end of each weekly season.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom nav */}
        {!payItem && (
          <div style={{ display:"flex", background:"rgba(0,0,0,0.4)", borderTop:"1px solid rgba(168,85,247,0.1)", padding:"10px 0 20px", backdropFilter:"blur(10px)" }}>
            {[
              { id:"game",        label:"Play",        icon:"🎮" },
              { id:"shop",        label:"Shop",        icon:"🛒" },
              { id:"leaderboard", label:"Ranks",       icon:"🏆" },
            ].map(n=>(
              <button key={n.id} onClick={()=>{ setPayItem(null); setScreen(n.id); }} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3, background:"none", border:"none", cursor:"pointer", padding:"4px 0" }}>
                <span style={{ fontSize:18, lineHeight:1 }}>{n.icon}</span>
                <span style={{ fontSize:10, fontWeight:700, color:screen===n.id?"#E879F9":"rgba(255,255,255,0.3)" }}>{n.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
