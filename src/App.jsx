import { useState, useEffect, useReducer } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from "recharts";
import { Search, Bell, Users, Home, Mail, Filter, ChevronRight, ChevronDown, Clock, CheckCircle, AlertTriangle, XCircle, Send, MessageSquare, Phone, ArrowRight, ArrowLeft, Zap, Target, TrendingUp, Eye, MoreVertical, Plus, Settings, RefreshCw, UserCheck, UserX, DollarSign, Calendar, FileText, Activity, Bot, Inbox, LayoutDashboard } from "lucide-react";

// ─── Data & Constants ────────────────────────────────────────────────
const LEAD_MAGNETS = [
  { id: "lm1", name: "Free Home Valuation", category: "Seller", color: "#8B5CF6" },
  { id: "lm2", name: "First-Time Buyer Guide", category: "Buyer", color: "#3B82F6" },
  { id: "lm3", name: "Investment Property Calculator", category: "Investor", color: "#10B981" },
  { id: "lm4", name: "Neighborhood Market Report", category: "Buyer", color: "#F59E0B" },
  { id: "lm5", name: "Mortgage Pre-Approval Checklist", category: "Buyer", color: "#EF4444" },
  { id: "lm6", name: "Relocation Guide", category: "Buyer", color: "#EC4899" },
];

const AGENTS = [
  { id: "a1", name: "Marcus Johnson", email: "marcus@realtypro.com", phone: "(555) 201-4410", specialty: "Luxury Homes", activeLeads: 12, closedThisMonth: 3, avatar: "MJ" },
  { id: "a2", name: "Sarah Chen", email: "sarah@realtypro.com", phone: "(555) 201-4411", specialty: "First-Time Buyers", activeLeads: 18, closedThisMonth: 5, avatar: "SC" },
  { id: "a3", name: "David Park", email: "david@realtypro.com", phone: "(555) 201-4412", specialty: "Investment Properties", activeLeads: 9, closedThisMonth: 2, avatar: "DP" },
  { id: "a4", name: "Lisa Rodriguez", email: "lisa@realtypro.com", phone: "(555) 201-4413", specialty: "Relocation", activeLeads: 15, closedThisMonth: 4, avatar: "LR" },
  { id: "a5", name: "James Wright", email: "james@realtypro.com", phone: "(555) 201-4414", specialty: "Commercial", activeLeads: 7, closedThisMonth: 1, avatar: "JW" },
];

const STATUS_CONFIG = {
  hot: { label: "Hot Lead", color: "#EF4444", bg: "#FEF2F2", icon: Zap },
  nurture: { label: "Nurture", color: "#F59E0B", bg: "#FFFBEB", icon: Target },
  drip: { label: "Drip Campaign", color: "#3B82F6", bg: "#EFF6FF", icon: Mail },
  new: { label: "New Lead", color: "#8B5CF6", bg: "#F5F3FF", icon: Plus },
  qualifying: { label: "AI Qualifying", color: "#6366F1", bg: "#EEF2FF", icon: Bot },
  under_contract: { label: "Under Contract", color: "#10B981", bg: "#ECFDF5", icon: FileText },
  closed: { label: "Closed", color: "#059669", bg: "#ECFDF5", icon: CheckCircle },
  cold: { label: "Gone Cold", color: "#6B7280", bg: "#F9FAFB", icon: XCircle },
};

const DRIP_CAMPAIGNS = [
  { id: "dc1", name: "First-Time Buyer Nurture", type: "Buyer", emails: 8, duration: "45 days", openRate: "42%", clickRate: "18%", status: "active", enrolled: 127 },
  { id: "dc2", name: "Seller Market Update", type: "Seller", emails: 6, duration: "30 days", openRate: "38%", clickRate: "15%", status: "active", enrolled: 89 },
  { id: "dc3", name: "Investor Opportunity Alerts", type: "Investor", emails: 12, duration: "90 days", openRate: "45%", clickRate: "22%", status: "active", enrolled: 54 },
  { id: "dc4", name: "Re-engagement - Cold Leads", type: "All", emails: 5, duration: "21 days", openRate: "25%", clickRate: "8%", status: "active", enrolled: 203 },
  { id: "dc5", name: "Relocation Welcome Series", type: "Buyer", emails: 10, duration: "60 days", openRate: "51%", clickRate: "24%", status: "active", enrolled: 41 },
];

