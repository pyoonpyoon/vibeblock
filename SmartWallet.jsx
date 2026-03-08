import { useState, useEffect, useRef } from "react";

// ─── SEED DATA ────────────────────────────────────────────────────────────────
const CONTACTS = [
  { id: 1, name: "Maria Chen",     initials: "MC", color: "#0057FF", phone: "+1 (917) 555-0182" },
  { id: 2, name: "Alex Rivera",    initials: "AR", color: "#00B07D", phone: "+1 (646) 555-0341" },
  { id: 3, name: "Jordan Park",    initials: "JP", color: "#FF5C35", phone: "+1 (212) 555-0924" },
  { id: 4, name: "Sam Okafor",     initials: "SO", color: "#8B5CF6", phone: "+1 (718) 555-0617" },
  { id: 5, name: "Taylor Wu",      initials: "TW", color: "#F59E0B", phone: "+1 (332) 555-0278" },
  { id: 6, name: "Priya Sharma",   initials: "PS", color: "#EC4899", phone: "+1 (929) 555-0453" },
];

const INITIAL_TXN = [
  { id: 1, type:"received", contact: CONTACTS[0], amount: 240.00,  note: "Dinner last Friday 🍜",   time: "2 min ago",    date: "Today" },
  { id: 2, type:"sent",     contact: CONTACTS[2], amount: 85.50,   note: "Concert tickets 🎵",       time: "1 hr ago",     date: "Today" },
  { id: 3, type:"received", contact: CONTACTS[1], amount: 1200.00, note: "Rent — March",             time: "Yesterday",    date: "Yesterday" },
  { id: 4, type:"sent",     contact: CONTACTS[3], amount: 6.40,    note: "Coffee ☕",                time: "Yesterday",    date: "Yesterday" },
  { id: 5, type:"received", contact: CONTACTS[4], amount: 320.00,  note: "Design work invoice",      time: "Mon",          date: "This week" },
  { id: 6, type:"sent",     contact: CONTACTS[5], amount: 45.00,   note: "Birthday gift 🎁",         time: "Mon",          date: "This week" },
];

const INITIAL_BALANCE = 4829.14;

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt = (n) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtShort = (n) => n >= 1000 ? `$${(n/1000).toFixed(1)}k` : `$${fmt(n)}`;

function Avatar({ contact, size = 40 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: contact.color + "18",
      border: `1.5px solid ${contact.color}30`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.32, fontWeight: 700, color: contact.color,
      flexShrink: 0, fontFamily: "'Geist',sans-serif",
    }}>{contact.initials}</div>
  );
}

