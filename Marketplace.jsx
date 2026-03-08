import { useState, useEffect } from "react";

// ─── SEED DATA ────────────────────────────────────────────────────────────────
const LISTINGS = [
  { id:1, name:"Nike SB Dunk Low Travis Scott", cat:"Sneakers",   price:1240,  condition:"New w/ Box",  seller:"SneakerVault", verified:true,  sales:142, color:"#E8F4E8", emoji:"👟" },
  { id:2, name:"Rolex Submariner Date 2023",    cat:"Watches",    price:14800, condition:"Like New",    seller:"LuxWatches",   verified:true,  sales:89,  color:"#E8EAF4", emoji:"⌚" },
  { id:3, name:"Banksy — Girl with Balloon",    cat:"Art",        price:3200,  condition:"Mint",        seller:"ArtHouse",     verified:true,  sales:34,  color:"#F4E8E8", emoji:"🎨" },
  { id:4, name:"Supreme Box Logo Hoodie FW23",  cat:"Streetwear", price:680,   condition:"New",         seller:"DropArchive",  verified:false, sales:28,  color:"#F0E8F4", emoji:"👕" },
  { id:5, name:"Jordan 4 Retro Military Black", cat:"Sneakers",   price:340,   condition:"DS",          seller:"KicksOnly",    verified:true,  sales:205, color:"#E8EEF4", emoji:"👟" },
  { id:6, name:"KAWS Companion Figure (Open)",  cat:"Collectibles",price:850,  condition:"Mint in Box", seller:"ModernArts",   verified:true,  sales:61,  color:"#F4EDE8", emoji:"🗿" },
];

const CATEGORIES = ["All", "Sneakers", "Watches", "Art", "Streetwear", "Collectibles"];

const MY_LISTINGS = [
  { id:10, name:"Air Jordan 1 Retro High OG",  price:420,  status:"sold",       views:84,  date:"Mar 4" },
  { id:11, name:"Vintage Rolex Datejust 36",   price:8200, status:"in_transit", views:231, date:"Mar 2" },
  { id:12, name:"Supreme Jacket FW22",         price:310,  status:"active",     views:47,  date:"Feb 28" },
];