const generateLeads = () => [
  { id: "l1", name: "Jennifer Martinez", email: "jen.martinez@email.com", phone: "(555) 312-8891", magnet: "lm1", status: "hot", assignedAgent: "a1", score: 92, notes: "Wants to sell 4BR home in Westlake. Motivated — relocating for work in 60 days.", aiSummary: "High urgency seller. Timeline-driven. Pre-qualified with lender.", lastContact: "2 hours ago", responseTime: "< 5 min", messages: 8, created: "Mar 22, 2026", timeline: [
      { date: "Mar 22", event: "Lead captured from Free Home Valuation", type: "system" },
      { date: "Mar 22", event: "AI Bot: Initial outreach sent via Outlook", type: "ai" },
      { date: "Mar 22", event: "Lead replied: Interested in selling within 60 days", type: "lead" },
      { date: "Mar 22", event: "AI Bot: Categorized as HOT LEAD — immediate handoff", type: "ai" },
      { date: "Mar 22", event: "Assigned to Marcus Johnson", type: "system" },
      { date: "Mar 23", event: "Agent sent CMA via Outlook", type: "agent" },
      { date: "Mar 24", event: "Lead replied: Wants to schedule listing appointment", type: "lead" },
      { date: "Mar 25", event: "Listing appointment confirmed for Mar 28", type: "agent" },
    ]},
  { id: "l2", name: "Michael Thompson", email: "m.thompson@email.com", phone: "(555) 445-2203", magnet: "lm2", status: "qualifying", assignedAgent: null, score: 65, notes: "Downloaded first-time buyer guide. Interested in condos under $350K.", aiSummary: "AI Bot is gathering additional information. Pre-approval status unknown.", lastContact: "4 hours ago", responseTime: "~2 hrs", messages: 3, created: "Mar 25, 2026", timeline: [
      { date: "Mar 25", event: "Lead captured from First-Time Buyer Guide", type: "system" },
      { date: "Mar 25", event: "AI Bot: Initial qualification email sent", type: "ai" },
      { date: "Mar 25", event: "Lead replied: Looking in downtown area, budget ~$350K", type: "lead" },
      { date: "Mar 26", event: "AI Bot: Follow-up asking about pre-approval & timeline", type: "ai" },
    ]},
  { id: "l3", name: "Robert Kim", email: "r.kim@email.com", phone: "(555) 667-3345", magnet: "lm3", status: "hot", assignedAgent: "a3", score: 88, notes: "Looking for multi-family investment. Has $200K liquid for down payment.", aiSummary: "Serious investor. Cash ready. Wants 4+ unit property. ROI-focused.", lastContact: "1 hour ago", responseTime: "< 10 min", messages: 12, created: "Mar 20, 2026", timeline: [
      { date: "Mar 20", event: "Lead captured from Investment Property Calculator", type: "system" },
      { date: "Mar 20", event: "AI Bot: Sent personalized investment follow-up", type: "ai" },
      { date: "Mar 20", event: "Lead replied: Looking for 4-plex, has $200K ready", type: "lead" },
      { date: "Mar 20", event: "AI Bot: Categorized as HOT LEAD", type: "ai" },
      { date: "Mar 20", event: "Assigned to David Park", type: "system" },
      { date: "Mar 21", event: "Agent sent 3 property options via Outlook", type: "agent" },
      { date: "Mar 23", event: "Property tour scheduled for 2 units", type: "agent" },
      { date: "Mar 25", event: "Lead interested in 412 Oak St — running numbers", type: "lead" },
      { date: "Mar 26", event: "Agent sent detailed ROI analysis", type: "agent" },
    ]},
  { id: "l4", name: "Amanda Foster", email: "a.foster@email.com", phone: "(555) 889-1122", magnet: "lm4", status: "nurture", assignedAgent: null, score: 45, notes: "Requested neighborhood report for Riverside area. Not ready to buy yet.", aiSummary: "Exploratory stage. 6-12 month timeline. Enrolled in nurture sequence.", lastContact: "3 days ago", responseTime: "~24 hrs", messages: 2, created: "Mar 18, 2026", timeline: [
      { date: "Mar 18", event: "Lead captured from Neighborhood Market Report", type: "system" },
      { date: "Mar 18", event: "AI Bot: Sent follow-up with additional market data", type: "ai" },
      { date: "Mar 19", event: "Lead replied: Just researching, probably 6-12 months out", type: "lead" },
      { date: "Mar 19", event: "AI Bot: Categorized as NURTURE — enrolled in buyer nurture campaign", type: "ai" },
    ]},
  { id: "l5", name: "Chris Davidson", email: "c.davidson@email.com", phone: "(555) 334-5567", magnet: "lm5", status: "drip", assignedAgent: null, score: 35, notes: "Downloaded mortgage checklist. No response to follow-up.", aiSummary: "Non-responsive after initial download. Placed on drip campaign.", lastContact: "5 days ago", responseTime: "No response", messages: 0, created: "Mar 15, 2026", timeline: [
      { date: "Mar 15", event: "Lead captured from Mortgage Pre-Approval Checklist", type: "system" },
      { date: "Mar 15", event: "AI Bot: Initial follow-up email sent", type: "ai" },
      { date: "Mar 17", event: "AI Bot: Second follow-up sent — no response", type: "ai" },
      { date: "Mar 19", event: "AI Bot: Categorized as DRIP — enrolled in re-engagement campaign", type: "ai" },
    ]},
  { id: "l6", name: "Patricia Williams", email: "p.williams@email.com", phone: "(555) 778-9034", magnet: "lm6", status: "under_contract", assignedAgent: "a4", score: 95, notes: "Relocating from Chicago. Found home in Maple Heights. Under contract.", aiSummary: "Under contract. Closing scheduled Apr 15. Agent monitoring milestones.", lastContact: "6 hours ago", responseTime: "< 15 min", messages: 24, created: "Mar 5, 2026", timeline: [
      { date: "Mar 5", event: "Lead captured from Relocation Guide", type: "system" },
      { date: "Mar 5", event: "AI Bot: Sent relocation-specific follow-up", type: "ai" },
      { date: "Mar 5", event: "Lead replied: Moving from Chicago in April, need home ASAP", type: "lead" },
      { date: "Mar 5", event: "AI Bot: Categorized as HOT LEAD", type: "ai" },
      { date: "Mar 5", event: "Assigned to Lisa Rodriguez", type: "system" },
      { date: "Mar 7", event: "Virtual tours of 5 properties conducted", type: "agent" },
      { date: "Mar 10", event: "Offer submitted on 892 Maple Heights Dr", type: "agent" },
      { date: "Mar 12", event: "Offer accepted — under contract!", type: "system" },
      { date: "Mar 15", event: "Inspection completed — clear", type: "agent" },
      { date: "Mar 20", event: "Appraisal ordered", type: "agent" },
      { date: "Mar 25", event: "Appraisal came back at value", type: "system" },
    ]},
  { id: "l7", name: "Daniel Wright", email: "d.wright@email.com", phone: "(555) 223-4456", magnet: "lm1", status: "cold", assignedAgent: null, score: 15, notes: "Was hot lead with Sarah. Stopped responding after 2 weeks. Returned to system.", aiSummary: "Previously hot. Agent returned lead after no response. Re-entered nurture.", lastContact: "12 days ago", responseTime: "No response", messages: 6, created: "Mar 1, 2026", timeline: [
      { date: "Mar 1", event: "Lead captured from Free Home Valuation", type: "system" },
      { date: "Mar 1", event: "AI Bot: Categorized as HOT LEAD after strong initial response", type: "ai" },
      { date: "Mar 1", event: "Assigned to Sarah Chen", type: "system" },
      { date: "Mar 3", event: "Agent sent CMA and market analysis", type: "agent" },
      { date: "Mar 5", event: "Lead replied: Reviewing with spouse", type: "lead" },
      { date: "Mar 8", event: "Agent followed up — no response", type: "agent" },
      { date: "Mar 12", event: "Agent followed up again — no response", type: "agent" },
      { date: "Mar 15", event: "Agent returned lead — marked as COLD", type: "system" },
      { date: "Mar 15", event: "AI Bot: Re-categorized to re-engagement drip campaign", type: "ai" },
    ]},
  { id: "l8", name: "Sophia Nguyen", email: "s.nguyen@email.com", phone: "(555) 556-7789", magnet: "lm2", status: "new", assignedAgent: null, score: 50, notes: "Just downloaded buyer guide. Awaiting AI bot initial outreach.", aiSummary: "New lead. AI Bot queued for initial contact.", lastContact: "Just now", responseTime: "—", messages: 0, created: "Mar 27, 2026", timeline: [
      { date: "Mar 27", event: "Lead captured from First-Time Buyer Guide", type: "system" },
      { date: "Mar 27", event: "AI Bot: Initial outreach queued...", type: "ai" },
    ]},
];

