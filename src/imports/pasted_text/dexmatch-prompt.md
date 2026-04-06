# DexMatch — Figma Make Comprehensive Build Prompt

---

## 🎯 Project Overview

Build **DexMatch**, a Pokémon-themed job matching web application — a fully interactive, single-page React app styled like a retro-modern Pokémon career platform. The experience mimics a Pokédex-meets-LinkedIn aesthetic: dark navy/red branding, game-accurate UI patterns, and an AI-powered CV scanner that matches users to open roles.

---

## 🎨 Design System

### Color Palette
```
--brand-dark:     #1A1A2E   /* primary dark navy — nav, banners, panels */
--brand-red:      #E3350D   /* Poké-red accent — CTAs, borders, badges */
--brand-gold:     #FFD700   /* headline highlight */
--brand-green:    #059669   /* salary, success states */
--brand-success:  #3BB53B   /* HP bar green */
--brand-warn:     #F0A000   /* HP bar amber */
--surface:        #FAFAF7   /* warm off-white page background */
--surface-card:   #FFFFFF   /* card backgrounds */
--border:         #E8E5DE   /* default card borders */
--text-primary:   #1A1A2E
--text-muted:     #6B7280
--text-faint:     #9CA3AF
```

### Typography
- **Font stack:** System sans-serif, clean and utilitarian
- **Logo / brand text:** `font-weight: 900`, `letter-spacing: -0.4px`
- **Section headers:** `font-weight: 800`, `letter-spacing: -0.5px`
- **Body / description:** `font-weight: 400–600`, `line-height: 1.7`
- **Badges / labels:** `font-weight: 700–800`, `text-transform: uppercase`, `letter-spacing: 0.8–1.2px`

### Animations (CSS keyframes)
```css
@keyframes spin    { to { transform: rotate(360deg); } }
@keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.4} }
@keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeIn  { from{opacity:0} to{opacity:1} }
```
Apply `fadeUp` with staggered `animation-delay` to all cards and list items.

---

## 🧩 Component Inventory

### 1. PokéBall SVG Component
A reusable SVG icon used throughout the app.
- **Props:** `size` (default 28), `spinning` (boolean — applies spin animation)
- **Structure:** Red top half, white bottom half, dark center band, small center dot
- SVG viewBox `0 0 40 40`:
  - Red circle `cx=20 cy=20 r=18`
  - White clipped half-circle (bottom)
  - Dark rect `x=2 y=18 w=36 h=4` (center band)
  - White circle `r=6` with dark border at center
  - Dark circle `r=3` at center

### 2. TypeBadge Component
Inline badge for job category labels.

**⚠️ CRITICAL MODIFICATION:** The badge must display **only the icon and the full category name** — **do NOT show Pokémon type labels** (no "Psychic", "Fighting", "Steel", "Fairy", "Normal", "Grass", "Dark", "Electric" etc.). The label shown must be the human-readable job category.

**Job Category Badge Definitions (icon + color only, label = category name):**
| Category | Background | Text Color | Light BG | Icon |
|---|---|---|---|---|
| Research & Science | `#F85888` | `#fff` | `#FEE8F2` | 🔬 |
| Battle & Training | `#C03028` | `#fff` | `#FDECEA` | ⚔️ |
| Engineering & Tech | `#6B8CBA` | `#fff` | `#EEF3FA` | ⚙️ |
| Performance & Arts | `#D685AD` | `#fff` | `#FBEFF6` | ✨ |
| Healthcare & Welfare | `#A8A878` | `#fff` | `#F5F5EC` | 💊 |
| Conservation & Welfare | `#78C850` | `#fff` | `#EEF9E8` | 🌿 |
| Law Enforcement & Patrol | `#705848` | `#fff` | `#F0EDE8` | 🛡️ |
| Media & Communications | `#C8A800` | `#1A1A2E` | `#FFFBEA` | 📡 |

**Badge styling:**
```css
display: inline-flex; align-items: center; gap: 4px;
padding: 3px 9px (normal) or 2px 7px (small);
border-radius: 4px;
font-size: 11px (normal) or 10px (small);
font-weight: 700; letter-spacing: 0.3px;
text-transform: uppercase; white-space: nowrap;
```

### 3. HPBar Component
Pokémon-style HP bar showing match score percentage.
- `pct >= 80` → green `#3BB53B`
- `pct >= 50` → amber `#F0A000`
- `pct < 50` → red `#E3350D`
- Container: `height:7px`, `border-radius:4px`, `background:#E8E5DE`, `border:1px solid #D4D0C8`
- Fill bar: `width: {pct}%`, `transition: width 1s ease`
- Right label: `font-weight: 800`, `font-size: 12px`, colored to match bar

