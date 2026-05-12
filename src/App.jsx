import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { supabase } from "./lib/supabase";
import Auth from "./Auth";
import {
  Home, Users, FileText, Map, Brain, Settings, Plus, ChevronRight, ChevronLeft,
  TrendingUp, Mail, Phone, Globe, Eye, Target, BarChart3, ExternalLink,
  Copy, Check, DollarSign, Award, MapPin, Sparkles, Menu, X,
  Calendar, Clock, MessageSquare, RefreshCw, Search, Tag, Bell, Activity, Inbox,
  Layers, GripVertical, ArrowUpDown, ChevronDown, CalendarPlus, Trash2, CheckCircle2,
  CalendarDays, Building2, BedDouble, Bath, AlertCircle, CheckCheck, ChevronUp,
  Filter as FilterIcon, Bookmark, Lightbulb, LogOut, Loader2
} from "lucide-react";

const C = {
  teal: "#5eead4", tealDark: "#2dd4bf",
  blue: "#818cf8", blueDark: "#6366f1",
  purple: "#a78bfa", purpleDark: "#8b5cf6",
  green: "#10b981", amber: "#f59e0b", red: "#ef4444",
  bg: "#0a0a14", bgCard: "#12121e", bgHover: "#1a1a2e",
  border: "#1e1e32", borderLight: "#2a2a44",
  text: "#f0f0f8", textMuted: "#8888a8", textDim: "#55557a",
};

// Icon registry for activity types
const ICONS = { Eye, FileText, Mail, Phone, MessageSquare, MapPin, Calendar, Activity, Tag };

// Format a timestamp as a relative "time ago" string (e.g., "2h ago")
function timeAgo(input) {
  if (!input) return "";
  const d = typeof input === "string" ? new Date(input) : input;
  const seconds = Math.max(1, Math.floor((Date.now() - d.getTime()) / 1000));
  if (seconds < 60)     return seconds + "s ago";
  if (seconds < 3600)   return Math.floor(seconds / 60) + "m ago";
  if (seconds < 86400)  return Math.floor(seconds / 3600) + "h ago";
  if (seconds < 604800) return Math.floor(seconds / 86400) + "d ago";
  if (seconds < 2592000)return Math.floor(seconds / 604800) + "w ago";
  return d.toLocaleDateString();
}

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

// ============================================================
// DATA
// ============================================================

const AGENTS = [
  { id: 1, name: "Sarah Mitchell", plan: "Pro", leads: 47, closings: 12, revenue: 284000, website: "sarahmitchell.triskope.io", reports: 8, communities: 5 },
  { id: 2, name: "James Parker", plan: "Enterprise", leads: 63, closings: 18, revenue: 412000, website: "jamesparker.triskope.io", reports: 12, communities: 8 },
  { id: 3, name: "Lisa Chen", plan: "Starter", leads: 22, closings: 5, revenue: 98000, website: "lisachen.triskope.io", reports: 3, communities: 2 },
  { id: 4, name: "Marcus Johnson", plan: "Pro", leads: 38, closings: 9, revenue: 195000, website: "marcusjohnson.triskope.io", reports: 6, communities: 4 },
  { id: 5, name: "Amy Rodriguez", plan: "Pro", leads: 15, closings: 2, revenue: 45000, website: "amyrodriguez.triskope.io", reports: 4, communities: 3 },
];

// Leads are fetched from Supabase at runtime; see useEffect in App below.


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

// Pipeline stages — used by the Kanban view
const STAGES = [
  { id: "new",       label: "New",       color: "#818cf8" }, // blue
  { id: "contacted", label: "Contacted", color: "#a78bfa" }, // purple
  { id: "qualified", label: "Qualified", color: "#5eead4" }, // teal
  { id: "showing",   label: "Showing",   color: "#f59e0b" }, // amber
  { id: "offer",     label: "Offer",     color: "#10b981" }, // green
  { id: "closed",    label: "Closed",    color: "#55557a" }, // dim
];

// Initial stage assignment is now stored directly on each lead row in the
// database (leads.stage), so no static map is needed here.

const STATUS_FILTERS = [
  { id: "all", label: "All" },
  { id: "hot", label: "Hot" },
  { id: "nurture", label: "Nurture" },
  { id: "new", label: "New" },
  { id: "cold", label: "Cold" },
];

const SORT_OPTIONS = [
  { id: "score",  label: "Score (high → low)" },
  { id: "recent", label: "Most recent" },
  { id: "name",   label: "Name (A → Z)" },
];

// Grand Strand listing data — coordinates roughly approximate (NMB north, Pawleys south)
const LISTINGS = [
  { id: 1,  address: "1247 Ocean Blvd #802",        community: "Oceanfront",       area: "Myrtle Beach",       price: 485000,  beds: 3, baths: 2,   sqft: 1456, type: "Condo",         status: "active",  days: 4,  agent: "Sarah Mitchell",  lat: 33.690, lng: -78.880, photo: "🌊" },
  { id: 2,  address: "142 Springs Ave",             community: "Litchfield Beach", area: "Pawleys Island",     price: 625000,  beds: 4, baths: 3,   sqft: 2890, type: "Single Family", status: "active",  days: 2,  agent: "Sarah Mitchell",  lat: 33.495, lng: -79.080, photo: "🏡" },
  { id: 3,  address: "88 Magnolia Lake Ct",         community: "Barefoot Resort",  area: "North Myrtle Beach", price: 545000,  beds: 4, baths: 3,   sqft: 2640, type: "Single Family", status: "active",  days: 9,  agent: "James Parker",    lat: 33.815, lng: -78.715, photo: "⛳" },
  { id: 4,  address: "415 Cypress Way",             community: "Carolina Forest",  area: "Myrtle Beach",       price: 358000,  beds: 4, baths: 2.5, sqft: 2180, type: "Single Family", status: "active",  days: 14, agent: "Marcus Johnson",  lat: 33.760, lng: -78.910, photo: "🌲" },
  { id: 5,  address: "9 Beach Bridge Rd",           community: "Litchfield Beach", area: "Pawleys Island",     price: 1250000, beds: 5, baths: 4.5, sqft: 4120, type: "Single Family", status: "active",  days: 1,  agent: "Sarah Mitchell",  lat: 33.485, lng: -79.085, photo: "🏖️" },
  { id: 6,  address: "2210 N Ocean Blvd #1402",     community: "Oceanfront",       area: "Myrtle Beach",       price: 339000,  beds: 2, baths: 2,   sqft: 1180, type: "Condo",         status: "pending", days: 18, agent: "Sarah Mitchell",  lat: 33.730, lng: -78.860, photo: "🌅" },
  { id: 7,  address: "147 Grande Dunes Pkwy",       community: "Grande Dunes",     area: "Myrtle Beach",       price: 1485000, beds: 5, baths: 4.5, sqft: 4680, type: "Single Family", status: "active",  days: 22, agent: "Sarah Mitchell",  lat: 33.755, lng: -78.835, photo: "🏛️" },
  { id: 8,  address: "3 Sandhill Crane Dr",         community: "Prince Creek",     area: "Murrells Inlet",     price: 298000,  beds: 3, baths: 2,   sqft: 1820, type: "Single Family", status: "active",  days: 5,  agent: "Amy Rodriguez",   lat: 33.595, lng: -79.005, photo: "🌾" },
  { id: 9,  address: "523 Howard Ave",              community: "Market Common",    area: "Myrtle Beach",       price: 425000,  beds: 3, baths: 2.5, sqft: 1980, type: "Townhouse",     status: "active",  days: 7,  agent: "Lisa Chen",       lat: 33.665, lng: -78.910, photo: "🏘️" },
  { id: 10, address: "118 Magnolia Trail",          community: "Carolina Forest",  area: "Myrtle Beach",       price: 312000,  beds: 3, baths: 2,   sqft: 1640, type: "Single Family", status: "active",  days: 11, agent: "Marcus Johnson",  lat: 33.745, lng: -78.945, photo: "🌳" },
  { id: 11, address: "44 Pelican Pointe Dr",        community: "Barefoot Resort",  area: "North Myrtle Beach", price: 729000,  beds: 4, baths: 4,   sqft: 3210, type: "Single Family", status: "active",  days: 3,  agent: "James Parker",    lat: 33.820, lng: -78.710, photo: "⛳" },
  { id: 12, address: "8 Inlet Cove Way",            community: "Murrells Inlet",   area: "Murrells Inlet",     price: 545000,  beds: 3, baths: 3,   sqft: 2240, type: "Single Family", status: "active",  days: 6,  agent: "James Parker",    lat: 33.555, lng: -79.030, photo: "⛵" },
  { id: 13, address: "1024 N Ocean Blvd #506",      community: "Oceanfront",       area: "North Myrtle Beach", price: 412000,  beds: 2, baths: 2,   sqft: 1320, type: "Condo",         status: "active",  days: 16, agent: "James Parker",    lat: 33.810, lng: -78.715, photo: "🌊" },
  { id: 14, address: "67 Litchfield Country Club",  community: "Litchfield Beach", area: "Pawleys Island",     price: 489000,  beds: 3, baths: 2.5, sqft: 2080, type: "Single Family", status: "active",  days: 8,  agent: "Sarah Mitchell",  lat: 33.490, lng: -79.090, photo: "⛳" },
  { id: 15, address: "31 Willow Bend Ct",           community: "Carolina Forest",  area: "Conway",             price: 268000,  beds: 3, baths: 2,   sqft: 1480, type: "Single Family", status: "active",  days: 19, agent: "Marcus Johnson",  lat: 33.835, lng: -79.045, photo: "🌳" },
  { id: 16, address: "207 Surfwood Dr",             community: "Surfside Beach",   area: "Surfside Beach",     price: 385000,  beds: 3, baths: 2,   sqft: 1720, type: "Single Family", status: "active",  days: 4,  agent: "Lisa Chen",       lat: 33.605, lng: -78.965, photo: "🏖️" },
  { id: 17, address: "92 Plantation Dr",            community: "Prince Creek",     area: "Murrells Inlet",     price: 358000,  beds: 4, baths: 2.5, sqft: 2350, type: "Single Family", status: "active",  days: 12, agent: "Amy Rodriguez",   lat: 33.585, lng: -79.015, photo: "🌾" },
  { id: 18, address: "780 Grande Dunes Way #305",   community: "Grande Dunes",     area: "Myrtle Beach",       price: 695000,  beds: 3, baths: 3,   sqft: 2120, type: "Condo",         status: "active",  days: 2,  agent: "Sarah Mitchell",  lat: 33.760, lng: -78.840, photo: "🏛️" },
  { id: 19, address: "55 Boardwalk Drive",          community: "Market Common",    area: "Myrtle Beach",       price: 612000,  beds: 4, baths: 3.5, sqft: 2840, type: "Single Family", status: "active",  days: 25, agent: "Lisa Chen",       lat: 33.670, lng: -78.915, photo: "🏙️" },
  { id: 20, address: "12 Heron Lake Way",           community: "Carolina Forest",  area: "Myrtle Beach",       price: 412000,  beds: 4, baths: 3,   sqft: 2470, type: "Single Family", status: "active",  days: 8,  agent: "Marcus Johnson",  lat: 33.770, lng: -78.925, photo: "🦩" },
];

const LISTING_TYPES = ["Single Family", "Condo", "Townhouse"];
const LISTING_COMMUNITIES = ["Oceanfront", "Barefoot Resort", "Grande Dunes", "Carolina Forest", "Market Common", "Litchfield Beach", "Prince Creek", "Murrells Inlet", "Surfside Beach"];

