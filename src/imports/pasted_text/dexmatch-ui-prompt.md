# DexMatch — Complete UI Overhaul Prompt v3.0
## Clean, Functional, Modern — Full Replacement

> **This document fully supersedes all previous DexMatch prompts (v1.1 and v2.0 Addendum).**
> Rebuild the entire interface from scratch using these specifications.

---

## CORE PHILOSOPHY

This is a **professional job-matching tool** — not a game UI. The Pokémon theme is expressed through data (companies, roles, regions, Pokémon sprites) and subtle brand touches, not through heavy game aesthetics, excessive animation, or decorative noise.

**Design principles:**
- Information hierarchy is the primary design tool
- Every element earns its place — if it doesn't aid comprehension or action, remove it
- Interactions are immediate and purposeful — no multi-step ceremonies
- The layout anticipates the user's next question before they ask it
- Custom SVG icons only — zero emoji, zero library icons

---

## PART 1 — DESIGN SYSTEM

### 1.1 Color Tokens

```css
:root {
  /* Brand */
  --navy:        #0F1224;
  --navy-mid:    #1A1E35;
  --navy-lift:   #252A45;
  --red:         #D93922;
  --red-hover:   #C22E19;
  --gold:        #E8B84B;

  /* Surfaces */
  --bg:          #F2F1ED;
  --surface:     #FFFFFF;
  --surface-2:   #F7F6F3;
  --border:      #E2DFD6;
  --border-2:    #CBC7BC;

  /* Text */
  --t1:          #111318;   /* primary — headings */
  --t2:          #3A3D4A;   /* secondary — body */
  --t3:          #6B6F7E;   /* muted — meta */
  --t4:          #9EA3B0;   /* faint — timestamps, placeholders */

  /* Semantic */
  --green:       #0D9C6B;
  --green-bg:    #E8F7F2;
  --amber:       #C47F12;
  --amber-bg:    #FDF4E3;
  --red-bg:      #FDECEA;

  /* Shadows — applied with box-shadow only, no filter:drop-shadow on layout */
  --s1: 0 1px 3px rgba(0,0,0,0.07);
  --s2: 0 3px 10px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05);
  --s3: 0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.05);
  --s4: 0 20px 48px rgba(0,0,0,0.13), 0 6px 16px rgba(0,0,0,0.07);
}
```

### 1.2 Typography

Import only:
```html
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
```

| Role | Family | Weight | Size |
|---|---|---|---|
| Brand wordmark | DM Sans | 800 | 17px |
| Page headline | DM Sans | 700 | 32px |
| Section title | DM Sans | 700 | 16px |
| Card title (job) | DM Sans | 700 | 15px |
| Card title (company) | DM Sans | 600 | 13px |
| Body / description | DM Sans | 400 | 13px |
| Meta / labels | DM Sans | 500 | 11px |
| Numbers / salary | DM Mono | 500 | 13px |
| Badge text | DM Sans | 600 | 10px |

`letter-spacing` — use sparingly: only on uppercase labels (`0.06em`), never on body text.
`line-height` — body: `1.7`, headings: `1.2`, meta: `1.4`.

### 1.3 Animation — Strict Constraints

**Permitted animations only:**
```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
@keyframes progressFill {
  from { width: 0; }
}
```

**Rules:**
- `fadeUp`: cards mounting only, `0.22s ease`, max 3 staggered items at once (40ms delay)
- `fadeIn`: panels, modals, dropdowns — `0.15s ease`
- `spin`: only on the CV upload spinner — single SVG element, never the whole component
- `progressFill`: score bars only, `0.8s ease-out` on mount
- `transition` on interactive elements: `0.15s ease` for color/border/shadow changes only
- **Zero** bounce, spring, slide-in-from-sides, scale-bounce, or shimmer animations anywhere

---

## PART 2 — CUSTOM SVG ICON SYSTEM

Build these as React components. No emoji. No icon libraries. All icons are geometric, single-color, 16×16 or 20×20 viewBox.

### Icon Components

```jsx
// Usage: <Icon.Location size={16} color="var(--t3)" />
// All icons accept: size (number), color (string), strokeWidth (number, default 1.5)

const Icon = {

  Location: ({size=16, color="currentColor", sw=1.5}) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5C5.515 1.5 3.5 3.515 3.5 6c0 3.75 4.5 8.5 4.5 8.5S12.5 9.75 12.5 6c0-2.485-2.015-4.5-4.5-4.5Z"
        stroke={color} strokeWidth={sw} strokeLinejoin="round"/>
      <circle cx="8" cy="6" r="1.5" stroke={color} strokeWidth={sw}/>
    </svg>
  ),

  Briefcase: ({size=16, color="currentColor", sw=1.5}) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="5" width="13" height="9" rx="1.5" stroke={color} strokeWidth={sw}/>
      <path d="M5.5 5V3.5A1.5 1.5 0 0 1 7 2h2a1.5 1.5 0 0 1 1.5 1.5V5"
        stroke={color} strokeWidth={sw} strokeLinecap="round"/>
      <line x1="1.5" y1="9" x2="14.5" y2="9" stroke={color} strokeWidth={sw}/>
    </svg>
  ),

  Users: ({size=16, color="currentColor", sw=1.5}) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="6" cy="5" r="2.5" stroke={color} strokeWidth={sw}/>
      <path d="M1 13.5c0-2.485 2.239-4.5 5-4.5s5 2.015 5 4.5"
        stroke={color} strokeWidth={sw} strokeLinecap="round"/>
      <circle cx="12" cy="5.5" r="2" stroke={color} strokeWidth={sw}/>
      <path d="M14.5 13c0-1.933-1.119-3.565-2.75-4.3"
        stroke={color} strokeWidth={sw} strokeLinecap="round"/>
    </svg>
  ),

  Calendar: ({size=16, color="currentColor", sw=1.5}) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="3" width="13" height="11.5" rx="1.5" stroke={color} strokeWidth={sw}/>
      <line x1="1.5" y1="7" x2="14.5" y2="7" stroke={color} strokeWidth={sw}/>
      <line x1="5" y1="1.5" x2="5" y2="4.5" stroke={color} strokeWidth={sw} strokeLinecap="round"/>
      <line x1="11" y1="1.5" x2="11" y2="4.5" stroke={color} strokeWidth={sw} strokeLinecap="round"/>
    </svg>
  ),

  ChevronDown: ({size=16, color="currentColor", sw=1.5}) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M4 6l4 4 4-4" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),

  ChevronRight: ({size=16, color="currentColor", sw=1.5}) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M6 4l4 4-4 4" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),

  Upload: ({size=16, color="currentColor", sw=1.5}) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 11V3M5 6l3-3 3 3" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2.5 11v1.5A1 1 0 0 0 3.5 13.5h9a1 1 0 0 0 1-1V11"
        stroke={color} strokeWidth={sw} strokeLinecap="round"/>
    </svg>
  ),

  Check: ({size=16, color="currentColor", sw=2}) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3 8.5l3.5 3.5L13 5" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),

  Search: ({size=16, color="currentColor", sw=1.5}) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="7" cy="7" r="4.5" stroke={color} strokeWidth={sw}/>
      <line x1="10.5" y1="10.5" x2="14" y2="14" stroke={color} strokeWidth={sw} strokeLinecap="round"/>
    </svg>
  ),

  Filter: ({size=16, color="currentColor", sw=1.5}) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <line x1="2" y1="4" x2="14" y2="4" stroke={color} strokeWidth={sw} strokeLinecap="round"/>
      <line x1="4" y1="8" x2="12" y2="8" stroke={color} strokeWidth={sw} strokeLinecap="round"/>
      <line x1="6" y1="12" x2="10" y2="12" stroke={color} strokeWidth={sw} strokeLinecap="round"/>
    </svg>
  ),

  Close: ({size=16, color="currentColor", sw=1.5}) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M4 4l8 8M12 4l-8 8" stroke={color} strokeWidth={sw} strokeLinecap="round"/>
    </svg>
  ),

  Lightning: ({size=16, color="currentColor", sw=0}) => (
    // Filled icon — urgency indicator
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M9.5 2L4 9h5l-2.5 5L14 7H9L11.5 2H9.5z" fill={color}/>
    </svg>
  ),

  Globe: ({size=16, color="currentColor", sw=1.5}) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke={color} strokeWidth={sw}/>
      <ellipse cx="8" cy="8" rx="2.5" ry="6.5" stroke={color} strokeWidth={sw}/>
      <line x1="1.5" y1="8" x2="14.5" y2="8" stroke={color} strokeWidth={sw}/>
    </svg>
  ),

  Pokedex: ({size=16, color="currentColor", sw=1.5}) => (
    // Custom: represents the DexMatch brand — stylised pokéball as a circle with a horizontal line and center dot
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke={color} strokeWidth={sw}/>
      <line x1="1.5" y1="8" x2="14.5" y2="8" stroke={color} strokeWidth={sw}/>
      <circle cx="8" cy="8" r="2" stroke={color} strokeWidth={sw}/>
      <circle cx="8" cy="8" r="0.75" fill={color}/>
    </svg>
  ),

  Sparkle: ({size=16, color="currentColor", sw=0}) => (
    // Match score indicator — filled
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5L9.2 6.8L14.5 8L9.2 9.2L8 14.5L6.8 9.2L1.5 8L6.8 6.8L8 1.5Z" fill={color}/>
    </svg>
  ),

  ArrowRight: ({size=16, color="currentColor", sw=1.5}) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10M9 4l4 4-4 4" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),

  Building: ({size=16, color="currentColor", sw=1.5}) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="2" y="3" width="12" height="11" rx="1" stroke={color} strokeWidth={sw}/>
      <path d="M5 14V10h6v4" stroke={color} strokeWidth={sw} strokeLinejoin="round"/>
      <rect x="5" y="5.5" width="2" height="2" rx="0.5" stroke={color} strokeWidth={sw}/>
      <rect x="9" y="5.5" width="2" height="2" rx="0.5" stroke={color} strokeWidth={sw}/>
      <line x1="2" y1="8" x2="14" y2="8" stroke={color} strokeWidth={sw}/>
    </svg>
  ),

  Tag: ({size=16, color="currentColor", sw=1.5}) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M2.5 2.5h5l6 6a1.5 1.5 0 0 1 0 2.12l-2.88 2.88a1.5 1.5 0 0 1-2.12 0l-6-6V2.5Z"
        stroke={color} strokeWidth={sw} strokeLinejoin="round"/>
      <circle cx="6" cy="6" r="1" fill={color}/>
    </svg>
  ),

  BarChart: ({size=16, color="currentColor", sw=1.5}) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="2" y="9" width="3" height="5" rx="0.5" stroke={color} strokeWidth={sw}/>
      <rect x="6.5" y="5" width="3" height="9" rx="0.5" stroke={color} strokeWidth={sw}/>
      <rect x="11" y="2" width="3" height="12" rx="0.5" stroke={color} strokeWidth={sw}/>
    </svg>
  ),

  Minus: ({size=16, color="currentColor", sw=1.5}) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <line x1="4" y1="8" x2="12" y2="8" stroke={color} strokeWidth={sw} strokeLinecap="round"/>
    </svg>
  ),

}
```

