import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import {
  Home, Users, FileText, Map, Brain, Settings, Plus, ChevronRight, ChevronLeft,
  TrendingUp, Mail, Phone, Globe, Eye, Target, BarChart3, ExternalLink,
  Copy, Check, DollarSign, Award, MapPin, Sparkles, Menu, X,
  Calendar, Clock, MessageSquare, RefreshCw, Search, Tag, Bell, Activity, Inbox,
  Layers, GripVertical, ArrowUpDown, ChevronDown, CalendarPlus, Trash2, CheckCircle2
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

const LEADS = [
  {
    id: 1, name: "Robert Williams", source: "Market Report — Myrtle Beach", status: "hot", score: 94,
    agent: "Sarah Mitchell", interest: "Buying", budget: "$350K-$450K", area: "Myrtle Beach",
    phone: "(843) 555-0142", email: "rwilliams@gmail.com", lastContact: "2h ago", addedDays: 12,
    tags: ["pre-approved", "out-of-state", "oceanfront"],
    aiNotes: "High-intent buyer relocating from Charlotte. Viewed the Myrtle Beach market report 4 times in the past week and clicked through to 3 oceanfront condo listings on Ocean Boulevard. Pre-approval letter on file ($475K). Likely closing window: 30-60 days.",
    activity: [
      { type: "view", text: "Viewed 1247 Ocean Blvd #802", time: "2h ago", icon: "Eye" },
      { type: "view", text: "Re-opened Myrtle Beach market report", time: "5h ago", icon: "FileText" },
      { type: "email", text: "Opened drip email “Spring buyers guide”", time: "yesterday", icon: "Mail" },
      { type: "call", text: "Sarah called — 8 min conversation", time: "3 days ago", icon: "Phone" },
      { type: "form", text: "Submitted contact form", time: "12 days ago", icon: "MessageSquare" },
    ],
  },
  {
    id: 2, name: "Jennifer Adams", source: "Community Page — Barefoot Resort", status: "hot", score: 88,
    agent: "James Parker", interest: "Buying", budget: "$500K-$700K", area: "North Myrtle Beach",
    phone: "(843) 555-0287", email: "jadams.nyc@outlook.com", lastContact: "yesterday", addedDays: 8,
    tags: ["relocating", "golf", "luxury"],
    aiNotes: "Relocating from Manhattan after husband's retirement. Budget flexible, primary interest is Barefoot Resort and Grande Dunes. Husband plays golf 4x/week — golf community is critical. Mentioned wanting to be settled before October.",
    activity: [
      { type: "view", text: "Viewed Barefoot Resort homes", time: "yesterday", icon: "Eye" },
      { type: "email", text: "Replied to James's email", time: "yesterday", icon: "Mail" },
      { type: "call", text: "James called — 22 min discovery call", time: "2 days ago", icon: "Phone" },
      { type: "form", text: "Submitted community page form", time: "8 days ago", icon: "MessageSquare" },
    ],
  },
  {
    id: 3, name: "David Thompson", source: "Agent Website", status: "nurture", score: 62,
    agent: "Lisa Chen", interest: "Selling", budget: "Listing ~$320K", area: "Surfside Beach",
    phone: "(843) 555-0319", email: "dthompson74@yahoo.com", lastContact: "5 days ago", addedDays: 21,
    tags: ["seller", "timeline-3-6mo"],
    aiNotes: "Considering selling his Surfside Beach home in 3-6 months. Current Zestimate ~$320K. Wants to upgrade to single-story before retirement. Hasn't decided yet on listing now vs. spring 2026.",
    activity: [
      { type: "view", text: "Viewed CMA estimate page", time: "5 days ago", icon: "FileText" },
      { type: "email", text: "Opened “What's your home worth?”", time: "1 week ago", icon: "Mail" },
      { type: "form", text: "Requested home valuation", time: "21 days ago", icon: "MessageSquare" },
    ],
  },
  {
    id: 4, name: "Maria Garcia", source: "Market Report — Conway", status: "nurture", score: 55,
    agent: "Marcus Johnson", interest: "Buying", budget: "$200K-$300K", area: "Conway",
    phone: "(843) 555-0451", email: "maria.garcia.sc@gmail.com", lastContact: "1 week ago", addedDays: 18,
    tags: ["first-time", "needs-preapproval"],
    aiNotes: "First-time buyer, single mom with two kids. Browsing 3BR homes in Conway under $290K. Has not yet secured pre-approval; Marcus referred her to a local lender. Strong school district priority.",
    activity: [
      { type: "view", text: "Viewed 14 Conway listings", time: "1 week ago", icon: "Eye" },
      { type: "email", text: "Marcus sent lender referral", time: "1 week ago", icon: "Mail" },
      { type: "form", text: "Subscribed to Conway market report", time: "18 days ago", icon: "MessageSquare" },
    ],
  },
  {
    id: 5, name: "Karen Lee", source: "Market Report — Pawleys Island", status: "hot", score: 91,
    agent: "Sarah Mitchell", interest: "Buying", budget: "$400K-$550K", area: "Pawleys Island",
    phone: "(843) 555-0598", email: "kmlee.coastal@gmail.com", lastContact: "30 min ago", addedDays: 6,
    tags: ["pre-approved", "waterfront", "ready-to-offer"],
    aiNotes: "Pre-approved up to $575K. Specifically wants Pawleys Island creekfront or oceanfront. Just toured 142 Springs Ave in person on Saturday — said she would “make an offer this week” pending inspection report. Closing on her current home in Atlanta in 3 weeks.",
    activity: [
      { type: "call", text: "Sarah called — discussing offer terms", time: "30 min ago", icon: "Phone" },
      { type: "view", text: "Re-viewed 142 Springs Ave", time: "today", icon: "Eye" },
      { type: "showing", text: "In-person showing — 142 Springs Ave", time: "Saturday", icon: "MapPin" },
      { type: "form", text: "Submitted Pawleys Island form", time: "6 days ago", icon: "MessageSquare" },
    ],
  },
  {
    id: 6, name: "Steve Chen", source: "Agent Website", status: "new", score: 45,
    agent: null, interest: "Buying", budget: "$250K-$350K", area: "Murrells Inlet",
    phone: "(843) 555-0673", email: "stevechen.work@gmail.com", lastContact: "—", addedDays: 1,
    tags: ["new-lead", "auto-qualifying"],
    aiNotes: "Just signed up yesterday. AI is auto-qualifying based on session behavior: 8 listings viewed, 4.2 min avg engagement, returned to site 3x. No phone conversation yet. Recommended next action: warm outreach within 24h.",
    activity: [
      { type: "view", text: "Viewed 8 Murrells Inlet listings", time: "yesterday", icon: "Eye" },
      { type: "form", text: "Signed up for newsletter", time: "yesterday", icon: "MessageSquare" },
    ],
  },
  {
    id: 7, name: "Patricia Moore", source: "Community Page — Carolina Forest", status: "new", score: 52,
    agent: null, interest: "Buying", budget: "$300K-$400K", area: "Carolina Forest",
    phone: "(843) 555-0712", email: "p.moore.family@outlook.com", lastContact: "—", addedDays: 2,
    tags: ["family", "schools", "new-lead"],
    aiNotes: "Family of four relocating from Raleigh for her husband's hospital job at Conway Medical. Two kids ages 8 and 11 — schools are her top priority. Asked specifically about Ocean Bay and Forestbrook elementary zones.",
    activity: [
      { type: "view", text: "Viewed school district overlay", time: "yesterday", icon: "Eye" },
      { type: "view", text: "Viewed Carolina Forest community page", time: "2 days ago", icon: "Eye" },
      { type: "form", text: "Submitted contact form", time: "2 days ago", icon: "MessageSquare" },
    ],
  },
  {
    id: 8, name: "Tom Baker", source: "Community Page — Grande Dunes", status: "cold", score: 28,
    agent: "Amy Rodriguez", interest: "Investing", budget: "$600K+", area: "Myrtle Beach",
    phone: "(843) 555-0884", email: "tbaker.investments@protonmail.com", lastContact: "3 weeks ago", addedDays: 64,
    tags: ["investor", "low-engagement"],
    aiNotes: "Investor based in Cleveland. Browsed Grande Dunes a few times two months ago. Hasn't engaged with emails in 3+ weeks. Likely paused his search.",
    activity: [
      { type: "email", text: "Email bounced — auto reply", time: "3 weeks ago", icon: "Mail" },
      { type: "view", text: "Last site visit", time: "5 weeks ago", icon: "Eye" },
      { type: "form", text: "Submitted Grande Dunes form", time: "9 weeks ago", icon: "MessageSquare" },
    ],
  },
  {
    id: 9, name: "Daniel & Rachel Foster", source: "Market Report — North Myrtle Beach", status: "hot", score: 86,
    agent: "James Parker", interest: "Buying", budget: "$650K-$850K", area: "North Myrtle Beach",
    phone: "(843) 555-0921", email: "fosters.move@gmail.com", lastContact: "today", addedDays: 4,
    tags: ["dual-income", "pre-approved", "urgent"],
    aiNotes: "Tech couple from Austin, both remote. Pre-approved up to $900K. Looking for a primary residence with home office and pool. Have a 30-day timeline tied to lease end in Austin.",
    activity: [
      { type: "showing", text: "Toured 3 homes in NMB with James", time: "today", icon: "MapPin" },
      { type: "view", text: "Re-viewed NMB market report", time: "yesterday", icon: "FileText" },
      { type: "email", text: "Booked Saturday tour", time: "2 days ago", icon: "Mail" },
      { type: "form", text: "Submitted NMB report form", time: "4 days ago", icon: "MessageSquare" },
    ],
  },
  {
    id: 10, name: "Linda Wexler", source: "Community Page — Litchfield Beach", status: "nurture", score: 68,
    agent: "Sarah Mitchell", interest: "Buying", budget: "$450K-$600K", area: "Pawleys Island",
    phone: "(843) 555-0987", email: "lwex55@yahoo.com", lastContact: "6 days ago", addedDays: 32,
    tags: ["second-home", "boomer"],
    aiNotes: "Looking for a second home / future retirement property in Litchfield. Husband not on board yet — she's the decision driver. Plans to visit in 6 weeks.",
    activity: [
      { type: "email", text: "Replied — confirming September visit", time: "6 days ago", icon: "Mail" },
      { type: "view", text: "Viewed Litchfield Beach listings", time: "10 days ago", icon: "Eye" },
      { type: "form", text: "Subscribed to community updates", time: "32 days ago", icon: "MessageSquare" },
    ],
  },
  {
    id: 11, name: "Marcus & Tonya Reed", source: "Agent Website", status: "nurture", score: 71,
    agent: "Marcus Johnson", interest: "Buying", budget: "$280K-$340K", area: "Carolina Forest",
    phone: "(843) 555-1042", email: "reed.family5@gmail.com", lastContact: "4 days ago", addedDays: 14,
    tags: ["growing-family", "needs-4br"],
    aiNotes: "Local family currently renting, looking to buy first home. Wife pregnant with their third — need 4BR minimum. Pre-approval in progress; loan officer expects clearance within 2 weeks.",
    activity: [
      { type: "view", text: "Viewed 4BR Carolina Forest homes", time: "4 days ago", icon: "Eye" },
      { type: "email", text: "Marcus sent 4BR shortlist", time: "5 days ago", icon: "Mail" },
      { type: "form", text: "Requested 4BR alerts", time: "14 days ago", icon: "MessageSquare" },
    ],
  },
  {
    id: 12, name: "Anthony Russo", source: "Community Page — Market Common", status: "new", score: 58,
    agent: null, interest: "Buying", budget: "$375K-$475K", area: "Myrtle Beach",
    phone: "(843) 555-1158", email: "arusso.philly@gmail.com", lastContact: "—", addedDays: 3,
    tags: ["walkable", "new-lead"],
    aiNotes: "Just relocated to Myrtle Beach for new restaurant management job. Currently renting near Market Common — wants to buy in the same walkable district. First-time buyer; no pre-approval yet.",
    activity: [
      { type: "view", text: "Viewed Market Common condos", time: "yesterday", icon: "Eye" },
      { type: "form", text: "Submitted Market Common form", time: "3 days ago", icon: "MessageSquare" },
    ],
  },
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

// Pipeline stages — used by the Kanban view
const STAGES = [
  { id: "new",       label: "New",       color: "#818cf8" }, // blue
  { id: "contacted", label: "Contacted", color: "#a78bfa" }, // purple
  { id: "qualified", label: "Qualified", color: "#5eead4" }, // teal
  { id: "showing",   label: "Showing",   color: "#f59e0b" }, // amber
  { id: "offer",     label: "Offer",     color: "#10b981" }, // green
  { id: "closed",    label: "Closed",    color: "#55557a" }, // dim
];

// Initial stage assignment per lead id — derived from each lead's situation
const LEAD_STAGE_INIT = {
  1: "qualified", 2: "contacted", 3: "qualified", 4: "contacted",
  5: "offer",     6: "new",       7: "new",       8: "contacted",
  9: "showing",  10: "contacted",11: "qualified",12: "new",
};

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
  const [leadStages, setLeadStages] = useState(LEAD_STAGE_INIT);
  const [leadNotes, setLeadNotes] = useState({});   // { leadId: [{ id, text, createdAt }] }
  const [leadTasks, setLeadTasks] = useState({});   // { leadId: [{ id, text, due, done }] }
  const [noteDraft, setNoteDraft] = useState("");
  const [taskDraft, setTaskDraft] = useState("");
  const [taskDueDraft, setTaskDueDraft] = useState("");
  const [draggingId, setDraggingId] = useState(null);
  const [stageMenuFor, setStageMenuFor] = useState(null); // leadId whose stage menu is open

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    setLeadStages(prev => ({ ...prev, [leadId]: stageId }));
    const lead = LEADS.find(l => l.id === leadId);
    const stage = STAGES.find(s => s.id === stageId);
    if (lead && stage) setToast({ message: `${lead.name.split(" ")[0]} moved to ${stage.label}`, kind: "success" });
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

  const filteredLeads = LEADS
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

  const statusCounts = LEADS.reduce((acc, l) => {
    acc.all = (acc.all || 0) + 1;
    acc[l.status] = (acc[l.status] || 0) + 1;
    return acc;
  }, {});

  const nav = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "leads", label: "Leads", icon: Users },
    { id: "pipeline", label: "Pipeline", icon: Layers },
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
        {LEADS.filter(l => l.status === "hot").map(lead => (
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
        <LeadCards leads={filteredLeads} />
      ) : (
        <LeadTable leads={filteredLeads} />
      )}
    </div>
  );

  const LeadDetail = ({ lead }) => {
    const notes = leadNotes[lead.id] || [];
    const tasks = leadTasks[lead.id] || [];
    const stage = leadStages[lead.id];
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

  const LeadCards = ({ leads }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ fontSize: 12, color: C.textMuted, padding: "0 4px" }}>
        Showing {leads.length} of {LEADS.length} leads
      </div>
      {leads.map(lead => (
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

  const LeadTable = ({ leads }) => (
    <>
      <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 8, padding: "0 4px" }}>
        Showing {leads.length} of {LEADS.length} leads
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
            {leads.map(lead => (
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
    const stageLeads = (stageId) => LEADS.filter(l => leadStages[l.id] === stageId);

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
                  const id = parseInt(e.dataTransfer.getData("leadId"));
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
            <button onClick={() => runAI(tool.id, tool.id === "lead-score" ? (selectedLead || LEADS[0]) : null)} style={{
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

  const renderView = () => {
    switch (view) {
      case "leads": return <LeadsView />;
      case "pipeline": return <PipelineView />;
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

  const currentPhases = aiType ? (THINKING_PHASES[aiType] || THINKING_PHASES["market-report"]) : [];

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
                <Icon size={isMobile ? 18 : 16} /> {item.label}
              </button>
            );
          })}
        </nav>

        <div style={{ paddingTop: 24, borderTop: `1px solid ${C.border}` }}>
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