// ─── SEND SCREEN ──────────────────────────────────────────────────────────────
function SendScreen({ balance, onSend, onBack }) {
  const [step, setStep] = useState("contact"); // contact → amount → confirm → sent
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const amountRef = useRef(null);

  const filtered = CONTACTS.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.phone.includes(query)
  );

  const parsedAmount = parseFloat(amount.replace(/[^0-9.]/g, "")) || 0;
  const canSend = parsedAmount > 0 && parsedAmount <= balance && selected;

  const handleAmountKey = (key) => {
    if (key === "⌫") { setAmount(a => a.slice(0, -1)); return; }
    if (key === "." && amount.includes(".")) return;
    if (amount.includes(".") && amount.split(".")[1]?.length >= 2) return;
    if (amount === "0" && key !== ".") { setAmount(key); return; }
    setAmount(a => a + key);
  };

  const handleSend = async () => {
    setSending(true);
    await new Promise(r => setTimeout(r, 1600));
    setSending(false);
    setStep("sent");
    setTimeout(() => onSend(selected, parsedAmount, note || `Sent to ${selected.name}`), 2200);
  };

  if (step === "sent") return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 32px", animation: "sw_fadeUp 0.4s ease both" }}>
      <div style={{ position: "relative", marginBottom: 28 }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#E8F5F0", display: "flex", alignItems: "center", justifyContent: "center", animation: "sw_popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path d="M7 18L15 26L29 10" stroke="#00B07D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: 40, strokeDashoffset: 0, animation: "sw_drawCheck 0.4s ease 0.3s both" }} />
          </svg>
        </div>
      </div>
      <div style={{ fontSize: 32, fontWeight: 800, color: "#0A0F1E", fontFamily: "'Geist',sans-serif", letterSpacing: "-0.03em", marginBottom: 6 }}>
        ${fmt(parsedAmount)}
      </div>
      <div style={{ fontSize: 15, color: "#6B7385", marginBottom: 4 }}>sent to</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: "#0A0F1E", fontFamily: "'Geist',sans-serif", marginBottom: 32 }}>{selected.name}</div>
      <div style={{ fontSize: 12, color: "#A0A8B8", textAlign: "center", lineHeight: 1.6 }}>Delivered instantly · No fees</div>
    </div>
  );

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {step === "contact" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "16px 20px 12px" }}>
            <div style={{ background: "#F4F6FA", borderRadius: 12, display: "flex", alignItems: "center", gap: 10, padding: "10px 14px" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="#8892A4" strokeWidth="1.5"/><path d="M11 11L14 14" stroke="#8892A4" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <input
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Name or phone number"
                style={{ border: "none", background: "transparent", flex: 1, fontSize: 14, color: "#0A0F1E", fontFamily: "'Geist',sans-serif", outline: "none" }}
              />
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {filtered.map((c, i) => (
              <button key={c.id} onClick={() => { setSelected(c); setStep("amount"); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "12px 20px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", animation: `sw_fadeUp 0.3s ease ${i * 0.04}s both` }}
                onMouseEnter={e => e.currentTarget.style.background = "#F8F9FC"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <Avatar contact={c} size={44} />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#0A0F1E", fontFamily: "'Geist',sans-serif" }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: "#8892A4", marginTop: 2 }}>{c.phone}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === "amount" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Recipient */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", borderBottom: "1px solid #F0F2F8" }}>
            <Avatar contact={selected} size={40} />
            <div>
              <div style={{ fontSize: 13, color: "#8892A4" }}>Sending to</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#0A0F1E", fontFamily: "'Geist',sans-serif" }}>{selected.name}</div>
            </div>
            <button onClick={() => { setStep("contact"); setAmount(""); }} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#0057FF", fontSize: 13, fontWeight: 600 }}>Change</button>
          </div>

          {/* Amount display */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 24px 16px" }}>
            <div style={{ fontSize: amount ? 52 : 36, fontWeight: 800, color: amount ? "#0A0F1E" : "#C8CDD8", fontFamily: "'Geist',sans-serif", letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 12, transition: "font-size 0.15s" }}>
              ${amount || "0"}
            </div>
            {parsedAmount > balance && (
              <div style={{ fontSize: 12, color: "#EF4444", marginBottom: 8 }}>Exceeds your balance of ${fmt(balance)}</div>
            )}
            {parsedAmount > 0 && parsedAmount <= balance && (
              <div style={{ fontSize: 12, color: "#00B07D", marginBottom: 8 }}>Arrives instantly · No fees</div>
            )}

            {/* Note */}
            <input
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Add a note (optional)"
              style={{ background: "#F4F6FA", border: "none", borderRadius: 10, padding: "10px 16px", fontSize: 13, color: "#0A0F1E", fontFamily: "'Geist',sans-serif", outline: "none", width: "100%", maxWidth: 280, textAlign: "center", marginBottom: 20, boxSizing: "border-box" }}
            />

            {/* Numpad */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, width: "100%", maxWidth: 280 }}>
              {["1","2","3","4","5","6","7","8","9",".","0","⌫"].map(k => (
                <button key={k} onClick={() => handleAmountKey(k)} style={{ padding: "16px 0", background: k === "⌫" ? "#F0F2F8" : "#F8F9FC", border: "none", borderRadius: 12, cursor: "pointer", fontSize: k === "⌫" ? 18 : 20, fontWeight: 600, color: "#0A0F1E", fontFamily: "'Geist',sans-serif", transition: "background 0.1s" }}
                  onMouseDown={e => e.currentTarget.style.background = "#E8EBF4"}
                  onMouseUp={e => e.currentTarget.style.background = k === "⌫" ? "#F0F2F8" : "#F8F9FC"}
                >{k}</button>
              ))}
            </div>
          </div>

          <div style={{ padding: "0 20px 24px" }}>
            <button onClick={handleSend} disabled={!canSend || sending} style={{ width: "100%", background: canSend ? "#0057FF" : "#E4E8F4", border: "none", borderRadius: 14, padding: "16px 0", color: canSend ? "#fff" : "#A0A8B8", fontSize: 16, fontWeight: 700, fontFamily: "'Geist',sans-serif", cursor: canSend ? "pointer" : "not-allowed", transition: "all 0.2s", letterSpacing: "-0.01em" }}>
              {sending ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <span style={{ width: 16, height: 16, border: "2.5px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "sw_spin 0.7s linear infinite" }} />
                  Sending...
                </span>
              ) : `Send $${amount || "0"}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── REQUEST SCREEN ───────────────────────────────────────────────────────────
function RequestScreen({ onBack }) {
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [requested, setRequested] = useState(false);

  const handleAmountKey = (key) => {
    if (key === "⌫") { setAmount(a => a.slice(0, -1)); return; }
    if (key === "." && amount.includes(".")) return;
    if (amount.includes(".") && amount.split(".")[1]?.length >= 2) return;
    if (amount === "0" && key !== ".") { setAmount(key); return; }
    setAmount(a => a + key);
  };

  if (requested) return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32 }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#EEF3FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, marginBottom: 20, animation: "sw_popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both" }}>📨</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: "#0A0F1E", fontFamily: "'Geist',sans-serif", letterSpacing: "-0.02em", marginBottom: 8 }}>Request Sent</div>
      <div style={{ fontSize: 14, color: "#6B7385", textAlign: "center", lineHeight: 1.6 }}>
        {selected?.name} will get a notification to send you <strong>${amount}</strong>
      </div>
    </div>
  );

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {!selected ? (
        <div style={{ flex: 1 }}>
          <div style={{ padding: "12px 20px 8px", fontSize: 13, color: "#8892A4", fontWeight: 600 }}>REQUEST FROM</div>
          {CONTACTS.map((c, i) => (
            <button key={c.id} onClick={() => setSelected(c)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "11px 20px", background: "transparent", border: "none", cursor: "pointer", animation: `sw_fadeUp 0.3s ease ${i * 0.04}s both` }}
              onMouseEnter={e => e.currentTarget.style.background = "#F8F9FC"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <Avatar contact={c} size={42} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#0A0F1E", fontFamily: "'Geist',sans-serif", textAlign: "left" }}>{c.name}</div>
                <div style={{ fontSize: 12, color: "#8892A4" }}>{c.phone}</div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", borderBottom: "1px solid #F0F2F8" }}>
            <Avatar contact={selected} size={38} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: "#8892A4" }}>Requesting from</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#0A0F1E", fontFamily: "'Geist',sans-serif" }}>{selected.name}</div>
            </div>
            <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "#0057FF", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Change</button>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 24px 16px" }}>
            <div style={{ fontSize: amount ? 52 : 36, fontWeight: 800, color: amount ? "#0A0F1E" : "#C8CDD8", fontFamily: "'Geist',sans-serif", letterSpacing: "-0.04em", marginBottom: 16, transition: "font-size 0.15s" }}>
              ${amount || "0"}
            </div>
            <input value={note} onChange={e => setNote(e.target.value)} placeholder="What's it for?" style={{ background: "#F4F6FA", border: "none", borderRadius: 10, padding: "10px 16px", fontSize: 13, color: "#0A0F1E", fontFamily: "'Geist',sans-serif", outline: "none", width: "100%", maxWidth: 280, textAlign: "center", marginBottom: 20, boxSizing: "border-box" }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, width: "100%", maxWidth: 280 }}>
              {["1","2","3","4","5","6","7","8","9",".","0","⌫"].map(k => (
                <button key={k} onClick={() => handleAmountKey(k)} style={{ padding: "15px 0", background: k === "⌫" ? "#F0F2F8" : "#F8F9FC", border: "none", borderRadius: 12, cursor: "pointer", fontSize: k === "⌫" ? 17 : 19, fontWeight: 600, color: "#0A0F1E", fontFamily: "'Geist',sans-serif" }}>{k}</button>
              ))}
            </div>
          </div>
          <div style={{ padding: "0 20px 24px" }}>
            <button onClick={() => setRequested(true)} disabled={!parseFloat(amount)} style={{ width: "100%", background: parseFloat(amount) ? "#0A0F1E" : "#E4E8F4", border: "none", borderRadius: 14, padding: "16px 0", color: parseFloat(amount) ? "#fff" : "#A0A8B8", fontSize: 16, fontWeight: 700, fontFamily: "'Geist',sans-serif", cursor: parseFloat(amount) ? "pointer" : "not-allowed" }}>
              Request ${amount || "0"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN WALLET ──────────────────────────────────────────────────────────────
export default function SmartWallet() {
  const [screen, setScreen] = useState("home"); // home | send | request | history
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [displayBalance, setDisplayBalance] = useState(0);
  const [transactions, setTransactions] = useState(INITIAL_TXN);
  const [lastSent, setLastSent] = useState(null);
  const [showAddMoney, setShowAddMoney] = useState(false);

  // Animate balance count-up on mount
  useEffect(() => {
    const target = INITIAL_BALANCE;
    const dur = 1200;
    const start = Date.now();
    const raf = () => {
      const prog = Math.min((Date.now() - start) / dur, 1);
      const ease = 1 - Math.pow(1 - prog, 3);
      setDisplayBalance(ease * target);
      if (prog < 1) requestAnimationFrame(raf);
      else setDisplayBalance(target);
    };
    const timer = setTimeout(() => requestAnimationFrame(raf), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSendComplete = (contact, amount, note) => {
    const newBalance = balance - amount;
    setBalance(newBalance);
    setDisplayBalance(newBalance);
    setLastSent({ contact, amount });
    const newTxn = {
      id: Date.now(), type: "sent", contact, amount,
      note: note || `Sent to ${contact.name}`,
      time: "Just now", date: "Today",
    };
    setTransactions(txns => [newTxn, ...txns]);
    setScreen("home");
  };

  const groupedTxns = transactions.reduce((acc, txn) => {
    if (!acc[txn.date]) acc[txn.date] = [];
    acc[txn.date].push(txn);
    return acc;
  }, {});

  const totalIn  = transactions.filter(t => t.type === "received").reduce((a, t) => a + t.amount, 0);
  const totalOut = transactions.filter(t => t.type === "sent").reduce((a, t) => a + t.amount, 0);

  return (
    <div style={{ minHeight: "100vh", background: "#F4F6FA", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Geist',sans-serif", padding: 20 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800;900&display=swap');
        @keyframes sw_fadeUp   { from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)} }
        @keyframes sw_popIn    { from{opacity:0;transform:scale(0.5)}to{opacity:1;transform:scale(1)} }
        @keyframes sw_spin     { to{transform:rotate(360deg)} }
        @keyframes sw_slideUp  { from{opacity:0;transform:translateY(100%)}to{opacity:1;transform:translateY(0)} }
        @keyframes sw_slideIn  { from{opacity:0;transform:translateX(100%)}to{opacity:1;transform:translateX(0)} }
        @keyframes sw_drawCheck { from{stroke-dashoffset:40}to{stroke-dashoffset:0} }
        @keyframes sw_shimmer  { 0%{background-position:-200% 0}100%{background-position:200% 0} }
        * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
        button { font-family: 'Geist', sans-serif; }
        input  { font-family: 'Geist', sans-serif; }
        ::-webkit-scrollbar { width: 0 }
      `}</style>

      {/* Phone shell */}
      <div style={{
        width: 390, minHeight: 720, maxHeight: "90vh",
        background: "#fff",
        borderRadius: 44,
        boxShadow: "0 40px 100px rgba(0,0,0,0.18), 0 8px 32px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(255,255,255,0.8)",
        overflow: "hidden", display: "flex", flexDirection: "column",
        position: "relative",
      }}>

        {/* Status bar */}
        <div style={{ background: screen === "home" ? "#0A0F1E" : "#fff", padding: "14px 28px 8px", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "background 0.3s" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: screen === "home" ? "#fff" : "#0A0F1E" }}>9:41</div>
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            {[3,4,4,5].map((h,i) => <div key={i} style={{ width: 3, height: h + 6, background: screen === "home" ? "#fff" : "#0A0F1E", borderRadius: 2, opacity: i < 3 ? 1 : 0.3 }} />)}
            <svg width="16" height="12" viewBox="0 0 16 12" style={{ marginLeft: 3 }}>
              <path d="M8 2C5.5 2 3.3 3 1.7 4.6L0 3C2.1 1.1 4.9 0 8 0s5.9 1.1 8 3l-1.7 1.6C12.7 3 10.5 2 8 2z" fill={screen === "home" ? "#fff" : "#0A0F1E"} opacity="0.4"/>
              <path d="M8 5c-1.7 0-3.2.7-4.3 1.7L2 5.1C3.5 3.8 5.7 3 8 3s4.5.8 6 2.1L12.3 6.7C11.2 5.7 9.7 5 8 5z" fill={screen === "home" ? "#fff" : "#0A0F1E"} opacity="0.7"/>
              <circle cx="8" cy="10" r="2" fill={screen === "home" ? "#fff" : "#0A0F1E"}/>
            </svg>
            <div style={{ width: 22, height: 11, border: `1.5px solid ${screen === "home" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)"}`, borderRadius: 3, marginLeft: 3, display: "flex", alignItems: "center", padding: "0 2px" }}>
              <div style={{ width: "70%", height: 7, background: screen === "home" ? "#fff" : "#0A0F1E", borderRadius: 1.5, opacity: 0.9 }} />
            </div>
          </div>
        </div>

        {/* ── HOME SCREEN ── */}
        {screen === "home" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
            {/* Hero balance area */}
            <div style={{ background: "linear-gradient(175deg, #0A0F1E 0%, #0D1533 60%, #0F1A3D 100%)", padding: "8px 24px 36px", position: "relative", overflow: "hidden" }}>
              {/* Subtle grid */}
              <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
              {/* Glow orbs */}
              <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,87,255,0.15),transparent 70%)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: -40, left: -40, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,176,125,0.1),transparent 70%)", pointerEvents: "none" }} />

              {/* App name */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 28, height: 28, background: "#0057FF", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 12, height: 12, background: "#fff", borderRadius: 3 }} />
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>Flōw</span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="4" r="2" fill="rgba(255,255,255,0.8)"/><path d="M2 12c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </button>
                  <button style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 4h10M2 7h10M2 10h7" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </button>
                </div>
              </div>

              {/* Balance */}
              <div style={{ marginBottom: 6 }}>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", fontWeight: 500, marginBottom: 8 }}>YOUR BALANCE</div>
                <div style={{ fontSize: 48, fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1, animation: "sw_fadeUp 0.6s ease 0.2s both", opacity: 0 }}>
                  ${fmt(displayBalance)}
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 8, animation: "sw_fadeUp 0.6s ease 0.4s both", opacity: 0 }}>
                  Available to send anywhere, instantly
                </div>
              </div>

              {/* Mini stats */}
              <div style={{ display: "flex", gap: 10, marginTop: 20, animation: "sw_fadeUp 0.6s ease 0.5s both", opacity: 0 }}>
                {[
                  { label: "In this month",  val: fmtShort(totalIn),  color: "#00B07D", icon: "↓" },
                  { label: "Out this month", val: fmtShort(totalOut), color: "#FF5C35", icon: "↑" },
                ].map(s => (
                  <div key={s.label} style={{ flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: "10px 14px" }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: s.color }}>{s.icon} {s.val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ padding: "20px 24px 0", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
              {[
                { label: "Send",    icon: "↑", color: "#0057FF", action: () => setScreen("send") },
                { label: "Request", icon: "↓", color: "#00B07D", action: () => setScreen("request") },
                { label: "History", icon: "≡", color: "#8B5CF6", action: () => setScreen("history") },
                { label: "Add",     icon: "+", color: "#F59E0B", action: () => setShowAddMoney(m => !m) },
              ].map(a => (
                <button key={a.label} onClick={a.action} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: "transparent", border: "none", cursor: "pointer", padding: "8px 4px" }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: a.color + "12", border: `1.5px solid ${a.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: a.color, fontWeight: 700, transition: "transform 0.15s" }}
                    onMouseDown={e => e.currentTarget.style.transform = "scale(0.92)"}
                    onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                  >{a.icon}</div>
                  <span style={{ fontSize: 12, color: "#6B7385", fontWeight: 500 }}>{a.label}</span>
                </button>
              ))}
            </div>

            {/* Quick send row */}
            <div style={{ padding: "20px 24px 0" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0A0F1E", marginBottom: 12 }}>Quick Send</div>
              <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4 }}>
                {CONTACTS.slice(0, 5).map((c, i) => (
                  <button key={c.id} onClick={() => setScreen("send")} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: "transparent", border: "none", cursor: "pointer", flexShrink: 0, animation: `sw_fadeUp 0.3s ease ${0.1 + i * 0.05}s both` }}>
                    <Avatar contact={c} size={48} />
                    <span style={{ fontSize: 11, color: "#6B7385", maxWidth: 48, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name.split(" ")[0]}</span>
                  </button>
                ))}
                <button style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: "transparent", border: "none", cursor: "pointer", flexShrink: 0 }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#F4F6FA", border: "1.5px dashed #C8CDD8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#8892A4" }}>+</div>
                  <span style={{ fontSize: 11, color: "#8892A4" }}>Add</span>
                </button>
              </div>
            </div>

            {/* Recent transactions */}
            <div style={{ padding: "24px 24px 0", flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0A0F1E" }}>Recent Activity</div>
                <button onClick={() => setScreen("history")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#0057FF", fontWeight: 600 }}>See all</button>
              </div>

              {transactions.slice(0, 4).map((txn, i) => (
                <div key={txn.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < 3 ? "1px solid #F4F6FA" : "none", animation: `sw_fadeUp 0.4s ease ${i * 0.07}s both` }}>
                  <div style={{ position: "relative" }}>
                    <Avatar contact={txn.contact} size={42} />
                    <div style={{ position: "absolute", bottom: -1, right: -1, width: 16, height: 16, borderRadius: "50%", background: txn.type === "received" ? "#00B07D" : "#FF5C35", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 8, color: "#fff", fontWeight: 900 }}>{txn.type === "received" ? "↓" : "↑"}</span>
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#0A0F1E", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{txn.contact.name}</div>
                    <div style={{ fontSize: 12, color: "#8892A4", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{txn.note}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: txn.type === "received" ? "#00B07D" : "#0A0F1E" }}>
                      {txn.type === "received" ? "+" : "-"}${fmt(txn.amount)}
                    </div>
                    <div style={{ fontSize: 11, color: "#A0A8B8", marginTop: 1 }}>{txn.time}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom attribution */}
            <div style={{ padding: "20px 24px 32px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#00B07D", animation: "sw_popIn 0.3s ease both" }} />
              <span style={{ fontSize: 10, color: "#A0A8B8", letterSpacing: "0.06em" }}>INSTANT GLOBAL TRANSFERS · ZERO FEES · POWERED BY ARBITRUM</span>
            </div>
          </div>
        )}

        {/* ── SEND SCREEN ── */}
        {screen === "send" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", animation: "sw_slideIn 0.28s cubic-bezier(0.22,1,0.36,1) both" }}>
            <div style={{ display: "flex", alignItems: "center", padding: "12px 20px", borderBottom: "1px solid #F0F2F8" }}>
              <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 8px 4px 0", fontSize: 16, color: "#0057FF", fontWeight: 600 }}>← Back</button>
              <div style={{ flex: 1, textAlign: "center", fontSize: 16, fontWeight: 700, color: "#0A0F1E", marginRight: 48 }}>Send Money</div>
            </div>
            <SendScreen balance={balance} onSend={handleSendComplete} onBack={() => setScreen("home")} />
          </div>
        )}

        {/* ── REQUEST SCREEN ── */}
        {screen === "request" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", animation: "sw_slideIn 0.28s cubic-bezier(0.22,1,0.36,1) both" }}>
            <div style={{ display: "flex", alignItems: "center", padding: "12px 20px", borderBottom: "1px solid #F0F2F8" }}>
              <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 8px 4px 0", fontSize: 16, color: "#0057FF", fontWeight: 600 }}>← Back</button>
              <div style={{ flex: 1, textAlign: "center", fontSize: 16, fontWeight: 700, color: "#0A0F1E", marginRight: 48 }}>Request Money</div>
            </div>
            <RequestScreen onBack={() => setScreen("home")} />
          </div>
        )}

        {/* ── HISTORY SCREEN ── */}
        {screen === "history" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", animation: "sw_slideIn 0.28s cubic-bezier(0.22,1,0.36,1) both" }}>
            <div style={{ display: "flex", alignItems: "center", padding: "12px 20px", borderBottom: "1px solid #F0F2F8" }}>
              <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 8px 4px 0", fontSize: 16, color: "#0057FF", fontWeight: 600 }}>← Back</button>
              <div style={{ flex: 1, textAlign: "center", fontSize: 16, fontWeight: 700, color: "#0A0F1E", marginRight: 48 }}>All Transactions</div>
            </div>
            <div style={{ flex: 1, overflowY: "auto" }}>
              {Object.entries(groupedTxns).map(([date, txns]) => (
                <div key={date}>
                  <div style={{ padding: "12px 20px 6px", fontSize: 11, fontWeight: 700, color: "#A0A8B8", letterSpacing: "0.08em", textTransform: "uppercase" }}>{date}</div>
                  {txns.map((txn, i) => (
                    <div key={txn.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 20px", cursor: "pointer" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#F8F9FC"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <div style={{ position: "relative" }}>
                        <Avatar contact={txn.contact} size={44} />
                        <div style={{ position: "absolute", bottom: -1, right: -1, width: 16, height: 16, borderRadius: "50%", background: txn.type === "received" ? "#00B07D" : "#FF5C35", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: 8, color: "#fff", fontWeight: 900 }}>{txn.type === "received" ? "↓" : "↑"}</span>
                        </div>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#0A0F1E" }}>{txn.contact.name}</div>
                        <div style={{ fontSize: 12, color: "#8892A4", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{txn.note}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: txn.type === "received" ? "#00B07D" : "#0A0F1E" }}>
                          {txn.type === "received" ? "+" : "-"}${fmt(txn.amount)}
                        </div>
                        <div style={{ fontSize: 11, color: "#A0A8B8", marginTop: 1 }}>{txn.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              {/* Invisible crypto disclosure */}
              <div style={{ margin: "16px 20px 32px", background: "#F8F9FC", borderRadius: 12, padding: "12px 16px", display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00B07D", marginTop: 5, flexShrink: 0 }} />
                <div style={{ fontSize: 11, color: "#A0A8B8", lineHeight: 1.6 }}>
                  All transfers settle via USDC on Arbitrum One and LayerZero cross-chain routing. Funds are displayed in USD. No gas fees are charged to users.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
