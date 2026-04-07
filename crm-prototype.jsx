import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from "recharts";
import { Home, Users, FileText, Map, Brain, Settings, Bell, Search, Plus, ChevronRight, TrendingUp, TrendingDown, Star, Mail, Phone, Globe, Eye, MousePointer, Download, Filter, MoreVertical, ArrowRight, Zap, Target, MessageSquare, BarChart3, Layers, ExternalLink, Copy, Check, RefreshCw, Calendar, DollarSign, Activity, Award, MapPin, Building, Clock, Send, Edit3, Trash2, ChevronDown } from "lucide-react";

// ============ DATA ============
const COLORS = {
  primary: "#6366f1", primaryDark: "#4f46e5", primaryLight: "#818cf8",
  secondary: "#10b981", secondaryDark: "#059669",
  accent: "#f59e0b", accentDark: "#d97706",
  danger: "#ef4444", dangerDark: "#dc2626",
  bg: "#0f172a", bgCard: "#1e293b", bgHover: "#334155",
  border: "#334155", borderLight: "#475569",
  text: "#f8fafc", textMuted: "#94a3b8", textDim: "#64748b",
};

const AGENTS = [
  { id: 1, name: "Sarah Mitchell", email: "sarah@grandstrand.com", phone: "(843) 555-0101", photo: null, plan: "Pro", status: "active", leads: 47, closings: 12, revenue: 284000, website: "sarahmitchell.grandstrandhomeliving.com", marketReports: 8, communityPages: 5 },
  { id: 2, name: "James Parker", email: "james@grandstrand.com", phone: "(843) 555-0102", photo: null, plan: "Enterprise", status: "active", leads: 63, closings: 18, revenue: 412000, website: "jamesparker.grandstrandhomeliving.com", marketReports: 12, communityPages: 8 },
  { id: 3, name: "Lisa Chen", email: "lisa@grandstrand.com", phone: "(843) 555-0103", photo: null, plan: "Starter", status: "active", leads: 22, closings: 5, revenue: 98000, website: "lisachen.grandstrandhomeliving.com", marketReports: 3, communityPages: 2 },
  { id: 4, name: "Marcus Johnson", email: "marcus@grandstrand.com", phone: "(843) 555-0104", photo: null, plan: "Pro", status: "active", leads: 38, closings: 9, revenue: 195000, website: "marcusjohnson.grandstrandhomeliving.com", marketReports: 6, communityPages: 4 },
  { id: 5, name: "Amy Rodriguez", email: "amy@grandstrand.com", phone: "(843) 555-0105", photo: null, plan: "Pro", status: "trial", leads: 15, closings: 2, revenue: 45000, website: "amyrodriguez.grandstrandhomeliving.com", marketReports: 4, communityPages: 3 },
];

const LEADS = [
  { id: 1, name: "Robert Williams", email: "rwilliams@email.com", phone: "(843) 555-2001", source: "Market Report - Myrtle Beach", status: "hot", score: 94, agent: "Sarah Mitchell", interest: "Buying", budget: "$350K-$450K", area: "Myrtle Beach", lastActivity: "Viewed 3 listings", lastContact: "2 hours ago", aiNotes: "High intent buyer. Viewed market report 4x this week. Clicked on 3 oceanfront condos." },
  { id: 2, name: "Jennifer Adams", email: "jadams@email.com", phone: "(843) 555-2002", source: "Community Page - Barefoot Resort", status: "hot", score: 88, agent: "James Parker", interest: "Buying", budget: "$500K-$700K", area: "North Myrtle Beach", lastActivity: "Requested showing", lastContact: "1 hour ago", aiNotes: "Relocating from NY. Budget flexible. Interested in golf communities." },
  { id: 3, name: "David Thompson", email: "dthompson@email.com", phone: "(843) 555-2003", source: "Agent Website", status: "nurture", score: 62, agent: "Lisa Chen", interest: "Selling", budget: "N/A", area: "Surfside Beach", lastActivity: "Downloaded CMA", lastContact: "1 day ago", aiNotes: "Considering selling in 3-6 months. Home value ~$320K. Follow up monthly." },
  { id: 4, name: "Maria Garcia", email: "mgarcia@email.com", phone: "(843) 555-2004", source: "Market Report - Conway", status: "nurture", score: 55, agent: "Marcus Johnson", interest: "Buying", budget: "$200K-$300K", area: "Conway", lastActivity: "Opened email", lastContact: "3 days ago", aiNotes: "First-time buyer. Needs pre-approval. Interested in new construction." },
  { id: 5, name: "Tom Baker", email: "tbaker@email.com", phone: "(843) 555-2005", source: "Community Page - Grande Dunes", status: "cold", score: 28, agent: "Amy Rodriguez", interest: "Investing", budget: "$600K+", area: "Myrtle Beach", lastActivity: "Viewed community page", lastContact: "2 weeks ago", aiNotes: "Investment buyer. Looking for rental income properties. Low engagement recently." },
  { id: 6, name: "Karen Lee", email: "klee@email.com", phone: "(843) 555-2006", source: "Market Report - Pawleys Island", status: "hot", score: 91, agent: "Sarah Mitchell", interest: "Buying", budget: "$400K-$550K", area: "Pawleys Island", lastActivity: "Scheduled call", lastContact: "30 min ago", aiNotes: "Ready to make offer. Pre-approved. Wants waterfront property." },
  { id: 7, name: "Steve Chen", email: "schen@email.com", phone: "(843) 555-2007", source: "Agent Website", status: "new", score: 45, agent: null, interest: "Buying", budget: "$250K-$350K", area: "Murrells Inlet", lastActivity: "Submitted form", lastContact: "Just now", aiNotes: "New lead. AI qualifying in progress. Submitted interest form on agent site." },
  { id: 8, name: "Patricia Moore", email: "pmoore@email.com", phone: "(843) 555-2008", source: "Community Page - Carolina Forest", status: "new", score: 52, agent: null, interest: "Buying", budget: "$300K-$400K", area: "Carolina Forest", lastActivity: "Viewed 5 listings", lastContact: "10 min ago", aiNotes: "Active browsing behavior. Family relocation. School district important." },
];