// ─── Helper Components ───────────────────────────────────────────────
const Badge = ({ status }) => {
  const config = STATUS_CONFIG[status];
  if (!config) return null;
  return (
    <span style={{ background: config.bg, color: config.color, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4, border: `1px solid ${config.color}22` }}>
      {config.label}
    </span>
  );
};

const Avatar = ({ text, size = 36, color = "#6366F1" }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: `${color}18`, color: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.36, fontWeight: 700, flexShrink: 0 }}>{text}</div>
);

const StatCard = ({ icon: Icon, label, value, sub, color = "#6366F1", trend }) => (
  <div style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", border: "1px solid #E5E7EB", flex: 1, minWidth: 180 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={20} color={color} />
      </div>
      {trend && <span style={{ fontSize: 12, color: trend > 0 ? "#10B981" : "#EF4444", fontWeight: 600 }}>{trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%</span>}
    </div>
    <div style={{ marginTop: 14, fontSize: 28, fontWeight: 800, color: "#111827" }}>{value}</div>
    <div style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>{label}</div>
    {sub && <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>{sub}</div>}
  </div>
);

const TimelineEvent = ({ event }) => {
  const colors = { system: "#6366F1", ai: "#8B5CF6", lead: "#10B981", agent: "#F59E0B" };
  const labels = { system: "System", ai: "AI Bot", lead: "Lead", agent: "Agent" };
  return (
    <div style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: "1px solid #F3F4F6" }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: colors[event.type], marginTop: 6, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, color: "#374151" }}>{event.event}</div>
        <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2, display: "flex", gap: 8 }}>
          <span>{event.date}</span>
          <span style={{ color: colors[event.type], fontWeight: 600 }}>{labels[event.type]}</span>
        </div>
      </div>
    </div>
  );
};