---

## PART 3 — DATA

All posted dates must use real 2026 calendar dates. Format: `"March 18, 2026"`, `"February 4, 2026"`, etc. No `"Jan 2025"` or `"Est."` prefixes anywhere in the UI.

### 3.1 Job Categories (no Pokémon type labels — category name only)

```js
const JOB_TYPES = {
  "Research & Science":       { bg:"#E8EEF8", color:"#2952A3", barColor:"#3B6FD4", icon: Icon.Sparkle },
  "Battle & Training":        { bg:"#FDECEA", color:"#A3291C", barColor:"#D93922", icon: Icon.Lightning },
  "Engineering & Tech":       { bg:"#EDF4FF", color:"#1A4FAD", barColor:"#2563EB", icon: Icon.BarChart },
  "Performance & Arts":       { bg:"#FDF0F8", color:"#8C2268", barColor:"#C026A0", icon: Icon.Sparkle },
  "Healthcare & Welfare":     { bg:"#E8F7F2", color:"#0A6B47", barColor:"#0D9C6B", icon: Icon.Check },
  "Conservation & Welfare":   { bg:"#EDFAED", color:"#1A6B1A", barColor:"#22A322", icon: Icon.Globe },
  "Law Enforcement & Patrol": { bg:"#F2F0EC", color:"#4A3D2E", barColor:"#7C6A54", icon: Icon.Briefcase },
  "Media & Communications":   { bg:"#FDF7E3", color:"#7A5A00", barColor:"#C8960A", icon: Icon.Globe },
};
```

### 3.2 Companies — All 26