const MARKET_REPORTS = [
  { id: 1, title: "Myrtle Beach Market Report", slug: "myrtle-beach", url: "/market/myrtle-beach", agent: "Sarah Mitchell", views: 1247, leads: 18, avgPrice: "$345,000", priceChange: "+5.2%", inventory: 342, daysOnMarket: 45, status: "published", lastUpdated: "Auto-updated 2h ago" },
  { id: 2, title: "North Myrtle Beach Market Report", slug: "north-myrtle-beach", url: "/market/north-myrtle-beach", agent: "James Parker", views: 892, leads: 12, avgPrice: "$425,000", priceChange: "+3.8%", inventory: 218, daysOnMarket: 52, status: "published", lastUpdated: "Auto-updated 2h ago" },
  { id: 3, title: "Conway Market Report", slug: "conway", url: "/market/conway", agent: "Marcus Johnson", views: 456, leads: 6, avgPrice: "$265,000", priceChange: "+7.1%", inventory: 156, daysOnMarket: 38, status: "published", lastUpdated: "Auto-updated 2h ago" },
  { id: 4, title: "Pawleys Island Market Report", slug: "pawleys-island", url: "/market/pawleys-island", agent: "Sarah Mitchell", views: 634, leads: 9, avgPrice: "$485,000", priceChange: "+2.4%", inventory: 98, daysOnMarket: 61, status: "published", lastUpdated: "Auto-updated 2h ago" },
  { id: 5, title: "Surfside Beach Market Report", slug: "surfside-beach", url: "/market/surfside-beach", agent: "Lisa Chen", views: 321, leads: 4, avgPrice: "$310,000", priceChange: "+4.6%", inventory: 87, daysOnMarket: 42, status: "draft", lastUpdated: "Draft saved 1d ago" },
  { id: 6, title: "Murrells Inlet Market Report", slug: "murrells-inlet", url: "/market/murrells-inlet", agent: "James Parker", views: 567, leads: 7, avgPrice: "$375,000", priceChange: "+3.1%", inventory: 124, daysOnMarket: 48, status: "published", lastUpdated: "Auto-updated 2h ago" },
];

const COMMUNITY_PAGES = [
  { id: 1, name: "Barefoot Resort & Golf", slug: "barefoot-resort", type: "Golf Community", area: "North Myrtle Beach", activeListings: 24, avgPrice: "$485,000", views: 2134, leads: 22, agent: "James Parker", status: "published", image: "🏌️" },
  { id: 2, name: "Grande Dunes", slug: "grande-dunes", type: "Luxury Community", area: "Myrtle Beach", activeListings: 18, avgPrice: "$725,000", views: 1876, leads: 15, agent: "Sarah Mitchell", status: "published", image: "🏖️" },
  { id: 3, name: "Carolina Forest", slug: "carolina-forest", type: "Family Community", area: "Myrtle Beach", activeListings: 45, avgPrice: "$340,000", views: 3210, leads: 34, agent: "Marcus Johnson", status: "published", image: "🌲" },
  { id: 4, name: "The Market Common", slug: "market-common", type: "Urban Living", area: "Myrtle Beach", activeListings: 12, avgPrice: "$395,000", views: 1456, leads: 11, agent: "Lisa Chen", status: "published", image: "🏙️" },
  { id: 5, name: "Litchfield Beach", slug: "litchfield-beach", type: "Beach Community", area: "Pawleys Island", activeListings: 15, avgPrice: "$520,000", views: 987, leads: 8, agent: "Sarah Mitchell", status: "published", image: "🏝️" },
  { id: 6, name: "Prince Creek", slug: "prince-creek", type: "Family Community", area: "Murrells Inlet", activeListings: 28, avgPrice: "$310,000", views: 1654, leads: 14, agent: "Amy Rodriguez", status: "draft", image: "🏡" },
];

const WEEKLY_DATA = [
  { day: "Mon", leads: 12, views: 340, conversions: 3 },
  { day: "Tue", leads: 18, views: 420, conversions: 5 },
  { day: "Wed", leads: 15, views: 380, conversions: 4 },
  { day: "Thu", leads: 22, views: 510, conversions: 6 },
  { day: "Fri", leads: 28, views: 620, conversions: 8 },
  { day: "Sat", leads: 35, views: 780, conversions: 10 },
  { day: "Sun", leads: 20, views: 450, conversions: 5 },
];

const MONTHLY_REVENUE = [
  { month: "Oct", revenue: 12400, agents: 28 },
  { month: "Nov", revenue: 15800, agents: 32 },
  { month: "Dec", revenue: 14200, agents: 31 },
  { month: "Jan", revenue: 18600, agents: 38 },
  { month: "Feb", revenue: 22400, agents: 42 },
  { month: "Mar", revenue: 26800, agents: 48 },
];

const PIE_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const PLANS = [
  { name: "Starter", price: 49, agents: 12, features: ["CRM + Lead Management", "3 Market Reports", "2 Community Pages", "Basic AI Scoring"] },
  { name: "Pro", price: 99, agents: 28, features: ["Everything in Starter", "Unlimited Market Reports", "10 Community Pages", "AI Content Generation", "Drip Campaigns"] },
  { name: "Enterprise", price: 199, agents: 8, features: ["Everything in Pro", "Unlimited Everything", "Predictive Analytics", "Custom Branding", "API Access", "Priority Support"] },
];

// ============ COMPONENTS ============
const Badge = ({ children, color = COLORS.primary, style = {} }) => (
  <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 10px", borderRadius: 9999, fontSize: 12, fontWeight: 600, background: color + "22", color, ...style }}>{children}</span>
);

