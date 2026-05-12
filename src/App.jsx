import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Home, Users, FileText, Map, Brain, Settings, Plus, ChevronRight, TrendingUp, Mail, Phone, Globe, Eye, Target, BarChart3, Layers, ExternalLink, Copy, Check, DollarSign, Award, MapPin, Send, Sparkles, Menu, X } from "lucide-react";

const C = {
  teal: "#5eead4", tealDark: "#2dd4bf",
  blue: "#818cf8", blueDark: "#6366f1",
  purple: "#a78bfa", purpleDark: "#8b5cf6",
  green: "#10b981", amber: "#f59e0b", red: "#ef4444",
  bg: "#0a0a14", bgCard: "#12121e", bgHover: "#1a1a2e",
  border: "#1e1e32", borderLight: "#2a2a44",
  text: "#f0f0f8", textMuted: "#8888a8", textDim: "#55557a",
};

const TriskopeLogo = ({ size = 36 }) => {
  const r = size * 0.22;
  const cx = size / 2, cy = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy - r * 0.7} r={r} fill="none" stroke={C.teal} strokeWidth={1.5} opacity={0.9} />
      <circle cx={cx - r * 0.65} cy={cy + r * 0.45} r={r} fill="none" stroke={C.blue} strokeWidth={1.5} opacity={0.9} />
      <circle cx={cx + r * 0.65} cy={cy + r * 0.45} r={r} fill="none" stroke={C.purple} strokeWidth={1.5} opacity={0.9} />
    </svg>
  );
};

const AGENTS = [
  { id: 1, name: "Sarah Mitchell", plan: "Pro", leads: 47, closings: 12, revenue: 284000, website: "sarahmitchell.triskope.io", reports: 8, communities: 5 },
  { id: 2, name: "James Parker", plan: "Enterprise", leads: 63, closings: 18, revenue: 412000, website: "jamesparker.triskope.io", reports: 12, communities: 8 },
  { id: 3, name: "Lisa Chen", plan: "Starter", leads: 22, closings: 5, revenue: 98000, website: "lisachen.triskope.io", reports: 3, communities: 2 },
  { id: 4, name: "Marcus Johnson", plan: "Pro", leads: 38, closings: 9, revenue: 195000, website: "marcusjohnson.triskope.io", reports: 6, communities: 4 },
  { id: 5, name: "Amy Rodriguez", plan: "Pro", leads: 15, closings: 2, revenue: 45000, website: "amyrodriguez.triskope.io", reports: 4, communities: 3 },
];

const LEADS = [
  { id: 1, name: "Robert Williams", source: "Market Report - Myrtle Beach", status: "hot", score: 94, agent: "Sarah Mitchell", interest: "Buying", budget: "$350K-$450K", area: "Myrtle Beach", aiNotes: "High intent buyer. Viewed market report 4x this week. Clicked on 3 oceanfront condos." },
  { id: 2, name: "Jennifer Adams", source: "Community Page - Barefoot Resort", status: "hot", score: 88, agent: "James Parker", interest: "Buying", budget: "$500K-$700K", area: "North Myrtle Beach", aiNotes: "Relocating from NY. Budget flexible. Interested in golf communities." },
  { id: 3, name: "David Thompson", source: "Agent Website", status: "nurture", score: 62, agent: "Lisa Chen", interest: "Selling", budget: "N/A", area: "Surfside Beach", aiNotes: "Considering selling in 3-6 months. Home value ~$320K." },
  { id: 4, name: "Maria Garcia", source: "Market Report - Conway", status: "nurture", score: 55, agent: "Marcus Johnson", interest: "Buying", budget: "$200K-$300K", area: "Conway", aiNotes: "First-time buyer. Needs pre-approval." },
  { id: 5, name: "Karen Lee", source: "Market Report - Pawleys Island", status: "hot", score: 91, agent: "Sarah Mitchell", interest: "Buying", budget: "$400K-$550K", area: "Pawleys Island", aiNotes: "Ready to make offer. Pre-approved. Wants waterfront." },
  { id: 6, name: "Steve Chen", source: "Agent Website", status: "new", score: 45, agent: null, interest: "Buying", budget: "$250K-$350K", area: "Murrells Inlet", aiNotes: "AI qualifying in progress." },
  { id: 7, name: "Patricia Moore", source: "Community Page - Carolina Forest", status: "new", score: 52, agent: null, interest: "Buying", budget: "$300K-$400K", area: "Carolina Forest", aiNotes: "Active browsing. Family relocation. School district important." },
  { id: 8, name: "Tom Baker", source: "Community Page - Grande Dunes", status: "cold", score: 28, agent: "Amy Rodriguez", interest: "Investing", budget: "$600K+", area: "Myrtle Beach", aiNotes: "Investment buyer. Low engagement." },
];