// Static notification feed (in-memory; users mark read interactively)
const NOTIFICATIONS = [
  { id: 1,  type: "new-lead",   title: "New lead — Anthony Russo",      text: "Submitted form via Market Common community page",       time: "12 min ago",  leadId: "33333333-3333-3333-3333-00000000000C", defaultRead: false, color: "#818cf8" },
  { id: 2,  type: "hot-alert",  title: "Karen Lee is back on the site", text: "Re-viewed 142 Springs Ave for the 3rd time today",      time: "47 min ago",  leadId: "33333333-3333-3333-3333-000000000005", defaultRead: false, color: "#ef4444" },
  { id: 3,  type: "task-due",   title: "Follow-up due today",            text: "Send shortlist to the Fosters (lease ends in 30d)",     time: "2h ago",      leadId: "33333333-3333-3333-3333-000000000009", defaultRead: false, color: "#f59e0b" },
  { id: 4,  type: "ai-suggest", title: "AI suggestion",                  text: "Tom Baker's engagement dropped — try a re-engagement email", time: "3h ago",  leadId: "33333333-3333-3333-3333-000000000008", defaultRead: false, color: "#a78bfa" },
  { id: 5,  type: "showing",    title: "Showing confirmed",              text: "James booked Saturday tour for the Fosters in NMB",     time: "yesterday",   leadId: "33333333-3333-3333-3333-000000000009", defaultRead: false, color: "#10b981" },
  { id: 6,  type: "new-lead",   title: "New lead — Steve Chen",          text: "Just signed up. Auto-qualifying based on session signals", time: "yesterday", leadId: "33333333-3333-3333-3333-000000000006", defaultRead: true,  color: "#818cf8" },
  { id: 7,  type: "ai-suggest", title: "AI suggestion",                  text: "Robert Williams is likely to write an offer in 30-60 days — move to Showing?", time: "yesterday", leadId: "33333333-3333-3333-3333-000000000001", defaultRead: true, color: "#a78bfa" },
  { id: 8,  type: "hot-alert",  title: "Pre-approval cleared",           text: "Marcus & Tonya Reed underwriting cleared — move to Qualified", time: "2 days ago", leadId: "33333333-3333-3333-3333-00000000000B", defaultRead: true, color: "#ef4444" },
  { id: 9,  type: "task-due",   title: "Open house this Saturday",       text: "1247 Ocean Blvd #802 — 12-3pm",                          time: "2 days ago",  leadId: null, defaultRead: true, color: "#f59e0b" },
  { id: 10, type: "ai-suggest", title: "Market insight",                 text: "Inventory in Pawleys Island dropped 8% this month — strong sellers' window", time: "3 days ago", leadId: null, defaultRead: true, color: "#a78bfa" },
];

const NOTIFICATION_ICONS = {
  "new-lead":   Users,
  "hot-alert":  AlertCircle,
  "task-due":   CalendarPlus,
  "ai-suggest": Lightbulb,
  "showing":    MapPin,
};

// ============================================================
// AI: thinking phases + content generators (context-aware)
// ============================================================

const THINKING_PHASES = {
  "market-report": ["Connecting to MLS feed", "Pulling 90 day sales data", "Calculating price + DOM trends", "Drafting narrative"],
  "listing-desc": ["Reading property details", "Analyzing comparable listings", "Choosing emotional hooks", "Polishing copy"],
  "email-campaign": ["Reading lead profile", "Selecting tone + cadence", "Drafting subject lines", "Composing sequence"],
  "lead-score": ["Pulling behavioral signals", "Weighting engagement events", "Cross-referencing intent model", "Generating recommendations"],
};

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function genMarketReport(ctx) {
  const market = ctx && ctx.title ? ctx.title : pick(["Myrtle Beach", "North Myrtle Beach", "Pawleys Island", "Conway"]);
  const inv = ctx?.inv ?? Math.floor(120 + Math.random() * 240);
  const avg = ctx?.avgPrice ?? "$" + (280 + Math.floor(Math.random() * 200)) + ",000";
  const change = ctx?.priceChange ?? "+" + (2 + Math.random() * 6).toFixed(1) + "%";
  const dom = ctx?.dom ?? Math.floor(35 + Math.random() * 30);
  const opener = pick([
    `${market} continues to show resilient demand into Q2 2026.`,
    `The ${market} market is tilting in favor of well-priced sellers heading into spring.`,
    `Buyer activity in ${market} is up sharply versus the same period last year.`,
  ]);
  const inventoryNote = inv < 200 ? "Inventory remains tight — under 4 months of supply at current absorption." :
    inv < 280 ? "Inventory is balanced — roughly 4 to 5 months of supply." :
    "Inventory is climbing, giving buyers more leverage than they had last quarter.";
  const closer = pick([
    `Expect continued appreciation of 3 to 5 percent through Q3.`,
    `Watch for a modest seasonal cooling in late summer before fall demand resumes.`,
    `Sellers who price within 2 percent of market are still seeing offers inside the first weekend.`,
  ]);
  return [
    `${market} Market Report — May 2026`,
    "",
    opener,
    "",
    "Key numbers this month:",
    `• Median price: ${avg} (${change} YoY)`,
    `• Active inventory: ${inv} listings`,
    `• Days on market: ${dom}`,
    `• ${inventoryNote}`,
    "",
    "Notable trends:",
    `• ${pick(["Oceanfront condos", "Single-story homes", "Golf community resales"])} are the strongest segment, with bidding activity on ${pick(["roughly 30%", "about 1 in 4", "nearly half"])} of sub-${pick(["$400K", "$500K", "$600K"])} listings.`,
    `• Days on market dropped ${pick(["from 52 to " + dom, "by " + (5 + Math.floor(Math.random() * 8)) + " days vs. last quarter", "noticeably for under-$400K homes"])}.`,
    `• Buyer ${pick(["relocations from the Northeast", "second-home demand", "investor activity"])} continues to drive the upper price tiers.`,
    "",
    `Forecast: ${closer}`,
  ].join("\n");
}

function genListingDesc(ctx) {
  const area = ctx?.area || pick(["Barefoot Resort", "Grande Dunes", "Pawleys Island", "Carolina Forest", "Market Common"]);
  const beds = pick([3, 4, 4, 5]);
  const baths = pick([2, 2.5, 3, 3.5]);
  const openers = [
    `Welcome to your Low Country retreat in ${area}.`,
    `A rare offering in ${area} — and it's exactly the kind of home buyers ask us about every week.`,
    `From the moment you turn into ${area}, this home tells you it's different.`,
  ];
  return [
    pick(openers),
    "",
    `This ${beds}BR / ${baths}BA blends comfort and craftsmanship — soaring ceilings, an open-concept living area, and a chef's kitchen anchored by quartz counters, custom cabinetry, and stainless appliances.`,
    "",
    `The primary suite is a true escape: a spa-style bath with dual vanities, a soaking tub, and a walk-in closet you'll actually find room in. Secondary bedrooms each have generous closet space and access to upgraded baths.`,
    "",
    pick([
      `Out back, the screened porch and travertine patio overlook a beautifully landscaped yard — the kind of outdoor living that defines coastal Carolina.`,
      `Step outside to a private courtyard with a custom paver patio, fire pit, and room for a future pool. It's the rare ${area} lot that gives you the outdoor space you want.`,
      `Enjoy unobstructed views from the rear deck, designed for morning coffee and sunset cocktails.`,
    ]),
    "",
    pick([
      `Community amenities include championship golf, oceanfront cabana access, and resort-style pools.`,
      `${area} delivers walkable shopping, top-rated schools, and a tight-knit community feel just minutes from the beach.`,
      `Steps from miles of beach access, restaurants, and the Intracoastal Waterway — the lifestyle here sells itself.`,
    ]),
  ].join("\n");
}

function genEmailCampaign(ctx) {
  const name = ctx?.name?.split(" ")[0] || "[First Name]";
  const area = ctx?.area || "the Grand Strand";
  return [
    `Subject: ${pick(["A quick Grand Strand update for you", "Your monthly market snapshot", "Three homes I think you'll love"])}`,
    "",
    `Hi ${name},`,
    "",
    `Quick update on ${area} — I wanted to put a few things in front of you before the weekend.`,
    "",
    "Market snapshot:",
    `• Median price moved ${pick(["+5.2%", "+4.6%", "+3.8%"])} year over year`,
    `• Homes are spending roughly ${pick([42, 45, 48])} days on market`,
    `• New listings are up about ${pick(["8%", "11%", "6%"])} this month versus last`,
    "",
    "Three homes I think fit what you're looking for:",
    `• 1247 Ocean Blvd #802 — ${pick(["price-improved 10K", "first weekend, no offers yet", "motivated seller"])}`,
    `• 142 Springs Ave — ${pick(["just listed Friday", "your kind of layout", "creek-front, rare listing"])}`,
    `• 88 Magnolia Lake Ct — ${pick(["good comps for your range", "under list for this neighborhood", "freshly renovated"])}`,
    "",
    `If any of these are worth a closer look, just hit reply and I'll send the full listing packets. Happy to set up a same-day tour if it makes sense.`,
    "",
    `— ${ctx?.agent || "Sarah"}`,
  ].join("\n");
}

function genLeadScore(lead) {
  if (!lead) {
    return "Open a lead's profile and run AI Score Analysis from there — that way the model can use real behavioral signals from that contact.";
  }
  const positive = [];
  const negative = [];
  if (lead.score >= 80) positive.push(`Strong engagement pattern — score ${lead.score}/100`);
  if (lead.tags?.includes("pre-approved")) positive.push("Pre-approval letter on file");
  if (lead.tags?.includes("ready-to-offer")) positive.push("Stated intent to write an offer this week");
  if (lead.activity?.some(a => a.type === "showing")) positive.push("Attended an in-person showing");
  if (lead.activity?.filter(a => a.type === "view").length >= 2) positive.push("Repeat site visits in the past week");
  if (lead.activity?.some(a => a.type === "call")) positive.push("Direct conversation with assigned agent");
  if (lead.tags?.includes("low-engagement")) negative.push("Engagement has dropped off in the last 3 weeks");
  if (!lead.activity?.some(a => a.type === "call")) negative.push("No phone conversation yet");
  if (lead.tags?.includes("needs-preapproval")) negative.push("Pre-approval still pending");
  if (lead.status === "cold") negative.push("Status flagged cold — automated email bounce detected");

  const recommended = lead.status === "hot"
    ? pick(["Call today to discuss specific listings and confirm timeline.", "Book an in-person tour for this weekend.", "Send a tailored shortlist of 3 homes that match the budget and area."])
    : lead.status === "new"
    ? pick(["Warm outreach call within 24 hours — keep it casual.", "Send the relevant community report and a personal welcome email.", "Trigger the 'new buyer' drip sequence and tag for follow-up."])
    : lead.status === "nurture"
    ? pick(["Drop a low-friction check-in email — share a fresh listing relevant to their area.", "Invite to an upcoming open house in their target neighborhood.", "Send a value-add piece (financing options, schools, or local guide)."])
    : pick(["Skip immediate outreach — move to quarterly 'just in case' sequence.", "Try a polite re-engagement email; if no open within 7 days, downgrade priority."]);

  const intent = Math.min(95, Math.max(15, Math.round(lead.score * 0.9 + (lead.activity?.length || 0) * 1.5)));
  return [
    `AI Lead Analysis — ${lead.name}`,
    "",
    `Overall score: ${lead.score}/100  (${lead.status === "hot" ? "Hot" : lead.status === "nurture" ? "Warm" : lead.status === "new" ? "Fresh" : "Cold"})`,
    "",
    "What's working:",
    ...positive.slice(0, 4).map(p => `+ ${p}`),
    "",
    negative.length ? "Friction:" : "",
    ...negative.slice(0, 3).map(n => `- ${n}`),
    negative.length ? "" : null,
    `Predicted intent: ${intent}% likely to act within 90 days.`,
    "",
    `Recommended next move: ${recommended}`,
  ].filter(x => x !== null).join("\n");
}

function generateAI(type, ctx) {
  switch (type) {
    case "market-report": return genMarketReport(ctx);
    case "listing-desc": return genListingDesc(ctx);
    case "email-campaign": return genEmailCampaign(ctx);
    case "lead-score": return genLeadScore(ctx);
    default: return genMarketReport(ctx);
  }
}

// ============================================================
// SMALL UI HELPERS
// ============================================================

const Badge = ({ children, color = C.teal }) => (
  <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 10px", borderRadius: 9999, fontSize: 12, fontWeight: 600, background: color + "18", color }}>{children}</span>
);