const MY_PURCHASES = [
  { id:20, name:"Yeezy Boost 350 V2 Cream",   price:290,  status:"delivered",  date:"Mar 3" },
  { id:21, name:"Stüssy 8-Ball Tee",          price:85,   status:"in_transit", date:"Mar 5" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt  = (n) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtK = (n) => n >= 1000 ? `$${(n/1000).toFixed(1)}k` : `$${n}`;

const STATUS_LABEL  = { sold:"Paid out", in_transit:"In transit", active:"Listed", delivered:"Delivered" };
const STATUS_COLOR  = { sold:"#00B07D", in_transit:"#F59E0B",    active:"#0057FF", delivered:"#00B07D" };

// ─── ITEM CARD ────────────────────────────────────────────────────────────────
function ItemCard({ item, onSelect }) {
  return (
    <button
      onClick={() => onSelect(item)}
      style={{ background:"#fff", border:"1px solid #EAECF0", borderRadius:14, overflow:"hidden", cursor:"pointer", textAlign:"left", padding:0, transition:"box-shadow 0.15s" }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.09)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
    >
      <div style={{ height:110, background:item.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:44 }}>{item.emoji}</div>
      <div style={{ padding:"10px 12px 12px" }}>
        <div style={{ fontSize:12, fontWeight:700, color:"#0D1117", lineHeight:1.3, marginBottom:4, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{item.name}</div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontSize:14, fontWeight:900, color:"#0D1117" }}>${fmt(item.price)}</span>
          {item.verified && <span style={{ fontSize:9, color:"#00B07D", background:"rgba(0,176,125,0.1)", border:"1px solid rgba(0,176,125,0.2)", borderRadius:4, padding:"1px 5px", fontWeight:800 }}>✓ VERIFIED</span>}
        </div>
        <div style={{ fontSize:10, color:"#8892A4", marginTop:3 }}>{item.condition} · {item.seller}</div>
      </div>
    </button>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Marketplace() {
  const [screen,    setScreen]    = useState("browse"); // browse | item | checkout | confirmed | sell | orders
  const [cat,       setCat]       = useState("All");
  const [query,     setQuery]     = useState("");
  const [selected,  setSelected]  = useState(null);
  const [orderTab,  setOrderTab]  = useState("selling"); // selling | buying
  const [checking,  setChecking]  = useState(false);
  const [sellStep,  setSellStep]  = useState("form"); // form | listed
  const [sellForm,  setSellForm]  = useState({ name:"", condition:"", price:"", desc:"" });

  const filtered = LISTINGS.filter(l =>
    (cat === "All" || l.cat === cat) &&
    (!query || l.name.toLowerCase().includes(query.toLowerCase()))
  );

  const handleBuy = () => {
    setChecking(true);
    setTimeout(() => { setChecking(false); setScreen("confirmed"); }, 2000);
  };

  const fee       = selected ? +(selected.price * 0.015).toFixed(2) : 0;
  const youPay    = selected ? selected.price : 0;

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes mp_fadeUp  { from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)} }
        @keyframes mp_popIn   { from{opacity:0;transform:scale(0.5)}to{opacity:1;transform:scale(1)} }
        @keyframes mp_slideIn { from{opacity:0;transform:translateX(100%)}to{opacity:1;transform:translateX(0)} }
        @keyframes mp_spin    { to{transform:rotate(360deg)} }
        ::-webkit-scrollbar{width:0}
      `}</style>

      {/* Phone shell */}
      <div style={{ width:390, minHeight:720, maxHeight:"90vh", background:"#F8F9FA", borderRadius:44, boxShadow:"0 40px 100px rgba(0,0,0,0.15), 0 8px 32px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(0,0,0,0.06)", overflow:"hidden", display:"flex", flexDirection:"column", position:"relative" }}>

        {/* Status bar */}
        <div style={{ background: screen === "browse" ? "#fff" : "#fff", padding:"14px 28px 8px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontSize:13, fontWeight:700, color:"#0D1117" }}>9:41</div>
          <div style={{ display:"flex", gap:5, alignItems:"center" }}>
            {[3,4,4,5].map((h,i) => <div key={i} style={{ width:3, height:h+6, background:"#0D1117", borderRadius:2, opacity:i<3?0.6:0.2 }}/>)}
          </div>
        </div>

        {/* ── BROWSE ── */}
        {screen === "browse" && (
          <div style={{ flex:1, display:"flex", flexDirection:"column", overflowY:"auto" }}>
            {/* Header */}
            <div style={{ padding:"4px 20px 12px", background:"#fff", borderBottom:"1px solid #F0F2F8" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                <div>
                  <div style={{ fontSize:20, fontWeight:900, color:"#0D1117", letterSpacing:"-0.03em" }}>Tradeport</div>
                  <div style={{ fontSize:11, color:"#8892A4", marginTop:1 }}>P2P · No holds · Instant payout</div>
                </div>
                <button onClick={() => setScreen("sell")} style={{ background:"#0D1117", border:"none", borderRadius:10, padding:"8px 14px", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>+ Sell</button>
              </div>
              {/* Search */}
              <div style={{ background:"#F4F6FA", borderRadius:12, display:"flex", alignItems:"center", gap:8, padding:"10px 14px", marginBottom:10 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke="#8892A4" strokeWidth="1.5"/><path d="M10 10L13 13" stroke="#8892A4" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search listings..." style={{ border:"none", background:"transparent", flex:1, fontSize:13, color:"#0D1117", fontFamily:"'DM Sans',sans-serif", outline:"none" }}/>
              </div>
              {/* Category chips */}
              <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:2 }}>
                {CATEGORIES.map(c => (
                  <button key={c} onClick={() => setCat(c)} style={{ flexShrink:0, background:cat===c?"#0D1117":"#F4F6FA", border:"none", borderRadius:20, padding:"5px 12px", fontSize:11, fontWeight:700, color:cat===c?"#fff":"#6B7385", cursor:"pointer" }}>{c}</button>
                ))}
              </div>
            </div>

            {/* Fee callout */}
            <div style={{ margin:"12px 16px 0", background:"rgba(0,200,5,0.05)", border:"1px solid rgba(0,200,5,0.18)", borderRadius:10, padding:"9px 12px", display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:13 }}>💸</span>
              <div style={{ fontSize:11, color:"#00A804", fontWeight:700 }}>1.5% fee — vs eBay (12.9%) or PayPal (3.49%+). Sellers keep more.</div>
            </div>

            {/* Grid */}
            <div style={{ padding:"12px 16px 24px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {filtered.map((item, i) => (
                <div key={item.id} style={{ animation:`mp_fadeUp 0.3s ease ${i*0.04}s both` }}>
                  <ItemCard item={item} onSelect={it => { setSelected(it); setScreen("item"); }}/>
                </div>
              ))}
              {filtered.length === 0 && (
                <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"40px 0", color:"#8892A4", fontSize:13 }}>No listings found</div>
              )}
            </div>
          </div>
        )}

        {/* ── ITEM DETAIL ── */}
        {screen === "item" && selected && (
          <div style={{ flex:1, display:"flex", flexDirection:"column", overflowY:"auto", animation:"mp_slideIn 0.25s cubic-bezier(0.22,1,0.36,1) both" }}>
            {/* Back */}
            <div style={{ display:"flex", alignItems:"center", padding:"10px 16px", background:"#fff", borderBottom:"1px solid #F0F2F8" }}>
              <button onClick={() => setScreen("browse")} style={{ background:"none", border:"none", cursor:"pointer", padding:"4px 8px 4px 0", fontSize:14, color:"#0057FF", fontWeight:600 }}>← Back</button>
              <div style={{ flex:1, textAlign:"center", fontSize:14, fontWeight:700, color:"#0D1117", marginRight:40 }}>{selected.cat}</div>
            </div>
            {/* Image */}
            <div style={{ height:200, background:selected.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:80 }}>{selected.emoji}</div>
            {/* Info */}
            <div style={{ flex:1, padding:"20px 20px 0" }}>
              <div style={{ fontSize:18, fontWeight:900, color:"#0D1117", letterSpacing:"-0.02em", lineHeight:1.3, marginBottom:6 }}>{selected.name}</div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
                <span style={{ fontSize:11, color:"#6B7385", background:"#F4F6FA", borderRadius:6, padding:"3px 8px", fontWeight:600 }}>{selected.condition}</span>
                {selected.verified && <span style={{ fontSize:10, color:"#00B07D", background:"rgba(0,176,125,0.08)", border:"1px solid rgba(0,176,125,0.2)", borderRadius:6, padding:"3px 8px", fontWeight:800 }}>✓ VERIFIED SELLER</span>}
              </div>

              {/* Seller */}
              <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 14px", background:"#F8F9FA", borderRadius:12, marginBottom:16 }}>
                <div style={{ width:38, height:38, borderRadius:"50%", background:"#E4E8F4", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:700, color:"#4B5563" }}>{selected.seller[0]}</div>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:"#0D1117" }}>{selected.seller}</div>
                  <div style={{ fontSize:11, color:"#8892A4", marginTop:1 }}>{selected.sales} completed sales</div>
                </div>
              </div>

              {/* Price breakdown */}
              <div style={{ background:"#fff", border:"1px solid #EAECF0", borderRadius:14, overflow:"hidden", marginBottom:16 }}>
                <div style={{ display:"flex", justifyContent:"space-between", padding:"12px 16px", borderBottom:"1px solid #F4F6FA" }}>
                  <span style={{ fontSize:13, color:"#6B7385" }}>Item price</span>
                  <span style={{ fontSize:13, fontWeight:700, color:"#0D1117" }}>${fmt(selected.price)}</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", padding:"12px 16px", borderBottom:"1px solid #F4F6FA" }}>
                  <span style={{ fontSize:13, color:"#6B7385" }}>Platform fee</span>
                  <span style={{ fontSize:13, color:"#6B7385" }}>$0.00 <span style={{ fontSize:10, color:"#00B07D", fontWeight:700 }}>(paid by seller)</span></span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", padding:"12px 16px", background:"#F8F9FA" }}>
                  <span style={{ fontSize:14, fontWeight:800, color:"#0D1117" }}>You pay</span>
                  <span style={{ fontSize:16, fontWeight:900, color:"#0D1117" }}>${fmt(youPay)}</span>
                </div>
              </div>

              {/* Escrow note */}
              <div style={{ display:"flex", gap:8, padding:"10px 12px", background:"rgba(0,87,255,0.04)", border:"1px solid rgba(0,87,255,0.1)", borderRadius:10, marginBottom:20 }}>
                <span style={{ fontSize:14, flexShrink:0 }}>🔒</span>
                <div style={{ fontSize:11, color:"#4B5693", lineHeight:1.6 }}>Your payment is held in escrow until you confirm delivery. If the item doesn't arrive, you get a full refund.</div>
              </div>
            </div>

            {/* Buy CTA */}
            <div style={{ padding:"0 20px 32px", background:"#F8F9FA" }}>
              <button onClick={handleBuy} disabled={checking} style={{ width:"100%", background:checking?"rgba(0,200,5,0.5)":"#00C805", border:"none", borderRadius:14, padding:"16px 0", color:"#fff", fontSize:16, fontWeight:800, cursor:checking?"not-allowed":"pointer", letterSpacing:"-0.01em" }}>
                {checking
                  ? <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}><span style={{ width:16, height:16, border:"2.5px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", display:"inline-block", animation:"mp_spin 0.7s linear infinite" }}/>Processing...</span>
                  : `Buy Now · $${fmt(youPay)}`}
              </button>
            </div>
          </div>
        )}

        {/* ── CONFIRMED ── */}
        {screen === "confirmed" && selected && (
          <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 32px", animation:"mp_fadeUp 0.4s ease both" }}>
            <div style={{ width:80, height:80, borderRadius:"50%", background:"rgba(0,200,5,0.1)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:24, animation:"mp_popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M7 18L15 26L29 10" stroke="#00C805" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div style={{ fontSize:24, fontWeight:900, color:"#0D1117", letterSpacing:"-0.03em", marginBottom:6 }}>Order placed!</div>
            <div style={{ fontSize:15, color:"#6B7385", marginBottom:4, textAlign:"center" }}>{selected.name}</div>
            <div style={{ fontSize:20, fontWeight:800, color:"#0D1117", marginBottom:28 }}>${fmt(youPay)}</div>

            <div style={{ width:"100%", background:"rgba(0,87,255,0.04)", border:"1px solid rgba(0,87,255,0.12)", borderRadius:14, padding:"16px", marginBottom:24 }}>
              <div style={{ fontSize:12, fontWeight:800, color:"#0057FF", marginBottom:8, letterSpacing:"0.04em" }}>🔒 ESCROW ACTIVE</div>
              <div style={{ fontSize:12, color:"#4B5693", lineHeight:1.65 }}>Your ${fmt(youPay)} is held securely. When you confirm delivery, the seller is paid instantly. No holds, no chargebacks.</div>
            </div>

            <div style={{ fontSize:10, color:"#A0A8B8", textAlign:"center", lineHeight:1.7, marginBottom:28 }}>
              Settlement via USDC on Arbitrum One · Displayed in USD · No gas fees charged
            </div>

            <button onClick={() => { setScreen("browse"); setSelected(null); setChecking(false); }} style={{ width:"100%", background:"#0D1117", border:"none", borderRadius:14, padding:"14px 0", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer" }}>
              Continue Shopping
            </button>
          </div>
        )}

        {/* ── SELL ── */}
        {screen === "sell" && (
          <div style={{ flex:1, display:"flex", flexDirection:"column", animation:"mp_slideIn 0.25s cubic-bezier(0.22,1,0.36,1) both" }}>
            <div style={{ display:"flex", alignItems:"center", padding:"10px 16px", background:"#fff", borderBottom:"1px solid #F0F2F8" }}>
              <button onClick={() => { setScreen("browse"); setSellStep("form"); }} style={{ background:"none", border:"none", cursor:"pointer", padding:"4px 8px 4px 0", fontSize:14, color:"#0057FF", fontWeight:600 }}>← Back</button>
              <div style={{ flex:1, textAlign:"center", fontSize:14, fontWeight:700, color:"#0D1117", marginRight:40 }}>List an Item</div>
            </div>

            {sellStep === "form" ? (
              <div style={{ flex:1, overflowY:"auto", padding:"20px 20px 32px" }}>
                {/* Fee comparison */}
                <div style={{ background:"#fff", border:"1px solid #EAECF0", borderRadius:14, overflow:"hidden", marginBottom:20 }}>
                  <div style={{ padding:"12px 16px", borderBottom:"1px solid #F4F6FA", fontSize:12, fontWeight:800, color:"#0D1117" }}>Why sell here?</div>
                  {[
                    { platform:"Tradeport", fee:"1.5%",   color:"#00C805", bold:true },
                    { platform:"StockX",    fee:"9–10%",  color:"#6B7385" },
                    { platform:"eBay",      fee:"12.9%",  color:"#6B7385" },
                    { platform:"PayPal",    fee:"3.49%+", color:"#6B7385" },
                  ].map((r, i) => (
                    <div key={r.platform} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 16px", background:r.bold?"rgba(0,200,5,0.03)":"#fff", borderBottom:i<3?"1px solid #F4F6FA":"none" }}>
                      <span style={{ fontSize:13, fontWeight:r.bold?700:400, color:r.bold?"#0D1117":"#8892A4" }}>{r.platform}{r.bold?" ✓":""}</span>
                      <span style={{ fontSize:13, fontWeight:800, color:r.color }}>{r.fee}</span>
                    </div>
                  ))}
                </div>

                {/* Form */}
                {[
                  { key:"name",      placeholder:"Item name",         type:"text" },
                  { key:"condition", placeholder:"Condition (New, Like New, Used…)", type:"text" },
                  { key:"price",     placeholder:"Your asking price ($)",    type:"number" },
                  { key:"desc",      placeholder:"Description (optional)",   type:"text" },
                ].map(f => (
                  <input
                    key={f.key}
                    type={f.type}
                    placeholder={f.placeholder}
                    value={sellForm[f.key]}
                    onChange={e => setSellForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    style={{ width:"100%", padding:"13px 16px", background:"#fff", border:"1.5px solid #E4E8F0", borderRadius:12, fontSize:14, color:"#0D1117", outline:"none", marginBottom:10, boxSizing:"border-box", fontFamily:"'DM Sans',sans-serif" }}
                    onFocus={e => e.target.style.borderColor = "#0057FF"}
                    onBlur={e  => e.target.style.borderColor = "#E4E8F0"}
                  />
                ))}

                <button
                  onClick={() => setSellStep("listed")}
                  disabled={!sellForm.name || !sellForm.price}
                  style={{ width:"100%", background:sellForm.name&&sellForm.price?"#0D1117":"#E4E8F4", border:"none", borderRadius:14, padding:"16px 0", color:sellForm.name&&sellForm.price?"#fff":"#A0A8B8", fontSize:15, fontWeight:800, cursor:sellForm.name&&sellForm.price?"pointer":"not-allowed" }}
                >
                  List for Sale →
                </button>
                <div style={{ fontSize:11, color:"#A0A8B8", textAlign:"center", marginTop:10, lineHeight:1.6 }}>
                  You receive ${sellForm.price ? fmt(sellForm.price*(1-0.015)) : "—"} after the 1.5% fee. Paid instantly on delivery confirmation.
                </div>
              </div>
            ) : (
              <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 32px", animation:"mp_fadeUp 0.4s ease both" }}>
                <div style={{ width:72, height:72, borderRadius:"50%", background:"rgba(0,200,5,0.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, marginBottom:20, animation:"mp_popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}>🎉</div>
                <div style={{ fontSize:22, fontWeight:900, color:"#0D1117", letterSpacing:"-0.02em", marginBottom:6 }}>Item Listed!</div>
                <div style={{ fontSize:14, color:"#6B7385", textAlign:"center", lineHeight:1.6, marginBottom:8 }}>{sellForm.name}</div>
                <div style={{ fontSize:18, fontWeight:800, color:"#0D1117", marginBottom:28 }}>${sellForm.price ? fmt(parseFloat(sellForm.price)) : "—"}</div>
                <div style={{ fontSize:11, color:"#A0A8B8", textAlign:"center", lineHeight:1.7, marginBottom:28 }}>
                  You'll be notified when someone buys. Payout is instant once they confirm delivery.
                </div>
                <button onClick={() => { setScreen("orders"); setSellStep("form"); setSellForm({ name:"", condition:"", price:"", desc:"" }); }} style={{ width:"100%", background:"#0D1117", border:"none", borderRadius:14, padding:"14px 0", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", marginBottom:10 }}>
                  View My Listings
                </button>
                <button onClick={() => { setScreen("browse"); setSellStep("form"); setSellForm({ name:"", condition:"", price:"", desc:"" }); }} style={{ width:"100%", background:"transparent", border:"1.5px solid #E4E8F0", borderRadius:14, padding:"14px 0", color:"#6B7385", fontSize:14, fontWeight:600, cursor:"pointer" }}>
                  Back to Browse
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── ORDERS / DASHBOARD ── */}
        {screen === "orders" && (
          <div style={{ flex:1, display:"flex", flexDirection:"column", animation:"mp_slideIn 0.25s cubic-bezier(0.22,1,0.36,1) both" }}>
            <div style={{ display:"flex", alignItems:"center", padding:"10px 16px", background:"#fff", borderBottom:"1px solid #F0F2F8" }}>
              <button onClick={() => setScreen("browse")} style={{ background:"none", border:"none", cursor:"pointer", padding:"4px 8px 4px 0", fontSize:14, color:"#0057FF", fontWeight:600 }}>← Back</button>
              <div style={{ flex:1, textAlign:"center", fontSize:14, fontWeight:700, color:"#0D1117", marginRight:40 }}>Activity</div>
            </div>

            {/* Toggle */}
            <div style={{ display:"flex", margin:"12px 16px 0", background:"#F4F6FA", borderRadius:12, padding:3 }}>
              {["selling","buying"].map(t => (
                <button key={t} onClick={() => setOrderTab(t)} style={{ flex:1, background:orderTab===t?"#fff":"transparent", border:"none", borderRadius:10, padding:"8px 0", fontSize:12, fontWeight:700, color:orderTab===t?"#0D1117":"#8892A4", cursor:"pointer", boxShadow:orderTab===t?"0 1px 4px rgba(0,0,0,0.08)":"none", transition:"all 0.15s", textTransform:"capitalize" }}>{t}</button>
              ))}
            </div>

            <div style={{ flex:1, overflowY:"auto", padding:"14px 16px 32px" }}>
              {(orderTab === "selling" ? MY_LISTINGS : MY_PURCHASES).map((o, i) => (
                <div key={o.id} style={{ background:"#fff", border:"1px solid #EAECF0", borderRadius:14, padding:"14px 16px", marginBottom:10, animation:`mp_fadeUp 0.3s ease ${i*0.06}s both` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                    <div style={{ flex:1, marginRight:10 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:"#0D1117", lineHeight:1.3, marginBottom:4 }}>{o.name}</div>
                      <div style={{ fontSize:11, color:"#8892A4" }}>{o.date}{orderTab==="selling" ? ` · ${o.views} views` : ""}</div>
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0 }}>
                      <div style={{ fontSize:15, fontWeight:900, color:"#0D1117" }}>${fmt(o.price)}</div>
                      <div style={{ fontSize:10, fontWeight:700, color:STATUS_COLOR[o.status], marginTop:3 }}>{STATUS_LABEL[o.status]}</div>
                    </div>
                  </div>
                  {o.status === "in_transit" && (
                    <button style={{ width:"100%", background:"rgba(0,200,5,0.08)", border:"1px solid rgba(0,200,5,0.25)", borderRadius:10, padding:"9px 0", color:"#00A804", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                      {orderTab === "selling" ? "Awaiting delivery confirmation" : "✓ Confirm Delivery"}
                    </button>
                  )}
                  {o.status === "sold" && (
                    <div style={{ fontSize:11, color:"#00B07D", fontWeight:600 }}>✓ Payout sent instantly</div>
                  )}
                  {o.status === "active" && (
                    <button style={{ background:"transparent", border:"1px solid #E4E8F0", borderRadius:8, padding:"6px 12px", fontSize:11, color:"#6B7385", cursor:"pointer", fontWeight:600 }}>Edit listing</button>
                  )}
                </div>
              ))}

              {/* Crypto disclosure */}
              <div style={{ margin:"8px 0 0", background:"#F4F6FA", borderRadius:12, padding:"12px 14px", display:"flex", gap:8, alignItems:"flex-start" }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:"#00B07D", marginTop:4, flexShrink:0 }}/>
                <div style={{ fontSize:10, color:"#A0A8B8", lineHeight:1.65 }}>
                  All payments settle via USDC on Arbitrum One. Funds are displayed in USD. No gas fees are charged to buyers or sellers.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom nav */}
        {(screen === "browse" || screen === "orders") && (
          <div style={{ display:"flex", background:"#fff", borderTop:"1px solid #F0F2F8", padding:"10px 0 20px" }}>
            {[
              { id:"browse", label:"Browse",   icon:"🏠" },
              { id:"sell",   label:"Sell",     icon:"+" },
              { id:"orders", label:"Activity", icon:"📦" },
            ].map(n => (
              <button key={n.id} onClick={() => setScreen(n.id)} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3, background:"none", border:"none", cursor:"pointer", padding:"4px 0" }}>
                <span style={{ fontSize:n.id==="sell"?20:18, lineHeight:1, ...(n.id==="sell"?{ width:32, height:32, background:"#0D1117", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:18 }:{}) }}>{n.icon}</span>
                <span style={{ fontSize:10, fontWeight:700, color:screen===n.id?"#0D1117":"#A0A8B8" }}>{n.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