### 4. SpriteImg Component
Loads Pokémon official artwork from PokeAPI CDN:
`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png`
- Falls back silently on error (hides image, no broken icon)

---

## 🗄️ Data Layer

### Companies (14 total)
Each company has: `pokemon` (sprite ID), `bannerBg`, `accent`, `logoBg`, `logoText`, `logo` (abbreviation), `tagline`, `hq`, `size`, `industry`, `founded`, `verified` (boolean), `about`.

| Company | Pokemon ID | Accent | Logo |
|---|---|---|---|
| Professor Oak's Laboratory | 133 | `#D4A44C` | OAK |
| Silph Co. | 137 | `#4A90D9` | SC |
| Devon Corporation | 208 | `#2ECC8A` | DC |
| Pokémon Center Network | 113 | `#F07BAA` | PCN |
| Aether Foundation | 789 | `#E8D87F` | AF |
| Cerulean City Gym | 121 | `#4DB8E8` | CCG |
| Hoenn Pokémon League | 384 | `#F5C518` | HPL |
| Battle Frontier | 376 | `#A855F7` | BF |
| Ranger Union | 492 | `#4CAF50` | RU |
| Global Terminal Systems (GTS) | 233 | `#3B82F6` | GTS |
| Goldenrod Radio Tower | 39 | `#F59E0B` | GRT |
| Lilycove Contest Hall | 350 | `#E879C0` | LCH |
| National Daycare – Route 34 | 132 | `#6EBF6E` | NDC |
| Pokémon League Association | 59 | `#E8C84A` | PLA |

### Jobs (15 total)
Each job has: `id`, `title`, `company`, `region`, `macro` (region group), `type` (job category), `salary`, `level`, `openings`, `posted`, `urgent` (boolean), `skills[]`, `desc`.

| ID | Title | Company | Region | Macro | Type | Salary | Level | Openings | Urgent |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Pokémon Research Scientist | Professor Oak's Laboratory | Pallet Town | Kanto | Research & Science | ₽4.2M–₽6.8M | Mid–Senior | 2 | ✅ |
| 2 | Gym Leader (Water-Type) | Cerulean City Gym | Cerulean City | Kanto | Battle & Training | ₽3.5M–₽5.2M | Senior | 1 | ❌ |
| 3 | Senior Product Engineer | Silph Co. | Saffron City | Kanto | Engineering & Tech | ₽7.1M–₽9.4M | Senior | 3 | ❌ |
| 4 | Pokémon Contest Coordinator | Lilycove Contest Hall | Lilycove City | Hoenn | Performance & Arts | ₽2.8M–₽4.5M | Mid | 2 | ❌ |
| 5 | Marine Biologist – Pokémon Div. | Devon Corporation | Dewford Town | Hoenn | Research & Science | ₽5.0M–₽7.3M | Mid–Senior | 1 | ✅ |
| 6 | Head Nurse – Pokémon Center | Pokémon Center Network | Goldenrod City | Johto | Healthcare & Welfare | ₽3.9M–₽5.6M | Senior | 4 | ✅ |
| 7 | Network Infrastructure Engineer | Global Terminal Systems | Goldenrod City | Johto | Engineering & Tech | ₽6.5M–₽8.9M | Senior | 2 | ❌ |
| 8 | Conservation Officer | Aether Foundation | Aether Paradise | Alola | Conservation & Welfare | ₽4.4M–₽6.1M | Mid | 3 | ❌ |
| 9 | Field Ranger – Almia Division | Ranger Union | Chicole Village | Almia | Law Enforcement & Patrol | ₽3.2M–₽4.8M | Entry–Mid | 6 | ❌ |
| 10 | Battle Strategy Analyst | Battle Frontier | Battle Frontier | Hoenn | Battle & Training | ₽5.8M–₽7.7M | Senior | 1 | ❌ |
| 11 | Radio Host – Pokémon Talk | Goldenrod Radio Tower | Goldenrod City | Johto | Media & Communications | ₽3.1M–₽4.6M | Mid | 1 | ❌ |
| 12 | League Referee & Officiator | Pokémon League Association | Indigo Plateau | Kanto | Battle & Training | ₽4.7M–₽6.3M | Mid–Senior | 5 | ❌ |
| 13 | UX Researcher – PokéNav Div. | Devon Corporation | Rustboro City | Hoenn | Engineering & Tech | ₽5.5M–₽7.2M | Mid | 2 | ✅ |
| 14 | Elite Four – Psychic Division | Hoenn Pokémon League | Ever Grande City | Hoenn | Battle & Training | ₽9.2M–₽14.0M | Executive | 1 | ✅ |
| 15 | Pokémon Daycare Specialist | National Daycare – Route 34 | Route 34 | Johto | Healthcare & Welfare | ₽2.5M–₽3.7M | Entry–Mid | 2 | ❌ |