const REPORTS = [
  { id: 1, title: "Myrtle Beach", slug: "myrtle-beach", agent: "Sarah Mitchell", views: 1247, leads: 18, avgPrice: "$345,000", priceChange: "+5.2%", inv: 342, dom: 45, status: "published" },
  { id: 2, title: "North Myrtle Beach", slug: "north-myrtle-beach", agent: "James Parker", views: 892, leads: 12, avgPrice: "$425,000", priceChange: "+3.8%", inv: 218, dom: 52, status: "published" },
  { id: 3, title: "Conway", slug: "conway", agent: "Marcus Johnson", views: 456, leads: 6, avgPrice: "$265,000", priceChange: "+7.1%", inv: 156, dom: 38, status: "published" },
  { id: 4, title: "Pawleys Island", slug: "pawleys-island", agent: "Sarah Mitchell", views: 634, leads: 9, avgPrice: "$485,000", priceChange: "+2.4%", inv: 98, dom: 61, status: "published" },
  { id: 5, title: "Surfside Beach", slug: "surfside-beach", agent: "Lisa Chen", views: 321, leads: 4, avgPrice: "$310,000", priceChange: "+4.6%", inv: 87, dom: 42, status: "draft" },
  { id: 6, title: "Murrells Inlet", slug: "murrells-inlet", agent: "James Parker", views: 567, leads: 7, avgPrice: "$375,000", priceChange: "+3.1%", inv: 124, dom: 48, status: "published" },
];

const COMMUNITIES = [
  { id: 1, name: "Barefoot Resort & Golf", slug: "barefoot-resort", type: "Golf", area: "North Myrtle Beach", listings: 24, avgPrice: "$485,000", views: 2134, leads: 22, agent: "James Parker", icon: "🏌️" },
  { id: 2, name: "Grande Dunes", slug: "grande-dunes", type: "Luxury", area: "Myrtle Beach", listings: 18, avgPrice: "$725,000", views: 1876, leads: 15, agent: "Sarah Mitchell", icon: "🏖️" },
  { id: 3, name: "Carolina Forest", slug: "carolina-forest", type: "Family", area: "Myrtle Beach", listings: 45, avgPrice: "$340,000", views: 3210, leads: 34, agent: "Marcus Johnson", icon: "🌲" },
  { id: 4, name: "The Market Common", slug: "market-common", type: "Urban", area: "Myrtle Beach", listings: 12, avgPrice: "$395,000", views: 1456, leads: 11, agent: "Lisa Chen", icon: "🏙️" },
  { id: 5, name: "Litchfield Beach", slug: "litchfield-beach", type: "Beach", area: "Pawleys Island", listings: 15, avgPrice: "$520,000", views: 987, leads: 8, agent: "Sarah Mitchell", icon: "🏝️" },
  { id: 6, name: "Prince Creek", slug: "prince-creek", type: "Family", area: "Murrells Inlet", listings: 28, avgPrice: "$310,000", views: 1654, leads: 14, agent: "Amy Rodriguez", icon: "🏡" },
];

const WEEKLY = [
  { day: "Mon", leads: 12 }, { day: "Tue", leads: 18 }, { day: "Wed", leads: 15 },
  { day: "Thu", leads: 22 }, { day: "Fri", leads: 28 }, { day: "Sat", leads: 35 }, { day: "Sun", leads: 20 },
];
const REVENUE = [
  { month: "Oct", revenue: 12400 }, { month: "Nov", revenue: 15800 }, { month: "Dec", revenue: 14200 },
  { month: "Jan", revenue: 18600 }, { month: "Feb", revenue: 22400 }, { month: "Mar", revenue: 26800 },
];