```js
const COMPANIES = {
  // ── KANTO
  "Professor Oak's Laboratory": {
    pokemon:133, bannerBg:"#1C1400", accent:"#D4A44C",
    logoBg:"#D4A44C", logoText:"#1C1400", logo:"OAK",
    tagline:"Advancing Pokémon Science",
    hq:"Pallet Town, Kanto", size:"50–200", industry:"Research & Academia", founded:"1996",
    about:"The world's most decorated Pokémon research institution. Home to the National Pokédex project and landmark behavioural studies across all known species."
  },
  "Silph Co.": {
    pokemon:137, bannerBg:"#091628", accent:"#4A90D9",
    logoBg:"#4A90D9", logoText:"#fff", logo:"SC",
    tagline:"The Future of Trainer Technology",
    hq:"Saffron City, Kanto", size:"10,000+", industry:"Technology & Manufacturing", founded:"1997",
    about:"The world's largest producer of Trainer technology — from PokéBalls to the Silph Scope — powering every region's Trainer ecosystem."
  },
  "Pokémon Center Network": {
    pokemon:113, bannerBg:"#280718", accent:"#F07BAA",
    logoBg:"#F07BAA", logoText:"#fff", logo:"PCN",
    tagline:"Caring for Partners Every Day",
    hq:"Goldenrod City, Johto", size:"50,000+", industry:"Healthcare & Veterinary", founded:"1998",
    about:"Operating in every town across all known regions, providing free round-the-clock Pokémon healing and certified Nurse care."
  },
  "Cerulean City Gym": {
    pokemon:121, bannerBg:"#051528", accent:"#4DB8E8",
    logoBg:"#4DB8E8", logoText:"#051528", logo:"CCG",
    tagline:"Official League Facility · Water Div.",
    hq:"Cerulean City, Kanto", size:"10–50", industry:"Battle & Training", founded:"1999",
    about:"One of Kanto's eight official League Gyms, specialising in Water-type training and serving as a cornerstone of Trainer development."
  },
  "Pokémon League Association": {
    pokemon:59, bannerBg:"#0A0A18", accent:"#E8C84A",
    logoBg:"#E8C84A", logoText:"#0A0A18", logo:"PLA",
    tagline:"Governing Competition Worldwide",
    hq:"Indigo Plateau, Kanto", size:"1,000–5,000", industry:"Governance & Sport", founded:"1996",
    about:"The governing body certifying Gym Leaders, sanctioning all official battles, and organising the biannual World Pokémon Championships."
  },

  // ── JOHTO
  "Goldenrod Radio Tower": {
    pokemon:39, bannerBg:"#1E0F00", accent:"#F59E0B",
    logoBg:"#F59E0B", logoText:"#1E0F00", logo:"GRT",
    tagline:"Johto's #1 Broadcast Station",
    hq:"Goldenrod City, Johto", size:"100–500", industry:"Media & Broadcasting", founded:"2000",
    about:"The most listened-to broadcast station in Johto, offering Pokémon news, music, Lucky Channel, and exclusive Gym Leader interviews."
  },
  "Global Terminal Systems (GTS)": {
    pokemon:233, bannerBg:"#081220", accent:"#3B82F6",
    logoBg:"#3B82F6", logoText:"#fff", logo:"GTS",
    tagline:"Connecting Trainers Across Every Region",
    hq:"Goldenrod City, Johto", size:"5,000–10,000", industry:"Technology & Infrastructure", founded:"2007",
    about:"The backbone of global Pokémon trading — maintaining servers enabling real-time cross-regional exchanges for millions of Trainers."
  },
  "National Daycare – Route 34": {
    pokemon:132, bannerBg:"#0A1618", accent:"#6EBF6E",
    logoBg:"#6EBF6E", logoText:"#0A1618", logo:"NDC",
    tagline:"Trusted Breeding & Care",
    hq:"Route 34, Johto", size:"10–50", industry:"Pokémon Care & Breeding", founded:"1999",
    about:"Johto's oldest and most trusted daycare facility, renowned for breeding compatibility insights and meticulous egg cycle tracking."
  },
  "Pokémon Trainers' School": {
    pokemon:282, bannerBg:"#081428", accent:"#7CB9E8",
    logoBg:"#7CB9E8", logoText:"#081428", logo:"PTS",
    tagline:"Shaping Tomorrow's Trainers",
    hq:"Violet City, Johto", size:"200–500", industry:"Education & Training", founded:"2001",
    about:"The leading accredited Trainer education institution in Johto, offering structured battling curricula, Pokémon care certification, and apprenticeship placements."
  },

  // ── HOENN
  "Devon Corporation": {
    pokemon:208, bannerBg:"#081E1A", accent:"#2ECC8A",
    logoBg:"#2ECC8A", logoText:"#081E1A", logo:"DC",
    tagline:"Innovation for Every Region",
    hq:"Rustboro City, Hoenn", size:"5,000–10,000", industry:"Technology & Marine Research", founded:"2003",
    about:"Hoenn's leading research and development corporation, pioneering submarine technology, the PokéNav, and advanced marine Pokémon studies."
  },
  "Hoenn Pokémon League": {
    pokemon:384, bannerBg:"#0A0A1C", accent:"#F5C518",
    logoBg:"#F5C518", logoText:"#0A0A1C", logo:"HPL",
    tagline:"Hoenn's Highest Honor",
    hq:"Ever Grande City, Hoenn", size:"100–500", industry:"Battle & Governance", founded:"2003",
    about:"Governing all sanctioned competitions in Hoenn — from Gym Badges to Elite Four. The ultimate arbiter of Trainer excellence in the region."
  },
  "Battle Frontier": {
    pokemon:376, bannerBg:"#120820", accent:"#A855F7",
    logoBg:"#A855F7", logoText:"#fff", logo:"BF",
    tagline:"The Ultimate Test of Excellence",
    hq:"Battle Frontier, Hoenn", size:"200–500", industry:"Competitive Battle", founded:"2005",
    about:"Seven unique battle facilities designed to push Trainers to absolute limits, attracting only the most dedicated competitors from across all regions."
  },
  "Lilycove Contest Hall": {
    pokemon:350, bannerBg:"#1C0720", accent:"#E879C0",
    logoBg:"#E879C0", logoText:"#fff", logo:"LCH",
    tagline:"Where Pokémon and Art Become One",
    hq:"Lilycove City, Hoenn", size:"200–500", industry:"Performance & Arts", founded:"2004",
    about:"Hoenn's premier Pokémon Contest venue — hosting Ribbon Cup tournaments and nurturing Coordinators from novice to Grand Festival level."
  },

  // ── ALOLA
  "Aether Foundation": {
    pokemon:789, bannerBg:"#111111", accent:"#E8D87F",
    logoBg:"#E8D87F", logoText:"#111111", logo:"AF",
    tagline:"Protecting Pokémon Across Dimensions",
    hq:"Aether Paradise, Alola", size:"1,000–5,000", industry:"Conservation & Research", founded:"2016",
    about:"Operating the world's most advanced Pokémon conservation facility, specialising in rehabilitation of Ultra Space–affected and endangered species."
  },

  // ── ALMIA
  "Ranger Union": {
    pokemon:492, bannerBg:"#081608", accent:"#4CAF50",
    logoBg:"#4CAF50", logoText:"#fff", logo:"RU",
    tagline:"Protecting Nature, One Region at a Time",
    hq:"Ranger Base, Almia", size:"2,000–5,000", industry:"Conservation & Law Enforcement", founded:"2006",
    about:"Maintaining ecological balance across Fiore, Almia, and Oblivia — protecting wild habitats and responding to environmental emergencies."
  },

  // ── SINNOH
  "Sinnoh Underground Corp.": {
    pokemon:299, bannerBg:"#1C1200", accent:"#C8860A",
    logoBg:"#C8860A", logoText:"#fff", logo:"SUC",
    tagline:"Mining the Future",
    hq:"Oreburgh City, Sinnoh", size:"1,000–5,000", industry:"Fossil Research & Mining", founded:"2007",
    about:"Operators of the Great Underground — Sinnoh's subterranean fossil extraction and restoration network, supplying researchers across all regions."
  },
  "Galactic Research Unit": {
    pokemon:487, bannerBg:"#0D0618", accent:"#8B5CF6",
    logoBg:"#8B5CF6", logoText:"#fff", logo:"GRU",
    tagline:"Beyond the Known Universe",
    hq:"Veilstone City, Sinnoh", size:"500–1,000", industry:"Space & Dimensional Research", founded:"2006",
    about:"A controversial but scientifically rigorous research unit studying dimensional rifts, space-time distortions, and legendary Pokémon activity."
  },

  // ── UNOVA
  "Pokémon Musical Theatre": {
    pokemon:594, bannerBg:"#160820", accent:"#F472B6",
    logoBg:"#F472B6", logoText:"#fff", logo:"PMT",
    tagline:"Curtain Up on Every Stage",
    hq:"Nimbasa City, Unova", size:"100–500", industry:"Performance & Entertainment", founded:"2011",
    about:"Unova's foremost Pokémon performance venue, producing award-winning musicals and hosting Pokémon Contest showcases for audiences across the region."
  },
  "Unova Transport Authority": {
    pokemon:602, bannerBg:"#081220", accent:"#22D3EE",
    logoBg:"#22D3EE", logoText:"#081220", logo:"UTA",
    tagline:"Connecting Every Corner",
    hq:"Castelia City, Unova", size:"5,000–10,000", industry:"Transport & Infrastructure", founded:"2010",
    about:"Managing Unova's intercity rail, ferry, and air transport networks — ensuring Trainer mobility across the most densely populated region."
  },

  // ── KALOS
  "Kalos Fashion Institute": {
    pokemon:670, bannerBg:"#200A08", accent:"#FB923C",
    logoBg:"#FB923C", logoText:"#fff", logo:"KFI",
    tagline:"Style Is a Second Skin",
    hq:"Lumiose City, Kalos", size:"200–500", industry:"Fashion & Design", founded:"2014",
    about:"The premier institution for Pokémon coordination aesthetics — training stylists, choreographers, and creative directors for the Grand Festival circuit."
  },
  "Lysandre Labs": {
    pokemon:716, bannerBg:"#140606", accent:"#EF4444",
    logoBg:"#EF4444", logoText:"#fff", logo:"LL",
    tagline:"Innovation at Any Cost",
    hq:"Lumiose City, Kalos", size:"1,000–5,000", industry:"Technology & Energy", founded:"2013",
    about:"A high-clearance research laboratory pursuing next-generation energy extraction and Mega Evolution amplification technology."
  },

  // ── GALAR
  "Galar Pokémon League": {
    pokemon:800, bannerBg:"#0A0A14", accent:"#FBBF24",
    logoBg:"#FBBF24", logoText:"#0A0A14", logo:"GPL",
    tagline:"The Greatest Show on Earth",
    hq:"Wyndon, Galar", size:"500–1,000", industry:"Battle & Governance", founded:"2019",
    about:"Governing all Gym Challenge and Championship events across Galar — the most-watched Pokémon League in broadcast history."
  },
  "Macro Cosmos Corp.": {
    pokemon:890, bannerBg:"#080818", accent:"#A78BFA",
    logoBg:"#A78BFA", logoText:"#fff", logo:"MCC",
    tagline:"Building Galar's Future",
    hq:"Wyndon, Galar", size:"50,000+", industry:"Energy & Finance", founded:"2018",
    about:"Galar's largest conglomerate — operating Wishing Star energy extraction, Pokémon storage infrastructure, and regional finance services."
  },

  // ── PALDEA
  "Naranja Academy": {
    pokemon:906, bannerBg:"#140800", accent:"#F97316",
    logoBg:"#F97316", logoText:"#fff", logo:"NAC",
    tagline:"Treasure Hunt for Knowledge",
    hq:"Mesagoza, Paldea", size:"1,000–5,000", industry:"Education & Research", founded:"2022",
    about:"Paldea's most prestigious academic institution — hosting Treasure Hunt expeditions, Pokémon research programs, and the annual academy battle tournament."
  },
  "Paldea Pokémon Patrol": {
    pokemon:935, bannerBg:"#081408", accent:"#34D399",
    logoBg:"#34D399", logoText:"#081408", logo:"PPP",
    tagline:"Guardians of the Open World",
    hq:"Porto Marinada, Paldea", size:"2,000–5,000", industry:"Law Enforcement & Patrol", founded:"2023",
    about:"Paldea's open-terrain patrol division — monitoring wild Pokémon migration, preventing poaching, and responding to region-wide ecological emergencies."
  },
  "Casseroya Aquatic Lab": {
    pokemon:978, bannerBg:"#040E1C", accent:"#0EA5E9",
    logoBg:"#0EA5E9", logoText:"#fff", logo:"CAL",
    tagline:"Depths of Discovery",
    hq:"Casseroya Lake, Paldea", size:"100–500", industry:"Marine Research", founded:"2022",
    about:"Dedicated to studying Paldea's freshwater and coastal Pokémon ecosystems — publishing influential quarterly reports for regional environmental policy."
  },
};
```

### 3.3 Jobs — All 30 (with real 2026 dates)