const Avatar = ({ name, size = 36, color = C.teal }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: `linear-gradient(135deg, ${color}, ${color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.38, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
    {name.split(" ").map(n => n[0]).join("").slice(0, 2)}
  </div>
);

const StatCard = ({ icon: Icon, label, value, change, color = C.teal, subtitle, isMobile }) => (
  <div style={{ background: C.bgCard, borderRadius: 12, padding: isMobile ? 16 : 20, border: `1px solid ${C.border}`, flex: isMobile ? "1 1 100%" : 1, minWidth: isMobile ? "auto" : 200, transition: "transform 0.2s ease, border-color 0.2s ease" }}
       onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderLight; e.currentTarget.style.transform = "translateY(-2px)"; }}
       onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "translateY(0)"; }}>
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
    <div style={{ display: "flex", alignItems: "center", gap: 6 }} aria-label={`Lead score ${score} out of 100`}>
      <div style={{ width: 48, height: 6, borderRadius: 3, background: C.border }}>
        <div style={{ width: `${score}%`, height: "100%", borderRadius: 3, background: color, transition: "width 0.4s ease" }} />
      </div>
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

const EmptyState = ({ icon: Icon = Inbox, title, message, action }) => (
  <div style={{ padding: "48px 20px", textAlign: "center", color: C.textMuted }}>
    <div style={{ width: 56, height: 56, borderRadius: 14, background: C.bg, border: `1px solid ${C.border}`, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
      <Icon size={24} color={C.textDim} />
    </div>
    <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 4 }}>{title}</div>
    {message && <div style={{ fontSize: 13, color: C.textMuted, maxWidth: 320, margin: "0 auto" }}>{message}</div>}
    {action}
  </div>
);

const Toast = ({ message, kind = "success", onDismiss }) => {
  useEffect(() => {
    const t = setTimeout(onDismiss, 2400);
    return () => clearTimeout(t);
  }, [onDismiss]);
  const color = kind === "error" ? C.red : kind === "info" ? C.blue : C.teal;
  return (
    <div style={{
      position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", zIndex: 600,
      background: C.bgCard, border: `1px solid ${color}55`, borderLeft: `3px solid ${color}`,
      borderRadius: 8, padding: "10px 16px", color: C.text, fontSize: 13, fontWeight: 500,
      boxShadow: "0 8px 24px rgba(0,0,0,0.4)", display: "flex", alignItems: "center", gap: 8,
      animation: "tk-toast 0.2s ease",
    }}>
      <Check size={14} color={color} /> {message}
    </div>
  );
};

const ActivityRow = ({ event }) => {
  const Icon = ICONS[event.icon] || Activity;
  return (
    <div style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: C.bg, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={14} color={C.teal} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: C.text, fontWeight: 500, lineHeight: 1.35 }}>{event.text}</div>
        <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>{event.time}</div>
      </div>
    </div>
  );
};

// ============================================================
// MAIN APP
// ============================================================

export default function App() {
  // Auth
  const [authLoading, setAuthLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setAuthLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!session?.user) { setProfile(null); return; }
    let cancelled = false;
    supabase.from("profiles").select("id, email, display_name, role").eq("id", session.user.id).maybeSingle()
      .then(({ data, error }) => { if (!cancelled && !error) setProfile(data); });
    return () => { cancelled = true; };
  }, [session?.user?.id]);

  const signOut = async () => { await supabase.auth.signOut(); };

  const [view, setView] = useState("dashboard");
  const [selectedLead, setSelectedLead] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 768 : false);
  const [toast, setToast] = useState(null);

  // AI state
  const [aiOpen, setAiOpen] = useState(false);
  const [aiType, setAiType] = useState(null);
  const [aiCtx, setAiCtx] = useState(null);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiPhase, setAiPhase] = useState(0);
  const [aiOut, setAiOut] = useState("");
  const [aiStreamed, setAiStreamed] = useState("");
  const [aiStreaming, setAiStreaming] = useState(false);
  const phaseTimer = useRef(null);
  const streamTimer = useRef(null);

  // Phase 2: lead filtering, pipeline, notes, tasks
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("score");
  const [sortOpen, setSortOpen] = useState(false);
  const [leads, setLeads] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadNotes, setLeadNotes] = useState({});   // { leadId: [{ id, text, createdAt }] }
  const [leadTasks, setLeadTasks] = useState({});   // { leadId: [{ id, text, due, done }] }
  const [noteDraft, setNoteDraft] = useState("");
  const [taskDraft, setTaskDraft] = useState("");
  const [taskDueDraft, setTaskDueDraft] = useState("");
  const [draggingId, setDraggingId] = useState(null);
  const [stageMenuFor, setStageMenuFor] = useState(null); // leadId whose stage menu is open

  // Phase 3: Listings, Tasks, Inbox
  const [selectedListing, setSelectedListing] = useState(null);
  const [listingSearch, setListingSearch] = useState("");
  const [listingCommunity, setListingCommunity] = useState("all");
  const [listingType, setListingType] = useState("all");
  const [listingBeds, setListingBeds] = useState(0);
  const [listingMinPrice, setListingMinPrice] = useState("");
  const [listingMaxPrice, setListingMaxPrice] = useState("");
  const [hoveredListing, setHoveredListing] = useState(null);
  const [notifReads, setNotifReads] = useState(() => {
    const m = {};
    NOTIFICATIONS.forEach(n => { if (n.defaultRead) m[n.id] = true; });
    return m;
  });

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch leads from Supabase whenever the session changes
  useEffect(() => {
    if (!session) { setLeads([]); return; }
    let cancelled = false;
    setLeadsLoading(true);
    supabase
      .from("leads")
      .select(`
        id, name, email, phone, source, status, stage, score, area, budget, interest,
        ai_notes, added_days, last_contact, created_at,
        agent:agents(full_name),
        tags:lead_tags(tag),
        activity:lead_activity(type, text, icon, occurred_at)
      `)
      .order("score", { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        setLeadsLoading(false);
        if (error) { setToast({ message: "Couldn't load leads: " + error.message, kind: "error" }); return; }
        const shaped = (data || []).map(l => ({
          id: l.id,
          name: l.name,
          email: l.email,
          phone: l.phone,
          source: l.source,
          status: l.status,
          stage: l.stage,
          score: l.score,
          area: l.area,
          budget: l.budget,
          interest: l.interest,
          aiNotes: l.ai_notes,
          addedDays: l.added_days ?? 0,
          lastContact: l.last_contact || "—",
          agent: l.agent?.full_name || null,
          tags: (l.tags || []).map(t => t.tag),
          activity: (l.activity || [])
            .sort((a, b) => new Date(b.occurred_at) - new Date(a.occurred_at))
            .map(a => ({
              type: a.type,
              text: a.text,
              icon: a.icon || "Activity",
              time: timeAgo(a.occurred_at),
            })),
        }));
        setLeads(shaped);
      });
    return () => { cancelled = true; };
  }, [session?.user?.id]);

  // Phased "thinking", then start streaming the result
  useEffect(() => {
    if (!aiBusy || !aiType) return;
    const phases = THINKING_PHASES[aiType] || THINKING_PHASES["market-report"];
    setAiPhase(0);
    let p = 0;
    phaseTimer.current = setInterval(() => {
      p++;
      if (p >= phases.length) {
        clearInterval(phaseTimer.current);
        const result = generateAI(aiType, aiCtx);
        setAiOut(result);
        setAiBusy(false);
        setAiStreamed("");
        setAiStreaming(true);
      } else {
        setAiPhase(p);
      }
    }, 380 + Math.random() * 250);
    return () => clearInterval(phaseTimer.current);
  }, [aiBusy, aiType, aiCtx]);

  // Stream characters
  useEffect(() => {
    if (!aiStreaming || !aiOut) return;
    let i = 0;
    streamTimer.current = setInterval(() => {
      i += 3; // 3 chars per tick keeps it fast on long outputs
      if (i >= aiOut.length) {
        setAiStreamed(aiOut);
        setAiStreaming(false);
        clearInterval(streamTimer.current);
      } else {
        setAiStreamed(aiOut.slice(0, i));
      }
    }, 12);
    return () => clearInterval(streamTimer.current);
  }, [aiStreaming, aiOut]);

  const runAI = (type, ctx = null) => {
    setAiOpen(true);
    setAiType(type);
    setAiCtx(ctx);
    setAiOut("");
    setAiStreamed("");
    setAiStreaming(false);
    setAiBusy(true);
  };

  const regenerateAI = () => {
    if (!aiType) return;
    runAI(aiType, aiCtx);
  };

  const copyAI = () => {
    const text = aiOut || aiStreamed;
    if (!text) return;
    try {
      navigator.clipboard.writeText(text);
      setToast({ message: "Copied to clipboard", kind: "success" });
    } catch {
      setToast({ message: "Copy failed — your browser blocked it", kind: "error" });
    }
  };

  const skipStreaming = () => {
    if (aiStreaming && aiOut) {
      setAiStreamed(aiOut);
      setAiStreaming(false);
    }
  };

  // ----- Phase 2 helpers -----
  const moveLeadToStage = (leadId, stageId) => {
    // Optimistic UI update
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage: stageId } : l));
    const lead = leads.find(l => l.id === leadId);
    const stage = STAGES.find(s => s.id === stageId);
    if (lead && stage) setToast({ message: `${lead.name.split(" ")[0]} moved to ${stage.label}`, kind: "success" });
    // Persist to Supabase
    supabase.from("leads").update({ stage: stageId }).eq("id", leadId).then(({ error }) => {
      if (error) setToast({ message: "Couldn't save stage: " + error.message, kind: "error" });
    });
  };

  const addNote = (leadId, text) => {
    if (!text.trim()) return;
    const note = { id: Date.now(), text: text.trim(), createdAt: "just now" };
    setLeadNotes(prev => ({ ...prev, [leadId]: [note, ...(prev[leadId] || [])] }));
    setNoteDraft("");
    setToast({ message: "Note added", kind: "success" });
  };

  const addTask = (leadId, text, due) => {
    if (!text.trim()) return;
    const task = { id: Date.now(), text: text.trim(), due: due || "no due date", done: false };
    setLeadTasks(prev => ({ ...prev, [leadId]: [task, ...(prev[leadId] || [])] }));
    setTaskDraft(""); setTaskDueDraft("");
    setToast({ message: "Follow-up scheduled", kind: "success" });
  };

  const toggleTask = (leadId, taskId) => {
    setLeadTasks(prev => ({
      ...prev,
      [leadId]: (prev[leadId] || []).map(t => t.id === taskId ? { ...t, done: !t.done } : t),
    }));
  };

  const deleteTask = (leadId, taskId) => {
    setLeadTasks(prev => ({
      ...prev,
      [leadId]: (prev[leadId] || []).filter(t => t.id !== taskId),
    }));
  };

  const filteredLeads = leads
    .filter(l => statusFilter === "all" || l.status === statusFilter)
    .filter(l => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return l.name.toLowerCase().includes(q) ||
             (l.email || "").toLowerCase().includes(q) ||
             (l.area || "").toLowerCase().includes(q) ||
             (l.source || "").toLowerCase().includes(q) ||
             (l.tags || []).some(t => t.toLowerCase().includes(q));
    })
    .sort((a, b) => {
      if (sortBy === "score")  return b.score - a.score;
      if (sortBy === "recent") return a.addedDays - b.addedDays;
      if (sortBy === "name")   return a.name.localeCompare(b.name);
      return 0;
    });

  const statusCounts = leads.reduce((acc, l) => {
    acc.all = (acc.all || 0) + 1;
    acc[l.status] = (acc[l.status] || 0) + 1;
    return acc;
  }, {});

  // Phase 3: aggregations
  const allTasks = Object.entries(leadTasks).flatMap(([lid, tasks]) =>
    tasks.map(t => ({ ...t, leadId: lid, lead: leads.find(l => l.id === lid) }))
  );

  const todayStr = new Date().toISOString().slice(0, 10);
  const taskBuckets = {
    overdue:   allTasks.filter(t => !t.done && t.due && t.due < todayStr),
    today:     allTasks.filter(t => !t.done && t.due === todayStr),
    upcoming:  allTasks.filter(t => !t.done && t.due && t.due > todayStr),
    nodue:     allTasks.filter(t => !t.done && !t.due),
    completed: allTasks.filter(t => t.done).slice(0, 12),
  };

  const filteredListings = LISTINGS.filter(L => {
    if (listingCommunity !== "all" && L.community !== listingCommunity) return false;
    if (listingType !== "all" && L.type !== listingType) return false;
    if (listingBeds && L.beds < listingBeds) return false;
    if (listingMinPrice && L.price < Number(listingMinPrice)) return false;
    if (listingMaxPrice && L.price > Number(listingMaxPrice)) return false;
    if (listingSearch.trim()) {
      const q = listingSearch.toLowerCase();
      if (!L.address.toLowerCase().includes(q) &&
          !L.community.toLowerCase().includes(q) &&
          !L.area.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const unreadNotifs = NOTIFICATIONS.filter(n => !notifReads[n.id]).length;

  const markNotifRead = (id) => setNotifReads(prev => ({ ...prev, [id]: true }));
  const markAllNotifsRead = () => {
    const m = {};
    NOTIFICATIONS.forEach(n => { m[n.id] = true; });
    setNotifReads(m);
    setToast({ message: "All caught up", kind: "success" });
  };
  const jumpToLead = (leadId) => {
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      setSelectedLead(lead);
      setView("leads");
      if (isMobile) setSidebarOpen(false);
    }
  };
  const formatPrice = (p) => "$" + (p / 1000).toFixed(0) + "K";
  const formatDate = (d) => {
    if (!d) return "";
    try {
      const dt = new Date(d + "T00:00:00");
      return dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: dt.getFullYear() === new Date().getFullYear() ? undefined : "numeric" });
    } catch { return d; }
  };

  const nav = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "inbox", label: "Inbox", icon: Bell },
    { id: "leads", label: "Leads", icon: Users },
    { id: "pipeline", label: "Pipeline", icon: Layers },
    { id: "tasks", label: "Tasks", icon: CalendarDays },
    { id: "listings", label: "Listings", icon: Building2 },
    { id: "reports", label: "Market Reports", icon: FileText },
    { id: "communities", label: "Communities", icon: Map },
    { id: "agents", label: "Agents", icon: Award },
    { id: "ai", label: "AI Tools", icon: Brain },
    { id: "billing", label: "Plans", icon: Settings },
  ];

  const Card = ({ children, style = {}, hover = false, onClick }) => (
    <div
      onClick={onClick}
      style={{
        background: C.bgCard, borderRadius: 12, padding: isMobile ? 16 : 20,
        border: `1px solid ${C.border}`, transition: "border-color 0.2s ease, transform 0.2s ease",
        ...(onClick ? { cursor: "pointer" } : {}),
        ...style,
      }}
      onMouseEnter={hover || onClick ? (e) => { e.currentTarget.style.borderColor = C.borderLight; } : undefined}
      onMouseLeave={hover || onClick ? (e) => { e.currentTarget.style.borderColor = C.border; } : undefined}
    >
      {children}
    </div>
  );

  // ----- DASHBOARD -----
  const Dashboard = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", marginBottom: 24, flexDirection: isMobile ? "column" : "row", gap: isMobile ? 12 : 0 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: C.text, margin: 0 }}>Platform Dashboard</h1>
          <p style={{ fontSize: 14, color: C.textMuted, margin: "4px 0 0" }}>triskope — see everything together</p>
        </div>
        {!isMobile && (
          <button onClick={() => runAI("market-report", REPORTS[0])} style={btnPrimary()}><Sparkles size={16} /> AI Insights</button>
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
          <h3 style={cardTitle()}>Weekly Lead Flow</h3>
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
          <h3 style={cardTitle()}>Revenue Growth</h3>
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
        <h3 style={cardTitle()}>Recent Hot Leads</h3>
        {leads.filter(l => l.status === "hot").map(lead => (
          <div key={lead.id} onClick={() => { setSelectedLead(lead); setView("leads"); if (isMobile) setSidebarOpen(false); }}
               style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: `1px solid ${C.border}`, cursor: "pointer", transition: "background 0.15s ease", borderRadius: 6 }}
               onMouseEnter={e => e.currentTarget.style.background = C.bgHover}
               onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
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

  // ----- LEADS -----
  const LeadsToolbar = () => (
    <Card style={{ marginBottom: 16, padding: isMobile ? 12 : 16 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexDirection: isMobile ? "column" : "row" }}>
        {/* Search */}
        <div style={{ position: "relative", flex: 1, width: "100%" }}>
          <Search size={14} color={C.textDim} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, area, source, or tag…"
            style={{
              width: "100%", padding: "10px 12px 10px 36px",
              background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8,
              color: C.text, fontSize: 13, outline: "none",
              transition: "border-color 0.15s ease",
            }}
            onFocus={e => e.currentTarget.style.borderColor = C.teal + "88"}
            onBlur={e => e.currentTarget.style.borderColor = C.border}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{
              position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", color: C.textDim, cursor: "pointer",
              padding: 6, display: "flex", alignItems: "center",
            }} aria-label="Clear search">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Sort dropdown */}
        <div style={{ position: "relative", width: isMobile ? "100%" : "auto" }}>
          <button onClick={() => setSortOpen(o => !o)} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "10px 14px",
            background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8,
            color: C.text, fontSize: 13, fontWeight: 500, cursor: "pointer",
            minHeight: 44, whiteSpace: "nowrap", width: isMobile ? "100%" : "auto", justifyContent: "space-between",
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><ArrowUpDown size={14} /> {SORT_OPTIONS.find(s => s.id === sortBy)?.label}</span>
            <ChevronDown size={14} />
          </button>
          {sortOpen && (
            <>
              <div onClick={() => setSortOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 100 }} />
              <div style={{
                position: "absolute", top: "100%", right: 0, marginTop: 4,
                background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8,
                boxShadow: "0 8px 24px rgba(0,0,0,0.4)", zIndex: 101, minWidth: 200,
                padding: 4,
              }}>
                {SORT_OPTIONS.map(opt => (
                  <button key={opt.id} onClick={() => { setSortBy(opt.id); setSortOpen(false); }} style={{
                    display: "flex", width: "100%", padding: "10px 12px",
                    background: sortBy === opt.id ? C.bgHover : "transparent", border: "none",
                    color: sortBy === opt.id ? C.teal : C.text,
                    fontSize: 13, cursor: "pointer", textAlign: "left", borderRadius: 6,
                    alignItems: "center", gap: 8,
                  }}>
                    {sortBy === opt.id && <Check size={12} />}{sortBy !== opt.id && <span style={{ width: 12 }} />}
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Status filter pills */}
      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
        {STATUS_FILTERS.map(f => {
          const active = statusFilter === f.id;
          const count = statusCounts[f.id] || 0;
          return (
            <button key={f.id} onClick={() => setStatusFilter(f.id)} style={{
              padding: "6px 12px", borderRadius: 9999,
              background: active ? `linear-gradient(135deg, ${C.teal}25, ${C.blue}20)` : C.bg,
              color: active ? C.teal : C.textMuted,
              border: `1px solid ${active ? C.teal + "55" : C.border}`,
              fontSize: 12, fontWeight: 600, cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: 6,
              transition: "all 0.15s ease", minHeight: 32,
            }}>
              {f.label}
              <span style={{
                fontSize: 11, padding: "1px 6px", borderRadius: 9999,
                background: active ? C.teal + "30" : C.border,
                color: active ? C.teal : C.textDim,
              }}>{count}</span>
            </button>
          );
        })}
        {(search || statusFilter !== "all") && (
          <button onClick={() => { setSearch(""); setStatusFilter("all"); }} style={{
            padding: "6px 10px", borderRadius: 9999, background: "transparent",
            color: C.textMuted, border: `1px solid transparent`,
            fontSize: 12, fontWeight: 500, cursor: "pointer", minHeight: 32,
          }}>
            Clear filters
          </button>
        )}
      </div>
    </Card>
  );

  const LeadsView = () => (
    <div>
      <h1 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: C.text, margin: 0 }}>Lead Management</h1>
      <p style={{ fontSize: 14, color: C.textMuted, margin: "4px 0 16px" }}>AI-powered lead scoring and qualification</p>

      {!selectedLead && <LeadsToolbar />}

      {selectedLead ? (
        <LeadDetail lead={selectedLead} />
      ) : filteredLeads.length === 0 ? (
        <Card>
          <EmptyState
            icon={Search}
            title="No leads match your filters"
            message="Try clearing the search or selecting a different status."
            action={
              <button onClick={() => { setSearch(""); setStatusFilter("all"); }} style={{ ...btnPrimary(), marginTop: 16 }}>
                Clear filters
              </button>
            }
          />
        </Card>
      ) : isMobile ? (
        <LeadCards items={filteredLeads} />
      ) : (
        <LeadTable items={filteredLeads} />
      )}
    </div>
  );

  const LeadDetail = ({ lead }) => {
    const notes = leadNotes[lead.id] || [];
    const tasks = leadTasks[lead.id] || [];
    const stage = lead.stage;
    const stageInfo = STAGES.find(s => s.id === stage);

    return (
      <Card>
        <button onClick={() => setSelectedLead(null)} style={{ background: "none", border: "none", color: C.teal, fontSize: 14, cursor: "pointer", padding: "4px 0", minHeight: 44, display: "flex", alignItems: "center", gap: 4 }}>
          <ChevronLeft size={16} /> Back to all leads
        </button>

        <div style={{ display: "flex", alignItems: isMobile ? "flex-start" : "center", gap: 16, margin: "12px 0 20px", flexDirection: isMobile ? "column" : "row" }}>
          <Avatar name={lead.name} size={56} color={lead.status === "hot" ? C.red : lead.status === "new" ? C.blue : lead.status === "nurture" ? C.amber : C.textDim} />
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: C.text, margin: 0 }}>{lead.name}</h2>
            <div style={{ display: "flex", gap: 12, marginTop: 6, flexWrap: "wrap", alignItems: "center" }}>
              <StatusDot status={lead.status} />
              <Score score={lead.score} />
              {stageInfo && <Badge color={stageInfo.color}>Pipeline: {stageInfo.label}</Badge>}
              <span style={{ fontSize: 12, color: C.textDim }}>Added {lead.addedDays}d ago • Last contact {lead.lastContact}</span>
            </div>
          </div>
        </div>

        {/* Quick action bar */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          <a href={`tel:${(lead.phone || "").replace(/[^0-9]/g, "")}`} style={quickAction(C.green)}><Phone size={14} /> Call</a>
          <a href={`mailto:${lead.email}`} style={quickAction(C.blue)}><Mail size={14} /> Email</a>
          <button onClick={() => runAI("lead-score", lead)} style={quickAction(C.teal)}><Brain size={14} /> AI score</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12, marginBottom: 16 }}>
          {[["Interest", lead.interest], ["Budget", lead.budget], ["Area", lead.area], ["Source", lead.source], ["Phone", lead.phone], ["Email", lead.email]].map(([k, v]) => (
            <div key={k} style={{ padding: 12, background: C.bg, borderRadius: 8, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 11, color: C.textDim }}>{k}</div>
              <div style={{ fontSize: 13, color: C.text, fontWeight: 500, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis" }}>{v}</div>
            </div>
          ))}
        </div>

        {lead.tags?.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {lead.tags.map(t => (
              <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 6, fontSize: 11, color: C.textMuted, background: C.bg, border: `1px solid ${C.border}` }}>
                <Tag size={10} /> {t}
              </span>
            ))}
          </div>
        )}

        <div style={{ background: `linear-gradient(135deg, ${C.teal}10, ${C.blue}10)`, borderRadius: 10, padding: 16, border: `1px solid ${C.teal}25`, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}><Brain size={16} color={C.teal} /><span style={{ fontSize: 14, fontWeight: 600, color: C.teal }}>AI Analysis</span></div>
          <p style={{ fontSize: 13, color: C.textMuted, margin: 0, lineHeight: 1.6 }}>{lead.aiNotes}</p>
        </div>

        {/* Tasks (follow-ups) */}
        <div style={{ marginBottom: 16, padding: 14, background: C.bg, borderRadius: 10, border: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <CalendarPlus size={14} color={C.amber} />
            <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Follow-ups</span>
            <span style={{ fontSize: 11, color: C.textDim }}>{tasks.filter(t => !t.done).length} open</span>
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: tasks.length ? 12 : 0, flexDirection: isMobile ? "column" : "row" }}>
            <input
              type="text" value={taskDraft}
              onChange={e => setTaskDraft(e.target.value)}
              placeholder="What needs to happen next?"
              onKeyDown={e => { if (e.key === "Enter") addTask(lead.id, taskDraft, taskDueDraft); }}
              style={{
                flex: 1, padding: "10px 12px", background: C.bgCard, border: `1px solid ${C.border}`,
                borderRadius: 8, color: C.text, fontSize: 13, outline: "none",
              }}
            />
            <input
              type="date" value={taskDueDraft}
              onChange={e => setTaskDueDraft(e.target.value)}
              style={{
                padding: "10px 12px", background: C.bgCard, border: `1px solid ${C.border}`,
                borderRadius: 8, color: C.text, fontSize: 13, outline: "none",
                colorScheme: "dark", width: isMobile ? "100%" : 160,
              }}
            />
            <button onClick={() => addTask(lead.id, taskDraft, taskDueDraft)}
                    disabled={!taskDraft.trim()}
                    style={{
                      ...btnPrimary(),
                      opacity: taskDraft.trim() ? 1 : 0.5,
                      cursor: taskDraft.trim() ? "pointer" : "not-allowed",
                    }}>
              <Plus size={14} /> Add
            </button>
          </div>

          {tasks.map(t => (
            <div key={t.id} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 10px", marginTop: 6, background: C.bgCard,
              borderRadius: 8, border: `1px solid ${C.border}`,
            }}>
              <button onClick={() => toggleTask(lead.id, t.id)} style={{
                background: "none", border: "none", padding: 4, cursor: "pointer",
                display: "flex", alignItems: "center", color: t.done ? C.teal : C.textDim,
              }}>
                {t.done ? <CheckCircle2 size={18} /> : <div style={{ width: 16, height: 16, borderRadius: "50%", border: `1.5px solid ${C.textDim}` }} />}
              </button>
              <div style={{ flex: 1, fontSize: 13, color: t.done ? C.textDim : C.text, textDecoration: t.done ? "line-through" : "none" }}>
                {t.text}
                <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>Due {t.due}</div>
              </div>
              <button onClick={() => deleteTask(lead.id, t.id)} style={{
                background: "none", border: "none", padding: 6, cursor: "pointer",
                color: C.textDim, display: "flex", alignItems: "center",
              }} aria-label="Delete task">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Notes + Activity merged timeline */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Activity size={14} color={C.textMuted} />
            <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Activity & notes</span>
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <input
              type="text" value={noteDraft}
              onChange={e => setNoteDraft(e.target.value)}
              placeholder="Log a quick note for this lead…"
              onKeyDown={e => { if (e.key === "Enter") addNote(lead.id, noteDraft); }}
              style={{
                flex: 1, padding: "10px 12px", background: C.bg,
                border: `1px solid ${C.border}`, borderRadius: 8,
                color: C.text, fontSize: 13, outline: "none",
              }}
            />
            <button onClick={() => addNote(lead.id, noteDraft)}
                    disabled={!noteDraft.trim()}
                    style={{
                      ...quickAction(C.purple),
                      opacity: noteDraft.trim() ? 1 : 0.5,
                      cursor: noteDraft.trim() ? "pointer" : "not-allowed",
                    }}>
              <MessageSquare size={14} /> Log
            </button>
          </div>

          {notes.map(n => (
            <ActivityRow key={n.id} event={{ text: n.text, time: n.createdAt, icon: "MessageSquare" }} />
          ))}
          {lead.activity?.map((ev, i) => <ActivityRow key={`a${i}`} event={ev} />)}
        </div>
      </Card>
    );
  };

  const LeadCards = ({ items }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ fontSize: 12, color: C.textMuted, padding: "0 4px" }}>
        Showing {items.length} of {leads.length} leads
      </div>
      {items.map(lead => (
        <Card key={lead.id} onClick={() => setSelectedLead(lead)}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <Avatar name={lead.name} size={40} color={lead.status === "hot" ? C.red : lead.status === "new" ? C.blue : lead.status === "nurture" ? C.amber : C.textDim} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{lead.name}</div>
              <div style={{ fontSize: 12, color: C.textDim }}>{lead.area} • {lead.lastContact}</div>
            </div>
            <StatusDot status={lead.status} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Score score={lead.score} />
            <span style={{ fontSize: 12, color: C.textMuted }}>{lead.budget}</span>
          </div>
          <div style={{ fontSize: 11, color: C.textDim, marginTop: 6 }}>{lead.source} • {lead.agent || "Unassigned"}</div>
        </Card>
      ))}
    </div>
  );

  const LeadTable = ({ items }) => (
    <>
      <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 8, padding: "0 4px" }}>
        Showing {items.length} of {leads.length} leads
      </div>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: C.bg }}>
              {["Lead", "Status", "Score", "Source", "Budget", "Last contact", "Agent"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, color: C.textDim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: `1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map(lead => (
              <tr key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  style={{ cursor: "pointer", borderBottom: `1px solid ${C.border}`, transition: "background 0.15s ease" }}
                  onMouseEnter={e => e.currentTarget.style.background = C.bgHover}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar name={lead.name} size={32} color={lead.status === "hot" ? C.red : lead.status === "new" ? C.blue : lead.status === "nurture" ? C.amber : C.textDim} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{lead.name}</div>
                      <div style={{ fontSize: 11, color: C.textDim }}>{lead.area}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "12px 16px" }}><StatusDot status={lead.status} /></td>
                <td style={{ padding: "12px 16px" }}><Score score={lead.score} /></td>
                <td style={{ padding: "12px 16px", fontSize: 12, color: C.textMuted }}>{lead.source}</td>
                <td style={{ padding: "12px 16px", fontSize: 12, color: C.textMuted }}>{lead.budget}</td>
                <td style={{ padding: "12px 16px", fontSize: 12, color: C.textMuted }}>{lead.lastContact}</td>
                <td style={{ padding: "12px 16px", fontSize: 12, color: C.textMuted }}>{lead.agent || "Unassigned"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );

  // ----- PIPELINE (Kanban) -----
  const PipelineView = () => {
    const stageLeads = (stageId) => leads.filter(l => l.stage === stageId);

    return (
      <div>
        <div style={pageHeader(isMobile)}>
          <div>
            <h1 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: C.text, margin: 0 }}>Pipeline</h1>
            <p style={{ fontSize: 14, color: C.textMuted, margin: "4px 0 0" }}>
              {isMobile ? "Tap the stage badge on a card to move it." : "Drag leads across stages, or tap the stage badge to pick a destination."}
            </p>
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? `repeat(${STAGES.length}, 260px)` : `repeat(${STAGES.length}, minmax(0, 1fr))`,
          gap: 12,
          overflowX: isMobile ? "auto" : "visible",
          paddingBottom: isMobile ? 16 : 0,
          marginLeft: isMobile ? -16 : 0,
          marginRight: isMobile ? -16 : 0,
          paddingLeft: isMobile ? 16 : 0,
          paddingRight: isMobile ? 16 : 0,
        }}>
          {STAGES.map(stage => {
            const leads = stageLeads(stage.id);
            return (
              <div
                key={stage.id}
                onDragOver={e => { e.preventDefault(); }}
                onDrop={e => {
                  e.preventDefault();
                  const id = e.dataTransfer.getData("leadId");
                  if (id) moveLeadToStage(id, stage.id);
                  setDraggingId(null);
                }}
                style={{
                  background: C.bgCard, borderRadius: 12, border: `1px solid ${C.border}`,
                  padding: 12, minHeight: 200,
                  borderTop: `3px solid ${stage.color}`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: stage.color }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{stage.label}</span>
                  <span style={{ fontSize: 11, color: C.textDim, marginLeft: "auto" }}>{leads.length}</span>
                </div>

                {leads.length === 0 ? (
                  <div style={{ fontSize: 11, color: C.textDim, padding: "16px 8px", textAlign: "center" }}>Drop a lead here</div>
                ) : (
                  leads.map(lead => (
                    <div
                      key={lead.id}
                      draggable={!isMobile}
                      onDragStart={e => { e.dataTransfer.setData("leadId", String(lead.id)); setDraggingId(lead.id); }}
                      onDragEnd={() => setDraggingId(null)}
                      onClick={() => setSelectedLead(lead) || setView("leads") || (isMobile && setSidebarOpen(false))}
                      style={{
                        background: C.bg, borderRadius: 8, border: `1px solid ${C.border}`,
                        padding: 10, marginBottom: 8, cursor: isMobile ? "pointer" : "grab",
                        opacity: draggingId === lead.id ? 0.4 : 1,
                        transition: "opacity 0.15s ease, border-color 0.15s ease",
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = C.borderLight}
                      onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        {!isMobile && <GripVertical size={12} color={C.textDim} />}
                        <Avatar name={lead.name} size={26} color={lead.status === "hot" ? C.red : lead.status === "new" ? C.blue : lead.status === "nurture" ? C.amber : C.textDim} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead.name}</div>
                          <div style={{ fontSize: 10, color: C.textDim, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead.area}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Score score={lead.score} />
                        <button
                          onClick={(e) => { e.stopPropagation(); setStageMenuFor(stageMenuFor === lead.id ? null : lead.id); }}
                          style={{
                            fontSize: 10, padding: "2px 6px", borderRadius: 4,
                            background: stage.color + "22", color: stage.color,
                            border: "none", cursor: "pointer", fontWeight: 600,
                          }}
                          aria-label="Change stage"
                        >
                          Move ▾
                        </button>
                      </div>
                      {stageMenuFor === lead.id && (
                        <>
                          <div onClick={(e) => { e.stopPropagation(); setStageMenuFor(null); }} style={{ position: "fixed", inset: 0, zIndex: 150 }} />
                          <div style={{
                            position: "absolute", marginTop: 6, background: C.bgCard,
                            border: `1px solid ${C.border}`, borderRadius: 8,
                            boxShadow: "0 8px 24px rgba(0,0,0,0.5)", zIndex: 151,
                            padding: 4, minWidth: 160,
                          }}
                          onClick={(e) => e.stopPropagation()}>
                            {STAGES.map(s => (
                              <button key={s.id}
                                onClick={(e) => { e.stopPropagation(); moveLeadToStage(lead.id, s.id); setStageMenuFor(null); }}
                                style={{
                                  display: "flex", width: "100%", padding: "8px 10px",
                                  background: s.id === stage.id ? C.bgHover : "transparent",
                                  border: "none", color: s.id === stage.id ? C.teal : C.text,
                                  fontSize: 12, cursor: "pointer", textAlign: "left", borderRadius: 6,
                                  alignItems: "center", gap: 8,
                                }}>
                                <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }} />
                                {s.label}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ----- REPORTS -----
  const ReportsView = () => (
    <div>
      <div style={pageHeader(isMobile)}>
        <div>
          <h1 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: C.text, margin: 0 }}>Market Reports</h1>
          <p style={{ fontSize: 14, color: C.textMuted, margin: "4px 0 0" }}>Auto-generated SEO pages with live MLS data</p>
        </div>
        <button onClick={() => runAI("market-report")} style={btnPrimary()}><Plus size={14} /> Generate Report</button>
      </div>
      <div style={gridCols(isMobile, 320)}>
        {REPORTS.map(r => (
          <Card key={r.id} onClick={() => runAI("market-report", r)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div><h3 style={{ fontSize: 16, fontWeight: 600, color: C.text, margin: 0 }}>{r.title}</h3><div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>{r.agent}</div></div>
              <StatusDot status={r.status} />
            </div>
            <div style={urlBadge()}><Globe size={12} /> /market/{r.slug}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
              <div><div style={{ fontSize: 11, color: C.textDim }}>Avg Price</div><div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{r.avgPrice} <span style={{ fontSize: 11, color: C.teal }}>{r.priceChange}</span></div></div>
              <div><div style={{ fontSize: 11, color: C.textDim }}>Inventory</div><div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{r.inv}</div></div>
              <div><div style={{ fontSize: 11, color: C.textDim }}>Days on Market</div><div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{r.dom}</div></div>
              <div><div style={{ fontSize: 11, color: C.textDim }}>Leads</div><div style={{ fontSize: 14, fontWeight: 600, color: C.teal }}>{r.leads}</div></div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: `1px solid ${C.border}`, flexWrap: "wrap", gap: 8 }}>
              <span style={{ fontSize: 12, color: C.textMuted, display: "flex", alignItems: "center", gap: 4 }}><Eye size={12} /> {r.views.toLocaleString()} views</span>
              <Badge color={C.purple}>MLS auto-sync</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  // ----- COMMUNITIES -----
  const CommunitiesView = () => (
    <div>
      <div style={pageHeader(isMobile)}>
        <div>
          <h1 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: C.text, margin: 0 }}>Community Pages</h1>
          <p style={{ fontSize: 14, color: C.textMuted, margin: "4px 0 0" }}>Live MLS-powered community listing pages</p>
        </div>
        <button onClick={() => setToast({ message: "New community wizard — coming in Phase 2", kind: "info" })} style={btnPrimary()}><Plus size={14} /> New Community</button>
      </div>
      <div style={gridCols(isMobile, 320)}>
        {COMMUNITIES.map(c => (
          <Card key={c.id} hover>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 32 }}>{c.icon}</div>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: C.text, margin: 0 }}>{c.name}</h3>
                  <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>{c.type} • {c.area}</div>
                </div>
              </div>
              <Badge color={C.teal}>{c.listings} active</Badge>
            </div>
            <div style={urlBadge()}><Globe size={12} /> /community/{c.slug}</div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.textMuted, flexWrap: "wrap", gap: 4 }}>
              <span>Avg: <strong style={{ color: C.text }}>{c.avgPrice}</strong></span>
              <span>{c.views.toLocaleString()} views</span>
              <span style={{ color: C.teal }}>{c.leads} leads</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  // ----- AGENTS -----
  const AgentsView = () => (
    <div>
      <h1 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: C.text, margin: 0 }}>Subscribing Agents</h1>
      <p style={{ fontSize: 14, color: C.textMuted, margin: "4px 0 24px" }}>Each agent gets a branded subdomain powered by triskope</p>
      <div style={gridCols(isMobile, 340)}>
        {AGENTS.map(a => (
          <Card key={a.id} hover>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <Avatar name={a.name} size={48} color={a.plan === "Enterprise" ? C.purple : a.plan === "Pro" ? C.blue : C.teal} />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: C.text, margin: 0 }}>{a.name}</h3>
                <Badge color={a.plan === "Enterprise" ? C.purple : a.plan === "Pro" ? C.blue : C.teal}>{a.plan}</Badge>
              </div>
            </div>
            <div style={urlBadge()}><Globe size={12} /> {a.website}</div>
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

  // ----- AI TOOLS -----
  const AIView = () => (
    <div>
      <h1 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: C.text, margin: 0 }}>AI Tools</h1>
      <p style={{ fontSize: 14, color: C.textMuted, margin: "4px 0 24px" }}>Generate reports, descriptions, emails, and lead analysis</p>
      <div style={gridCols(isMobile, 280)}>
        {[
          { id: "market-report", icon: BarChart3, title: "Market Report Generator", desc: "AI writes neighborhood analysis from live MLS data", color: C.teal },
          { id: "listing-desc", icon: FileText, title: "Listing Description Writer", desc: "Compelling property copy from photos and details", color: C.blue },
          { id: "email-campaign", icon: Mail, title: "Email Campaign Builder", desc: "Personalized drip sequences from lead profile", color: C.purple },
          { id: "lead-score", icon: Brain, title: "Lead Score Analysis", desc: "Behavioral signals + intent prediction", color: C.red },
        ].map(tool => (
          <Card key={tool.id} hover>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: tool.color + "15", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <tool.icon size={22} color={tool.color} />
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: C.text, margin: "0 0 4px" }}>{tool.title}</h3>
            <p style={{ fontSize: 12, color: C.textMuted, margin: "0 0 12px", lineHeight: 1.5 }}>{tool.desc}</p>
            <button onClick={() => runAI(tool.id, tool.id === "lead-score" ? (selectedLead || leads[0]) : null)} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", borderRadius: 6, border: "none",
              background: `linear-gradient(135deg, ${tool.color}, ${tool.color}cc)`,
              color: tool.color === C.teal || tool.color === C.blue ? "#0a0a14" : "#fff",
              fontSize: 13, fontWeight: 600, cursor: "pointer", minHeight: 44, transition: "transform 0.15s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              <Sparkles size={12} /> Generate
            </button>
          </Card>
        ))}
      </div>
    </div>
  );

  // ----- PLANS -----
  const PlansView = () => (
    <div>
      <h1 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: C.text, margin: 0 }}>Subscription Plans</h1>
      <p style={{ fontSize: 14, color: C.textMuted, margin: "4px 0 24px" }}>Tiered pricing for real estate agents</p>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
        {PLANS.map(p => (
          <Card key={p.name} style={{ borderColor: p.name === "Pro" ? C.blue : C.border, borderWidth: p.name === "Pro" ? 2 : 1, position: "relative" }}>
            {p.name === "Pro" && <Badge color={C.blue}>Most Popular</Badge>}
            <h3 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: "8px 0 4px" }}>{p.name}</h3>
            <div style={{ fontSize: 32, fontWeight: 700, color: C.text }}>${p.price}<span style={{ fontSize: 14, color: C.textDim, fontWeight: 400 }}>/mo</span></div>
            <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 16 }}>{p.agents} agents on this plan</div>
            {p.features.map(f => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontSize: 13, color: C.text }}>
                <Check size={14} color={C.teal} /> {f}
              </div>
            ))}
          </Card>
        ))}
      </div>
    </div>
  );

  // ----- INBOX -----
  const InboxView = () => {
    const [showUnreadOnly, setShowUnreadOnly] = useState(false);
    const shown = NOTIFICATIONS.filter(n => !showUnreadOnly || !notifReads[n.id]);
    return (
      <div>
        <div style={pageHeader(isMobile)}>
          <div>
            <h1 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: C.text, margin: 0 }}>Inbox</h1>
            <p style={{ fontSize: 14, color: C.textMuted, margin: "4px 0 0" }}>
              {unreadNotifs > 0 ? `${unreadNotifs} unread • ${NOTIFICATIONS.length} total` : "All caught up"}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setShowUnreadOnly(o => !o)} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "10px 14px",
              background: showUnreadOnly ? C.teal + "20" : C.bg,
              border: `1px solid ${showUnreadOnly ? C.teal + "55" : C.border}`,
              borderRadius: 8, color: showUnreadOnly ? C.teal : C.text,
              fontSize: 13, fontWeight: 500, cursor: "pointer", minHeight: 44,
            }}>
              <FilterIcon size={14} /> {showUnreadOnly ? "Unread only" : "All"}
            </button>
            <button onClick={markAllNotifsRead} disabled={unreadNotifs === 0} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "10px 14px",
              background: C.bg, border: `1px solid ${C.border}`,
              borderRadius: 8, color: C.text, fontSize: 13, fontWeight: 500,
              cursor: unreadNotifs ? "pointer" : "not-allowed", opacity: unreadNotifs ? 1 : 0.5, minHeight: 44,
            }}>
              <CheckCheck size={14} /> Mark all read
            </button>
          </div>
        </div>

        {shown.length === 0 ? (
          <Card><EmptyState icon={Inbox} title="Inbox zero" message="Everything has been read. We'll surface new items here as they come in." /></Card>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {shown.map(n => {
              const NIcon = NOTIFICATION_ICONS[n.type] || Bell;
              const isUnread = !notifReads[n.id];
              return (
                <Card key={n.id} style={{
                  padding: 14,
                  borderLeft: `3px solid ${isUnread ? n.color : C.border}`,
                  background: isUnread ? C.bgCard : C.bg,
                }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 10,
                      background: n.color + "20", display: "flex",
                      alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <NIcon size={18} color={n.color} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{n.title}</span>
                        {isUnread && <span style={{ width: 6, height: 6, borderRadius: 3, background: n.color }} />}
                      </div>
                      <div style={{ fontSize: 13, color: C.textMuted, marginTop: 4, lineHeight: 1.5 }}>{n.text}</div>
                      <div style={{ display: "flex", gap: 12, marginTop: 8, alignItems: "center", flexWrap: "wrap" }}>
                        <span style={{ fontSize: 11, color: C.textDim }}>{n.time}</span>
                        {n.leadId && (
                          <button onClick={() => { jumpToLead(n.leadId); markNotifRead(n.id); }} style={{
                            background: "none", border: "none", color: C.teal,
                            fontSize: 12, fontWeight: 600, cursor: "pointer", padding: 0,
                          }}>View lead →</button>
                        )}
                        {isUnread && (
                          <button onClick={() => markNotifRead(n.id)} style={{
                            background: "none", border: "none", color: C.textMuted,
                            fontSize: 12, fontWeight: 500, cursor: "pointer", padding: 0,
                          }}>Mark read</button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // ----- TASKS / CALENDAR -----
  const TasksView = () => {
    const sections = [
      { id: "overdue",   title: "Overdue",          tasks: taskBuckets.overdue,   color: C.red,     icon: AlertCircle },
      { id: "today",     title: "Due today",        tasks: taskBuckets.today,     color: C.amber,   icon: CalendarDays },
      { id: "upcoming",  title: "Upcoming",         tasks: taskBuckets.upcoming,  color: C.blue,    icon: Calendar },
      { id: "nodue",     title: "No due date",      tasks: taskBuckets.nodue,     color: C.purple,  icon: Bookmark },
      { id: "completed", title: "Recently completed", tasks: taskBuckets.completed, color: C.teal,  icon: CheckCheck },
    ];
    const totalOpen = taskBuckets.overdue.length + taskBuckets.today.length + taskBuckets.upcoming.length + taskBuckets.nodue.length;

    return (
      <div>
        <h1 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: C.text, margin: 0 }}>Tasks & follow-ups</h1>
        <p style={{ fontSize: 14, color: C.textMuted, margin: "4px 0 16px" }}>
          {totalOpen === 0 ? "No open follow-ups yet — schedule one from any lead's detail page" : `${totalOpen} open across all leads`}
        </p>

        <div style={{ display: "flex", gap: isMobile ? 8 : 12, marginBottom: 16, flexWrap: "wrap" }}>
          <StatCard icon={AlertCircle} label="Overdue"   value={taskBuckets.overdue.length}  color={C.red}    isMobile={isMobile} />
          <StatCard icon={CalendarDays} label="Today"     value={taskBuckets.today.length}    color={C.amber}  isMobile={isMobile} />
          <StatCard icon={Calendar} label="Upcoming"  value={taskBuckets.upcoming.length} color={C.blue}   isMobile={isMobile} />
          <StatCard icon={CheckCircle2} label="Completed" value={allTasks.filter(t => t.done).length} color={C.teal} isMobile={isMobile} />
        </div>

        {totalOpen === 0 && taskBuckets.completed.length === 0 ? (
          <Card>
            <EmptyState
              icon={CalendarPlus}
              title="No follow-ups scheduled yet"
              message="Open any lead, then add a follow-up under the Follow-ups section. It'll show up here grouped by due date."
              action={
                <button onClick={() => setView("leads")} style={{ ...btnPrimary(), marginTop: 16 }}>
                  Go to leads
                </button>
              }
            />
          </Card>
        ) : (
          sections.map(s => (
            s.tasks.length === 0 ? null : (
              <Card key={s.id} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <s.icon size={16} color={s.color} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{s.title}</span>
                  <span style={{ fontSize: 11, color: C.textDim, marginLeft: "auto" }}>{s.tasks.length}</span>
                </div>
                {s.tasks.map(t => (
                  <div key={`${t.leadId}-${t.id}`} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "8px 0", borderBottom: `1px solid ${C.border}`,
                  }}>
                    <button onClick={() => toggleTask(t.leadId, t.id)} style={{
                      background: "none", border: "none", padding: 4, cursor: "pointer",
                      display: "flex", alignItems: "center", color: t.done ? C.teal : C.textDim,
                    }}>
                      {t.done ? <CheckCircle2 size={18} /> : <div style={{ width: 16, height: 16, borderRadius: "50%", border: `1.5px solid ${C.textDim}` }} />}
                    </button>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 13,
                        color: t.done ? C.textDim : C.text,
                        textDecoration: t.done ? "line-through" : "none",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>{t.text}</div>
                      <div style={{ fontSize: 11, color: C.textDim, marginTop: 2, display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {t.lead && (
                          <button onClick={() => jumpToLead(t.leadId)} style={{
                            background: "none", border: "none", color: C.teal,
                            fontSize: 11, cursor: "pointer", padding: 0,
                          }}>{t.lead.name}</button>
                        )}
                        <span>Due {t.due === todayStr ? "today" : t.due ? formatDate(t.due) : "—"}</span>
                      </div>
                    </div>
                    <button onClick={() => deleteTask(t.leadId, t.id)} style={{
                      background: "none", border: "none", padding: 6, cursor: "pointer",
                      color: C.textDim, display: "flex", alignItems: "center",
                    }} aria-label="Delete task"><Trash2 size={14} /></button>
                  </div>
                ))}
              </Card>
            )
          ))
        )}
      </div>
    );
  };

  // ----- LISTINGS -----
  const latLngToSvg = (lat, lng) => {
    const y = 480 - ((lat - 33.485) / 0.335) * 440;
    const x = ((lng - (-79.09)) / 0.38) * 240 + 80;
    return { x: Math.max(20, Math.min(360, x)), y: Math.max(20, Math.min(580, y)) };
  };

  const ListingMap = ({ items }) => (
    <svg viewBox="0 0 400 600" style={{ width: "100%", height: "100%", display: "block", borderRadius: 10, background: C.bg }}>
      <defs>
        <linearGradient id="oceanGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={C.bg} />
          <stop offset="40%" stopColor="#0e1838" />
          <stop offset="100%" stopColor="#13234b" />
        </linearGradient>
        <linearGradient id="landGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f1a2a" />
          <stop offset="100%" stopColor="#13202f" />
        </linearGradient>
      </defs>
      {/* Land */}
      <rect x="0" y="0" width="270" height="600" fill="url(#landGrad)" />
      {/* Coast curve (rough) */}
      <path d="M 270 0 Q 280 60 270 130 Q 260 220 280 320 Q 300 420 280 510 Q 270 580 280 600 L 400 600 L 400 0 Z" fill="url(#oceanGrad)" />
      {/* Coast line */}
      <path d="M 270 0 Q 280 60 270 130 Q 260 220 280 320 Q 300 420 280 510 Q 270 580 280 600"
            fill="none" stroke={C.teal + "33"} strokeWidth="1" />
      {/* Area labels */}
      <text x="200" y="50"  fill={C.textDim} fontSize="11" textAnchor="middle">N. Myrtle Beach</text>
      <text x="200" y="225" fill={C.textDim} fontSize="11" textAnchor="middle">Myrtle Beach</text>
      <text x="180" y="380" fill={C.textDim} fontSize="11" textAnchor="middle">Murrells Inlet</text>
      <text x="180" y="510" fill={C.textDim} fontSize="11" textAnchor="middle">Pawleys Island</text>
      <text x="345" y="320" fill={C.teal + "77"} fontSize="11" fontStyle="italic" textAnchor="middle">Atlantic</text>
      {/* Markers */}
      {items.map(L => {
        const { x, y } = latLngToSvg(L.lat, L.lng);
        const isActive = hoveredListing === L.id || selectedListing?.id === L.id;
        return (
          <g key={L.id}
             onMouseEnter={() => setHoveredListing(L.id)}
             onMouseLeave={() => setHoveredListing(null)}
             onClick={() => setSelectedListing(L)}
             style={{ cursor: "pointer" }}>
            <circle cx={x} cy={y} r={isActive ? 9 : 6} fill={C.teal} opacity={isActive ? 0.4 : 0.2} />
            <circle cx={x} cy={y} r={isActive ? 5 : 4} fill={C.teal} stroke={C.bg} strokeWidth="1.5" />
            {isActive && (
              <g>
                <rect x={x + 10} y={y - 16} width={110} height={28} rx={6} fill={C.bgCard} stroke={C.teal + "55"} />
                <text x={x + 16} y={y - 3} fill={C.text} fontSize="10" fontWeight="600">{formatPrice(L.price)}</text>
                <text x={x + 16} y={y + 8} fill={C.textMuted} fontSize="9">{L.beds}BR · {L.baths}BA</text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );

  const ListingCard = ({ L }) => (
    <Card
      style={{ padding: 0, overflow: "hidden", borderColor: hoveredListing === L.id ? C.teal + "66" : C.border }}
      onClick={() => setSelectedListing(L)}
    >
      <div
        onMouseEnter={() => setHoveredListing(L.id)}
        onMouseLeave={() => setHoveredListing(null)}
      >
        {/* Photo placeholder */}
        <div style={{
          height: 120,
          background: `linear-gradient(135deg, ${C.teal}22, ${C.blue}22, ${C.purple}22)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 48, position: "relative",
        }}>
          {L.photo}
          {L.status === "pending" && (
            <span style={{
              position: "absolute", top: 10, right: 10,
              padding: "2px 8px", borderRadius: 6,
              background: C.amber + "30", color: C.amber,
              fontSize: 10, fontWeight: 700,
            }}>PENDING</span>
          )}
          {L.days <= 5 && (
            <span style={{
              position: "absolute", top: 10, left: 10,
              padding: "2px 8px", borderRadius: 6,
              background: C.red + "30", color: C.red,
              fontSize: 10, fontWeight: 700,
            }}>NEW</span>
          )}
        </div>
        <div style={{ padding: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: C.text }}>{formatPrice(L.price)}</span>
            <span style={{ fontSize: 11, color: C.textDim }}>{L.days}d on market</span>
          </div>
          <div style={{ fontSize: 13, color: C.text, marginBottom: 2 }}>{L.address}</div>
          <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 10 }}>{L.community} • {L.area}</div>
          <div style={{ display: "flex", gap: 12, fontSize: 12, color: C.textMuted, alignItems: "center" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><BedDouble size={12} /> {L.beds}</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Bath size={12} /> {L.baths}</span>
            <span>{L.sqft.toLocaleString()} sqft</span>
          </div>
        </div>
      </div>
    </Card>
  );

  const ListingsView = () => (
    <div>
      <div style={pageHeader(isMobile)}>
        <div>
          <h1 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: C.text, margin: 0 }}>Listings</h1>
          <p style={{ fontSize: 14, color: C.textMuted, margin: "4px 0 0" }}>Active Grand Strand inventory · MLS auto-sync</p>
        </div>
      </div>

      {/* Filter toolbar */}
      <Card style={{ marginBottom: 16, padding: isMobile ? 12 : 16 }}>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 1fr 1fr 1fr" }}>
          <div style={{ position: "relative" }}>
            <Search size={14} color={C.textDim} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text" value={listingSearch}
              onChange={e => setListingSearch(e.target.value)}
              placeholder="Search address, community, area…"
              style={{ width: "100%", padding: "10px 12px 10px 36px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13, outline: "none", minHeight: 44 }}
            />
          </div>
          <select value={listingCommunity} onChange={e => setListingCommunity(e.target.value)} style={selectStyle()}>
            <option value="all">All communities</option>
            {LISTING_COMMUNITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={listingType} onChange={e => setListingType(e.target.value)} style={selectStyle()}>
            <option value="all">Any type</option>
            {LISTING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={listingBeds} onChange={e => setListingBeds(Number(e.target.value))} style={selectStyle()}>
            <option value="0">Any beds</option>
            <option value="2">2+ beds</option>
            <option value="3">3+ beds</option>
            <option value="4">4+ beds</option>
            <option value="5">5+ beds</option>
          </select>
          <div style={{ display: "flex", gap: 6 }}>
            <input type="number" value={listingMinPrice} onChange={e => setListingMinPrice(e.target.value)} placeholder="Min $" style={priceInputStyle()} />
            <input type="number" value={listingMaxPrice} onChange={e => setListingMaxPrice(e.target.value)} placeholder="Max $" style={priceInputStyle()} />
          </div>
        </div>
        <div style={{ fontSize: 12, color: C.textMuted, marginTop: 10 }}>
          Showing {filteredListings.length} of {LISTINGS.length} listings
          {(listingSearch || listingCommunity !== "all" || listingType !== "all" || listingBeds || listingMinPrice || listingMaxPrice) && (
            <button onClick={() => {
              setListingSearch(""); setListingCommunity("all"); setListingType("all");
              setListingBeds(0); setListingMinPrice(""); setListingMaxPrice("");
            }} style={{
              marginLeft: 12, background: "none", border: "none", color: C.teal,
              cursor: "pointer", fontSize: 12, fontWeight: 600,
            }}>Clear filters</button>
          )}
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.6fr 1fr", gap: 16 }}>
        {/* Listings grid */}
        <div>
          {filteredListings.length === 0 ? (
            <Card><EmptyState icon={Search} title="No listings match" message="Adjust filters to broaden the search." /></Card>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
              {filteredListings.map(L => <ListingCard key={L.id} L={L} />)}
            </div>
          )}
        </div>

        {/* Map */}
        <Card style={{ padding: 12, position: isMobile ? "static" : "sticky", top: 16, height: isMobile ? 360 : 600 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <MapPin size={14} color={C.teal} />
            <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Map view</span>
            <span style={{ fontSize: 11, color: C.textDim, marginLeft: "auto" }}>{filteredListings.length} markers</span>
          </div>
          <div style={{ height: "calc(100% - 28px)" }}>
            <ListingMap items={filteredListings} />
          </div>
        </Card>
      </div>
    </div>
  );

  const ListingDetailModal = () => {
    if (!selectedListing) return null;
    const L = selectedListing;
    return (
      <div onClick={() => setSelectedListing(null)} style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 450, padding: isMobile ? 0 : 20,
      }}>
        <div onClick={e => e.stopPropagation()} style={{
          background: C.bgCard, borderRadius: isMobile ? 0 : 14,
          width: isMobile ? "100%" : "100%", maxWidth: 560,
          maxHeight: isMobile ? "100%" : "92vh", overflow: "auto",
          border: `1px solid ${C.border}`,
        }}>
          <div style={{
            height: 180,
            background: `linear-gradient(135deg, ${C.teal}30, ${C.blue}30, ${C.purple}30)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 72, position: "relative",
          }}>
            {L.photo}
            <button onClick={() => setSelectedListing(null)} style={{
              position: "absolute", top: 12, right: 12,
              background: "rgba(10,10,20,0.55)", border: "none",
              color: C.text, fontSize: 18, cursor: "pointer",
              width: 36, height: 36, borderRadius: 18,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>×</button>
          </div>
          <div style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
              <span style={{ fontSize: 26, fontWeight: 700, color: C.text }}>{formatPrice(L.price)}</span>
              <Badge color={L.status === "pending" ? C.amber : C.teal}>{L.status}</Badge>
            </div>
            <div style={{ fontSize: 15, color: C.text, marginBottom: 2 }}>{L.address}</div>
            <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 16 }}>{L.community} • {L.area}</div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16 }}>
              {[
                { label: "Beds", value: L.beds, icon: BedDouble },
                { label: "Baths", value: L.baths, icon: Bath },
                { label: "Sqft", value: L.sqft.toLocaleString(), icon: Building2 },
                { label: "DOM", value: L.days, icon: Clock },
              ].map(s => (
                <div key={s.label} style={{ padding: 10, background: C.bg, borderRadius: 8, border: `1px solid ${C.border}`, textAlign: "center" }}>
                  <s.icon size={14} color={C.textDim} style={{ marginBottom: 4 }} />
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ padding: 12, background: C.bg, borderRadius: 8, border: `1px solid ${C.border}`, marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: C.textDim, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Listing agent</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar name={L.agent} size={36} color={C.teal} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{L.agent}</div>
                  <div style={{ fontSize: 11, color: C.textDim }}>{L.type}</div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button onClick={() => setToast({ message: "Showing request sent", kind: "success" })} style={btnPrimary()}>
                <Calendar size={14} /> Schedule showing
              </button>
              <button onClick={() => runAI("listing-desc", L)} style={quickAction(C.purple)}>
                <Sparkles size={14} /> Generate copy
              </button>
              <button onClick={() => setToast({ message: "Saved to favorites", kind: "success" })} style={quickAction(C.teal)}>
                <Bookmark size={14} /> Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderView = () => {
    switch (view) {
      case "inbox": return <InboxView />;
      case "leads": return <LeadsView />;
      case "pipeline": return <PipelineView />;
      case "tasks": return <TasksView />;
      case "listings": return <ListingsView />;
      case "reports": return <ReportsView />;
      case "communities": return <CommunitiesView />;
      case "agents": return <AgentsView />;
      case "ai": return <AIView />;
      case "billing": return <PlansView />;
      default: return <Dashboard />;
    }
  };

  // Inline style helpers (closures over C/isMobile)
  function btnPrimary() {
    return {
      display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 8,
      border: "none", background: `linear-gradient(135deg, ${C.teal}, ${C.blue})`,
      color: "#0a0a14", fontSize: 13, fontWeight: 600, cursor: "pointer",
      minHeight: 44, transition: "transform 0.15s ease, filter 0.15s ease",
    };
  }
  function cardTitle() {
    return { fontSize: 15, fontWeight: 600, color: C.text, margin: "0 0 16px" };
  }
  function pageHeader(mob) {
    return {
      display: "flex", justifyContent: "space-between",
      alignItems: mob ? "flex-start" : "center",
      marginBottom: 24, flexDirection: mob ? "column" : "row",
      gap: mob ? 12 : 0,
    };
  }
  function gridCols(mob, minW) {
    return { display: "grid", gridTemplateColumns: mob ? "1fr" : `repeat(auto-fill, minmax(${minW}px, 1fr))`, gap: 16 };
  }
  function urlBadge() {
    return {
      display: "flex", alignItems: "center", gap: 6, padding: "6px 10px",
      background: C.bg, borderRadius: 6, marginBottom: 12, fontSize: 11,
      color: C.teal, fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
    };
  }
  function quickAction(color) {
    return {
      display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 14px",
      borderRadius: 8, border: `1px solid ${color}40`,
      background: color + "12", color, fontSize: 13, fontWeight: 600,
      textDecoration: "none", cursor: "pointer", minHeight: 44,
      transition: "background 0.15s ease",
    };
  }
  function selectStyle() {
    return {
      padding: "10px 12px", background: C.bg, border: `1px solid ${C.border}`,
      borderRadius: 8, color: C.text, fontSize: 13, outline: "none",
      minHeight: 44, cursor: "pointer", appearance: "none",
      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238888a8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 10px center",
      paddingRight: 32,
    };
  }
  function priceInputStyle() {
    return {
      width: "100%", padding: "10px 10px", background: C.bg, border: `1px solid ${C.border}`,
      borderRadius: 8, color: C.text, fontSize: 12, outline: "none", minHeight: 44,
    };
  }

  const currentPhases = aiType ? (THINKING_PHASES[aiType] || THINKING_PHASES["market-report"]) : [];

  // -------- AUTH GATE --------
  if (authLoading) {
    return (
      <div style={{
        minHeight: "100vh", background: C.bg, color: C.text,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: 12,
        fontFamily: "-apple-system, system-ui, sans-serif",
      }}>
        <TriskopeLogo size={48} />
        <Loader2 size={20} color={C.teal} style={{ animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }
  if (!session) return <Auth />;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "-apple-system, system-ui, sans-serif" }}>
      <style>{`
        @keyframes tk-toast { from { opacity: 0; transform: translate(-50%, 8px); } to { opacity: 1; transform: translate(-50%, 0); } }
        @keyframes tk-pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
        @keyframes tk-fade { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        .tk-cursor { display: inline-block; width: 8px; height: 14px; background: ${C.teal}; vertical-align: middle; margin-left: 2px; animation: tk-pulse 0.9s ease-in-out infinite; }
        .tk-view { animation: tk-fade 0.25s ease; }
        button:focus-visible, a:focus-visible { outline: 2px solid ${C.teal}; outline-offset: 2px; }
      `}</style>

      {/* Mobile header */}
      {isMobile && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, height: 56, background: C.bgCard,
          borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "0 16px", zIndex: 200,
        }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
            background: "none", border: "none", color: C.text, cursor: "pointer",
            padding: 8, minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center",
          }} aria-label="Toggle menu">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <TriskopeLogo size={28} />
            <span style={{ fontSize: 15, fontWeight: 700, color: C.text, letterSpacing: "0.08em" }}>triskope</span>
          </div>
          <button onClick={() => runAI("market-report", REPORTS[0])} style={{
            background: `linear-gradient(135deg, ${C.teal}, ${C.blue})`, border: "none",
            borderRadius: 8, padding: "0 12px", color: "#0a0a14", fontSize: 13, fontWeight: 700,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 6, minHeight: 44, minWidth: 44,
          }} aria-label="AI Insights">
            <Sparkles size={16} /> AI
          </button>
        </div>
      )}

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 250,
        }} />
      )}

      {/* Sidebar */}
      <aside style={{
        width: 240, background: C.bgCard, borderRight: `1px solid ${C.border}`,
        padding: 20, flexShrink: 0, display: "flex", flexDirection: "column",
        ...(isMobile ? {
          position: "fixed", top: 0, left: sidebarOpen ? 0 : -260, bottom: 0,
          zIndex: 300, transition: "left 0.25s ease", overflowY: "auto", paddingTop: 20,
        } : {}),
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
          <TriskopeLogo size={36} />
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.text, letterSpacing: "0.08em" }}>triskope</div>
            <div style={{ fontSize: 9, color: C.textDim, letterSpacing: "0.15em", textTransform: "uppercase" }}>see everything together</div>
          </div>
        </div>

        <nav style={{ flex: 1 }}>
          {nav.map(item => {
            const Icon = item.icon;
            const active = view === item.id;
            return (
              <button key={item.id}
                onClick={() => { setView(item.id); setSelectedLead(null); if (isMobile) setSidebarOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%",
                  padding: isMobile ? "12px 12px" : "10px 12px", marginBottom: 4, borderRadius: 8, border: "none",
                  background: active ? `linear-gradient(135deg, ${C.teal}18, ${C.blue}12)` : "transparent",
                  color: active ? C.teal : C.textMuted,
                  fontSize: isMobile ? 14 : 13, fontWeight: 500, cursor: "pointer", textAlign: "left",
                  minHeight: isMobile ? 48 : 40, transition: "background 0.15s ease, color 0.15s ease",
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = C.bgHover; e.currentTarget.style.color = C.text; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.textMuted; } }}
              >
                <Icon size={isMobile ? 18 : 16} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.id === "inbox" && unreadNotifs > 0 && (
                  <span style={{
                    padding: "1px 7px", borderRadius: 9999,
                    background: C.red, color: "#fff", fontSize: 10, fontWeight: 700,
                    minWidth: 18, textAlign: "center",
                  }}>{unreadNotifs}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div style={{ paddingTop: 16, borderTop: `1px solid ${C.border}`, marginTop: 12 }}>
          {/* User block */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 8px", borderRadius: 8,
            background: C.bg, border: `1px solid ${C.border}`, marginBottom: 10,
          }}>
            <Avatar name={profile?.display_name || session?.user?.email || "user"} size={32} color={C.teal} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {profile?.display_name || (session?.user?.email || "").split("@")[0]}
              </div>
              <div style={{ fontSize: 10, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {profile?.role || "agent"}
              </div>
            </div>
            <button onClick={signOut} title="Sign out" style={{
              background: "none", border: "none", padding: 6, cursor: "pointer",
              color: C.textDim, display: "flex", alignItems: "center", borderRadius: 6,
            }}
              onMouseEnter={e => { e.currentTarget.style.background = C.bgHover; e.currentTarget.style.color = C.red; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.textDim; }}>
              <LogOut size={14} />
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10, color: C.textDim, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            <TriskopeLogo size={20} />
            <span>powered by <span style={{ color: C.blue, fontWeight: 600 }}>triskope</span></span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: isMobile ? "72px 16px 24px" : 32, overflow: "auto", minWidth: 0 }}>
        <div key={view + (selectedLead?.id || "")} className="tk-view">
          {renderView()}
        </div>
      </main>

      {/* AI Panel */}
      {aiOpen && (
        <div onClick={() => setAiOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "flex-end", zIndex: 400 }}>
          <div onClick={e => e.stopPropagation()} style={{
            width: isMobile ? "100%" : 520, maxWidth: "100%",
            background: C.bgCard, borderLeft: isMobile ? "none" : `1px solid ${C.border}`,
            padding: isMobile ? 16 : 24, overflow: "auto",
            display: "flex", flexDirection: "column",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <Brain size={20} color={C.teal} />
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: 0 }}>
                  {aiType === "market-report" && "Market Report Generator"}
                  {aiType === "listing-desc" && "Listing Description Writer"}
                  {aiType === "email-campaign" && "Email Campaign Builder"}
                  {aiType === "lead-score" && "Lead Score Analysis"}
                </h2>
                <div style={{ fontSize: 11, color: C.textDim }}>
                  {aiType === "lead-score" && aiCtx?.name ? `Context: ${aiCtx.name}` :
                   aiCtx?.title ? `Context: ${aiCtx.title}` : "Demo output"}
                </div>
              </div>
              <button onClick={() => setAiOpen(false)} style={{ marginLeft: "auto", background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: 20, padding: 8, minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center" }} aria-label="Close panel">×</button>
            </div>

            {aiBusy ? (
              <div style={{ padding: "20px 0", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, color: C.teal }}>
                  <Sparkles size={18} className="" />
                  <span style={{ fontSize: 14, fontWeight: 600 }}>Thinking...</span>
                </div>
                {currentPhases.map((p, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "8px 0",
                    fontSize: 13, color: i < aiPhase ? C.text : i === aiPhase ? C.teal : C.textDim,
                    transition: "color 0.2s ease",
                  }}>
                    <div style={{
                      width: 16, height: 16, borderRadius: "50%",
                      background: i < aiPhase ? C.teal : "transparent",
                      border: `1.5px solid ${i <= aiPhase ? C.teal : C.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {i < aiPhase && <Check size={10} color="#0a0a14" />}
                      {i === aiPhase && <div style={{ width: 6, height: 6, borderRadius: 3, background: C.teal, animation: "tk-pulse 0.8s ease-in-out infinite" }} />}
                    </div>
                    {p}
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div onClick={skipStreaming}
                     style={{
                       whiteSpace: "pre-wrap", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                       fontSize: 13, color: C.text, lineHeight: 1.65,
                       background: C.bg, padding: 16, borderRadius: 8,
                       border: `1px solid ${C.border}`, flex: 1, minHeight: 200,
                       cursor: aiStreaming ? "pointer" : "default",
                     }}>
                  {aiStreamed || aiOut}
                  {aiStreaming && <span className="tk-cursor" />}
                </div>
                {aiStreaming && (
                  <div style={{ fontSize: 11, color: C.textDim, marginTop: 6, textAlign: "right" }}>
                    Click output to skip streaming
                  </div>
                )}
                <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                  <button onClick={copyAI} disabled={aiStreaming} style={aiActionBtn(aiStreaming)}>
                    <Copy size={14} /> Copy
                  </button>
                  <button onClick={regenerateAI} style={aiActionBtn(false)}>
                    <RefreshCw size={14} /> Regenerate
                  </button>
                  <button onClick={() => { setToast({ message: "Saved to drafts", kind: "success" }); }} disabled={aiStreaming} style={aiActionBtn(aiStreaming)}>
                    <Check size={14} /> Save
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <ListingDetailModal />

      {toast && <Toast message={toast.message} kind={toast.kind} onDismiss={() => setToast(null)} />}
    </div>
  );
}

function aiActionBtn(disabled) {
  return {
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "10px 14px", borderRadius: 8,
    border: `1px solid ${C.border}`, background: C.bg, color: C.text,
    fontSize: 13, fontWeight: 500, cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1, minHeight: 44,
    transition: "background 0.15s ease, border-color 0.15s ease",
  };
}