const PLANS = [
  { name: "Starter", price: 49, agents: 12, features: ["CRM + Lead Management", "3 Market Reports", "2 Community Pages", "Basic AI Scoring"] },
  { name: "Pro", price: 99, agents: 28, features: ["Everything in Starter", "Unlimited Market Reports", "10 Community Pages", "AI Content Generation", "Drip Campaigns"] },
  { name: "Enterprise", price: 199, agents: 8, features: ["Everything in Pro", "Unlimited Everything", "Predictive Analytics", "Custom Branding", "API Access"] },
];

const AI_OUTPUTS = {
  "market-report": "📊 Myrtle Beach Market Report — April 2026\n\nThe Myrtle Beach housing market continues its upward trajectory with median home prices reaching $345,000, a 5.2% increase year-over-year. Active inventory sits at 342 listings, down 12% from last quarter.\n\nKey Highlights:\n• Days on market averaged 45, down from 52\n• Oceanfront condos saw highest appreciation at 7.8%\n• New construction permits up 15% in Carolina Forest\n• Investment properties showing 6.2% rental yield\n\nForecast: Expect continued appreciation of 3-5% through Q3 2026.",
  "listing-desc": "🏠 Welcome to Coastal Paradise\n\nNestled in Barefoot Resort, this stunning 4BR/3BA offers luxury and Low Country charm. Soaring ceilings, open-concept living, gourmet kitchen with granite counters.\n\nPrimary suite features spa-like bath with dual vanities. Screened porch overlooks the Intracoastal Waterway. Community amenities include 4 championship golf courses, oceanfront cabana, resort-style pools.",
  "email-campaign": "📧 Subject: Your Monthly Market Update\n\nHi [First Name],\n\nSpring is heating up! Here's what you need to know:\n\n🏠 Market Snapshot:\n• Median price: $345,000 (+5.2% YoY)\n• Homes selling in 45 days average\n• New listings up 8% this month\n\n🔥 Hot Communities:\n• Carolina Forest — 45 listings from $280K\n• Barefoot Resort — Golf homes from $425K\n• Grande Dunes — Luxury from $650K\n\nReady to explore? Let's schedule a chat.",
  "lead-score": "🎯 AI Lead Analysis — Steve Chen\n\nOverall Score: 72/100 (Warm Lead)\n\nBehavioral Signals:\n• Submitted interest form → +15\n• Viewed 8 listings in Murrells Inlet → +12\n• 4.2 min avg on community pages → +8\n• Returned 3x this week → +10\n• No phone engagement → -5\n\nPredicted Intent: 68% likely to purchase within 90 days\nRecommended: Send market report, follow up within 24h, add to drip campaign",
};

const Badge = ({ children, color = C.teal }) => <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 10px", borderRadius: 9999, fontSize: 12, fontWeight: 600, background: color + "18", color }}>{children}</span>;