```js
const JOBS = [
  // ── KANTO
  { id:1,  title:"Pokémon Research Scientist",       company:"Professor Oak's Laboratory",    region:"Pallet Town",     macro:"Kanto",  type:"Research & Science",       salary:"₽4.2M–₽6.8M", level:"Mid–Senior", openings:2, posted:"March 2, 2026",    urgent:true,  skills:["Pokédex Analysis","Field Research","Data Collection","Biology","Statistical Modeling","Expedition Planning"],            desc:"Lead field expeditions documenting undiscovered Pokémon behaviours across Kanto. Collaborate with regional professors on multi-year longitudinal studies." },
  { id:2,  title:"Gym Leader (Water-Type)",           company:"Cerulean City Gym",             region:"Cerulean City",   macro:"Kanto",  type:"Battle & Training",        salary:"₽3.5M–₽5.2M", level:"Senior",     openings:1, posted:"February 24, 2026",  urgent:false, skills:["Water-Type Mastery","Battle Strategy","Team Training","Public Relations","Leadership","Youth Mentorship"],               desc:"Oversee Cerulean Gym operations, train junior trainers, and represent Kanto's official League as a Water-type authority." },
  { id:3,  title:"Senior Product Engineer",           company:"Silph Co.",                     region:"Saffron City",    macro:"Kanto",  type:"Engineering & Tech",       salary:"₽7.1M–₽9.4M", level:"Senior",     openings:3, posted:"February 18, 2026",  urgent:false, skills:["Item Development","Systems Engineering","PokéBall Mechanics","R&D","Technical Documentation","Project Management"],      desc:"Drive next-generation PokéBall technology and Trainer-facing items. Work cross-functionally with research and manufacturing teams." },
  { id:12, title:"League Referee & Officiator",      company:"Pokémon League Association",    region:"Indigo Plateau",  macro:"Kanto",  type:"Battle & Training",        salary:"₽4.7M–₽6.3M", level:"Mid–Senior", openings:5, posted:"January 14, 2026",   urgent:false, skills:["Rule Enforcement","Battle Observation","Conflict Resolution","Move Identification","Impartial Judgment","Public Speaking"], desc:"Officiate sanctioned Pokémon battles at League level. Ensure compliance with International Battle Rules and resolve Trainer disputes." },
  { id:27, title:"PokéBall Assembly Technician Lead",company:"Silph Co.",                     region:"Saffron City",    macro:"Kanto",  type:"Engineering & Tech",       salary:"₽5.1M–₽7.3M", level:"Mid–Senior", openings:5, posted:"March 5, 2026",      urgent:true,  skills:["PokéBall Mechanics","Item Development","Technical Documentation","Systems Engineering","R&D","Project Management"],       desc:"Supervise the Master Ball production line and lead QA testing for new capture device prototypes. Work directly with the Chief Engineer on next-season product releases." },
  { id:28, title:"Wellness Counsellor – Trainer Div.",company:"Pokémon Center Network",       region:"Cerulean City",   macro:"Kanto",  type:"Healthcare & Welfare",     salary:"₽3.4M–₽4.9M", level:"Mid",        openings:6, posted:"March 4, 2026",      urgent:false, skills:["Patient Communication","Pokémon Medicine","Behavioural Assessment","First Aid","Team Coordination","Healing Systems"],    desc:"Provide emotional wellness support for Trainers experiencing battle stress, loss, or burnout. Facilitate recovery workshops and connect Trainers to community resources." },

  // ── JOHTO
  { id:6,  title:"Head Nurse – Pokémon Center",      company:"Pokémon Center Network",        region:"Goldenrod City",  macro:"Johto",  type:"Healthcare & Welfare",     salary:"₽3.9M–₽5.6M", level:"Senior",     openings:4, posted:"March 6, 2026",      urgent:true,  skills:["Pokémon Medicine","Emergency Care","Healing Systems","Team Coordination","Patient Communication","First Aid"],           desc:"Manage daily operations of a high-traffic Pokémon Center. Oversee nursing staff and Chansey assistants providing round-the-clock care." },
  { id:7,  title:"Network Infrastructure Engineer",  company:"Global Terminal Systems (GTS)", region:"Goldenrod City",  macro:"Johto",  type:"Engineering & Tech",       salary:"₽6.5M–₽8.9M", level:"Senior",     openings:2, posted:"February 5, 2026",   urgent:false, skills:["Network Architecture","Database Management","Trade System Design","Security Protocols","Uptime Management","API Development"], desc:"Maintain and scale the GTS cross-regional infrastructure. Ensure 99.9% uptime for worldwide Trainer Pokémon exchanges." },
  { id:11, title:"Radio Host – Pokémon Talk",        company:"Goldenrod Radio Tower",         region:"Goldenrod City",  macro:"Johto",  type:"Media & Communications",   salary:"₽3.1M–₽4.6M", level:"Mid",        openings:1, posted:"March 3, 2026",      urgent:false, skills:["Broadcasting","Scriptwriting","Pokémon Knowledge","Audience Engagement","Live Interviewing","Social Media"],             desc:"Host a daily programme covering Pokémon news, trainer tips, and legendary sightings with live Gym Leader interviews." },
  { id:15, title:"Pokémon Daycare Specialist",       company:"National Daycare – Route 34",   region:"Route 34",        macro:"Johto",  type:"Healthcare & Welfare",     salary:"₽2.5M–₽3.7M", level:"Entry–Mid",  openings:2, posted:"February 26, 2026",  urgent:false, skills:["Pokémon Breeding","Egg Care","Behavioural Assessment","Nutrition Planning","Record Keeping","Client Communication"],       desc:"Provide expert care for Trainer-deposited Pokémon and manage breeding pair monitoring. Maintain egg cycle and compatibility logs." },
  { id:26, title:"Broadcast Journalist – Field Div.",company:"Goldenrod Radio Tower",         region:"Goldenrod City",  macro:"Johto",  type:"Media & Communications",   salary:"₽3.3M–₽4.9M", level:"Mid",        openings:2, posted:"March 3, 2026",      urgent:false, skills:["Broadcasting","Live Interviewing","Scriptwriting","Social Media","Audience Engagement","Pokémon Knowledge"],            desc:"Report live from Gym Battles, Contest Halls, and wild sighting events across Johto. File daily audio segments and manage the station's social media channels." },
  { id:29, title:"Pokémon Trainer Instructor",       company:"Pokémon Trainers' School",      region:"Violet City",     macro:"Johto",  type:"Battle & Training",        salary:"₽2.9M–₽4.3M", level:"Mid",        openings:4, posted:"February 6, 2026",   urgent:false, skills:["Youth Mentorship","Battle Strategy","Leadership","Team Training","Public Speaking","Rule Enforcement"],                 desc:"Teach beginner and intermediate Trainer classes covering type advantages, move strategy, and Pokémon care ethics. Develop curriculum and assessments for the upcoming semester." },

  // ── HOENN
  { id:4,  title:"Pokémon Contest Coordinator",      company:"Lilycove Contest Hall",         region:"Lilycove City",   macro:"Hoenn", type:"Performance & Arts",       salary:"₽2.8M–₽4.5M", level:"Mid",        openings:2, posted:"March 2, 2026",      urgent:false, skills:["Pokémon Styling","Contest Performance","Choreography","Audience Engagement","Creative Direction","Move Aesthetics"],    desc:"Organise and host Pokémon Contests, evaluate performance combinations, and mentor coordinators seeking the Grand Festival ribbon." },
  { id:5,  title:"Marine Biologist – Pokémon Div.", company:"Devon Corporation",             region:"Dewford Town",    macro:"Hoenn", type:"Research & Science",       salary:"₽5.0M–₽7.3M", level:"Mid–Senior", openings:1, posted:"March 1, 2026",      urgent:true,  skills:["Marine Biology","Aquatic Pokémon Research","Data Analysis","Diving Certification","Environmental Assessment","Report Writing"], desc:"Investigate undersea Pokémon habitats across Hoenn's ocean routes. Produce environmental impact assessments for Devon's submarine programme." },
  { id:10, title:"Battle Strategy Analyst",          company:"Battle Frontier",               region:"Battle Frontier", macro:"Hoenn", type:"Battle & Training",        salary:"₽5.8M–₽7.7M", level:"Senior",     openings:1, posted:"February 8, 2026",   urgent:false, skills:["Competitive Battle Analysis","EV/IV Optimisation","Move Pool Research","Meta Analysis","Statistical Modeling","Coaching"],  desc:"Develop AI-driven Frontier Brain team compositions from challenger data. Produce weekly meta-game intelligence reports." },
  { id:13, title:"UX Researcher – PokéNav Div.",     company:"Devon Corporation",             region:"Rustboro City",   macro:"Hoenn", type:"Engineering & Tech",       salary:"₽5.5M–₽7.2M", level:"Mid",        openings:2, posted:"March 1, 2026",      urgent:true,  skills:["UX Research","User Testing","Interface Design","Trainer Journey Mapping","Prototype Testing","Accessibility"],            desc:"Lead usability research for the next-generation PokéNav+. Drive trainer-centred design improvements and accessibility testing." },
  { id:14, title:"Elite Four – Battle Division",     company:"Hoenn Pokémon League",          region:"Ever Grande City",macro:"Hoenn", type:"Battle & Training",        salary:"₽9.2M–₽14.0M",level:"Executive",  openings:1, posted:"March 2, 2026",      urgent:true,  skills:["Championship-Level Battling","Mental Fortitude","Elite Strategy","Public Representation","Mentorship","Leadership"],        desc:"Serve as an Elite Four member for the Hoenn League. Represent the League in exhibitions and evaluate Champion candidates." },
  { id:20, title:"Head Stylist – Coordinator Div.",  company:"Kalos Fashion Institute",       region:"Lumiose City",    macro:"Kalos", type:"Performance & Arts",       salary:"₽4.8M–₽6.5M", level:"Senior",     openings:2, posted:"March 2, 2026",      urgent:false, skills:["Pokémon Styling","Contest Performance","Move Aesthetics","Creative Direction","Audience Engagement","Choreography"],      desc:"Lead Pokémon Contest costume design and Showcase styling for Kalos competitors. Mentor junior stylists and represent the Institute at the Pokémon Showcase Grand Prix." },

  // ── ALOLA
  { id:8,  title:"Conservation Officer",             company:"Aether Foundation",             region:"Aether Paradise", macro:"Alola", type:"Conservation & Welfare",   salary:"₽4.4M–₽6.1M", level:"Mid",        openings:3, posted:"January 19, 2026",   urgent:false, skills:["Wildlife Conservation","Habitat Management","Rehabilitation","Environmental Science","Community Education","Grant Writing"], desc:"Oversee rehabilitation programmes for Ultra Space–affected Pokémon and develop sustainable habitats across Alola's island ecosystems." },

  // ── ALMIA
  { id:9,  title:"Field Ranger – Almia Division",    company:"Ranger Union",                  region:"Chicole Village", macro:"Almia", type:"Law Enforcement & Patrol", salary:"₽3.2M–₽4.8M", level:"Entry–Mid",  openings:6, posted:"December 21, 2025",  urgent:false, skills:["Field Operations","Capture Styler (Class B)","Navigation","Crisis Response","Team Coordination","Wilderness Survival"],   desc:"Patrol designated nature zones, respond to wild Pokémon distress calls, and prevent poaching across the Almia region." },

  // ── SINNOH
  { id:16, title:"Lead Fossil Researcher",           company:"Sinnoh Underground Corp.",      region:"Oreburgh City",   macro:"Sinnoh",type:"Research & Science",       salary:"₽5.5M–₽7.8M", level:"Mid–Senior", openings:2, posted:"March 5, 2026",      urgent:false, skills:["Fossil Restoration","Geological Survey","Palaeontology","Laboratory Analysis","Data Collection","Report Writing"],           desc:"Excavate and restore ancient Pokémon fossils from Sinnoh's underground tunnel network. Collaborate on new extraction sites and publish findings in the Pokémon Palaeontology Quarterly." },
  { id:17, title:"Dimensional Physics Researcher",   company:"Galactic Research Unit",        region:"Veilstone City",  macro:"Sinnoh",type:"Research & Science",       salary:"₽6.8M–₽9.2M", level:"Senior",     openings:1, posted:"March 4, 2026",      urgent:true,  skills:["Quantum Physics","Dimensional Theory","Statistical Modeling","Data Collection","Field Research","Expedition Planning"],      desc:"Research temporal and spatial anomalies linked to Dialga and Palkia activity. Develop theoretical models for the Distortion World and publish peer-reviewed studies." },

  // ── UNOVA
  { id:18, title:"Pokémon Musical Director",         company:"Pokémon Musical Theatre",       region:"Nimbasa City",    macro:"Unova", type:"Performance & Arts",       salary:"₽4.0M–₽5.8M", level:"Senior",     openings:1, posted:"March 3, 2026",      urgent:false, skills:["Choreography","Musical Direction","Move Aesthetics","Creative Direction","Audience Engagement","Pokémon Styling"],        desc:"Direct seasonal Pokémon Musical productions. Coordinate costumes, lighting, and performer training — including both Trainers and their Pokémon partners." },
  { id:19, title:"Transit Network Engineer",         company:"Unova Transport Authority",     region:"Castelia City",   macro:"Unova", type:"Engineering & Tech",       salary:"₽7.4M–₽10.1M",level:"Senior",     openings:3, posted:"January 31, 2026",   urgent:false, skills:["Systems Engineering","Network Architecture","Project Management","Technical Documentation","API Development","Uptime Management"], desc:"Design and maintain Unova's cross-city rail and ferry systems. Lead infrastructure upgrades to expand capacity across Castelia, Nimbasa, and Mistralton." },

  // ── KALOS
  { id:30, title:"Energy Research Analyst",          company:"Lysandre Labs",                 region:"Lumiose City",    macro:"Kalos", type:"Research & Science",       salary:"₽6.0M–₽8.5M", level:"Senior",     openings:1, posted:"December 15, 2025",  urgent:false, skills:["Statistical Modeling","Data Analysis","Field Research","Report Writing","Environmental Assessment","Data Collection"],        desc:"Analyse Mega Evolution energy signatures and model the long-term sustainability of residual energy fields. High security clearance required." },

  // ── GALAR
  { id:21, title:"Renewable Energy Engineer",        company:"Macro Cosmos Corp.",            region:"Wyndon",          macro:"Galar", type:"Engineering & Tech",       salary:"₽8.0M–₽11.5M",level:"Senior",     openings:4, posted:"February 17, 2026",  urgent:true,  skills:["Energy Systems","Systems Engineering","R&D","Project Management","Technical Documentation","Environmental Assessment"],      desc:"Develop next-generation Wishing Star energy extraction systems for Galar's national power grid. Ensure ethical power conversion and ecological compliance." },
  { id:22, title:"Champion Liaison Officer",         company:"Galar Pokémon League",          region:"Wyndon",          macro:"Galar", type:"Battle & Training",        salary:"₽6.2M–₽8.4M", level:"Mid–Senior", openings:2, posted:"March 1, 2026",      urgent:false, skills:["Leadership","Public Relations","Battle Strategy","Public Speaking","Youth Mentorship","Conflict Resolution"],               desc:"Coordinate between the Champion, Gym Leaders, and the League Association. Manage scheduling for official Championship events and Gigantamax exhibition battles." },

  // ── PALDEA
  { id:23, title:"Academy Expedition Coordinator",   company:"Naranja Academy",               region:"Mesagoza",        macro:"Paldea",type:"Research & Science",       salary:"₽4.5M–₽6.2M", level:"Mid",        openings:3, posted:"March 4, 2026",      urgent:true,  skills:["Expedition Planning","Field Research","Pokédex Analysis","Biology","Data Collection","Community Education"],                desc:"Lead student Treasure Hunt expeditions across all of Paldea. Identify new habitats, document rare species sightings, and submit Pokédex entries to the Academy research board." },
  { id:24, title:"Open-World Patrol Ranger",         company:"Paldea Pokémon Patrol",         region:"Porto Marinada",  macro:"Paldea",type:"Law Enforcement & Patrol", salary:"₽3.6M–₽5.1M", level:"Entry–Mid",  openings:8, posted:"March 5, 2026",      urgent:true,  skills:["Field Operations","Navigation","Crisis Response","Wilderness Survival","Environmental Assessment","Team Coordination"],      desc:"Patrol Paldea's open terrain, monitor wild Pokémon migration, and respond to conflict reports from Trainers. First line of ecological protection across the region." },
  { id:25, title:"Marine Habitat Scientist",         company:"Casseroya Aquatic Lab",         region:"Casseroya Lake",  macro:"Paldea",type:"Research & Science",       salary:"₽5.2M–₽7.0M", level:"Mid–Senior", openings:1, posted:"February 7, 2026",   urgent:false, skills:["Marine Biology","Aquatic Pokémon Research","Environmental Assessment","Diving Certification","Data Analysis","Report Writing"], desc:"Study Tatsugiri and Dondozo population dynamics in Casseroya Lake. Produce quarterly reports on aquatic Pokémon ecology for the Paldean Ministry of Nature." },
];
```