**Derived constants:**
- `TOTAL_OPENINGS` = sum of all `openings` values
- `UNIQUE_REGIONS` = deduplicated `macro` values (Kanto, Hoenn, Johto, Alola, Almia)
- `UNIQUE_COMPANIES` = 14

---

## 🖼️ Layout Structure

### Global Layout
```
<html>
  <style> (global keyframes, box-sizing reset) </style>
  <div style="min-height:100vh; background:#FAFAF7; font-family:sans-serif">
    <header>  ← sticky nav
    <section> ← hero
    <main>    ← 2-column grid: [310px sidebar] [1fr content]
    <footer>
  </div>
```

---

## 📐 Section Specifications

### SECTION 1: Navigation Bar (`<header>`)
**Styles:** `background:#1A1A2E`, `border-bottom: 2.5px solid #E3350D`, `position:sticky; top:0; z-index:50`

**Height:** 60px, `max-width:1280px` centered with `padding: 0 28px`

**Left — Brand:**
- PokéBall icon (size=32)
- Text block:
  - `"DexMatch"` — `font-weight:900; font-size:18px; color:#fff; letter-spacing:-0.4px`
  - `"Pokémon Career Network"` — `font-size:9px; color:rgba(255,255,255,0.28); letter-spacing:2px; text-transform:uppercase`

**Right — Nav links + CTA:**
- Links: "Browse", "Companies", "Resources" — `color:rgba(255,255,255,0.42); font-size:13px; font-weight:700`
- Button: "Sign In" — `background:#E3350D; color:#fff; padding:8px 18px; border-radius:9px; font-weight:800`

---

### SECTION 2: Hero (`<section>`)
**Styles:** `background:#1A1A2E; padding:44px 28px 48px; position:relative; overflow:hidden`

**Decorative circles (absolute positioned, pointer-events:none):**
- Circle 1: `right:-40px; top:-40px; width:260px; height:260px; border:48px solid rgba(227,53,13,0.05)`
- Circle 2: `right:100px; bottom:-60px; width:180px; height:180px; border:36px solid rgba(227,53,13,0.04)`

**Content (max-width:660px, centered):**

1. **Status pill:**
   - `background:rgba(227,53,13,0.12); border:1px solid rgba(227,53,13,0.28); border-radius:20px; padding:5px 16px`
   - Animated red dot (pulse animation) + text: `"{TOTAL_OPENINGS} open positions · {UNIQUE_REGIONS.length} regions"`
   - Text: `font-size:11px; color:#FCA5A5; font-weight:800; letter-spacing:1.2px; text-transform:uppercase`

2. **Headline:**
   - `"Find Your Best Role"` (white) + line break + `"Across the Pokémon World"` (gold `#FFD700`)
   - `font-size:42px; font-weight:900; line-height:1.1; letter-spacing:-1.5px`

3. **Subtext:**
   - `"Upload your CV and let DexAI match your skills to the right career — from Professor Labs to the Elite Four."`
   - `color:rgba(255,255,255,0.42); font-size:15px; line-height:1.8`

4. **Stats bar** (inline-flex, glass panel):
   - `background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); border-radius:14px; overflow:hidden`
   - Three stats separated by thin dividers:
     - `{UNIQUE_REGIONS.length}` — "Regions"
     - `{TOTAL_OPENINGS}` — "Open Positions"
     - `{UNIQUE_COMPANIES}` — "Companies"
   - Number: `font-weight:900; font-size:20px; color:#FFD700`
   - Label: `font-size:10px; color:rgba(255,255,255,0.35); font-weight:700; letter-spacing:0.8px; text-transform:uppercase`

---

### SECTION 3: Main Grid (`<main>`)
`max-width:1280px; margin:0 auto; padding:28px 28px 52px`
`display:grid; grid-template-columns:310px 1fr; gap:22px; align-items:start`

---

### SECTION 3A: Left Sidebar