// ─── Main App ────────────────────────────────────────────────────────
export default function LeadManagementPlatform() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [leads, setLeads] = useState(generateLeads);
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [simulatingBot, setSimulatingBot] = useState(false);

  const filteredLeads = leads.filter(l => {
    const matchesStatus = filterStatus === "all" || l.status === filterStatus;
    const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusCounts = leads.reduce((acc, l) => { acc[l.status] = (acc[l.status] || 0) + 1; return acc; }, {});

  const simulateAIBot = (leadId) => {
    setSimulatingBot(true);
    setTimeout(() => {
      setLeads(prev => prev.map(l => {
        if (l.id === leadId && l.status === "new") {
          return { ...l, status: "qualifying", timeline: [...l.timeline, { date: "Mar 27", event: "AI Bot: Personalized qualification email sent via Outlook", type: "ai" }], lastContact: "Just now" };
        }
        if (l.id === leadId && l.status === "qualifying") {
          return { ...l, status: "hot", score: 85, assignedAgent: "a2", timeline: [...l.timeline, { date: "Mar 27", event: "Lead responded with high intent — AI Bot categorized as HOT LEAD", type: "ai" }, { date: "Mar 27", event: "Auto-assigned to Sarah Chen", type: "system" }], aiSummary: "Lead expressed urgency. Pre-approved. Looking to buy within 30 days.", lastContact: "Just now" };
        }
        return l;
      }));
      setSimulatingBot(false);
    }, 1500);
  };

  const returnLeadToCold = (leadId) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return { ...l, status: "cold", assignedAgent: null, timeline: [...l.timeline, { date: "Mar 27", event: "Agent returned lead — no response. Re-entering nurture pipeline.", type: "system" }, { date: "Mar 27", event: "AI Bot: Enrolled in re-engagement drip campaign", type: "ai" }] };
      }
      return l;
    }));
  };

  // ─── Sidebar ─────────────────────────────────────────────────────
  const Sidebar = () => {
    const navItems = [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "leads", label: "All Leads", icon: Users },
      { id: "pipeline", label: "AI Pipeline", icon: Bot },
      { id: "agents", label: "Agent Tracking", icon: UserCheck },
      { id: "campaigns", label: "Drip Campaigns", icon: Mail },
      { id: "magnets", label: "Lead Magnets", icon: Target },
    ];
    return (
      <div style={{ width: 240, background: "#0F172A", color: "#fff", display: "flex", flexDirection: "column", height: "100vh", flexShrink: 0 }}>
        <div style={{ padding: "24px 20px", borderBottom: "1px solid #1E293B" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #6366F1, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Home size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15 }}>RealtyFlow AI</div>
              <div style={{ fontSize: 10, color: "#94A3B8", letterSpacing: 1 }}>LEAD MANAGEMENT</div>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, padding: "16px 12px" }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const active = currentView === item.id;
            return (
              <button key={item.id} onClick={() => { setCurrentView(item.id); setSelectedLead(null); setSelectedAgent(null); }}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 10, border: "none", cursor: "pointer", marginBottom: 4,
                  background: active ? "#6366F1" : "transparent", color: active ? "#fff" : "#94A3B8", fontSize: 13, fontWeight: active ? 600 : 400, transition: "all .15s" }}>
                <Icon size={18} /> {item.label}
              </button>
            );
          })}
        </div>
        <div style={{ padding: "16px 12px", borderTop: "1px solid #1E293B" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px" }}>
            <Avatar text="SB" size={32} color="#6366F1" />
            <div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>Seth Bass</div>
              <div style={{ fontSize: 10, color: "#94A3B8" }}>Admin</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ─── Top Bar ─────────────────────────────────────────────────────
  const TopBar = ({ title, subtitle }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 32px", background: "#fff", borderBottom: "1px solid #E5E7EB" }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: 0 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 13, color: "#6B7280", margin: "4px 0 0" }}>{subtitle}</p>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ position: "relative", display: "flex", alignItems: "center", background: "#F3F4F6", borderRadius: 10, padding: "8px 14px", gap: 8 }}>
          <Search size={16} color="#9CA3AF" />
          <input placeholder="Search leads..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            style={{ border: "none", background: "none", outline: "none", fontSize: 13, width: 180, color: "#374151" }} />
        </div>
        <button onClick={() => setShowAIPanel(!showAIPanel)}
          style={{ width: 38, height: 38, borderRadius: 10, border: "1px solid #E5E7EB", background: showAIPanel ? "#6366F1" : "#fff", color: showAIPanel ? "#fff" : "#6B7280", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Bot size={18} />
        </button>
        <div style={{ position: "relative" }}>
          <button style={{ width: 38, height: 38, borderRadius: 10, border: "1px solid #E5E7EB", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Bell size={18} color="#6B7280" />
          </button>
          {notifications > 0 && <span style={{ position: "absolute", top: -4, right: -4, width: 18, height: 18, borderRadius: "50%", background: "#EF4444", color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{notifications}</span>}
        </div>
      </div>
    </div>
  );

  // ─── Dashboard View ──────────────────────────────────────────────
  const DashboardView = () => {
    const pieData = Object.entries(statusCounts).map(([key, val]) => ({ name: STATUS_CONFIG[key]?.label || key, value: val, color: STATUS_CONFIG[key]?.color || "#999" }));
    const weeklyData = [
      { day: "Mon", leads: 12, qualified: 4, hot: 2 }, { day: "Tue", leads: 18, qualified: 7, hot: 3 },
      { day: "Wed", leads: 15, qualified: 5, hot: 2 }, { day: "Thu", leads: 22, qualified: 9, hot: 5 },
      { day: "Fri", leads: 20, qualified: 8, hot: 4 }, { day: "Sat", leads: 8, qualified: 3, hot: 1 },
      { day: "Sun", leads: 5, qualified: 2, hot: 1 },
    ];
    const conversionData = [
      { week: "W1", rate: 12 }, { week: "W2", rate: 15 }, { week: "W3", rate: 18 }, { week: "W4", rate: 22 },
    ];
    return (
      <div style={{ padding: 32 }}>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
          <StatCard icon={Users} label="Total Active Leads" value={leads.length} sub="Across all magnets" color="#6366F1" trend={12} />
          <StatCard icon={Zap} label="Hot Leads" value={statusCounts.hot || 0} sub="Assigned to agents" color="#EF4444" trend={8} />
          <StatCard icon={Bot} label="AI Qualifying" value={(statusCounts.new || 0) + (statusCounts.qualifying || 0)} sub="In AI pipeline" color="#8B5CF6" trend={15} />
          <StatCard icon={DollarSign} label="Under Contract" value={statusCounts.under_contract || 0} sub="Pending close" color="#10B981" trend={25} />
          <StatCard icon={Activity} label="Avg Response Time" value="4.2m" sub="AI Bot first touch" color="#F59E0B" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 28 }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: 24, border: "1px solid #E5E7EB" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 18px", color: "#111827" }}>Weekly Lead Flow</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="leads" fill="#E5E7EB" radius={[4, 4, 0, 0]} name="Total Leads" />
                <Bar dataKey="qualified" fill="#6366F1" radius={[4, 4, 0, 0]} name="AI Qualified" />
                <Bar dataKey="hot" fill="#EF4444" radius={[4, 4, 0, 0]} name="Hot Leads" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ background: "#fff", borderRadius: 14, padding: 24, border: "1px solid #E5E7EB" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 18px", color: "#111827" }}>Lead Distribution</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={80} innerRadius={50} paddingAngle={3}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: 24, border: "1px solid #E5E7EB" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 16px", color: "#111827" }}>AI Bot Activity (Live)</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { text: "Sent qualification email to Sophia Nguyen", time: "Just now", type: "ai" },
                { text: "Categorized Michael Thompson — awaiting response", time: "4h ago", type: "ai" },
                { text: "Enrolled Chris Davidson in drip campaign", time: "2d ago", type: "ai" },
                { text: "Re-engagement email sent to Daniel Wright", time: "3d ago", type: "ai" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "10px 12px", background: "#F9FAFB", borderRadius: 10, alignItems: "center" }}>
                  <Bot size={16} color="#8B5CF6" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: "#374151" }}>{item.text}</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF" }}>{item.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: "#fff", borderRadius: 14, padding: 24, border: "1px solid #E5E7EB" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 16px", color: "#111827" }}>Top Performing Agents</h3>
            {AGENTS.slice(0, 4).map(agent => (
              <div key={agent.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #F3F4F6", cursor: "pointer" }}
                onClick={() => { setSelectedAgent(agent.id); setCurrentView("agents"); }}>
                <Avatar text={agent.avatar} size={34} color="#6366F1" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{agent.name}</div>
                  <div style={{ fontSize: 11, color: "#9CA3AF" }}>{agent.specialty}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#10B981" }}>{agent.closedThisMonth} closed</div>
                  <div style={{ fontSize: 11, color: "#9CA3AF" }}>{agent.activeLeads} active</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ─── Leads View ──────────────────────────────────────────────────
  const LeadsView = () => (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {["all", "new", "qualifying", "hot", "nurture", "drip", "under_contract", "cold"].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            style={{ padding: "7px 16px", borderRadius: 20, border: "1px solid #E5E7EB", fontSize: 12, fontWeight: 600, cursor: "pointer",
              background: filterStatus === s ? (s === "all" ? "#6366F1" : STATUS_CONFIG[s]?.color || "#6366F1") : "#fff",
              color: filterStatus === s ? "#fff" : "#6B7280" }}>
            {s === "all" ? "All Leads" : STATUS_CONFIG[s]?.label} {s !== "all" && `(${statusCounts[s] || 0})`}
          </button>
        ))}
      </div>
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E5E7EB", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB" }}>
              {["Lead", "Source Magnet", "Status", "Score", "Assigned To", "Last Contact", ""].map(h => (
                <th key={h} style={{ padding: "12px 16px", fontSize: 11, fontWeight: 600, color: "#6B7280", textAlign: "left", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map(lead => {
              const magnet = LEAD_MAGNETS.find(m => m.id === lead.magnet);
              const agent = AGENTS.find(a => a.id === lead.assignedAgent);
              return (
                <tr key={lead.id} style={{ borderTop: "1px solid #F3F4F6", cursor: "pointer", transition: "background .1s" }}
                  onClick={() => setSelectedLead(lead.id)}
                  onMouseOver={e => e.currentTarget.style.background = "#F9FAFB"} onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Avatar text={lead.name.split(" ").map(n => n[0]).join("")} size={34} color={STATUS_CONFIG[lead.status]?.color} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{lead.name}</div>
                        <div style={{ fontSize: 11, color: "#9CA3AF" }}>{lead.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 6, background: `${magnet?.color}14`, color: magnet?.color, fontWeight: 500 }}>{magnet?.name}</span>
                  </td>
                  <td style={{ padding: "14px 16px" }}><Badge status={lead.status} /></td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 50, height: 6, borderRadius: 3, background: "#E5E7EB", overflow: "hidden" }}>
                        <div style={{ width: `${lead.score}%`, height: "100%", borderRadius: 3, background: lead.score >= 80 ? "#EF4444" : lead.score >= 50 ? "#F59E0B" : "#6B7280" }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{lead.score}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: agent ? "#374151" : "#9CA3AF" }}>{agent ? agent.name : "AI Bot"}</td>
                  <td style={{ padding: "14px 16px", fontSize: 12, color: "#6B7280" }}>{lead.lastContact}</td>
                  <td style={{ padding: "14px 16px" }}><ChevronRight size={16} color="#9CA3AF" /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ─── Lead Detail View ────────────────────────────────────────────
  const LeadDetailView = () => {
    const lead = leads.find(l => l.id === selectedLead);
    if (!lead) return null;
    const magnet = LEAD_MAGNETS.find(m => m.id === lead.magnet);
    const agent = AGENTS.find(a => a.id === lead.assignedAgent);
    return (
      <div style={{ padding: 32 }}>
        <button onClick={() => setSelectedLead(null)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#6366F1", fontSize: 13, fontWeight: 600, marginBottom: 20, padding: 0 }}>
          <ArrowLeft size={16} /> Back to leads
        </button>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24 }}>
          <div>
            {/* Lead Header */}
            <div style={{ background: "#fff", borderRadius: 14, padding: 24, border: "1px solid #E5E7EB", marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <Avatar text={lead.name.split(" ").map(n => n[0]).join("")} size={52} color={STATUS_CONFIG[lead.status]?.color} />
                  <div>
                    <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#111827" }}>{lead.name}</h2>
                    <div style={{ display: "flex", gap: 16, marginTop: 6, fontSize: 13, color: "#6B7280" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Mail size={14} /> {lead.email}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Phone size={14} /> {lead.phone}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Badge status={lead.status} />
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: lead.score >= 80 ? "#EF4444" : lead.score >= 50 ? "#F59E0B" : "#6B7280" }}>{lead.score}</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, marginTop: 20, padding: "16px 0 0", borderTop: "1px solid #F3F4F6" }}>
                <div><div style={{ fontSize: 11, color: "#9CA3AF", textTransform: "uppercase" }}>Source</div><div style={{ fontSize: 13, fontWeight: 600, marginTop: 4, color: magnet?.color }}>{magnet?.name}</div></div>
                <div><div style={{ fontSize: 11, color: "#9CA3AF", textTransform: "uppercase" }}>Created</div><div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{lead.created}</div></div>
                <div><div style={{ fontSize: 11, color: "#9CA3AF", textTransform: "uppercase" }}>Response Time</div><div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{lead.responseTime}</div></div>
                <div><div style={{ fontSize: 11, color: "#9CA3AF", textTransform: "uppercase" }}>Messages</div><div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{lead.messages}</div></div>
              </div>
            </div>

            {/* AI Summary */}
            <div style={{ background: "linear-gradient(135deg, #6366F112, #8B5CF612)", borderRadius: 14, padding: 20, border: "1px solid #6366F122", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <Bot size={18} color="#6366F1" />
                <span style={{ fontSize: 14, fontWeight: 700, color: "#6366F1" }}>AI Bot Assessment</span>
              </div>
              <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.6 }}>{lead.aiSummary}</p>
              {lead.notes && <p style={{ fontSize: 12, color: "#6B7280", margin: "10px 0 0", fontStyle: "italic" }}>Notes: {lead.notes}</p>}
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              {(lead.status === "new" || lead.status === "qualifying") && (
                <button onClick={() => simulateAIBot(lead.id)} disabled={simulatingBot}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 10, border: "none", background: "#6366F1", color: "#fff", fontWeight: 600, fontSize: 13, cursor: simulatingBot ? "wait" : "pointer", opacity: simulatingBot ? 0.7 : 1 }}>
                  {simulatingBot ? <RefreshCw size={16} className="animate-spin" /> : <Bot size={16} />}
                  {simulatingBot ? "AI Bot Processing..." : lead.status === "new" ? "Trigger AI Outreach" : "Simulate Lead Response"}
                </button>
              )}
              {lead.status === "hot" && lead.assignedAgent && (
                <button onClick={() => returnLeadToCold(lead.id)}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 10, border: "1px solid #EF4444", background: "#FEF2F2", color: "#EF4444", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                  <UserX size={16} /> Return Lead (Gone Cold)
                </button>
              )}
            </div>

            {/* Timeline */}
            <div style={{ background: "#fff", borderRadius: 14, padding: 24, border: "1px solid #E5E7EB" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 16px", color: "#111827" }}>Activity Timeline</h3>
              {lead.timeline.map((event, i) => <TimelineEvent key={i} event={event} />)}
            </div>
          </div>

          {/* Sidebar Info */}
          <div>
            {agent && (
              <div style={{ background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #E5E7EB", marginBottom: 16 }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: "0 0 14px" }}>Assigned Agent</h4>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <Avatar text={agent.avatar} size={42} color="#6366F1" />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{agent.name}</div>
                    <div style={{ fontSize: 12, color: "#6B7280" }}>{agent.specialty}</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF" }}>{agent.email}</div>
                  </div>
                </div>
                <div style={{ marginTop: 14, padding: "12px 0 0", borderTop: "1px solid #F3F4F6" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#6B7280", marginBottom: 6 }}>
                    <Mail size={14} /> Outlook tracking: <span style={{ color: "#10B981", fontWeight: 600 }}>Active</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#6B7280" }}>
                    <Clock size={14} /> Avg response: <span style={{ fontWeight: 600, color: "#374151" }}>23 min</span>
                  </div>
                </div>
              </div>
            )}
            <div style={{ background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #E5E7EB", marginBottom: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: "0 0 14px" }}>Outlook Email Tracking</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {lead.messages > 0 ? (
                  <>
                    <div style={{ padding: "10px 12px", background: "#F9FAFB", borderRadius: 8 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Last email opened</div>
                      <div style={{ fontSize: 11, color: "#9CA3AF" }}>{lead.lastContact}</div>
                    </div>
                    <div style={{ padding: "10px 12px", background: "#F9FAFB", borderRadius: 8 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Total thread messages</div>
                      <div style={{ fontSize: 11, color: "#9CA3AF" }}>{lead.messages} emails tracked</div>
                    </div>
                    <div style={{ padding: "10px 12px", background: "#ECFDF5", borderRadius: 8 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#059669" }}>Outlook sync status</div>
                      <div style={{ fontSize: 11, color: "#6B7280" }}>Connected &amp; monitoring</div>
                    </div>
                  </>
                ) : (
                  <div style={{ padding: "10px 12px", background: "#F9FAFB", borderRadius: 8, fontSize: 12, color: "#9CA3AF" }}>No email activity yet</div>
                )}
              </div>
            </div>
            <div style={{ background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #E5E7EB" }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: "0 0 14px" }}>Lead Score Breakdown</h4>
              {[
                { label: "Engagement", val: Math.min(100, lead.score + 5) },
                { label: "Response Speed", val: lead.responseTime?.includes("No") ? 10 : lead.score },
                { label: "Intent Signal", val: lead.score },
                { label: "Timeline Urgency", val: lead.score >= 80 ? 90 : lead.score >= 50 ? 55 : 25 },
              ].map((item, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: "#6B7280" }}>{item.label}</span>
                    <span style={{ fontWeight: 600, color: "#374151" }}>{item.val}%</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: "#E5E7EB" }}>
                    <div style={{ width: `${item.val}%`, height: "100%", borderRadius: 3, background: item.val >= 80 ? "#EF4444" : item.val >= 50 ? "#F59E0B" : "#6B7280", transition: "width .3s" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ─── Pipeline View ───────────────────────────────────────────────
  const PipelineView = () => {
    const stages = [
      { key: "new", label: "New Leads", desc: "Awaiting AI Bot outreach" },
      { key: "qualifying", label: "AI Qualifying", desc: "Bot gathering info" },
      { key: "hot", label: "Hot Leads", desc: "Assigned to agents" },
      { key: "nurture", label: "Nurture", desc: "Long-term engagement" },
      { key: "drip", label: "Drip Campaign", desc: "Automated sequences" },
      { key: "under_contract", label: "Under Contract", desc: "Pending close" },
    ];
    return (
      <div style={{ padding: 32 }}>
        <div style={{ background: "linear-gradient(135deg, #6366F108, #8B5CF608)", borderRadius: 14, padding: 20, border: "1px solid #6366F118", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <Bot size={22} color="#6366F1" />
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#111827" }}>AI Pipeline — How It Works</h3>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            {["Lead Captured", "AI Outreach", "Response Analysis", "Auto-Categorize", "Route to Action"].map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ background: "#6366F1", color: "#fff", width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{i + 1}</span>
                <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{step}</span>
                {i < 4 && <ArrowRight size={14} color="#9CA3AF" />}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {stages.map(stage => {
            const stageLeads = leads.filter(l => l.status === stage.key);
            const config = STATUS_CONFIG[stage.key];
            return (
              <div key={stage.key} style={{ background: "#fff", borderRadius: 14, border: "1px solid #E5E7EB", overflow: "hidden" }}>
                <div style={{ padding: "14px 18px", borderBottom: `3px solid ${config.color}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{stage.label}</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF" }}>{stage.desc}</div>
                  </div>
                  <span style={{ background: config.bg, color: config.color, width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800 }}>{stageLeads.length}</span>
                </div>
                <div style={{ padding: 12, maxHeight: 340, overflowY: "auto" }}>
                  {stageLeads.length === 0 && <div style={{ padding: 20, textAlign: "center", color: "#9CA3AF", fontSize: 12 }}>No leads</div>}
                  {stageLeads.map(lead => (
                    <div key={lead.id} onClick={() => { setSelectedLead(lead.id); setCurrentView("leads"); }}
                      style={{ padding: "12px 14px", borderRadius: 10, border: "1px solid #F3F4F6", marginBottom: 8, cursor: "pointer", transition: "all .15s" }}
                      onMouseOver={e => e.currentTarget.style.borderColor = config.color} onMouseOut={e => e.currentTarget.style.borderColor = "#F3F4F6"}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{lead.name}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: config.color }}>{lead.score}</span>
                      </div>
                      <div style={{ fontSize: 11, color: "#9CA3AF" }}>{lead.lastContact}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ─── Agents View ─────────────────────────────────────────────────
  const AgentsView = () => {
    const agentDetail = selectedAgent ? AGENTS.find(a => a.id === selectedAgent) : null;
    const agentLeads = selectedAgent ? leads.filter(l => l.assignedAgent === selectedAgent) : [];
    if (agentDetail) {
      return (
        <div style={{ padding: 32 }}>
          <button onClick={() => setSelectedAgent(null)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#6366F1", fontSize: 13, fontWeight: 600, marginBottom: 20, padding: 0 }}>
            <ArrowLeft size={16} /> All agents
          </button>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>
            <div>
              <div style={{ background: "#fff", borderRadius: 14, padding: 24, border: "1px solid #E5E7EB", marginBottom: 20 }}>
                <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 20 }}>
                  <Avatar text={agentDetail.avatar} size={56} color="#6366F1" />
                  <div>
                    <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#111827" }}>{agentDetail.name}</h2>
                    <div style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>{agentDetail.specialty} Specialist</div>
                    <div style={{ fontSize: 12, color: "#9CA3AF" }}>{agentDetail.email}</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
                  <div style={{ background: "#F9FAFB", borderRadius: 10, padding: 14, textAlign: "center" }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#6366F1" }}>{agentDetail.activeLeads}</div>
                    <div style={{ fontSize: 11, color: "#6B7280" }}>Active Leads</div>
                  </div>
                  <div style={{ background: "#ECFDF5", borderRadius: 10, padding: 14, textAlign: "center" }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#10B981" }}>{agentDetail.closedThisMonth}</div>
                    <div style={{ fontSize: 11, color: "#6B7280" }}>Closed (Month)</div>
                  </div>
                  <div style={{ background: "#FEF2F2", borderRadius: 10, padding: 14, textAlign: "center" }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#EF4444" }}>23 min</div>
                    <div style={{ fontSize: 11, color: "#6B7280" }}>Avg Response</div>
                  </div>
                  <div style={{ background: "#FFFBEB", borderRadius: 10, padding: 14, textAlign: "center" }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#F59E0B" }}>94%</div>
                    <div style={{ fontSize: 11, color: "#6B7280" }}>Follow-up Rate</div>
                  </div>
                </div>
              </div>
              <div style={{ background: "#fff", borderRadius: 14, padding: 24, border: "1px solid #E5E7EB" }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 16px", color: "#111827" }}>Assigned Leads ({agentLeads.length})</h3>
                {agentLeads.length === 0 && <p style={{ color: "#9CA3AF", fontSize: 13 }}>No leads currently assigned</p>}
                {agentLeads.map(lead => (
                  <div key={lead.id} onClick={() => { setSelectedLead(lead.id); setCurrentView("leads"); }}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0", borderBottom: "1px solid #F3F4F6", cursor: "pointer" }}>
                    <Avatar text={lead.name.split(" ").map(n => n[0]).join("")} size={34} color={STATUS_CONFIG[lead.status]?.color} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{lead.name}</div>
                      <div style={{ fontSize: 11, color: "#9CA3AF" }}>{lead.notes?.substring(0, 60)}...</div>
                    </div>
                    <Badge status={lead.status} />
                    <div style={{ fontSize: 12, color: "#6B7280" }}>{lead.lastContact}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #E5E7EB", marginBottom: 16 }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 14px" }}>Outlook Monitoring</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ padding: "10px 12px", background: "#ECFDF5", borderRadius: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#059669" }}>Outlook Connected</div>
                    <div style={{ fontSize: 11, color: "#6B7280" }}>{agentDetail.email}</div>
                  </div>
                  <div style={{ padding: "10px 12px", background: "#F9FAFB", borderRadius: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>Emails sent today</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#6366F1" }}>14</div>
                  </div>
                  <div style={{ padding: "10px 12px", background: "#F9FAFB", borderRadius: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>Emails received today</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#10B981" }}>9</div>
                  </div>
                  <div style={{ padding: "10px 12px", background: "#F9FAFB", borderRadius: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>Pending responses</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#F59E0B" }}>3</div>
                  </div>
                </div>
              </div>
              <div style={{ background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #E5E7EB" }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 14px" }}>Accountability Metrics</h4>
                {[
                  { label: "Lead response within 5 min", val: 78 },
                  { label: "Follow-up compliance", val: 94 },
                  { label: "CRM notes updated", val: 88 },
                  { label: "Client satisfaction", val: 96 },
                ].map((m, i) => (
                  <div key={i} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                      <span style={{ color: "#6B7280" }}>{m.label}</span>
                      <span style={{ fontWeight: 600, color: m.val >= 90 ? "#10B981" : m.val >= 70 ? "#F59E0B" : "#EF4444" }}>{m.val}%</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 3, background: "#E5E7EB" }}>
                      <div style={{ width: `${m.val}%`, height: "100%", borderRadius: 3, background: m.val >= 90 ? "#10B981" : m.val >= 70 ? "#F59E0B" : "#EF4444" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div style={{ padding: 32 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
          {AGENTS.map(agent => {
            const aLeads = leads.filter(l => l.assignedAgent === agent.id);
            return (
              <div key={agent.id} onClick={() => setSelectedAgent(agent.id)}
                style={{ background: "#fff", borderRadius: 14, padding: 22, border: "1px solid #E5E7EB", cursor: "pointer", transition: "all .15s" }}
                onMouseOver={e => e.currentTarget.style.borderColor = "#6366F1"} onMouseOut={e => e.currentTarget.style.borderColor = "#E5E7EB"}>
                <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 16 }}>
                  <Avatar text={agent.avatar} size={46} color="#6366F1" />
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{agent.name}</div>
                    <div style={{ fontSize: 12, color: "#6B7280" }}>{agent.specialty}</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                  <div style={{ textAlign: "center", padding: "10px 0", background: "#F9FAFB", borderRadius: 8 }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#6366F1" }}>{aLeads.length}</div>
                    <div style={{ fontSize: 10, color: "#9CA3AF" }}>Active</div>
                  </div>
                  <div style={{ textAlign: "center", padding: "10px 0", background: "#ECFDF5", borderRadius: 8 }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#10B981" }}>{agent.closedThisMonth}</div>
                    <div style={{ fontSize: 10, color: "#9CA3AF" }}>Closed</div>
                  </div>
                  <div style={{ textAlign: "center", padding: "10px 0", background: "#FEF2F2", borderRadius: 8 }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#EF4444" }}>{aLeads.filter(l => l.status === "hot").length}</div>
                    <div style={{ fontSize: 10, color: "#9CA3AF" }}>Hot</div>
                  </div>
                </div>
                <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#10B981" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} /> Outlook connected
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ─── Campaigns View ──────────────────────────────────────────────
  const CampaignsView = () => (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <StatCard icon={Mail} label="Active Campaigns" value={DRIP_CAMPAIGNS.length} color="#3B82F6" />
        <StatCard icon={Users} label="Total Enrolled" value={DRIP_CAMPAIGNS.reduce((s, c) => s + c.enrolled, 0)} color="#8B5CF6" />
        <StatCard icon={Eye} label="Avg Open Rate" value="40%" color="#10B981" trend={5} />
        <StatCard icon={Target} label="Avg Click Rate" value="17%" color="#F59E0B" trend={3} />
      </div>
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E5E7EB", overflow: "hidden" }}>
        <div style={{ padding: "18px 22px", borderBottom: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>AI-Generated Drip Campaigns</h3>
          <span style={{ fontSize: 12, color: "#6B7280", background: "#F3F4F6", padding: "4px 12px", borderRadius: 6 }}>Auto-generated by AI Bot</span>
        </div>
        {DRIP_CAMPAIGNS.map((campaign, i) => (
          <div key={campaign.id} style={{ padding: "18px 22px", borderBottom: i < DRIP_CAMPAIGNS.length - 1 ? "1px solid #F3F4F6" : "none", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: "#6366F112", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Mail size={20} color="#6366F1" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{campaign.name}</div>
              <div style={{ display: "flex", gap: 14, marginTop: 4, fontSize: 12, color: "#6B7280" }}>
                <span>{campaign.emails} emails</span>
                <span>{campaign.duration}</span>
                <span style={{ color: "#6366F1", fontWeight: 500 }}>{campaign.type}</span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, textAlign: "center" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#10B981" }}>{campaign.openRate}</div>
                <div style={{ fontSize: 10, color: "#9CA3AF" }}>Open Rate</div>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#F59E0B" }}>{campaign.clickRate}</div>
                <div style={{ fontSize: 10, color: "#9CA3AF" }}>Click Rate</div>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#6366F1" }}>{campaign.enrolled}</div>
                <div style={{ fontSize: 10, color: "#9CA3AF" }}>Enrolled</div>
              </div>
            </div>
            <div style={{ padding: "4px 12px", borderRadius: 20, background: "#ECFDF5", color: "#059669", fontSize: 11, fontWeight: 600 }}>Active</div>
          </div>
        ))}
      </div>
    </div>
  );

  // ─── Magnets View ────────────────────────────────────────────────
  const MagnetsView = () => (
    <div style={{ padding: 32 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16, marginBottom: 24 }}>
        {LEAD_MAGNETS.map(magnet => {
          const magnetLeads = leads.filter(l => l.magnet === magnet.id);
          const hotCount = magnetLeads.filter(l => l.status === "hot" || l.status === "under_contract").length;
          return (
            <div key={magnet.id} style={{ background: "#fff", borderRadius: 14, padding: 22, border: "1px solid #E5E7EB", borderTop: `3px solid ${magnet.color}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{magnet.name}</div>
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: `${magnet.color}14`, color: magnet.color, fontWeight: 600 }}>{magnet.category}</span>
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: magnet.color }}>{magnetLeads.length}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1, padding: "8px 0", textAlign: "center", background: "#F9FAFB", borderRadius: 8 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#EF4444" }}>{hotCount}</div>
                  <div style={{ fontSize: 10, color: "#9CA3AF" }}>Hot/Contract</div>
                </div>
                <div style={{ flex: 1, padding: "8px 0", textAlign: "center", background: "#F9FAFB", borderRadius: 8 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#6366F1" }}>{magnetLeads.length - hotCount}</div>
                  <div style={{ fontSize: 10, color: "#9CA3AF" }}>In Pipeline</div>
                </div>
              </div>
              <div style={{ marginTop: 12, fontSize: 12, color: "#6B7280" }}>
                <span style={{ fontWeight: 600 }}>API Endpoint:</span> /api/leads/{magnet.id}
              </div>
              <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>
                <span style={{ fontWeight: 600 }}>Form:</span> embed.realtyflow.ai/{magnet.id}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ background: "#fff", borderRadius: 14, padding: 24, border: "1px solid #E5E7EB" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 16px" }}>Integration Endpoints</h3>
        <div style={{ fontFamily: "monospace", fontSize: 13, background: "#0F172A", color: "#E2E8F0", padding: 20, borderRadius: 10, lineHeight: 1.8 }}>
          <div style={{ color: "#6B7280" }}>// Form Submission Webhook</div>
          <div>POST /api/v1/leads/ingest</div>
          <div style={{ color: "#94A3B8" }}>{"{"} "name", "email", "phone", "magnet_id", "notes", "source_url" {"}"}</div>
          <br />
          <div style={{ color: "#6B7280" }}>// API Integration</div>
          <div>POST /api/v1/leads/create</div>
          <div style={{ color: "#94A3B8" }}>Headers: Authorization: Bearer {"<"}API_KEY{">"}</div>
          <br />
          <div style={{ color: "#6B7280" }}>// Outlook Webhook (Microsoft Graph API)</div>
          <div>POST /api/v1/outlook/webhook</div>
          <div style={{ color: "#94A3B8" }}>Subscription: mail.read, mail.send notifications</div>
          <br />
          <div style={{ color: "#6B7280" }}>// Agent Assignment Callback</div>
          <div>POST /api/v1/agents/assign</div>
          <div style={{ color: "#94A3B8" }}>{"{"} "lead_id", "agent_id", "priority": "hot" {"}"}</div>
        </div>
      </div>
    </div>
  );

  // ─── AI Panel (floating) ─────────────────────────────────────────
  const AIPanel = () => (
    <div style={{ position: "fixed", right: 20, top: 80, width: 340, background: "#fff", borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,.15)", border: "1px solid #E5E7EB", zIndex: 100, overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", background: "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Bot size={20} />
            <span style={{ fontWeight: 700, fontSize: 14 }}>AI Bot Control Panel</span>
          </div>
          <button onClick={() => setShowAIPanel(false)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 18 }}>×</button>
        </div>
      </div>
      <div style={{ padding: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981" }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#10B981" }}>AI Bot Online — Processing Leads</span>
        </div>
        {[
          { label: "Leads in queue", value: "2", color: "#6366F1" },
          { label: "Outreach sent today", value: "14", color: "#8B5CF6" },
          { label: "Responses received", value: "8", color: "#10B981" },
          { label: "Auto-categorized", value: "6", color: "#F59E0B" },
          { label: "Hot leads routed", value: "3", color: "#EF4444" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #F3F4F6" }}>
            <span style={{ fontSize: 13, color: "#6B7280" }}>{item.label}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: item.color }}>{item.value}</span>
          </div>
        ))}
        <div style={{ marginTop: 16, padding: 14, background: "#F9FAFB", borderRadius: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Current AI Actions:</div>
          <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.6 }}>
            Qualifying Michael Thompson (Buyer)<br />
            Monitoring drip campaign engagement<br />
            Scanning for re-engagement signals
          </div>
        </div>
      </div>
    </div>
  );

  // ─── Render ──────────────────────────────────────────────────────
  const viewTitles = {
    dashboard: ["Dashboard", "Real-time overview of your lead management pipeline"],
    leads: ["All Leads", `${leads.length} leads across ${LEAD_MAGNETS.length} lead magnets`],
    pipeline: ["AI Pipeline", "Watch the AI Bot qualify and categorize leads in real-time"],
    agents: ["Agent Tracking", `${AGENTS.length} agents monitored via Outlook integration`],
    campaigns: ["Drip Campaigns", "AI-generated email sequences for each lead category"],
    magnets: ["Lead Magnets", "Intake sources with form & API integration endpoints"],
  };

  const renderView = () => {
    if (selectedLead && currentView === "leads") return <LeadDetailView />;
    switch (currentView) {
      case "dashboard": return <DashboardView />;
      case "leads": return <LeadsView />;
      case "pipeline": return <PipelineView />;
      case "agents": return <AgentsView />;
      case "campaigns": return <CampaignsView />;
      case "magnets": return <MagnetsView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "#F9FAFB" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <TopBar title={viewTitles[currentView]?.[0]} subtitle={viewTitles[currentView]?.[1]} />
        <div style={{ flex: 1, overflow: "auto" }}>
          {renderView()}
        </div>
      </div>
      {showAIPanel && <AIPanel />}
    </div>
  );
}