---

## PART 4 — LAYOUT ARCHITECTURE

### 4.1 Overall Page Structure

```
┌──────────────────────────────────────────────────────────────────┐
│  NAV BAR — 56px, sticky, full width                              │
├──────────────────────────────────────────────────────────────────┤
│  HERO STRIP — compact, 88px, full width                          │
├──────────────────────────────────────────────────────────────────┤
│  FILTER TOOLBAR — sticky below nav (top:56px), full width, 48px  │
├─────────────┬────────────────────────────────────────────────────┤
│             │                                                    │
│  LEFT PANEL │  RIGHT PANEL                                       │
│  320px      │  flex:1                                            │
│  sticky     │                                                    │
│  top:104px  │  [pre-analysis]  scrollable job list               │
│             │  [post-analysis] scrollable matched job list        │
│             │                                                    │
│  — CV       │                                        [PREVIEW    │
│    Upload   │                              DRAWER →  PANE]       │
│  — Filters  │                                                    │
│    panel    │                                                    │
└─────────────┴────────────────────────────────────────────────────┘
│  FOOTER                                                          │
└──────────────────────────────────────────────────────────────────┘
```

**The right panel is a 2-column split when a job is selected:**
```
[Job List — ~380px] | [Job Detail Preview — flex:1]
```
This is the core UX improvement: click a job card → detail slides into the right pane without navigation.