#### Panel A: CV Scanner Panel
`background:#fff; border-radius:18px; border:1.5px solid #E8E5DE; box-shadow:0 2px 12px rgba(0,0,0,0.06); overflow:hidden`

**Header bar:** `background:#1A1A2E; padding:13px 18px`
- PokéBall icon (size=22) + "CV Scanner" label (white, font-weight:900, font-size:13px)
- Right side: animated status dot + status text ("Ready" / "File Loaded" / "Processing" / "Complete")

**Body:** `padding:18px`

**State: idle / uploaded**
- Drop zone:
  - `border:2px dashed; border-radius:14px; padding:28px 16px; text-align:center; cursor:pointer`
  - Default: `border-color:#D0CCC4; background:#FAFAF7`
  - Drag-over: `border-color:#E3350D; background:#FFF5F5`
  - Uploaded: `border-color:#059669; background:#F0FDF4`
  - Idle state: Upload icon SVG + "Drop your CV here" (bold, dark) + "PDF · DOCX · TXT · click to browse" (muted)
  - Uploaded state: ✅ emoji + filename (bold, green) + "CV loaded · click to replace"
  - Hidden `<input type="file" accept=".pdf,.doc,.docx,.txt">`
- Analyse button: full width, `padding:13px; border-radius:12px; font-weight:900; font-size:15px`
  - Disabled: `background:#E8E5DE; color:#B0A898`
  - Enabled: `background:#E3350D; color:#fff`
  - Contains PokéBall icon + text "Analyse My CV" / "Upload a CV to begin"

**State: analyzing**
- Header row: spinning PokéBall + "Analysing…" (red, bold) + percentage (right-aligned, color-coded)
- Progress bar: `height:10px; border:1px solid #D4D0C8; border-radius:6px`
- Current step text (gray, font-size:12px)
- Step indicators: 7 small segments that fill as steps complete

**Steps (in order):**
1. "Scanning document structure…"
2. "Extracting skills & competencies…"
3. "Measuring experience depth…"
4. "Searching active vacancies…"
5. "Computing DexMatch scores…"
6. "Ranking by region & fit…"
7. "Generating DexReport™…"

**Percentages:** 12, 26, 42, 58, 73, 88, 100

**State: done**
- 🎉 emoji + "Analysis complete!" (dark green, bold) + "{n} roles matched · {n} strong matches"
- Reset button: "↩ Upload New CV" (bordered, full width)

#### Panel B: Browse Filters (visible only in idle state)
`background:#fff; border-radius:18px; border:1.5px solid #E8E5DE`

**Header:** `background:#1A1A2E; padding:13px 18px` — 🗺️ icon + "Browse by"

**Body:** `padding:14px; gap:9px; flex-column`
- Region `<select>`: default "All Regions ({TOTAL_OPENINGS} openings)", then each macro region with opening count
- Type `<select>`: "All Types" + all 8 categories

**Quick Filter pills:**
- Label: "Quick Filter" (`font-size:10px; font-weight:800; color:#9CA3AF; letter-spacing:1px; text-transform:uppercase`)
- Pills for each unique region — active state: `background:#E3350D; color:#fff; border-color:#E3350D`; inactive: `background:#FAFAF7; border-color:#E8E5DE`

#### Panel C: Match Filters (visible only in done state)
**Panels:**
1. **Filter Matches panel** — Sort options (Match Score, Salary, Alphabetical) + Region filter + Type filter
2. **Skills Detected panel** — Header + grid of extracted skill pills with green check icons
   - Skill pill: `background:#F0FDF4; color:#065F46; border:1px solid #BBF7D0; border-radius:10px; padding:4px 10px; font-size:11px; font-weight:700`

---

### SECTION 3B: Right Content Area

#### PRE-ANALYSIS: Browse Grid
- Header: "Explore {n} Open Roles" (dark, font-weight:900) + "All active positions · sorted by region" (muted, font-size:13px)
- Grid: `display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:14px`
- Render `BrowseCard` for each filtered job

#### POST-ANALYSIS: Matched Roles List
- Header row (space-between):
  - Left: PokéBall icon + "{n} Matched Roles" (dark green, bold) + "{n} strong matches · sorted by {sort}" (green, font-size:12px)
  - Right: "Full DexReport™" button (dark green) + ⬇ download button + 🔗 share button
- Empty state: 🔍 icon + "No matches for this combination" + "Try broadening your filters"
- Render `MatchCard` for each result

---

## 🃏 Card Components