const Avatar = ({ name, size = 36, color = C.teal }) => <div style={{ width: size, height: size, borderRadius: "50%", background: `linear-gradient(135deg, ${color}, ${color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.38, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{name.split(" ").map(n => n[0]).join("")}</div>;

const StatCard = ({ icon: Icon, label, value, change, color = C.teal, subtitle, isMobile }) => (
  <div style={{ background: C.bgCard, borderRadius: 12, padding: isMobile ? 16 : 20, border: `1px solid ${C.border}`, flex: isMobile ? "1 1 100%" : 1, minWidth: isMobile ? "auto" : 200 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: color + "15", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={20} color={color} /></div>
      {change && <span style={{ fontSize: 13, fontWeight: 600, color: C.green, display: "flex", alignItems: "center", gap: 2 }}><TrendingUp size={14} /> {change}</span>}
    </div>
    <div style={{ fontSize: isMobile ? 24 : 28, fontWeight: 700, color: C.text }}>{value}</div>
    <div style={{ fontSize: 13, color: C.textMuted }}>{label}</div>
    {subtitle && <div style={{ fontSize: 11, color: C.textDim, marginTop: 4 }}>{subtitle}</div>}
  </div>
);

const Score = ({ score }) => {
  const color = score >= 80 ? C.teal : score >= 50 ? C.amber : C.red;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ width: 48, height: 6, borderRadius: 3, background: C.border }}><div style={{ width: `${score}%`, height: "100%", borderRadius: 3, background: color }} /></div>
      <span style={{ fontSize: 12, fontWeight: 600, color }}>{score}</span>
    </div>
  );
};

const StatusDot = ({ status }) => {
  const colors = { hot: C.red, nurture: C.amber, cold: C.textDim, new: C.blue, published: C.teal, draft: C.textDim };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: colors[status] || C.textDim }} />
      <span style={{ fontSize: 12, fontWeight: 500, color: C.textMuted, textTransform: "capitalize" }}>{status}</span>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState("dashboard");
  const [selectedLead, setSelectedLead] = useState(null);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiOut, setAiOut] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nav = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "leads", label: "Leads", icon: Users },
    { id: "reports", label: "Market Reports", icon: FileText },
    { id: "communities", label: "Communities", icon: Map },
    { id: "agents", label: "Agents", icon: Award },
    { id: "ai", label: "AI Tools", icon: Brain },
    { id: "billing", label: "Plans", icon: Settings },
  ];

  const runAI = (type) => {
    setAiOpen(true); setAiBusy(true); setAiOut("");
    setTimeout(() => { setAiOut(AI_OUTPUTS[type] || AI_OUTPUTS["market-report"]); setAiBusy(false); }, 1200);
  };

  const Card = ({ children, style = {} }) => <div style={{ background: C.bgCard, borderRadius: 12, padding: isMobile ? 16 : 20, border: `1px solid ${C.border}`, ...style }}>{children}</div>;

  const Dashboard = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", marginBottom: 24, flexDirection: isMobile ? "column" : "row", gap: isMobile ? 12 : 0 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: C.text, margin: 0 }}>Platform Dashboard</h1>
          <p style={{ fontSize: 14, color: C.textMuted, margin: "4px 0 0" }}>triskope — see everything together</p>
        </div>
        {!isMobile && (
          <button onClick={() => { setAiOpen(true); runAI("market-report"); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${C.teal}, ${C.blue})`, color: "#0a0a14", fontSize: 13, fontWeight: 600, cursor: "pointer" }}><Sparkles size={16} /> AI Insights</button>
        )}
      </div>
      <div style={{ display: "flex", gap: isMobile ? 12 : 16, marginBottom: 24, flexWrap: "wrap", flexDirection: isMobile ? "column" : "row" }}>
        <StatCard icon={Users} label="Total Agents" value="48" change="+12%" color={C.teal} subtitle="Active subscribers" isMobile={isMobile} />
        <StatCard icon={Target} label="Total Leads" value="1,247" change="+18%" color={C.blue} subtitle="Across all agents" isMobile={isMobile} />
        <StatCard icon={FileText} label="Market Reports" value="33" change="+6" color={C.purple} subtitle="Auto-generated pages" isMobile={isMobile} />
        <StatCard icon={DollarSign} label="MRR" value="$26.8K" change="+19%" color={C.teal} subtitle="Monthly recurring revenue" isMobile={isMobile} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: C.text, margin: "0 0 16px" }}>Weekly Lead Flow</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={WEEKLY}>
              <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.teal} stopOpacity={0.3} /><stop offset="95%" stopColor={C.teal} stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="day" stroke={C.textDim} fontSize={12} />
              <YAxis stroke={C.textDim} fontSize={12} />
              <Tooltip contentStyle={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text }} />
              <Area type="monotone" dataKey="leads" stroke={C.teal} fill="url(#g)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: C.text, margin: "0 0 16px" }}>Revenue Growth</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={REVENUE}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="month" stroke={C.textDim} fontSize={12} />
              <YAxis stroke={C.textDim} fontSize={12} tickFormatter={v => `$${v / 1000}K`} />
              <Tooltip contentStyle={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text }} formatter={v => [`$${v.toLocaleString()}`, "Revenue"]} />
              <Bar dataKey="revenue" fill={C.blue} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: C.text, margin: "0 0 16px" }}>Recent Hot Leads</h3>
        {LEADS.filter(l => l.status === "hot").map(lead => (
          <div key={lead.id} onClick={() => { setSelectedLead(lead); setView("leads"); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: `1px solid ${C.border}`, cursor: "pointer" }}>
            <Avatar name={lead.name} size={36} color={C.red} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead.name}</div>
              <div style={{ fontSize: 12, color: C.textDim, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead.source} • {lead.agent}</div>
            </div>
            <Score score={lead.score} />
          </div>
        ))}
      </Card>
    </div>
  );

  const LeadsView = () => (
    <div>
      <h1 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: C.text, margin: 0 }}>Lead Management</h1>
      <p style={{ fontSize: 14, color: C.textMuted, margin: "4px 0 24px" }}>AI-powered lead scoring and qualification</p>
      {selectedLead ? (
        <Card>
          <button onClick={() => setSelectedLead(null)} style={{ background: "none", border: "none", color: C.teal, fontSize: 14, cursor: "pointer", marginBottom: 16, padding: "4px 0", minHeight: 44, display: "flex", alignItems: "center" }}>← Back to all leads</button>
          <div style={{ display: "flex", alignItems: isMobile ? "flex-start" : "center", gap: 16, marginBottom: 24, flexDirection: isMobile ? "column" : "row" }}>
            <Avatar name={selectedLead.name} size={56} color={selectedLead.status === "hot" ? C.red : C.blue} />
            <div>
              <h2 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: C.text, margin: 0 }}>{selectedLead.name}</h2>
              <div style={{ display: "flex", gap: 12, marginTop: 6 }}><StatusDot status={selectedLead.status} /><Score score={selectedLead.score} /></div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12, marginBottom: 16 }}>
            {[["Interest", selectedLead.interest], ["Budget", selectedLead.budget], ["Area", selectedLead.area], ["Source", selectedLead.source]].map(([k, v]) => (
              <div key={k} style={{ padding: 12, background: C.bg, borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: C.textDim }}>{k}</div>
                <div style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ background: `linear-gradient(135deg, ${C.teal}10, ${C.blue}10)`, borderRadius: 10, padding: 16, border: `1px solid ${C.teal}25` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}><Brain size={16} color={C.teal} /><span style={{ fontSize: 14, fontWeight: 600, color: C.teal }}>AI Analysis</span></div>
            <p style={{ fontSize: 13, color: C.textMuted, margin: 0, lineHeight: 1.6 }}>{selectedLead.aiNotes}</p>
          </div>
          <button onClick={() => runAI("lead-score")} style={{ marginTop: 16, padding: "12px 16px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${C.teal}, ${C.blue})`, color: "#0a0a14", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, minHeight: 44 }}><Brain size={14} /> Run AI Score Analysis</button>
        </Card>
      ) : isMobile ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {LEADS.map(lead => (
            <Card key={lead.id} style={{ cursor: "pointer" }}>
              <div onClick={() => setSelectedLead(lead)}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <Avatar name={lead.name} size={40} color={C.blue} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{lead.name}</div>
                    <div style={{ fontSize: 12, color: C.textDim }}>{lead.area}</div>
                  </div>
                  <StatusDot status={lead.status} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Score score={lead.score} />
                  <span style={{ fontSize: 12, color: C.textMuted }}>{lead.budget}</span>
                </div>
                <div style={{ fontSize: 11, color: C.textDim, marginTop: 6 }}>{lead.source} • {lead.agent || "Unassigned"}</div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card style={{ padding: 0 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: C.bg }}>
                {["Lead", "Status", "Score", "Source", "Budget", "Agent"].map(h => <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, color: C.textDim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: `1px solid ${C.border}` }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {LEADS.map(lead => (
                <tr key={lead.id} onClick={() => setSelectedLead(lead)} style={{ cursor: "pointer", borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "12px 16px" }}><div style={{ display: "flex", alignItems: "center", gap: 10 }}><Avatar name={lead.name} size={32} color={C.blue} /><div><div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{lead.name}</div><div style={{ fontSize: 11, color: C.textDim }}>{lead.area}</div></div></div></td>
                  <td style={{ padding: "12px 16px" }}><StatusDot status={lead.status} /></td>
                  <td style={{ padding: "12px 16px" }}><Score score={lead.score} /></td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: C.textMuted }}>{lead.source}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: C.textMuted }}>{lead.budget}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: C.textMuted }}>{lead.agent || "Unassigned"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );

  const ReportsView = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", marginBottom: 24, flexDirection: isMobile ? "column" : "row", gap: isMobile ? 12 : 0 }}>
        <div><h1 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: C.text, margin: 0 }}>Market Reports</h1><p style={{ fontSize: 14, color: C.textMuted, margin: "4px 0 0" }}>Auto-generated SEO pages with live MLS data</p></div>
        <button onClick={() => runAI("market-report")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${C.teal}, ${C.blue})`, color: "#0a0a14", fontSize: 13, fontWeight: 600, cursor: "pointer", minHeight: 44 }}><Plus size={14} /> Generate Report</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
        {REPORTS.map(r => (
          <Card key={r.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}><div><h3 style={{ fontSize: 16, fontWeight: 600, color: C.text, margin: 0 }}>{r.title}</h3><div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>{r.agent}</div></div><StatusDot status={r.status} /></div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", background: C.bg, borderRadius: 6, marginBottom: 12, fontSize: 11, color: C.teal, fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis" }}><Globe size={12} /> /market/{r.slug}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
              <div><div style={{ fontSize: 11, color: C.textDim }}>Avg Price</div><div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{r.avgPrice} <span style={{ fontSize: 11, color: C.teal }}>{r.priceChange}</span></div></div>
              <div><div style={{ fontSize: 11, color: C.textDim }}>Inventory</div><div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{r.inv}</div></div>
              <div><div style={{ fontSize: 11, color: C.textDim }}>Days on Market</div><div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{r.dom}</div></div>
              <div><div style={{ fontSize: 11, color: C.textDim }}>Leads Generated</div><div style={{ fontSize: 14, fontWeight: 600, color: C.teal }}>{r.leads}</div></div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: `1px solid ${C.border}`, flexWrap: "wrap", gap: 8 }}><span style={{ fontSize: 12, color: C.textMuted, display: "flex", alignItems: "center", gap: 4 }}><Eye size={12} /> {r.views.toLocaleString()} views</span><Badge color={C.purple}>MLS auto-sync</Badge></div>
          </Card>
        ))}
      </div>
    </div>
  );

  const CommunitiesView = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", marginBottom: 24, flexDirection: isMobile ? "column" : "row", gap: isMobile ? 12 : 0 }}>
        <div><h1 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: C.text, margin: 0 }}>Community Pages</h1><p style={{ fontSize: 14, color: C.textMuted, margin: "4px 0 0" }}>Live MLS-powered community listing pages</p></div>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${C.teal}, ${C.blue})`, color: "#0a0a14", fontSize: 13, fontWeight: 600, cursor: "pointer", minHeight: 44 }}><Plus size={14} /> New Community</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
        {COMMUNITIES.map(c => (
          <Card key={c.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ fontSize: 32 }}>{c.icon}</div><div><h3 style={{ fontSize: 15, fontWeight: 600, color: C.text, margin: 0 }}>{c.name}</h3><div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>{c.type} • {c.area}</div></div></div>
              <Badge color={C.teal}>{c.listings} active</Badge>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", background: C.bg, borderRadius: 6, marginBottom: 12, fontSize: 11, color: C.teal, fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis" }}><Globe size={12} /> /community/{c.slug}</div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.textMuted, flexWrap: "wrap", gap: 4 }}><span>Avg: <strong style={{ color: C.text }}>{c.avgPrice}</strong></span><span>{c.views.toLocaleString()} views</span><span style={{ color: C.teal }}>{c.leads} leads</span></div>
          </Card>
        ))}
      </div>
    </div>
  );

  const AgentsView = () => (
    <div>
      <h1 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: C.text, margin: 0 }}>Subscribing Agents</h1>
      <p style={{ fontSize: 14, color: C.textMuted, margin: "4px 0 24px" }}>Each agent gets a branded subdomain powered by triskope</p>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
        {AGENTS.map(a => (
          <Card key={a.id}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <Avatar name={a.name} size={48} color={a.plan === "Enterprise" ? C.purple : a.plan === "Pro" ? C.blue : C.teal} />
              <div style={{ flex: 1 }}><h3 style={{ fontSize: 16, fontWeight: 600, color: C.text, margin: 0 }}>{a.name}</h3><Badge color={a.plan === "Enterprise" ? C.purple : a.plan === "Pro" ? C.blue : C.teal}>{a.plan}</Badge></div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", background: C.bg, borderRadius: 6, marginBottom: 12, fontSize: 11, color: C.teal, fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis" }}><Globe size={12} /> {a.website}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, fontSize: 12 }}>
              <div><div style={{ color: C.textDim, fontSize: 10 }}>Leads</div><div style={{ color: C.text, fontWeight: 600 }}>{a.leads}</div></div>
              <div><div style={{ color: C.textDim, fontSize: 10 }}>Closings</div><div style={{ color: C.text, fontWeight: 600 }}>{a.closings}</div></div>
              <div><div style={{ color: C.textDim, fontSize: 10 }}>Reports</div><div style={{ color: C.text, fontWeight: 600 }}>{a.reports}</div></div>
              <div><div style={{ color: C.textDim, fontSize: 10 }}>Revenue</div><div style={{ color: C.teal, fontWeight: 600 }}>${(a.revenue / 1000).toFixed(0)}K</div></div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const AIView = () => (
    <div>
      <h1 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: C.text, margin: 0 }}>AI Tools</h1>
      <p style={{ fontSize: 14, color: C.textMuted, margin: "4px 0 24px" }}>Generate reports, descriptions, emails, and lead analysis</p>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {[
          { id: "market-report", icon: BarChart3, title: "Market Report Generator", desc: "AI writes neighborhood analysis from live MLS data", color: C.teal },
          { id: "listing-desc", icon: FileText, title: "Listing Description Writer", desc: "Compelling property copy from photos and details", color: C.blue },
          { id: "email-campaign", icon: Mail, title: "Email Campaign Builder", desc: "Personalized drip sequences from lead profile", color: C.purple },
          { id: "lead-score", icon: Brain, title: "Lead Score Analysis", desc: "Behavioral signals + intent prediction", color: C.red },
        ].map(tool => (
          <Card key={tool.id}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: tool.color + "15", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}><tool.icon size={22} color={tool.color} /></div>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: C.text, margin: "0 0 4px" }}>{tool.title}</h3>
            <p style={{ fontSize: 12, color: C.textMuted, margin: "0 0 12px", lineHeight: 1.5 }}>{tool.desc}</p>
            <button onClick={() => runAI(tool.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", borderRadius: 6, border: "none", background: `linear-gradient(135deg, ${tool.color}, ${tool.color}cc)`, color: tool.color === C.teal || tool.color === C.blue ? "#0a0a14" : "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", minHeight: 44 }}><Sparkles size={12} /> Generate</button>
          </Card>
        ))}
      </div>
    </div>
  );

  const PlansView = () => (
    <div>
      <h1 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: C.text, margin: 0 }}>Subscription Plans</h1>
      <p style={{ fontSize: 14, color: C.textMuted, margin: "4px 0 24px" }}>Tiered pricing for real estate agents</p>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
        {PLANS.map(p => (
          <Card key={p.name} style={{ borderColor: p.name === "Pro" ? C.blue : C.border, borderWidth: p.name === "Pro" ? 2 : 1 }}>
            {p.name === "Pro" && <Badge color={C.blue}>Most Popular</Badge>}
            <h3 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: "8px 0 4px" }}>{p.name}</h3>
            <div style={{ fontSize: 32, fontWeight: 700, color: C.text }}>${p.price}<span style={{ fontSize: 14, color: C.textDim, fontWeight: 400 }}>/mo</span></div>
            <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 16 }}>{p.agents} agents on this plan</div>
            {p.features.map(f => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontSize: 13, color: C.text }}><Check size={14} color={C.teal} /> {f}</div>
            ))}
          </Card>
        ))}
      </div>
    </div>
  );

  const renderView = () => {
    switch (view) {
      case "leads": return <LeadsView />;
      case "reports": return <ReportsView />;
      case "communities": return <CommunitiesView />;
      case "agents": return <AgentsView />;
      case "ai": return <AIView />;
      case "billing": return <PlansView />;
      default: return <Dashboard />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "-apple-system, system-ui, sans-serif" }}>
      {/* Mobile Header Bar */}
      {isMobile && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, height: 56, background: C.bgCard,
          borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "0 16px", zIndex: 200
        }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
            background: "none", border: "none", color: C.text, cursor: "pointer",
            padding: 8, minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <TriskopeLogo size={28} />
            <span style={{ fontSize: 15, fontWeight: 700, color: C.text, letterSpacing: "0.08em" }}>triskope</span>
          </div>
          <button onClick={() => { setAiOpen(true); runAI("market-report"); }} style={{
            background: `linear-gradient(135deg, ${C.teal}, ${C.blue})`, border: "none",
            borderRadius: 8, padding: "6px 10px", color: "#0a0a14", fontSize: 12, fontWeight: 600,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 4, minHeight: 36
          }}>
            <Sparkles size={14} /> AI
          </button>
        </div>
      )}

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          zIndex: 250, transition: "opacity 0.2s ease"
        }} />
      )}

      {/* Sidebar */}
      <aside style={{
        width: 240,
        background: C.bgCard,
        borderRight: `1px solid ${C.border}`,
        padding: 20,
        flexShrink: 0,
        ...(isMobile ? {
          position: "fixed",
          top: 0,
          left: sidebarOpen ? 0 : -260,
          bottom: 0,
          zIndex: 300,
          transition: "left 0.25s ease",
          overflowY: "auto",
          paddingTop: 20,
        } : {})
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
          <TriskopeLogo size={36} />
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.text, letterSpacing: "0.08em" }}>triskope</div>
            <div style={{ fontSize: 9, color: C.textDim, letterSpacing: "0.15em", textTransform: "uppercase" }}>see everything together</div>
          </div>
        </div>
        {nav.map(item => {
          const Icon = item.icon;
          const active = view === item.id;
          return (
            <button key={item.id} onClick={() => { setView(item.id); setSelectedLead(null); if (isMobile) setSidebarOpen(false); }} style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%",
              padding: isMobile ? "12px 12px" : "10px 12px", marginBottom: 4, borderRadius: 8, border: "none",
              background: active ? `linear-gradient(135deg, ${C.teal}18, ${C.blue}12)` : "transparent",
              color: active ? C.teal : C.textMuted, fontSize: isMobile ? 14 : 13,
              fontWeight: 500, cursor: "pointer", textAlign: "left", minHeight: isMobile ? 48 : "auto"
            }}>
              <Icon size={isMobile ? 18 : 16} /> {item.label}
            </button>
          );
        })}
        <div style={{ marginTop: "auto", paddingTop: 24, borderTop: `1px solid ${C.border}`, marginTop: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10, color: C.textDim, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            <TriskopeLogo size={20} />
            <span>powered by <span style={{ color: C.blue, fontWeight: 600 }}>triskope</span></span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        padding: isMobile ? "72px 16px 24px" : 32,
        overflow: "auto",
        minWidth: 0,
      }}>{renderView()}</main>

      {/* AI Output Panel */}
      {aiOpen && (
        <div onClick={() => setAiOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "flex-end", zIndex: 400 }}>
          <div onClick={e => e.stopPropagation()} style={{
            width: isMobile ? "100%" : 480,
            maxWidth: "100%",
            background: C.bgCard,
            borderLeft: isMobile ? "none" : `1px solid ${C.border}`,
            padding: isMobile ? 16 : 24,
            overflow: "auto"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <Brain size={20} color={C.teal} />
              <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: 0 }}>AI Output</h2>
              <button onClick={() => setAiOpen(false)} style={{ marginLeft: "auto", background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: 20, padding: 8, minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
            </div>
            {aiBusy ? (
              <div style={{ padding: 40, textAlign: "center", color: C.textMuted }}>
                <Sparkles size={32} color={C.teal} />
                <div style={{ marginTop: 12 }}>Generating with AI…</div>
              </div>
            ) : (
              <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: 13, color: C.text, lineHeight: 1.6, background: C.bg, padding: 16, borderRadius: 8, border: `1px solid ${C.border}` }}>{aiOut}</pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