---

### 4.2 Navigation Bar

**Height:** 56px  
**Background:** `var(--navy)`  
**Bottom border:** `1px solid rgba(255,255,255,0.06)` — no thick red line

```
padding: 0 32px
display: flex
align-items: center
gap: 32px

[LEFT — 200px]
  Custom Pokedex icon (Icon.Pokedex, 22px, color: var(--red))
  "DexMatch" — DM Sans 800, 16px, white
  Separator · (rgba(255,255,255,0.15))
  "Career Network" — DM Sans 400, 11px, rgba(255,255,255,0.35)

[CENTER — flex:1]
  Search input:
    background: rgba(255,255,255,0.06)
    border: 1px solid rgba(255,255,255,0.08)
    border-radius: 8px
    height: 34px
    padding: 0 12px 0 34px
    max-width: 360px
    margin: 0 auto
    Icon.Search inside left at 16px, color rgba(255,255,255,0.3)
    placeholder: "Search roles, companies…" color rgba(255,255,255,0.3)
    font: DM Sans 400 13px white

[RIGHT]
  "Browse" — DM Sans 500, 13px, rgba(255,255,255,0.55), hover: white
  "Companies" — same
  Divider 1px rgba(255,255,255,0.1) height 16px
  "Sign In" button:
    background: var(--red)
    color: white
    border-radius: 7px
    padding: 7px 16px
    font: DM Sans 600, 13px
    hover: var(--red-hover)
    transition: background 0.15s
```

---

### 4.3 Hero Strip (compact, not decorative)

**Height:** 88px  
**Background:** `var(--navy)`  
**Purpose:** context + stats only — no headline poetics

```
padding: 0 32px
display: flex
align-items: center
justify-content: space-between

LEFT:
  "₽" + total openings count — DM Mono 500, 28px, var(--gold), letter-spacing: -1px
  Below: "open positions across 10 regions" — DM Sans 400, 12px, rgba(255,255,255,0.38)

CENTER (3 stat chips, flex row, gap: 8px):
  Each chip: background rgba(255,255,255,0.06), border 1px solid rgba(255,255,255,0.08)
  border-radius: 6px, padding: 6px 14px
  Number: DM Mono 500 14px white
  Label: DM Sans 400 10px rgba(255,255,255,0.4), margin-top: 1px
  Values: [26 Companies] [10 Regions] [X Urgent]

RIGHT:
  Horizontal pill strip showing all 10 regions as small pills
  Clicking a region pill sets the global region filter
  Active: background var(--red), color white
  Inactive: background rgba(255,255,255,0.06), color rgba(255,255,255,0.5)
  font: DM Sans 600, 11px
  border-radius: 20px
  padding: 4px 10px
  overflow-x: auto if wraps
```

---

### 4.4 Filter Toolbar

**Height:** 48px  
**Position:** `sticky; top: 56px; z-index: 40`  
**Background:** `var(--bg)` + `border-bottom: 1px solid var(--border)`  
**Padding:** `0 32px`

```
display: flex
align-items: center
gap: 8px

[LEFT SECTION — filters]
  Filter icon (Icon.Filter, 14px, var(--t3)) + "Filters" label (DM Sans 500, 12px, var(--t3))
  Separator line

  Each filter control — styled as a compact select:
    height: 32px
    background: var(--surface)
    border: 1px solid var(--border)
    border-radius: 6px
    padding: 0 10px
    font: DM Sans 500, 12px, var(--t2)
    Icon.ChevronDown right inside

  Controls in order:
    [Region — "All Regions" default, then all 10 macros]
    [Category — "All Categories", then all 8 types]
    [Level — "All Levels", then: Entry–Mid / Mid / Mid–Senior / Senior / Executive]
    [Salary — "Any Salary", then: ₽2M+ / ₽4M+ / ₽6M+ / ₽8M+]

  Active filter badge: if any filter set, show count pill
    background: var(--red); color: white; font: DM Sans 700 10px
    border-radius: 10px; padding: 1px 6px
    "Clear" button appears (Icon.Close, 12px, inline)

[SPACER flex:1]

[RIGHT SECTION — sort + view]
  "Sort:" label (DM Sans 400, 12px, var(--t4))
  Segmented control (3 options, border 1px solid var(--border), border-radius: 6px, overflow hidden):
    Each segment: padding 5px 12px, font DM Sans 500 12px
    Active: background var(--navy), color white
    Inactive: background var(--surface), color var(--t3)
    Options: "Best Match" | "Salary" | "Date"

  Divider

  View toggle (2 icon buttons):
    Grid view icon (2×2 squares — custom SVG)
    List view icon (3 horizontal lines with left dots — custom SVG)
    Active: background var(--navy-lift), border-radius 5px
    Size: 30px × 30px each
```

---

### 4.5 Left Panel — Sidebar

**Width:** 320px  
**Position:** `sticky; top: 104px; max-height: calc(100vh - 104px); overflow-y: auto`  
**Background:** `var(--bg)`  
**Right border:** `1px solid var(--border)`  
**Padding:** `20px 16px`  
**Gap between sections:** `12px`

#### A. CV Upload Panel

Simple, single-purpose. No ceremony.

```
Panel container:
  background: var(--surface)
  border: 1px solid var(--border)
  border-radius: 12px
  overflow: hidden

Panel header (click to collapse — accordion):
  padding: 12px 16px
  display: flex; align-items: center; justify-content: space-between
  cursor: pointer
  background: var(--surface)

  LEFT: Icon.Upload (16px, var(--t3)) + "CV Match" (DM Sans 700, 13px, var(--t1))
  RIGHT: phase indicator pill:
    idle:      dot(var(--border-2)) + "Ready"   — DM Sans 500, 11px, var(--t4)
    uploaded:  dot(var(--amber))    + "Loaded"  — amber
    analyzing: spinning Icon.Pokedex (12px) + "Scanning"  — var(--red)
    done:      dot(var(--green))   + "Complete" — green
  + Icon.ChevronDown (rotates 180deg when collapsed)

Panel body (collapsible, default: open):
  padding: 16px

  [IDLE / UPLOADED state]
  Drop zone:
    border: 1.5px dashed var(--border-2)
    border-radius: 8px
    padding: 20px 16px
    text-align: center
    cursor: pointer
    transition: border-color 0.15s, background 0.15s

    Drag-over state:
      border-color: var(--red)
      background: color-mix(in srgb, var(--red) 4%, var(--surface))

    Uploaded state:
      border-color: var(--green)
      border-style: solid
      background: var(--green-bg)

    Content (idle):
      Icon.Upload (24px, var(--t4))  ← no animation
      "Drop CV here" — DM Sans 600, 13px, var(--t2), margin-top: 8px
      ".pdf  .docx  .txt" — DM Sans 400, 11px, var(--t4), margin-top: 4px

    Content (uploaded):
      Icon.Check (20px, var(--green))
      filename — DM Sans 600, 13px, var(--green)
      "Tap to replace" — DM Sans 400, 11px, var(--t4)

    Hidden input: type="file" accept=".pdf,.doc,.docx,.txt"

  Analyse button (below drop zone, margin-top: 10px):
    width: 100%
    height: 40px
    border-radius: 8px
    border: none
    font: DM Sans 600, 13px
    transition: background 0.15s

    Disabled (idle):
      background: var(--surface-2)
      color: var(--t4)
      cursor: not-allowed

    Enabled (uploaded):
      background: var(--red)
      color: white
      cursor: pointer
      hover: var(--red-hover)

    Text: "Analyse CV" (no icon, no decoration)

  [ANALYZING state — replaces drop zone + button]
  Single progress bar:
    height: 3px
    background: var(--border)
    border-radius: 2px
    margin-bottom: 10px
    overflow: hidden

    Fill:
      background: var(--red)
      transition: width 0.4s ease
      animation: progressFill auto-driven by step

  Step label:
    DM Sans 400, 12px, var(--t3)
    Center-aligned
    Updates as steps advance (no dramatic labels — just: "Scanning…" "Matching…" "Done")

  [DONE state — replaces everything]
  Two-line summary row:
    "Match complete" — DM Sans 700, 13px, var(--green)
    "{n} roles · {n} strong" — DM Sans 400, 12px, var(--t3)
  Reset link (right side): "Reset" — DM Sans 500, 12px, var(--t4), underline on hover
```

#### B. Skills Detected Panel (post-analysis, collapsible accordion)