### BrowseCard (compact grid card)
**Container:** `background:#fff; border-radius:14px; border:1.5px solid; cursor:pointer; overflow:hidden`
- Border color: default `#E8E5DE`, open/active → company `accent` color
- `box-shadow`: subtle shadow, increases when open
- `animation: fadeUp 0.3s ease both` with staggered delay

**Structure:**
1. **Type color bar:** `height:4px; background:{typeColor}`
2. **Card body** (`padding:14px 16px`):
   - Company row:
     - Logo avatar (36px, rounded, company `logoBg`/`logoText`)
     - Company name (bold, dark) + location (muted, with 📍)
     - If `urgent`: "URGENT" badge (`background:#FEF3C7; color:#92400E; border:1px solid #FDE68A`)
   - Job title: `font-size:14px; font-weight:800; color:#1A1A2E`
   - Badges row: `TypeBadge` (small) + level badge (`background:#F5F4F0; color:#6B7280`)
   - Footer row: salary (green, bold, font-size:13px) + "{n} opening(s) · {date}" (muted, right)
3. **Expanded section** (when open, separated by dashed border):
   - Skill pills (using type light bg + type border color)
   - Description text
   - "Apply Now" button (dark, full-width) + "Save" button (bordered)

### MatchCard (full banner card)
**Container:** `background:#fff; border-radius:18px; border:1.5px solid; overflow:hidden; margin-bottom:16px`
- `animation: fadeUp 0.35s ease both`

**Structure:**

1. **Company banner** (`position:relative; min-height:100px; background:{bannerBg}; overflow:hidden`):
   - Radial gradient overlay (accent color, low opacity, from left)
   - Pokémon sprite (right side, 120×120px container, `drop-shadow` with accent color)
   - Banner content area (`padding:15px 18px 12px; padding-right:128px`):
     - Logo row: logo avatar (40px) + company name (white, bold) + ✓ VERIFIED badge (if verified) + tagline (faint white)
     - Company meta row: HQ 📍, Industry 🏭, Size 👥, Founded 🗓 — all in `rgba(255,255,255,0.38)`, font-size:10px

2. **Job body** (`padding:15px 18px`):
   - Row 1: job title (bold, dark, font-size:16px) + salary (green, font-weight:800)
   - Row 2: TypeBadge + level badge + if `urgent` → "URGENT" badge + location chip + openings chip
   - HP bar row: "Match Score" label + HPBar component + "DexMatch AI" label
   - Matched skills: highlighted green pills (if skill is matched) vs regular gray pills
   - "View Full Report" + "Apply Now" (if expanded) buttons

3. **Expanded section** (when open):
   - Company "About" paragraph
   - Divider
   - Job description
   - Two action buttons: "Apply Now" (full-width, dark) + "Save Role" (bordered)

---

## 📊 DexReport™ Modal

**Overlay:** `position:fixed; inset:0; background:rgba(0,0,0,0.6); backdrop-filter:blur(4px); z-index:100; display:flex; align-items:center; justify-content:center; padding:20px`

**Modal container:** `background:#fff; border-radius:24px; max-width:700px; width:100%; max-height:90vh; overflow-y:auto; border:2px solid #E8E5DE; box-shadow:0 24px 60px rgba(0,0,0,0.22)`

**Header:** `background:#1A1A2E; padding:20px 24px; border-radius:20px 20px 0 0`
- PokéBall icon + "DexReport™" (white, bold, font-size:18px) + "Personalised Career Analysis" (faint white)
- Close button ✕ (right side, semi-transparent)

**Sections:**

1. **Top 3 Picks** — Three match cards displayed compactly
2. **Skills Heatmap** — Grid of skill pills with match rate %
3. **Match Breakdown** — Doughnut/pie chart summary or bar chart of scores by category
4. **Recommendations** — 2–3 actionable next-step text bullets

---

## ⚙️ State Management

### Phases
```
phase: "idle" | "uploaded" | "analyzing" | "done"
```
- `idle` → show Browse Grid + Browse Filters + empty CV scanner
- `uploaded` → CV scanner shows file name, Analyse button active
- `analyzing` → progress bar animating, main content hidden
- `done` → Match Cards list + Match Filters + skills panel visible

### State Variables
```js
const [phase,       setPhase]       = useState("idle");
const [file,        setFile]        = useState(null);
const [drag,        setDrag]        = useState(false);
const [step,        setStep]        = useState(0);
const [pct,         setPct]         = useState(0);
const [results,     setResults]     = useState([]);
const [sort,        setSort]        = useState("match");   // "match"|"salary"|"alpha"
const [filterRegion,setFilterRegion]= useState("All Regions");
const [filterType,  setFilterType]  = useState("All Types");
const [browseMacro, setBrowseMacro] = useState("All Regions");
const [browseType,  setBrowseType]  = useState("All Types");
const [report,      setReport]      = useState(false);
const fRef = useRef(null);
```