const Avatar = ({ name, size = 36, color = COLORS.primary }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: `linear-gradient(135deg, ${color}, ${color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.38, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
    {name.split(" ").map(n => n[0]).join("")}
  </div>
);

const StatCard = ({ icon: Icon, label, value, change, changeDir, color = COLORS.primary, subtitle }) => (
  <div style={{ background: COLORS.bgCard, borderRadius: 12, padding: 20, border: `1px solid ${COLORS.border}`, flex: 1, minWidth: 200 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={20} color={color} />
      </div>
      {change && (
        <span style={{ fontSize: 13, fontWeight: 600, color: changeDir === "up" ? COLORS.secondary : COLORS.danger, display: "flex", alignItems: "center", gap: 2 }}>
          {changeDir === "up" ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {change}
        </span>
      )}
    </div>
    <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.text }}>{value}</div>
    <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 2 }}>{label}</div>
    {subtitle && <div style={{ fontSize: 11, color: COLORS.textDim, marginTop: 4 }}>{subtitle}</div>}
  </div>
);

const ScoreBadge = ({ score }) => {
  const color = score >= 80 ? COLORS.secondary : score >= 50 ? COLORS.accent : COLORS.danger;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ width: 48, height: 6, borderRadius: 3, background: COLORS.border }}>
        <div style={{ width: `${score}%`, height: "100%", borderRadius: 3, background: color }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color }}>{score}</span>
    </div>
  );
};

const StatusDot = ({ status }) => {
  const colors = { hot: COLORS.danger, nurture: COLORS.accent, cold: COLORS.textDim, new: COLORS.primary, active: COLORS.secondary, trial: COLORS.accent, published: COLORS.secondary, draft: COLORS.textDim };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: colors[status] || COLORS.textDim }} />
      <span style={{ fontSize: 12, fontWeight: 500, color: COLORS.textMuted, textTransform: "capitalize" }}>{status}</span>
    </div>
  );
};

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: copied ? COLORS.secondary : COLORS.textDim }}>
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
};

// ============ MAIN APP ============
export default function CRMPlatform() {
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiOutput, setAiOutput] = useState("");
  const [showPreview, setShowPreview] = useState(null);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "leads", label: "Leads", icon: Users },
    { id: "market-reports", label: "Market Reports", icon: FileText },
    { id: "communities", label: "Communities", icon: Map },
    { id: "agents", label: "Agents", icon: Award },
    { id: "ai-tools", label: "AI Tools", icon: Brain },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const simulateAI = (type) => {
    setAiGenerating(true);
    setAiOutput("");
    const outputs = {
      "market-report": "📊 **Myrtle Beach Market Report - April 2026**\n\nThe Myrtle Beach housing market continues its upward trajectory with median home prices reaching $345,000, a 5.2% increase year-over-year. Active inventory sits at 342 listings, down 12% from last quarter, creating favorable conditions for sellers.\n\n**Key Highlights:**\n• Days on market averaged 45, down from 52 last quarter\n• Oceanfront condos saw the highest appreciation at 7.8%\n• New construction permits up 15% in the Carolina Forest area\n• Investment properties showing 6.2% average rental yield\n\n**Forecast:** Expect continued appreciation of 3-5% through Q3 2026, with strongest growth in the $300K-$500K segment.",
      "listing-desc": "🏠 **Welcome to Coastal Paradise**\n\nNestled in the heart of Barefoot Resort, this stunning 4BR/3BA home offers the perfect blend of luxury and Low Country charm. Step inside to discover soaring ceilings, an open-concept living area bathed in natural light, and a gourmet kitchen with granite counters and stainless appliances.\n\nThe spacious primary suite features a spa-like bath with dual vanities and a walk-in closet. Outside, your private oasis awaits — a screened porch overlooking the Intracoastal Waterway, perfect for morning coffee or evening sunsets.\n\n**Community amenities** include 4 championship golf courses, oceanfront beach cabana, resort-style pools, and on-site dining. Minutes from dining, shopping, and the beach.",
      "email-campaign": "📧 **Subject: Your Monthly Grand Strand Market Update**\n\nHi [First Name],\n\nSpring is heating up on the Grand Strand, and so is the real estate market! Here's what you need to know:\n\n🏠 **Market Snapshot:**\n• Median price: $345,000 (+5.2% YoY)\n• Homes are selling in 45 days on average\n• New listings up 8% this month\n\n🔥 **Hot Communities This Month:**\n• Carolina Forest — 45 active listings from $280K\n• Barefoot Resort — Golf course homes from $425K\n• Grande Dunes — Luxury living from $650K\n\nI've curated some properties I think match what you're looking for. **[View Your Personalized Picks →]**\n\nReady to explore? Let's schedule a time to chat.\n\nBest,\n[Agent Name]",
      "lead-score": "🎯 **AI Lead Analysis — Steve Chen**\n\n**Overall Score: 72/100** (Warm Lead)\n\n**Behavioral Signals:**\n• Submitted interest form → +15 points\n• Viewed 8 listings in Murrells Inlet → +12 points\n• Spent 4.2 min avg on community pages → +8 points\n• Returned to site 3x this week → +10 points\n• No phone call engagement yet → -5 points\n\n**Predicted Intent:** 68% likely to purchase within 90 days\n**Recommended Budget Range:** $275K-$375K\n**Best Match Areas:** Murrells Inlet, Surfside Beach\n\n**Recommended Actions:**\n1. Send personalized Murrells Inlet market report\n2. Follow up call within 24 hours\n3. Add to 'Active Buyer' drip campaign\n4. Schedule community tour for Saturday",
    };
    setTimeout(() => {
      setAiOutput(outputs[type] || outputs["market-report"]);
      setAiGenerating(false);
    }, 2000);
  };

  // ============ VIEWS ============
  const DashboardView = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: COLORS.text, margin: 0 }}>Platform Dashboard</h1>
          <p style={{ fontSize: 14, color: COLORS.textMuted, margin: "4px 0 0" }}>SaaS overview — Grand Strand Home Living CRM</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setShowAIPanel(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight})`, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            <Brain size={16} /> AI Insights
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <StatCard icon={Users} label="Total Agents" value="48" change="+12%" changeDir="up" color={COLORS.primary} subtitle="Active subscribers" />
        <StatCard icon={Target} label="Total Leads" value="1,247" change="+18%" changeDir="up" color={COLORS.secondary} subtitle="Across all agents" />
        <StatCard icon={FileText} label="Market Reports" value="33" change="+6" changeDir="up" color={COLORS.accent} subtitle="Auto-generated pages" />
        <StatCard icon={DollarSign} label="MRR" value="$26.8K" change="+19%" changeDir="up" color={COLORS.primaryLight} subtitle="Monthly recurring revenue" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <div style={{ background: COLORS.bgCard, borderRadius: 12, padding: 20, border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, margin: "0 0 16px" }}>Weekly Lead Flow</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={WEEKLY_DATA}>
              <defs>
                <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis dataKey="day" stroke={COLORS.textDim} fontSize={12} />
              <YAxis stroke={COLORS.textDim} fontSize={12} />
              <Tooltip contentStyle={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text }} />
              <Area type="monotone" dataKey="leads" stroke={COLORS.primary} fill="url(#leadGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: COLORS.bgCard, borderRadius: 12, padding: 20, border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, margin: "0 0 16px" }}>Revenue Growth</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY_REVENUE}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis dataKey="month" stroke={COLORS.textDim} fontSize={12} />
              <YAxis stroke={COLORS.textDim} fontSize={12} tickFormatter={v => `$${v/1000}K`} />
              <Tooltip contentStyle={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text }} formatter={v => [`$${v.toLocaleString()}`, "Revenue"]} />
              <Bar dataKey="revenue" fill={COLORS.secondary} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: COLORS.bgCard, borderRadius: 12, padding: 20, border: `1px solid ${COLORS.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, margin: 0 }}>Recent Leads</h3>
            <button onClick={() => setActiveView("leads")} style={{ background: "none", border: "none", color: COLORS.primary, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>View all <ChevronRight size={14} /></button>
          </div>
          {LEADS.slice(0, 4).map(lead => (
            <div key={lead.id} onClick={() => { setSelectedLead(lead); setActiveView("leads"); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${COLORS.border}`, cursor: "pointer" }}>
              <Avatar name={lead.name} size={32} color={lead.status === "hot" ? COLORS.danger : lead.status === "new" ? COLORS.primary : COLORS.accent} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{lead.name}</div>
                <div style={{ fontSize: 11, color: COLORS.textDim }}>{lead.source}</div>
              </div>
              <ScoreBadge score={lead.score} />
            </div>
          ))}
        </div>

        <div style={{ background: COLORS.bgCard, borderRadius: 12, padding: 20, border: `1px solid ${COLORS.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, margin: 0 }}>Top Performing Pages</h3>
            <button onClick={() => setActiveView("market-reports")} style={{ background: "none", border: "none", color: COLORS.primary, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>View all <ChevronRight size={14} /></button>
          </div>
          {[...MARKET_REPORTS.slice(0, 2), ...COMMUNITY_PAGES.slice(0, 2)].map((page, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: i < 2 ? COLORS.primary + "18" : COLORS.secondary + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {i < 2 ? <FileText size={16} color={COLORS.primary} /> : <Map size={16} color={COLORS.secondary} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{page.title || page.name}</div>
                <div style={{ fontSize: 11, color: COLORS.textDim }}>{page.views.toLocaleString()} views • {page.leads} leads</div>
              </div>
              <Badge color={COLORS.secondary}>{page.leads} leads</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const LeadsView = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: COLORS.text, margin: 0 }}>Lead Management</h1>
          <p style={{ fontSize: 14, color: COLORS.textMuted, margin: "4px 0 0" }}>AI-powered lead scoring and qualification</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: `1px solid ${COLORS.border}`, background: COLORS.bgCard, color: COLORS.textMuted, fontSize: 13, cursor: "pointer" }}><Filter size={14} /> Filter</button>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "none", background: COLORS.primary, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}><Plus size={14} /> Add Lead</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {[{ label: "All", count: LEADS.length }, { label: "Hot", count: LEADS.filter(l => l.status === "hot").length }, { label: "New", count: LEADS.filter(l => l.status === "new").length }, { label: "Nurture", count: LEADS.filter(l => l.status === "nurture").length }, { label: "Cold", count: LEADS.filter(l => l.status === "cold").length }].map(tab => (
          <button key={tab.label} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${COLORS.border}`, background: tab.label === "All" ? COLORS.primary + "22" : COLORS.bgCard, color: tab.label === "All" ? COLORS.primary : COLORS.textMuted, fontSize: 13, cursor: "pointer" }}>
            {tab.label} <span style={{ marginLeft: 4, fontSize: 11, opacity: 0.7 }}>({tab.count})</span>
          </button>
        ))}
      </div>

      {selectedLead ? (
        <div style={{ background: COLORS.bgCard, borderRadius: 12, padding: 24, border: `1px solid ${COLORS.border}` }}>
          <button onClick={() => setSelectedLead(null)} style={{ background: "none", border: "none", color: COLORS.primary, fontSize: 13, cursor: "pointer", marginBottom: 16 }}>← Back to all leads</button>
          <div style={{ display: "flex", gap: 24 }}>
            <div style={{ flex: 2 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                <Avatar name={selectedLead.name} size={56} color={selectedLead.status === "hot" ? COLORS.danger : COLORS.primary} />
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, margin: 0 }}>{selectedLead.name}</h2>
                  <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                    <StatusDot status={selectedLead.status} />
                    <ScoreBadge score={selectedLead.score} />
                  </div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                {[{ icon: Mail, label: "Email", value: selectedLead.email }, { icon: Phone, label: "Phone", value: selectedLead.phone }, { icon: DollarSign, label: "Budget", value: selectedLead.budget }, { icon: MapPin, label: "Area", value: selectedLead.area }, { icon: Target, label: "Interest", value: selectedLead.interest }, { icon: Globe, label: "Source", value: selectedLead.source }].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: 12, background: COLORS.bg, borderRadius: 8 }}>
                    <item.icon size={16} color={COLORS.textDim} />
                    <div>
                      <div style={{ fontSize: 11, color: COLORS.textDim }}>{item.label}</div>
                      <div style={{ fontSize: 13, color: COLORS.text, fontWeight: 500 }}>{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: `linear-gradient(135deg, ${COLORS.primary}15, ${COLORS.primaryLight}10)`, borderRadius: 10, padding: 16, border: `1px solid ${COLORS.primary}30` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <Brain size={16} color={COLORS.primary} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.primary }}>AI Analysis</span>
                </div>
                <p style={{ fontSize: 13, color: COLORS.textMuted, margin: 0, lineHeight: 1.6 }}>{selectedLead.aiNotes}</p>
              </div>
            </div>
            <div style={{ flex: 1, borderLeft: `1px solid ${COLORS.border}`, paddingLeft: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, margin: "0 0 16px" }}>Quick Actions</h3>
              {[{ icon: Mail, label: "Send Email", color: COLORS.primary }, { icon: Phone, label: "Log Call", color: COLORS.secondary }, { icon: Send, label: "Add to Drip", color: COLORS.accent }, { icon: Brain, label: "AI Score Analysis", color: COLORS.primaryLight }].map((action, i) => (
                <button key={i} onClick={() => { if (action.label === "AI Score Analysis") { setShowAIPanel(true); simulateAI("lead-score"); }}} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", marginBottom: 8, borderRadius: 8, border: `1px solid ${COLORS.border}`, background: COLORS.bg, color: COLORS.text, fontSize: 13, cursor: "pointer", textAlign: "left" }}>
                  <action.icon size={16} color={action.color} /> {action.label}
                </button>
              ))}
              <h3 style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, margin: "24px 0 12px" }}>Activity</h3>
              <div style={{ fontSize: 12, color: COLORS.textMuted }}>
                <div style={{ padding: "8px 0", borderBottom: `1px solid ${COLORS.border}` }}>🕐 {selectedLead.lastContact} — {selectedLead.lastActivity}</div>
                <div style={{ padding: "8px 0", borderBottom: `1px solid ${COLORS.border}` }}>📧 Email opened — Market report link</div>
                <div style={{ padding: "8px 0" }}>🌐 First visit — {selectedLead.source}</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ background: COLORS.bgCard, borderRadius: 12, border: `1px solid ${COLORS.border}`, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                {["Lead", "Source", "Status", "AI Score", "Agent", "Last Activity"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LEADS.map(lead => (
                <tr key={lead.id} onClick={() => setSelectedLead(lead)} style={{ borderBottom: `1px solid ${COLORS.border}`, cursor: "pointer" }} onMouseOver={e => e.currentTarget.style.background = COLORS.bgHover} onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Avatar name={lead.name} size={30} color={lead.status === "hot" ? COLORS.danger : lead.status === "new" ? COLORS.primary : COLORS.accent} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{lead.name}</div>
                        <div style={{ fontSize: 11, color: COLORS.textDim }}>{lead.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: COLORS.textMuted }}>{lead.source}</td>
                  <td style={{ padding: "12px 16px" }}><StatusDot status={lead.status} /></td>
                  <td style={{ padding: "12px 16px" }}><ScoreBadge score={lead.score} /></td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: COLORS.textMuted }}>{lead.agent || <Badge color={COLORS.accent}>Unassigned</Badge>}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: COLORS.textDim }}>{lead.lastContact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const MarketReportsView = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: COLORS.text, margin: 0 }}>Market Reports</h1>
          <p style={{ fontSize: 14, color: COLORS.textMuted, margin: "4px 0 0" }}>Auto-generated SEO pages with live MLS data</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => { setShowAIPanel(true); simulateAI("market-report"); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight})`, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}><Brain size={14} /> AI Generate Report</button>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "none", background: COLORS.secondary, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}><Plus size={14} /> New Report</button>
        </div>
      </div>

      {selectedReport ? (
        <div>
          <button onClick={() => setSelectedReport(null)} style={{ background: "none", border: "none", color: COLORS.primary, fontSize: 13, cursor: "pointer", marginBottom: 16 }}>← Back to all reports</button>
          <div style={{ background: COLORS.bgCard, borderRadius: 12, padding: 24, border: `1px solid ${COLORS.border}`, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, margin: 0 }}>{selectedReport.title}</h2>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
                  <StatusDot status={selectedReport.status} />
                  <span style={{ fontSize: 12, color: COLORS.textDim }}>{selectedReport.lastUpdated}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: `1px solid ${COLORS.border}`, background: COLORS.bg, color: COLORS.textMuted, fontSize: 12, cursor: "pointer" }}><Eye size={14} /> Preview</button>
                <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: `1px solid ${COLORS.border}`, background: COLORS.bg, color: COLORS.textMuted, fontSize: 12, cursor: "pointer" }}><Edit3 size={14} /> Edit</button>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: COLORS.bg, borderRadius: 8, marginBottom: 20 }}>
              <Globe size={14} color={COLORS.textDim} />
              <code style={{ fontSize: 13, color: COLORS.primary, flex: 1 }}>https://{selectedReport.agent === "Sarah Mitchell" ? "sarahmitchell" : selectedReport.agent === "James Parker" ? "jamesparker" : "agent"}.grandstrandhomeliving.com{selectedReport.url}</code>
              <CopyButton />
              <button style={{ padding: "4px 10px", borderRadius: 6, border: "none", background: COLORS.primary, color: "#fff", fontSize: 11, cursor: "pointer" }}><ExternalLink size={12} /></button>
            </div>

            <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
              <StatCard icon={Eye} label="Page Views" value={selectedReport.views.toLocaleString()} change="+12%" changeDir="up" color={COLORS.primary} />
              <StatCard icon={Users} label="Leads Generated" value={selectedReport.leads} change="+3" changeDir="up" color={COLORS.secondary} />
              <StatCard icon={DollarSign} label="Avg Price" value={selectedReport.avgPrice} change={selectedReport.priceChange} changeDir="up" color={COLORS.accent} />
              <StatCard icon={Clock} label="Days on Market" value={selectedReport.daysOnMarket} color={COLORS.primaryLight} />
            </div>

            <div style={{ background: COLORS.bg, borderRadius: 10, padding: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, margin: "0 0 12px" }}>Report Preview</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
                <div style={{ background: COLORS.bgCard, borderRadius: 8, padding: 16, textAlign: "center" }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.text }}>{selectedReport.avgPrice}</div>
                  <div style={{ fontSize: 12, color: COLORS.textMuted }}>Median Price</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.secondary, marginTop: 4 }}>{selectedReport.priceChange} YoY</div>
                </div>
                <div style={{ background: COLORS.bgCard, borderRadius: 8, padding: 16, textAlign: "center" }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.text }}>{selectedReport.inventory}</div>
                  <div style={{ fontSize: 12, color: COLORS.textMuted }}>Active Listings</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.danger, marginTop: 4 }}>-12% vs last quarter</div>
                </div>
                <div style={{ background: COLORS.bgCard, borderRadius: 8, padding: 16, textAlign: "center" }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.text }}>{selectedReport.daysOnMarket}</div>
                  <div style={{ fontSize: 12, color: COLORS.textMuted }}>Avg Days on Market</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.secondary, marginTop: 4 }}>-7 days vs last quarter</div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: COLORS.textDim, padding: "12px 0", borderTop: `1px solid ${COLORS.border}` }}>
                📊 Auto-updated every 2 hours from MLS feed • Last sync: 2 hours ago • Next sync: in 2 hours
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {MARKET_REPORTS.map(report => (
            <div key={report.id} onClick={() => setSelectedReport(report)} style={{ background: COLORS.bgCard, borderRadius: 12, padding: 20, border: `1px solid ${COLORS.border}`, cursor: "pointer", transition: "border-color 0.2s" }} onMouseOver={e => e.currentTarget.style.borderColor = COLORS.primary} onMouseOut={e => e.currentTarget.style.borderColor = COLORS.border}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: COLORS.text, margin: 0 }}>{report.title}</h3>
                  <div style={{ fontSize: 12, color: COLORS.textDim, marginTop: 4 }}>Agent: {report.agent}</div>
                </div>
                <StatusDot status={report.status} />
              </div>
              <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
                <div><div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text }}>{report.avgPrice}</div><div style={{ fontSize: 11, color: COLORS.textDim }}>Avg Price</div></div>
                <div><div style={{ fontSize: 18, fontWeight: 700, color: COLORS.secondary }}>{report.priceChange}</div><div style={{ fontSize: 11, color: COLORS.textDim }}>Change</div></div>
                <div><div style={{ fontSize: 18, fontWeight: 700, color: COLORS.primary }}>{report.inventory}</div><div style={{ fontSize: 11, color: COLORS.textDim }}>Listings</div></div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: `1px solid ${COLORS.border}` }}>
                <div style={{ display: "flex", gap: 12, fontSize: 12, color: COLORS.textDim }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Eye size={12} /> {report.views.toLocaleString()}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Users size={12} /> {report.leads} leads</span>
                </div>
                <span style={{ fontSize: 11, color: COLORS.textDim }}>{report.lastUpdated}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const CommunitiesView = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: COLORS.text, margin: 0 }}>Community Pages</h1>
          <p style={{ fontSize: 14, color: COLORS.textMuted, margin: "4px 0 0" }}>Custom listing pages for each community with live MLS data</p>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "none", background: COLORS.secondary, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}><Plus size={14} /> New Community Page</button>
      </div>

      {selectedCommunity ? (
        <div>
          <button onClick={() => setSelectedCommunity(null)} style={{ background: "none", border: "none", color: COLORS.primary, fontSize: 13, cursor: "pointer", marginBottom: 16 }}>← Back to all communities</button>
          <div style={{ background: COLORS.bgCard, borderRadius: 12, padding: 24, border: `1px solid ${COLORS.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: 12, background: COLORS.primary + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>{selectedCommunity.image}</div>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, margin: 0 }}>{selectedCommunity.name}</h2>
                  <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                    <Badge color={COLORS.primary}>{selectedCommunity.type}</Badge>
                    <Badge color={COLORS.secondary}>{selectedCommunity.area}</Badge>
                    <StatusDot status={selectedCommunity.status} />
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: `1px solid ${COLORS.border}`, background: COLORS.bg, color: COLORS.textMuted, fontSize: 12, cursor: "pointer" }}><Eye size={14} /> Preview</button>
                <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: `1px solid ${COLORS.border}`, background: COLORS.bg, color: COLORS.textMuted, fontSize: 12, cursor: "pointer" }}><Edit3 size={14} /> Edit</button>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: COLORS.bg, borderRadius: 8, marginBottom: 20 }}>
              <Globe size={14} color={COLORS.textDim} />
              <code style={{ fontSize: 13, color: COLORS.primary, flex: 1 }}>https://{selectedCommunity.agent === "James Parker" ? "jamesparker" : "agent"}.grandstrandhomeliving.com/community/{selectedCommunity.slug}</code>
              <CopyButton />
              <button style={{ padding: "4px 10px", borderRadius: 6, border: "none", background: COLORS.primary, color: "#fff", fontSize: 11, cursor: "pointer" }}><ExternalLink size={12} /></button>
            </div>

            <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
              <StatCard icon={Building} label="Active Listings" value={selectedCommunity.activeListings} color={COLORS.primary} />
              <StatCard icon={DollarSign} label="Avg Price" value={selectedCommunity.avgPrice} color={COLORS.secondary} />
              <StatCard icon={Eye} label="Page Views" value={selectedCommunity.views.toLocaleString()} change="+22%" changeDir="up" color={COLORS.accent} />
              <StatCard icon={Users} label="Leads" value={selectedCommunity.leads} change="+5" changeDir="up" color={COLORS.primaryLight} />
            </div>

            <h3 style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, margin: "0 0 16px" }}>Sample Active Listings</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {[
                { price: "$489,000", beds: 4, baths: 3, sqft: "2,450", address: "123 Clubhouse Dr", status: "Active" },
                { price: "$525,000", beds: 3, baths: 2.5, sqft: "2,100", address: "456 Fairway Ln", status: "Active" },
                { price: "$612,000", beds: 5, baths: 4, sqft: "3,200", address: "789 Waterway Ct", status: "New" },
              ].map((listing, i) => (
                <div key={i} style={{ background: COLORS.bg, borderRadius: 10, padding: 16, border: `1px solid ${COLORS.border}` }}>
                  <div style={{ height: 100, background: `linear-gradient(135deg, ${COLORS.primary}22, ${COLORS.secondary}22)`, borderRadius: 8, marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: COLORS.textDim }}>📷 MLS Photo</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text }}>{listing.price}</div>
                  <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>{listing.beds}bd • {listing.baths}ba • {listing.sqft} sqft</div>
                  <div style={{ fontSize: 12, color: COLORS.textDim, marginTop: 4 }}>{listing.address}</div>
                  <Badge color={listing.status === "New" ? COLORS.secondary : COLORS.primary} style={{ marginTop: 8 }}>{listing.status}</Badge>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: COLORS.textDim, padding: "16px 0 0", borderTop: `1px solid ${COLORS.border}`, marginTop: 16 }}>
              🔄 Listings auto-synced from MLS feed • Last sync: 1 hour ago • {selectedCommunity.activeListings} total active listings
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {COMMUNITY_PAGES.map(community => (
            <div key={community.id} onClick={() => setSelectedCommunity(community)} style={{ background: COLORS.bgCard, borderRadius: 12, padding: 20, border: `1px solid ${COLORS.border}`, cursor: "pointer", transition: "border-color 0.2s" }} onMouseOver={e => e.currentTarget.style.borderColor = COLORS.secondary} onMouseOut={e => e.currentTarget.style.borderColor = COLORS.border}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: COLORS.primary + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{community.image}</div>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, margin: 0 }}>{community.name}</h3>
                  <div style={{ fontSize: 11, color: COLORS.textDim }}>{community.type} • {community.area}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                <div style={{ flex: 1, textAlign: "center", padding: 8, background: COLORS.bg, borderRadius: 6 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.text }}>{community.activeListings}</div>
                  <div style={{ fontSize: 10, color: COLORS.textDim }}>Listings</div>
                </div>
                <div style={{ flex: 1, textAlign: "center", padding: 8, background: COLORS.bg, borderRadius: 6 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.secondary }}>{community.avgPrice}</div>
                  <div style={{ fontSize: 10, color: COLORS.textDim }}>Avg Price</div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: COLORS.textDim }}>
                <span><Eye size={11} style={{ verticalAlign: "middle" }} /> {community.views.toLocaleString()} views</span>
                <span><Users size={11} style={{ verticalAlign: "middle" }} /> {community.leads} leads</span>
                <StatusDot status={community.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const AgentsView = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: COLORS.text, margin: 0 }}>Agent Management</h1>
          <p style={{ fontSize: 14, color: COLORS.textMuted, margin: "4px 0 0" }}>Manage subscribers and agent websites</p>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "none", background: COLORS.primary, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}><Plus size={14} /> Invite Agent</button>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        <StatCard icon={Users} label="Active Agents" value="48" color={COLORS.primary} />
        <StatCard icon={DollarSign} label="Avg Revenue/Agent" value="$558" color={COLORS.secondary} />
        <StatCard icon={Globe} label="Agent Websites" value="48" color={COLORS.accent} />
      </div>

      <div style={{ background: COLORS.bgCard, borderRadius: 12, border: `1px solid ${COLORS.border}`, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
              {["Agent", "Plan", "Website", "Leads", "Closings", "Revenue", "Pages", "Status"].map(h => (
                <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {AGENTS.map(agent => (
              <tr key={agent.id} style={{ borderBottom: `1px solid ${COLORS.border}` }} onMouseOver={e => e.currentTarget.style.background = COLORS.bgHover} onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "12px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar name={agent.name} size={32} color={COLORS.primary} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{agent.name}</div>
                      <div style={{ fontSize: 11, color: COLORS.textDim }}>{agent.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "12px 14px" }}><Badge color={agent.plan === "Enterprise" ? COLORS.accent : agent.plan === "Pro" ? COLORS.primary : COLORS.textDim}>{agent.plan}</Badge></td>
                <td style={{ padding: "12px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Globe size={12} color={COLORS.textDim} />
                    <span style={{ fontSize: 11, color: COLORS.primary }}>{agent.website.split(".")[0]}..</span>
                  </div>
                </td>
                <td style={{ padding: "12px 14px", fontSize: 13, color: COLORS.text, fontWeight: 600 }}>{agent.leads}</td>
                <td style={{ padding: "12px 14px", fontSize: 13, color: COLORS.text }}>{agent.closings}</td>
                <td style={{ padding: "12px 14px", fontSize: 13, color: COLORS.secondary, fontWeight: 600 }}>${(agent.revenue/1000).toFixed(0)}K</td>
                <td style={{ padding: "12px 14px", fontSize: 12, color: COLORS.textMuted }}>{agent.marketReports}R / {agent.communityPages}C</td>
                <td style={{ padding: "12px 14px" }}><StatusDot status={agent.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const AIToolsView = () => (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: COLORS.text, margin: 0 }}>AI Tools</h1>
        <p style={{ fontSize: 14, color: COLORS.textMuted, margin: "4px 0 0" }}>Powered by AI — content generation, lead scoring, and predictive analytics</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        {[
          { title: "Market Report Generator", desc: "Auto-generate comprehensive market reports from MLS data with AI-written analysis and insights.", icon: FileText, color: COLORS.primary, action: "market-report" },
          { title: "Listing Description Writer", desc: "Create compelling, SEO-optimized listing descriptions from property details and photos.", icon: Edit3, color: COLORS.secondary, action: "listing-desc" },
          { title: "Email Campaign Builder", desc: "Generate personalized drip campaigns, market updates, and nurture sequences.", icon: Mail, color: COLORS.accent, action: "email-campaign" },
          { title: "Lead Scoring & Analysis", desc: "Deep-dive AI analysis on any lead with behavioral signals, intent prediction, and next-best-action.", icon: Target, color: COLORS.primaryLight, action: "lead-score" },
        ].map((tool, i) => (
          <div key={i} style={{ background: COLORS.bgCard, borderRadius: 12, padding: 24, border: `1px solid ${COLORS.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: tool.color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <tool.icon size={22} color={tool.color} />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: COLORS.text, margin: 0 }}>{tool.title}</h3>
              </div>
            </div>
            <p style={{ fontSize: 13, color: COLORS.textMuted, margin: "0 0 16px", lineHeight: 1.5 }}>{tool.desc}</p>
            <button onClick={() => { setShowAIPanel(true); simulateAI(tool.action); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: tool.color, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              <Zap size={14} /> Generate
            </button>
          </div>
        ))}
      </div>

      <div style={{ background: COLORS.bgCard, borderRadius: 12, padding: 24, border: `1px solid ${COLORS.border}` }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: COLORS.text, margin: "0 0 6px" }}>Predictive Analytics Dashboard</h3>
        <p style={{ fontSize: 13, color: COLORS.textMuted, margin: "0 0 20px" }}>AI-powered market predictions and lead conversion forecasts</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
          {[
            { label: "Predicted Closings (30d)", value: "23", trend: "+15%", color: COLORS.secondary },
            { label: "Lead Conv. Rate Forecast", value: "18.4%", trend: "+2.1%", color: COLORS.primary },
            { label: "Market Appreciation (6mo)", value: "+4.8%", trend: "stable", color: COLORS.accent },
            { label: "Seller Likelihood Score", value: "847", trend: "+52 leads", color: COLORS.primaryLight },
          ].map((metric, i) => (
            <div key={i} style={{ background: COLORS.bg, borderRadius: 10, padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: metric.color }}>{metric.value}</div>
              <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>{metric.label}</div>
              <div style={{ fontSize: 11, color: COLORS.secondary, marginTop: 6 }}>{metric.trend}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SettingsView = () => (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: COLORS.text, margin: 0 }}>Platform Settings</h1>
        <p style={{ fontSize: 14, color: COLORS.textMuted, margin: "4px 0 0" }}>Manage your SaaS platform configuration</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <div style={{ background: COLORS.bgCard, borderRadius: 12, padding: 24, border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: COLORS.text, margin: "0 0 16px" }}>MLS / IDX Integration</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, background: COLORS.bg, borderRadius: 8, marginBottom: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: COLORS.secondary }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>Coastal Carolinas MLS (CCAR)</div>
              <div style={{ fontSize: 11, color: COLORS.textDim }}>Connected • Last sync: 1h ago • 12,847 active listings</div>
            </div>
            <button style={{ padding: "4px 12px", borderRadius: 6, border: `1px solid ${COLORS.border}`, background: "transparent", color: COLORS.textMuted, fontSize: 11, cursor: "pointer" }}>Configure</button>
          </div>
          <div style={{ fontSize: 12, color: COLORS.textDim }}>Auto-sync interval: Every 2 hours • RESO Web API v2</div>
        </div>

        <div style={{ background: COLORS.bgCard, borderRadius: 12, padding: 24, border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: COLORS.text, margin: "0 0 16px" }}>Domain & Branding</h3>
          <div style={{ padding: 14, background: COLORS.bg, borderRadius: 8, marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 4 }}>Primary Domain</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.primary }}>grandstrandhomeliving.com</div>
          </div>
          <div style={{ padding: 14, background: COLORS.bg, borderRadius: 8, marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 4 }}>Agent Subdomain Pattern</div>
            <div style={{ fontSize: 13, color: COLORS.text }}>[agentname].grandstrandhomeliving.com</div>
          </div>
          <div style={{ padding: 14, background: COLORS.bg, borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 4 }}>Explore Page</div>
            <div style={{ fontSize: 13, color: COLORS.primary }}>explore.grandstrandhomeliving.com</div>
          </div>
        </div>
      </div>

      <div style={{ background: COLORS.bgCard, borderRadius: 12, padding: 24, border: `1px solid ${COLORS.border}`, marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: COLORS.text, margin: "0 0 16px" }}>Subscription Plans</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {PLANS.map((plan, i) => (
            <div key={i} style={{ background: COLORS.bg, borderRadius: 10, padding: 20, border: `1px solid ${i === 1 ? COLORS.primary : COLORS.border}`, position: "relative" }}>
              {i === 1 && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: COLORS.primary, color: "#fff", fontSize: 10, fontWeight: 600, padding: "2px 10px", borderRadius: 10 }}>MOST POPULAR</div>}
              <h4 style={{ fontSize: 18, fontWeight: 700, color: COLORS.text, margin: "0 0 4px" }}>{plan.name}</h4>
              <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.primary, marginBottom: 4 }}>${plan.price}<span style={{ fontSize: 14, fontWeight: 400, color: COLORS.textDim }}>/mo</span></div>
              <div style={{ fontSize: 12, color: COLORS.textDim, marginBottom: 16 }}>{plan.agents} active agents</div>
              {plan.features.map((f, j) => (
                <div key={j} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", fontSize: 13, color: COLORS.textMuted }}>
                  <Check size={14} color={COLORS.secondary} /> {f}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const views = {
    dashboard: DashboardView,
    leads: LeadsView,
    "market-reports": MarketReportsView,
    communities: CommunitiesView,
    agents: AgentsView,
    "ai-tools": AIToolsView,
    settings: SettingsView,
  };

  const ActiveView = views[activeView] || DashboardView;

  return (
    <div style={{ display: "flex", height: "100vh", background: COLORS.bg, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: COLORS.text }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: COLORS.bgCard, borderRight: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "20px 16px", borderBottom: `1px solid ${COLORS.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Home size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>Grand Strand</div>
              <div style={{ fontSize: 10, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: 1 }}>CRM Platform</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "12px 8px" }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => { setActiveView(item.id); setSelectedLead(null); setSelectedReport(null); setSelectedCommunity(null); }} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", marginBottom: 2, borderRadius: 8, border: "none", background: activeView === item.id ? COLORS.primary + "18" : "transparent", color: activeView === item.id ? COLORS.primary : COLORS.textMuted, fontSize: 13, fontWeight: activeView === item.id ? 600 : 400, cursor: "pointer", textAlign: "left" }}>
              <item.icon size={18} /> {item.label}
              {item.id === "leads" && <span style={{ marginLeft: "auto", background: COLORS.danger, color: "#fff", fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 10 }}>2</span>}
            </button>
          ))}
        </nav>

        <div style={{ padding: 16, borderTop: `1px solid ${COLORS.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar name="Seth Bass" size={32} color={COLORS.secondary} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>Seth Bass</div>
              <div style={{ fontSize: 11, color: COLORS.textDim }}>Platform Admin</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: "auto", padding: 28 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <ActiveView />
        </div>
      </div>

      {/* AI Panel Overlay */}
      {showAIPanel && (
        <div style={{ position: "fixed", right: 0, top: 0, bottom: 0, width: 440, background: COLORS.bgCard, borderLeft: `1px solid ${COLORS.border}`, boxShadow: "-4px 0 24px rgba(0,0,0,0.3)", zIndex: 1000, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Brain size={18} color={COLORS.primary} />
              <span style={{ fontSize: 15, fontWeight: 600, color: COLORS.text }}>AI Assistant</span>
            </div>
            <button onClick={() => { setShowAIPanel(false); setAiOutput(""); }} style={{ background: "none", border: "none", color: COLORS.textDim, cursor: "pointer", fontSize: 18 }}>✕</button>
          </div>
          <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
            {aiGenerating ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", border: `3px solid ${COLORS.border}`, borderTopColor: COLORS.primary, animation: "spin 1s linear infinite" }} />
                <span style={{ fontSize: 14, color: COLORS.textMuted }}>AI is generating content...</span>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            ) : aiOutput ? (
              <div style={{ whiteSpace: "pre-wrap", fontSize: 13, color: COLORS.text, lineHeight: 1.7 }}>{aiOutput}</div>
            ) : (
              <div style={{ textAlign: "center", padding: "40px 20px", color: COLORS.textDim }}>
                <Brain size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
                <p>Select an AI tool to get started</p>
              </div>
            )}
          </div>
          {aiOutput && (
            <div style={{ padding: "12px 20px", borderTop: `1px solid ${COLORS.border}`, display: "flex", gap: 8 }}>
              <button style={{ flex: 1, padding: "8px", borderRadius: 8, border: `1px solid ${COLORS.border}`, background: COLORS.bg, color: COLORS.textMuted, fontSize: 12, cursor: "pointer" }}>📋 Copy</button>
              <button style={{ flex: 1, padding: "8px", borderRadius: 8, border: "none", background: COLORS.primary, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>✅ Use This</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