```
Panel container (same card style as CV panel above):

Header (clickable, accordion toggle):
  LEFT: Icon.Tag (16px, var(--t3)) + "Detected Skills" (DM Sans 700, 13px, var(--t1))
         + count badge: "{n}" — small pill, background var(--green-bg), color var(--green), DM Sans 700, 10px
  RIGHT: Icon.ChevronDown (rotates when open/closed)
  Default state: COLLAPSED

Body (revealed on expand):
  padding: 12px 16px
  Wrapping flex container, gap: 6px
  Each skill pill:
    background: var(--green-bg)
    color: var(--green)
    border-radius: 5px
    padding: 4px 10px
    font: DM Sans 600, 11px
    Icon.Check (10px) before label, gap: 4px

  "These skills were extracted from your CV and used to compute match scores."
  — DM Sans 400, 11px, var(--t4), margin-top: 10px
```

#### C. Quick Filters Panel (collapsible accordion, default: OPEN)

```
Panel container:

Header:
  LEFT: Icon.Filter (16px, var(--t3)) + "Quick Filter" (DM Sans 700, 13px, var(--t1))
  RIGHT: Icon.ChevronDown

Body:
  padding: 12px 16px
  gap: 12px

  Region tile grid:
    display: grid; grid-template-columns: 1fr 1fr; gap: 6px

    Each region tile:
      background: var(--surface-2)
      border: 1px solid var(--border)
      border-radius: 8px
      padding: 9px 10px
      cursor: pointer
      transition: all 0.15s

      Top row: region name — DM Sans 600, 12px, var(--t1)
      Bottom row: "{n} openings" — DM Mono 400, 10px, var(--t3)

      Active:
        background: var(--navy)
        border-color: var(--navy)
        name color: white
        count color: rgba(255,255,255,0.5)

      Hover (inactive):
        border-color: var(--border-2)
        background: var(--surface)

  Category list (below region grid):
    Each item is a full-width row:
      padding: 7px 0
      border-bottom: 1px solid var(--border) (except last)
      display: flex; justify-content: space-between; align-items: center

      LEFT:
        Category color bar: 3px × 14px, border-radius 2px, background: typeBarColor
        Category name — DM Sans 500, 12px, var(--t2)
      RIGHT:
        Count — DM Mono 400, 11px, var(--t4)

      Active row:
        background: var(--surface-2)
        name: var(--t1), font-weight: 700
        bar: slightly larger (4px)

      Hover: background var(--surface-2)
      cursor: pointer
```

---

### 4.6 Right Content Area

#### Pre-Analysis: Job List + Detail Pane

```
display: flex
flex-direction: row
height: calc(100vh - 104px)
overflow: hidden

[JOB LIST COLUMN — width: 380px, flex-shrink: 0]
  overflow-y: auto
  padding: 16px 12px 16px 20px
  border-right: 1px solid var(--border)

  List header:
    display: flex; justify-content: space-between; align-items: center
    margin-bottom: 12px
    "{n} positions" — DM Sans 700, 14px, var(--t1)
    "sorted by {sort}" — DM Sans 400, 12px, var(--t4)

  Job cards stacked vertically, gap: 6px (list view default)

[DETAIL PANE — flex:1]
  overflow-y: auto
  padding: 24px 28px

  Default state (no job selected):
    Centered placeholder:
      Icon.Briefcase (32px, var(--border-2))
      "Select a role to preview" — DM Sans 400, 14px, var(--t4)
      margin-top: 12px

  Job selected:
    fadeIn 0.15s
    Full job detail content (see Section 4.9)
```

#### Post-Analysis: Matched Results

Same split-pane layout as above, except:
- Job cards show match score bar
- Default sort is by score descending
- Header shows match context: "{n} matched · {n} strong fits"

---

### 4.7 Job List Card (compact, list-first design)

**No expanded state — clicking a card opens the detail pane instead.**

```
Card container:
  background: var(--surface)
  border: 1px solid var(--border)
  border-radius: 10px
  padding: 14px 16px
  cursor: pointer
  transition: border-color 0.15s, box-shadow 0.15s
  position: relative

  Selected state:
    border-color: var(--navy)
    box-shadow: var(--s2)
    background: var(--surface)

  Hover (unselected):
    border-color: var(--border-2)
    box-shadow: var(--s1)

  Urgency indicator — LEFT BORDER ONLY (no badge):
    If urgent: border-left: 3px solid var(--red)
    If not:    border-left: 3px solid transparent

CARD LAYOUT — 3 rows:

  ROW 1 (top): Company + Date
    display: flex; justify-content: space-between; align-items: center
    margin-bottom: 6px

    LEFT:
      Company logo avatar:
        width: 26px; height: 26px; border-radius: 6px
        background: company.logoBg; color: company.logoText
        font: DM Sans 800, 8px
        display: flex; align-items/justify-content: center
        flex-shrink: 0
      Company name: DM Sans 500, 12px, var(--t3) — truncate at 1 line

    RIGHT:
      posted date — DM Mono 400, 10px, var(--t4)
      Format: "Mar 2" (abbreviated month + day only)

  ROW 2 (middle): Job Title
    margin-bottom: 8px
    Job title — DM Sans 700, 14px, var(--t1)
    max 2 lines, overflow ellipsis

  ROW 3 (bottom): Meta row
    display: flex; align-items: center; gap: 10px; flex-wrap: wrap

    Location chip:
      Icon.Location (12px, var(--t4)) + "{region}, {macro}"
      DM Sans 400, 11px, var(--t3)
      display: flex; align-items: center; gap: 3px

    Openings chip:
      Icon.Users (12px, var(--t4)) + "{n} open"
      DM Sans 400, 11px, var(--t3)

    Category badge:
      background: type.bg; color: type.color
      border-radius: 4px; padding: 2px 8px
      font: DM Sans 600, 10px, text-transform: uppercase, letter-spacing: 0.05em
      NO icon on the badge — category name only (abbreviated if > 18 chars)

    [POST-ANALYSIS ONLY] Score badge — RIGHT ALIGNED:
      border-radius: 5px; padding: 3px 8px
      font: DM Mono 500, 11px
      ≥80: background var(--green-bg), color var(--green)
      ≥50: background var(--amber-bg), color var(--amber)
      <50:  background var(--red-bg),   color var(--red)
      Text: "{score}% match"
```

---

### 4.8 Grid View Card (alternate when grid toggle active)

```
Grid: repeat(auto-fill, minmax(260px, 1fr)), gap: 10px

Card:
  background: var(--surface)
  border: 1px solid var(--border)
  border-radius: 10px
  overflow: hidden
  cursor: pointer
  transition: all 0.15s
  hover: box-shadow var(--s2), border-color var(--border-2)

  Top accent: 4px height strip, background: type.barColor

  Body: padding 14px 16px

    Row 1: [logo 32px] + [company name 12px] + [date 10px right]
    Row 2: Job title — DM Sans 700, 14px, var(--t1), margin: 8px 0
    Row 3: [category badge] + [level chip — DM Sans 500 10px, var(--t3), background var(--surface-2)]
    Row 4: salary — DM Mono 500, 13px, var(--green), margin-top: 10px
    Row 5: [location chip] + [openings chip] — same as list view row 3
```

---

### 4.9 Job Detail Pane (preview panel — right side)

This replaces the old "expanded card" interaction entirely.