### CV Analysis Simulation
```js
function accept(name) { setFile(name); setPhase("uploaded"); }

function analyse() {
  setPhase("analyzing"); setStep(0); setPct(12);
  // Animate through 7 steps with 700ms intervals
  // On completion: compute scores for all jobs, setResults, setPhase("done")
}

function reset() {
  setPhase("idle"); setFile(null); setStep(0); setPct(0);
  setResults([]); setSort("match"); setFilterRegion("All Regions"); setFilterType("All Types");
}
```

### Score Computation
```js
const EXTRACTED_SKILLS = [
  "Pokédex Analysis","Field Research","Data Collection","Statistical Modeling",
  "Battle Strategy","Leadership","Team Coordination","Environmental Assessment",
  "Pokémon Medicine","Public Speaking","Report Writing","Expedition Planning"
];

function calcScore(job) {
  const matched = job.skills.filter(s => EXTRACTED_SKILLS.includes(s));
  const score = Math.min(98, Math.round((matched.length / job.skills.length) * 100) + Math.floor(Math.random() * 9));
  return { score, matched };
}
```

### Filtered Browse Jobs (pre-analysis)
```js
const browsedJobs = useMemo(() =>
  JOBS.filter(j =>
    (browseMacro === "All Regions" || j.macro === browseMacro) &&
    (browseType  === "All Types"   || j.type === browseType)
  ), [browseMacro, browseType]);
```

### Filtered Match Results (post-analysis)
```js
const filtered = useMemo(() => {
  let list = results
    .filter(r => (filterRegion === "All Regions" || r.job.macro === filterRegion))
    .filter(r => (filterType   === "All Types"   || r.job.type  === filterType));
  if (sort === "match")  list = [...list].sort((a,b) => b.score - a.score);
  if (sort === "salary") list = [...list].sort((a,b) => parseFloat(b.job.salary.replace(/[^\d.]/g,"")) - parseFloat(a.job.salary.replace(/[^\d.]/g,"")));
  if (sort === "alpha")  list = [...list].sort((a,b) => a.job.title.localeCompare(b.job.title));
  return list;
}, [results, sort, filterRegion, filterType]);
```

---

## 🦶 Footer

`background:#1A1A2E; border-top:2.5px solid #E3350D; padding:20px 28px`

**Inner:** `max-width:1280px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px`

**Left:** PokéBall (size=20) + "DexMatch" (white, bold, font-size:13px) + "© 2025 · The Pokémon Career Network" (faint white, font-size:12px)

**Right:** Links — "Privacy", "Terms", "Support", "Partner Gyms" — `color:rgba(255,255,255,0.24); font-size:12px; font-weight:600; text-decoration:none`

---

## ✅ Key Modifications Summary

> These are the explicit changes from the original design:

1. **Remove Pokémon type labels from job category badges.** The `TypeBadge` component must display only the **icon** and the **full category name** (e.g., "⚙️ Engineering & Tech"), not Pokémon type names like "Steel", "Psychic", "Fighting", "Fairy", "Normal", "Grass", "Dark", or "Electric". Delete the `label` field entirely from the type definitions.

2. **Job type filters** use the category name, not the Pokémon type label.

3. **All badge displays** — in BrowseCard, MatchCard, filter dropdowns, and filter pills — consistently show the category name only.

---

## 🚀 Implementation Notes

- Use **React with hooks** (`useState`, `useRef`, `useMemo`)
- All state in a single root component, passing props down
- `BrowseCard` and `MatchCard` are separate sub-components
- `TypeBadge`, `HPBar`, `PokéBall`, `SpriteImg` are micro-components
- All inline styles (no CSS modules or Tailwind required)
- `ReportModal` renders via React portal or conditional in root
- Drag-and-drop on the drop zone: `onDragOver`, `onDragLeave`, `onDrop` handlers
- File input hidden, triggered by clicking the drop zone
- Pokémon sprites loaded from external CDN — `SpriteImg` handles errors silently
- The analysis timer uses `setInterval` with cleanup on completion
- Region opening counts computed via `useMemo` from the JOBS array

---

*End of DexMatch Figma Make Prompt — v1.1 (Cleaned Edition)*