```
Triggered by: clicking any job card in the left list
Animation: fadeIn 0.15s

STRUCTURE:

─── BANNER ────────────────────────────────────────────
  position: relative
  background: company.bannerBg
  min-height: 100px
  padding: 20px 24px
  overflow: hidden

  Subtle radial gradient overlay (accent color, 15% opacity, ellipse at left)
  Pokémon sprite: right:0; bottom:0; height:110px; width:auto
    filter: drop-shadow only (no box-shadow)
    opacity: 0.88

  Content:
    Logo avatar (44px, border-radius: 10px) + company name (DM Sans 700, 16px, white)
    Tagline (DM Sans 400, 12px, rgba(255,255,255,0.4))
    Meta row: [HQ] · [Industry] · [Size] — DM Sans 400, 11px, rgba(255,255,255,0.32)
    Icon.Location, Icon.Building, Icon.Users before each — 11px, same color

─── BODY ──────────────────────────────────────────────
  padding: 20px 24px

  Job title: DM Sans 700, 20px, var(--t1), letter-spacing: -0.3px, margin-bottom: 4px
  Salary:    DM Mono 500, 15px, var(--green), margin-bottom: 14px

  Meta chips row (flex, gap: 6px, flex-wrap: wrap, margin-bottom: 16px):
    [Category badge — full category name, same styling as list card]
    [Level chip — background var(--surface-2), DM Sans 500, 11px, var(--t2)]
    [Location — Icon.Location + text, var(--t3), 11px]
    [{n} openings — Icon.Users + text]
    [Posted: {full date} — Icon.Calendar + text, var(--t4)]
    [URGENT indicator — if urgent: Icon.Lightning (12px, var(--red)) + "Urgent hire" text, var(--red), DM Sans 600, 11px]
    NO verified badge anywhere

─── MATCH SCORE (post-analysis only) ─────────────────
  padding: 0 24px 16px
  Score bar row:
    Label: "DexMatch Score" — DM Sans 500, 11px, var(--t4), text-transform: uppercase, letter-spacing: 0.06em
    Score: DM Mono 700, 13px, color by score tier — right side
    Bar: height 6px, border-radius 3px, background var(--border), overflow hidden
      Fill: width={score}%, animation: progressFill 0.8s ease-out, color by tier

─── SKILLS ACCORDION ─────────────────────────────────
  Collapsible section — DEFAULT OPEN if post-analysis, DEFAULT CLOSED if pre-analysis

  Header row (clickable):
    border-top: 1px solid var(--border)
    padding: 14px 24px
    display: flex; justify-content: space-between; align-items: center

    LEFT:
      Icon.Tag (14px, var(--t3)) + "Required Skills" (DM Sans 600, 13px, var(--t2))
      Pill: "{n} skills" — DM Sans 600, 10px, var(--t4), background var(--surface-2), border-radius 10px, padding 2px 7px
    RIGHT:
      Icon.ChevronDown (animates to ChevronUp when open)

  Body (revealed on open, transition: max-height 0.2s ease):
    padding: 0 24px 16px
    Flex wrap, gap: 6px

    Pre-analysis: all skills same style
      background: var(--surface-2), color: var(--t2), border-radius: 5px, padding: 4px 10px
      font: DM Sans 500, 11px

    Post-analysis: distinguish matched vs unmatched
      Matched: background var(--green-bg), color var(--green) — Icon.Check (10px) before text
      Unmatched: background var(--surface-2), color var(--t4)

─── DESCRIPTION ──────────────────────────────────────
  Section header:
    border-top: 1px solid var(--border)
    padding: 14px 24px 10px

    "Role Overview" — DM Sans 600, 13px, var(--t2)

  Description text:
    padding: 0 24px 20px
    DM Sans 400, 13px, var(--t2), line-height: 1.75

─── COMPANY ABOUT ────────────────────────────────────
  Collapsible — DEFAULT CLOSED

  Header (same clickable style as Skills header):
    Icon.Building (14px, var(--t3)) + "About {company name}" (DM Sans 600, 13px, var(--t2))
    Icon.ChevronDown

  Body:
    padding: 0 24px 16px
    DM Sans 400, 13px, var(--t3), line-height: 1.75

─── ACTION ROW ───────────────────────────────────────
  Sticky at bottom of detail pane:
    border-top: 1px solid var(--border)
    padding: 14px 24px
    background: var(--surface)
    display: flex; gap: 8px

    "Apply Now" button:
      flex: 1
      height: 40px
      background: var(--red)
      color: white
      border-radius: 8px
      font: DM Sans 700, 13px
      hover: var(--red-hover)
      transition: background 0.15s

    "Save Role" button:
      width: 80px
      height: 40px
      background: var(--surface-2)
      color: var(--t2)
      border: 1px solid var(--border)
      border-radius: 8px
      font: DM Sans 600, 13px
      hover: border-color var(--border-2)
```

---

### 4.10 Footer

Minimal. Three rows.

```
background: var(--navy)
border-top: 1px solid rgba(255,255,255,0.06)
padding: 32px 32px 24px

ROW 1 — brand + links (flex, space-between):
  LEFT: Icon.Pokedex (18px, var(--red)) + "DexMatch" (DM Sans 800, 15px, white)
  RIGHT links: "Privacy" · "Terms" · "Support" · "Partner Gyms"
    DM Sans 500, 12px, rgba(255,255,255,0.3)
    hover: rgba(255,255,255,0.65)

ROW 2 — separator:
  1px solid rgba(255,255,255,0.06), margin: 20px 0

ROW 3 — bottom meta (flex, space-between):
  LEFT: "© 2026 DexMatch" — DM Sans 400, 11px, rgba(255,255,255,0.2)
  RIGHT: "DexAI v2.0" — DM Sans 400, 11px, rgba(255,255,255,0.2)
```

---

## PART 5 — INTERACTION MODEL

### 5.1 State Machine

```
phase: "idle" | "uploaded" | "analyzing" | "done"

selectedJobId: number | null   ← drives detail pane
```

### 5.2 CV Analysis Flow (simplified — no 7-step theatre)

```js
function analyse() {
  setPhase("analyzing");
  let progress = 0;
  const steps = ["Scanning…", "Extracting skills…", "Matching roles…"];
  let stepIdx = 0;
  setStepLabel(steps[0]);

  const interval = setInterval(() => {
    progress += Math.random() * 18 + 8;
    if (progress >= 33 && stepIdx === 0) { stepIdx = 1; setStepLabel(steps[1]); }
    if (progress >= 66 && stepIdx === 1) { stepIdx = 2; setStepLabel(steps[2]); }
    if (progress >= 100) {
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        const scored = JOBS.map(j => ({ job: j, ...calcScore(j) }));
        setResults(scored);
        setPhase("done");
      }, 400);
      return;
    }
    setProgress(Math.min(progress, 99));
  }, 280);
}
```

### 5.3 Detail Pane Behavior

- Clicking a card: `setSelectedJobId(job.id)` — detail pane updates
- If no job selected and list has items: show the placeholder
- On mobile: detail pane becomes a bottom sheet (90vh, slide up)
- Clicking outside bottom sheet or X button: close it

### 5.4 Accordion Behavior (Skills, Company About)

```js
// Each accordion is a local useState(false) per section in the detail pane
// Transition: max-height 0 → 400px, 0.2s ease, overflow: hidden
// ChevronDown icon: transform: rotate(0deg) → rotate(-180deg), transition 0.2s
```

### 5.5 Filter Interaction

All filter changes are instant — no "Apply" button needed. Results update reactively via `useMemo`.

Active filter state shows:
- A small count badge on the filter bar: "3 active" with clear button
- Individual filter controls highlight when non-default (border-color: var(--navy))

### 5.6 Interaction Rules (strict)

| What | Allowed |
|---|---|
| Card hover | border-color + shadow change only — `0.15s ease` |
| Button hover | background color change only — `0.15s ease` |
| Card selection | immediate, no animation |
| Detail pane content change | `fadeIn 0.15s` on the content wrapper only |
| Accordion open/close | `max-height` transition `0.2s ease`, chevron rotate `0.2s` |
| Progress bar fill | `progressFill` animation `0.8s ease-out` on mount |
| Card list mount | `fadeUp 0.22s`, max 3 staggered at `40ms` delay each |
| Modal/overlay | `fadeIn 0.15s` |
| Everything else | NO animation |

---

## PART 6 — WHAT TO REMOVE / NEVER INCLUDE

- No PokéBall spin animation anywhere except the tiny progress spinner during CV scan
- No verified badge — removed entirely from all cards and panels
- No TypeBadge Pokémon type labels ("Psychic", "Fighting" etc.) — use category name only
- No emoji anywhere in the UI — use Icon.* components only
- No "Est." prefix on any date — use full real calendar dates (e.g., "March 2, 2026")
- No toast notifications (not needed for this MVP scope)
- No scroll-to-top button
- No urgent banner strip across the top
- No notification badges on nav links
- No DexReport™ modal — replace with the detail pane which is always visible
- No separate "Full DexReport" workflow — match scores are surfaced inline on the card and expanded in the detail pane
- No HPBar game-style border — use a clean flat bar (height: 6px, no border, no border-radius > 3px)
- No company verified badges of any kind
- No heavy shimmer animations on skeletons — use a simple opacity pulse if needed at all
- No excessive color variety — stick strictly to the token system defined above

---

## PART 7 — BUILD ORDER

```
1.  CSS tokens + font import
2.  Animation keyframes (only the 4 permitted ones)
3.  Icon system (all Icon.* components)
4.  Data: JOB_TYPES, COMPANIES, JOBS (all 30, real 2026 dates)
5.  Computed constants: TOTAL_OPENINGS, UNIQUE_REGIONS, UNIQUE_COMPANIES, URGENT_COUNT
6.  Root state: phase, selectedJobId, progress, stepLabel, results, filters
7.  Navigation bar
8.  Hero strip
9.  Filter toolbar
10. Sidebar — CV Upload panel (accordion)
11. Sidebar — Skills Detected panel (accordion, hidden pre-analysis)
12. Sidebar — Quick Filters panel (accordion)
13. Job List Card component (list view)
14. Grid View Card component
15. Job Detail Pane component (all 4 accordion sections + sticky action row)
16. Right content area (list column + detail pane split)
17. calcScore + analyse() + reset()
18. Filter/sort useMemo derivations
19. Footer
20. Responsive: mobile bottom sheet for detail pane, single-column below 768px
```

---

*DexMatch UI Overhaul Prompt v3.0 — Clean & Functional*
*This document fully replaces v1.1 and v2.0 Addendum.*