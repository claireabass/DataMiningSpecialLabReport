# DexMatch — Addendum Prompt v2.0
## Expanded Data + Modern UI/UX Overhaul

> **Apply this on top of the base DexMatch prompt (v1.1).**
> Where this document conflicts with v1.1, this document wins.

---

## PART 1 — EXPANDED DATA

---

### 1.1 New Regions (add to existing 5)

| Macro Region | Description |
|---|---|
| **Sinnoh** | Northern highland region — diamond-rich terrain, ancient mythology |
| **Unova** | Metropolitan, cosmopolitan — most urbanised region |
| **Kalos** | Fashion, culture, elegance — the aesthetic capital |
| **Galar** | Industrial + pastoral — steeped in League tradition |
| **Paldea** | Open-world academic region — home to Naranja/Uva Academy |

**Total macro regions after merge: 10**

---

### 1.2 New Companies (add to existing 14)

| Company | Pokemon ID | Banner BG | Accent | Logo | Logo BG | Logo Text | Tagline | HQ | Size | Industry | Founded | Verified |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Pokémon Trainers' School** | 282 | `#0A1E3C` | `#7CB9E8` | PTS | `#7CB9E8` | `#0A1E3C` | Shaping Tomorrow's Trainers | Violet City, Johto | 200–500 | Education & Training | 2001 | true |
| **Sinnoh Underground Corp.** | 299 | `#2A1A00` | `#C8860A` | SUC | `#C8860A` | `#fff` | Mining the Future | Oreburgh City, Sinnoh | 1,000–5,000 | Fossil Research & Mining | 2007 | true |
| **Galactic Research Unit** | 487 | `#12082A` | `#8B5CF6` | GRU | `#8B5CF6` | `#fff` | Beyond the Known Universe | Veilstone City, Sinnoh | 500–1,000 | Space & Dimensional Research | 2006 | false |
| **Pokémon Musical Theatre** | 594 | `#200A28` | `#F472B6` | PMT | `#F472B6` | `#fff` | Curtain Up on Every Stage | Nimbasa City, Unova | 100–500 | Performance & Entertainment | 2011 | true |
| **Unova Transport Authority** | 602 | `#0A1828` | `#22D3EE` | UTA | `#22D3EE` | `#0A1828` | Connecting Every Corner | Castelia City, Unova | 5,000–10,000 | Transport & Infrastructure | 2010 | true |
| **Kalos Fashion Institute** | 670 | `#28100A` | `#FB923C` | KFI | `#FB923C` | `#fff` | Style Is a Second Skin | Lumiose City, Kalos | 200–500 | Fashion & Design | 2014 | true |
| **Lysandre Labs** | 716 | `#1A0808` | `#EF4444` | LL | `#EF4444` | `#fff` | Innovation at Any Cost | Lumiose City, Kalos | 1,000–5,000 | Technology & Energy | 2013 | false |
| **Galar Pokémon League** | 800 | `#0E0E1A` | `#FBBF24` | GPL | `#FBBF24` | `#0E0E1A` | The Greatest Show on Earth | Wyndon, Galar | 500–1,000 | Battle & Governance | 2019 | true |
| **Macro Cosmos Corp.** | 890 | `#0A0A1E` | `#A78BFA` | MCC | `#A78BFA` | `#fff` | Building Galar's Future | Wyndon, Galar | 50,000+ | Energy & Finance | 2018 | true |
| **Naranja Academy** | 906 | `#1A0A00` | `#F97316` | NAC | `#F97316` | `#fff` | Treasure Hunt for Knowledge | Mesagoza, Paldea | 1,000–5,000 | Education & Research | 2022 | true |
| **Paldea Pokémon Patrol** | 935 | `#0A1A0A` | `#34D399` | PPP | `#34D399` | `#0A1A0A` | Guardians of the Open World | Porto Marinada, Paldea | 2,000–5,000 | Law Enforcement & Patrol | 2023 | true |
| **Casseroya Aquatic Lab** | 978 | `#051830` | `#0EA5E9` | CAL | `#0EA5E9` | `#fff` | Depths of Discovery | Casseroya Lake, Paldea | 100–500 | Marine Research | 2022 | false |

**Total companies after merge: 26**

---

### 1.3 New Job Listings (add to existing 15 — new IDs start at 16)

```
ID 16
Title:     Lead Fossil Researcher
Company:   Sinnoh Underground Corp.
Region:    Oreburgh City
Macro:     Sinnoh
Type:      Research & Science
Salary:    ₽5.5M – ₽7.8M
Level:     Mid–Senior
Openings:  2
Posted:    Jan 5, 2025
Urgent:    false
Skills:    Fossil Restoration, Geological Survey, Palaeontology, Laboratory Analysis, Data Collection, Report Writing
Desc:      Excavate and restore ancient Pokémon fossils from Sinnoh's underground tunnel network. Collaborate with the Mining Division on new extraction sites and publish findings in the Pokémon Palaeontology Quarterly.

ID 17
Title:     Dimensional Physics Researcher
Company:   Galactic Research Unit
Region:    Veilstone City
Macro:     Sinnoh
Type:      Research & Science
Salary:    ₽6.8M – ₽9.2M
Level:     Senior
Openings:  1
Posted:    Jan 4, 2025
Urgent:    true
Skills:    Quantum Physics, Dimensional Theory, Statistical Modeling, Data Collection, Field Research, Expedition Planning
Desc:      Research temporal and spatial anomalies linked to Dialga and Palkia activity. Develop theoretical models for the Distortion World and publish peer-reviewed studies.

ID 18
Title:     Pokémon Musical Director
Company:   Pokémon Musical Theatre
Region:    Nimbasa City
Macro:     Unova
Type:      Performance & Arts
Salary:    ₽4.0M – ₽5.8M
Level:     Senior
Openings:  1
Posted:    Jan 3, 2025
Urgent:    false
Skills:    Choreography, Musical Direction, Move Aesthetics, Creative Direction, Audience Engagement, Pokémon Styling
Desc:      Direct seasonal Pokémon Musical productions. Coordinate costumes, lighting, and performer training — including both Trainers and their Pokémon partners.

ID 19
Title:     Transit Network Engineer
Company:   Unova Transport Authority
Region:    Castelia City
Macro:     Unova
Type:      Engineering & Tech
Salary:    ₽7.4M – ₽10.1M
Level:     Senior
Openings:  3
Posted:    Dec 31, 2024
Urgent:    false
Skills:    Systems Engineering, Network Architecture, Project Management, Technical Documentation, API Development, Uptime Management
Desc:      Design and maintain Unova's cross-city rail and ferry systems. Lead infrastructure upgrades to expand capacity across Castelia, Nimbasa, and Mistralton.

ID 20
Title:     Head Stylist – Coordinator Division
Company:   Kalos Fashion Institute
Region:    Lumiose City
Macro:     Kalos
Type:      Performance & Arts
Salary:    ₽4.8M – ₽6.5M
Level:     Senior
Openings:  2
Posted:    Jan 2, 2025
Urgent:    false
Skills:    Pokémon Styling, Contest Performance, Move Aesthetics, Creative Direction, Audience Engagement, Choreography
Desc:      Lead Pokémon Contest costume design and Showcase styling for Kalos competitors. Mentor junior stylists and represent the Institute at the Pokémon Showcase Grand Prix.

ID 21
Title:     Renewable Energy Engineer
Company:   Macro Cosmos Corp.
Region:    Wyndon
Macro:     Galar
Type:      Engineering & Tech
Salary:    ₽8.0M – ₽11.5M
Level:     Senior
Openings:  4
Posted:    Dec 28, 2024
Urgent:    true
Skills:    Energy Systems, Systems Engineering, R&D, Project Management, Technical Documentation, Environmental Assessment
Desc:      Develop next-generation Wishing Star energy extraction systems for Galar's national power grid. Ensure ethical power conversion and ecological compliance with Pokémon habitats.

ID 22
Title:     Champion Liaison Officer
Company:   Galar Pokémon League
Region:    Wyndon
Macro:     Galar
Type:      Battle & Training
Salary:    ₽6.2M – ₽8.4M
Level:     Mid–Senior
Openings:  2
Posted:    Jan 1, 2025
Urgent:    false
Skills:    Leadership, Public Relations, Battle Strategy, Public Speaking, Youth Mentorship, Conflict Resolution
Desc:      Coordinate between the Champion, Gym Leaders, and the League Association. Manage scheduling for official Championship events and Gigantamax exhibition battles.

ID 23
Title:     Academy Expedition Coordinator
Company:   Naranja Academy
Region:    Mesagoza
Macro:     Paldea
Type:      Research & Science
Salary:    ₽4.5M – ₽6.2M
Level:     Mid
Openings:  3
Posted:    Jan 4, 2025
Urgent:    true
Skills:    Expedition Planning, Field Research, Pokédex Analysis, Biology, Data Collection, Community Education
Desc:      Lead student Treasure Hunt expeditions across all of Paldea. Identify new habitats, document rare species sightings, and submit Pokédex entries to the Academy research board.

ID 24
Title:     Open-World Patrol Ranger
Company:   Paldea Pokémon Patrol
Region:    Porto Marinada
Macro:     Paldea
Type:      Law Enforcement & Patrol
Salary:    ₽3.6M – ₽5.1M
Level:     Entry–Mid
Openings:  8
Posted:    Jan 5, 2025
Urgent:    true
Skills:    Field Operations, Navigation, Crisis Response, Wilderness Survival, Environmental Assessment, Team Coordination
Desc:      Patrol Paldea's open terrain, monitor wild Pokémon migration patterns, and respond to conflict reports from Trainers. First line of ecological protection in the region's vast countryside.

ID 25
Title:     Marine Habitat Scientist
Company:   Casseroya Aquatic Lab
Region:    Casseroya Lake
Macro:     Paldea
Type:      Research & Science
Salary:    ₽5.2M – ₽7.0M
Level:     Mid–Senior
Openings:  1
Posted:    Dec 29, 2024
Urgent:    false
Skills:    Marine Biology, Aquatic Pokémon Research, Environmental Assessment, Diving Certification, Data Analysis, Report Writing
Desc:      Study Tatsugiri and Dondozo population dynamics in Casseroya Lake. Produce quarterly reports on aquatic Pokémon ecology for the Paldean Ministry of Nature.

ID 26
Title:     Broadcast Journalist – Field Div.
Company:   Goldenrod Radio Tower
Region:    Goldenrod City
Macro:     Johto
Type:      Media & Communications
Salary:    ₽3.3M – ₽4.9M
Level:     Mid
Openings:  2
Posted:    Jan 3, 2025
Urgent:    false
Skills:    Broadcasting, Live Interviewing, Scriptwriting, Social Media, Audience Engagement, Pokémon Knowledge
Desc:      Report live from Gym Battles, Contest Halls, and wild sighting events across Johto. File daily audio segments and manage the station's social media channels.

ID 27
Title:     PokéBall Assembly Technician Lead
Company:   Silph Co.
Region:    Saffron City
Macro:     Kanto
Type:      Engineering & Tech
Salary:    ₽5.1M – ₽7.3M
Level:     Mid–Senior
Openings:  5
Posted:    Jan 5, 2025
Urgent:    true
Skills:    PokéBall Mechanics, Item Development, Technical Documentation, Systems Engineering, R&D, Project Management
Desc:      Supervise the Master Ball production line and lead QA testing for new capture device prototypes. Work directly with the Chief Engineer on next-season product releases.

ID 28
Title:     Wellness Counsellor – Trainer Division
Company:   Pokémon Center Network
Region:    Cerulean City
Macro:     Kanto
Type:      Healthcare & Welfare
Salary:    ₽3.4M – ₽4.9M
Level:     Mid
Openings:  6
Posted:    Jan 4, 2025
Urgent:    false
Skills:    Patient Communication, Pokémon Medicine, Behavioural Assessment, First Aid, Team Coordination, Healing Systems
Desc:      Provide emotional wellness support for Trainers experiencing battle stress, loss, or burnout. Facilitate recovery workshops and connect Trainers to community resources.

ID 29
Title:     Pokémon Trainer Instructor
Company:   Pokémon Trainers' School
Region:    Violet City
Macro:     Johto
Type:      Battle & Training
Salary:    ₽2.9M – ₽4.3M
Level:     Mid
Openings:  4
Posted:    Dec 26, 2024
Urgent:    false
Skills:    Youth Mentorship, Battle Strategy, Leadership, Team Training, Public Speaking, Rule Enforcement
Desc:      Teach beginner and intermediate Trainer classes covering type advantages, move strategy, and Pokémon care ethics. Develop curriculum and assessments for the upcoming semester.

ID 30
Title:     Energy Research Analyst
Company:   Lysandre Labs
Region:    Lumiose City
Macro:     Kalos
Type:      Research & Science
Salary:    ₽6.0M – ₽8.5M
Level:     Senior
Openings:  1
Posted:    Dec 20, 2024
Urgent:    false
Skills:    Statistical Modeling, Data Analysis, Field Research, Report Writing, Environmental Assessment, Data Collection
Desc:      Analyse Mega Evolution energy signatures and model the long-term sustainability of the Ultimate Weapon's residual energy fields. High security clearance required.
```

**Total jobs after merge: 30**
**Total openings after merge: recalculate dynamically**

---

## PART 2 — MODERN UI/UX OVERHAUL

> Replace ALL layout and design specifications from the v1.1 prompt with what follows. The component logic and data remain the same; only the visual system and layout structure changes.

---

### 2.1 Updated Design Tokens

```css
/* ── Core Brand ── */
--c-navy:        #0F1224;   /* deeper, richer dark */
--c-navy-mid:    #1A1E35;   /* sidebar/panel bg */
--c-navy-lift:   #232840;   /* hover states on dark bg */
--c-red:         #E8341A;   /* primary action */
--c-red-soft:    #FF6B50;   /* secondary/hover red */
--c-gold:        #F5C842;   /* headline accent */
--c-gold-dim:    #C4960A;   /* muted gold for labels */

/* ── Surfaces ── */
--c-bg:          #F4F3EF;   /* warm parchment page bg */
--c-surface:     #FFFFFF;
--c-surface-2:   #F9F8F5;   /* slightly warm for hover */
--c-border:      #E5E2D9;
--c-border-2:    #D4D0C7;   /* stronger dividers */

/* ── Semantic ── */
--c-green:       #10B981;   /* salary / success */
--c-green-dim:   #D1FAE5;   /* light bg for success */
--c-amber:       #F59E0B;   /* warning */
--c-amber-dim:   #FEF3C7;

/* ── Text ── */
--c-text-1:      #111827;   /* primary */
--c-text-2:      #374151;   /* secondary */
--c-text-3:      #6B7280;   /* muted */
--c-text-4:      #9CA3AF;   /* faint */

/* ── Elevation shadows ── */
--shadow-xs: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
--shadow-sm: 0 2px 8px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04);
--shadow-md: 0 8px 24px rgba(0,0,0,0.09), 0 2px 8px rgba(0,0,0,0.05);
--shadow-lg: 0 20px 48px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.07);
--shadow-xl: 0 32px 64px rgba(0,0,0,0.16), 0 12px 28px rgba(0,0,0,0.08);
```

---

### 2.2 Typography Upgrade

Import from Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
```

| Role | Font | Weight | Size | Notes |
|---|---|---|---|---|
| App brand | Plus Jakarta Sans | 900 | 20px | letter-spacing: -0.5px |
| Page headline | Plus Jakarta Sans | 800–900 | 36–44px | letter-spacing: -1.5px |
| Section title | Plus Jakarta Sans | 800 | 18–22px | letter-spacing: -0.5px |
| Card title | Plus Jakarta Sans | 700 | 14–16px | |
| Body / desc | Space Grotesk | 400 | 13–14px | line-height: 1.75 |
| Labels / badges | Space Grotesk | 600–700 | 10–12px | uppercase, tracking wide |
| Numbers / stats | Plus Jakarta Sans | 800–900 | varies | tabular-nums |

---

### 2.3 Animation System Upgrade

```css
@keyframes spin       { to { transform: rotate(360deg); } }
@keyframes pulse      { 0%,100%{opacity:1} 50%{opacity:0.35} }
@keyframes fadeUp     { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeIn     { from{opacity:0} to{opacity:1} }
@keyframes slideRight { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
@keyframes scaleIn    { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
@keyframes shimmer    {
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
}
```

**Usage rules:**
- Cards entering viewport: `fadeUp` with 40ms staggered delay per item
- Sidebar panels: `slideRight 0.3s ease`
- Modals: `scaleIn 0.22s cubic-bezier(0.34,1.56,0.64,1)` (spring feel)
- Skeleton loading: `shimmer` on placeholder elements
- Hover transitions: `transition: all 0.18s ease` on interactive elements

---

### 2.4 Global Layout — COMPLETE REDESIGN

#### Page Shell
```
background: var(--c-bg)
font-family: 'Space Grotesk', sans-serif
min-height: 100vh
```

#### Top Navigation (redesigned)

**Height:** 64px
**Background:** `var(--c-navy)` with `backdrop-filter: blur(16px)` for glass effect when scrolled
**Border bottom:** `1px solid rgba(255,255,255,0.07)` (subtle — no thick red line)
**Red accent:** moved to a 2px left-border on the active nav link, not the full bottom border

```
[LEFT]
  PokéBall icon (28px)
  "DexMatch" wordmark (Plus Jakarta Sans 900, 18px, white)
  Subtitle "Career Network" (10px, faint, uppercase, tracking)

[CENTER - new addition]
  Global search bar:
    background: rgba(255,255,255,0.07)
    border: 1px solid rgba(255,255,255,0.10)
    border-radius: 10px
    padding: 8px 14px 8px 36px
    width: 280px
    placeholder: "Search roles, companies, regions…"
    🔍 icon positioned left inside
    font-size: 13px, color: rgba(255,255,255,0.6)

[RIGHT]
  "Browse" link
  "Companies" link  
  "Resources" link
  Notification bell icon (🔔, badge if urgent jobs exist)
  Divider
  "Sign In" CTA button
    background: var(--c-red)
    padding: 8px 20px
    border-radius: 8px
    font-weight: 700
```

---

#### Hero Section (redesigned — more compact and action-forward)

**Background:** `var(--c-navy)` → subtle dark-to-dark gradient  
**Padding:** `36px 32px 40px` (tighter than v1 — this isn't a landing page, it's an app)

**Layout: two-column split** (new — not centered)

```
LEFT COLUMN (max-width: 520px)
  Status pill (same as before, but smaller)
  Headline: "Your Next Role in the Pokémon World"
  Subtext: one short line, max 80 chars
  Stats row (3 chips inline, pill style)

RIGHT COLUMN (shows on desktop, hidden on mobile)
  Stacked "Featured Role" preview card (teaser of the highest-urgency job)
  Faint background: radial glow from brand red
```

**Stats chips** (replace old stats bar):
```
Each stat: background rgba(255,255,255,0.07), border-radius: 20px, padding: 6px 14px
Format: "10 Regions" · "47 Positions" · "26 Companies"
No inner dividers — gap between chips instead
```

---

#### Main Content Grid (REDESIGNED)

**Switch from 2-col to 3-zone layout:**

```
┌─────────────────────────────────────────────────────────┐
│  NAV (sticky, full-width)                               │
├─────────────────────────────────────────────────────────┤
│  HERO (full-width)                                      │
├─────────────────────────────────────────────────────────┤
│  FILTER BAR (sticky below nav, full-width strip)        │  ← NEW
├──────────┬──────────────────────────────────────────────┤
│ SIDEBAR  │  CONTENT AREA                                │
│ 280px    │  flex-grow: 1                                │
│ sticky   │                                              │
│          │  [pre-analysis]  responsive card grid        │
│          │  [post-analysis] match list + sort bar       │
└──────────┴──────────────────────────────────────────────┘
```

**Sticky Filter Bar (NEW COMPONENT):**
```
Position: sticky, top: 64px (below nav), z-index: 40
Background: var(--c-bg) with bottom border 1px solid var(--c-border)
Padding: 10px 32px
Height: 52px

Contents (flex row, gap:10px):
  [Region dropdown]  [Job Type dropdown]  [Level dropdown — NEW]
  [Salary range toggle — NEW: "Any" | "₽3M+" | "₽5M+" | "₽8M+"]
  [Spacer]
  [Sort: "Best Match" | "Salary" | "A–Z"] (segmented control style)
  [View toggle: grid icon | list icon] — NEW
```

All dropdowns: `border-radius:8px; border:1.5px solid var(--c-border); background:var(--c-surface); padding:7px 12px; font-size:13px; font-weight:600; color:var(--c-text-2)`

---

### 2.5 Sidebar — Redesign

**Width:** 280px (down from 310px — sleeker)
**Position:** `sticky; top: 116px` (below nav + filter bar)
**Gap between panels:** 12px

#### CV Scanner Panel (redesigned)

**Header:**
- Remove the dark navy band header — integrate the panel title into the body
- Use a subtle top accent line instead: `height:3px; background:linear-gradient(90deg, var(--c-red), var(--c-red-soft))`

**Panel body:** `padding: 20px`

**Idle / Uploaded state:**
- Drop zone: `border-radius:16px; border:2px dashed; min-height:140px`
- Replace plain upload icon with an animated PokéBall that pulses when drag-over
- **New:** "Supported formats" shown as tiny pill tags: `PDF` `DOCX` `TXT`
- Analyse button: `border-radius:12px; height:48px; font-size:15px; font-weight:800; letter-spacing:-0.3px`

**Analyzing state:**
- Add a step progress row at the top: 7 dots that activate sequentially
- Keep HP-style bar but increase height to 12px
- Step label now has a subtle spinner icon to its left

**Done state:**
- Add a mini "match quality" gauge: a donut ring (SVG) showing percentage of roles with 80%+ score
- "Strong Matches" count in large bold green
- "Upload New CV" as a ghost button below

#### Region Quick-Filter Panel (redesigned)

**New design: Region Map-like tile grid instead of dropdown + pills**

```
Panel title: "Explore by Region" (left-aligned, font-weight:800, font-size:13px)

Region tiles: 2-column grid
Each tile:
  background: var(--c-surface-2)
  border: 1.5px solid var(--c-border)
  border-radius: 12px
  padding: 10px 12px
  cursor: pointer

  [Region name, font-weight:700, font-size:12px]
  [Job count, font-size:11px, color:var(--c-green), font-weight:600]

Active tile:
  background: var(--c-navy)
  border-color: var(--c-navy)
  color: white (name + count)

Hover: scale(1.02) with transition
```

#### Skills Detected Panel (post-analysis, redesigned)

**Header row:** "Skills Detected" label + small "12 found" count badge

**Skill pills — new visual treatment:**
- Each pill: `background:var(--c-green-dim); color:#065F46; border:none; border-radius:8px; padding:5px 12px; font-size:11px; font-weight:700`
- Add a small ✓ icon before each skill
- On hover: pill lifts with `box-shadow: 0 2px 8px rgba(16,185,129,0.25)`

---

### 2.6 BrowseCard — Redesign

**Layout change: switch from compact stacked to horizontal card for list view, retain grid card for grid view**

**View: Grid (default)**
```
Card container:
  background: var(--c-surface)
  border-radius: 16px
  border: 1.5px solid var(--c-border)
  box-shadow: var(--shadow-xs)
  overflow: hidden
  transition: transform 0.18s, box-shadow 0.18s
  cursor: pointer

Hover:
  transform: translateY(-3px)
  box-shadow: var(--shadow-md)
  border-color: {company accent color}

Top strip: 5px, gradient left→right from typeColor to typeColor transparent

Card body: padding 16px 18px

Row 1: [company logo avatar 38px] + [company name bold] + [URGENT badge if applicable]
Row 2: [job title, 15px, Plus Jakarta Sans 700]
Row 3: [TypeBadge] + [level chip] — gap: 6px
Row 4 (bottom): [salary, green, bold] + ["{n} opening(s)", muted, right-aligned]

Expanded on click:
  Reveals below Row 4, animate height with max-height transition
  Skills: wrapped pills
  Desc: Space Grotesk, 13px, line-height 1.75
  Action row: [Apply Now (red, full-width)] [Save (ghost)]
```

**View: List**
```
Card container:
  Same styles but: flex-direction row, min-height 72px, align-items center
  No top strip — left border 4px solid typeColor instead

Layout (horizontal):
  [Logo 44px] | [Title + company + location] | [TypeBadge + Level] | [Salary] | [Apply →]
  padding: 14px 20px
  Each section flex-grows appropriately
```

---

### 2.7 MatchCard — Redesign

**Banner redesign:**
```
Position: relative, min-height: 110px
Background: {company bannerBg}
Overflow: hidden

NEW: Mesh gradient overlay — two radial gradients composited:
  radial-gradient(ellipse at 15% 60%, {accent}28 0%, transparent 55%),
  radial-gradient(ellipse at 85% 20%, {accent}12 0%, transparent 45%)

Sprite positioning: right:0; bottom:0; width:130px; height:130px
  filter: drop-shadow(0 6px 14px {accent}60) saturate(1.1)
  opacity: 0.92

Banner content (padding: 18px 22px 14px; padding-right: 148px):

  Row 1 (flex, align center, gap 12px):
    Logo avatar: 44px × 44px, border-radius:12px, border: 1.5px solid rgba(255,255,255,0.15)
    [Company name (16px, Plus Jakarta Sans 700, white)]
      [✓ VERIFIED chip if verified — use accent color as bg]
    [Tagline (11px, rgba(255,255,255,0.38))]

  Row 2: company meta (HQ, Industry, Size, Founded)
    Each item: flex row, gap 3px, font-size:10px, color: rgba(255,255,255,0.32)
    Separator · between items instead of separate blocks
```

**Job body redesign:**
```
Padding: 18px 22px

Row 1 (flex, space-between, align-start):
  LEFT: job title (17px, Plus Jakarta Sans 700, var(--c-text-1))
  RIGHT: salary (14px, var(--c-green), font-weight:800)

Row 2 (flex, wrap, gap: 7px, margin: 10px 0):
  [TypeBadge] [Level chip] [URGENT chip] [📍 Region chip] [{n} openings chip]
  All chips use same height (24px), border-radius: 6px

Row 3 — Match Score (redesigned):
  Left label: "DexMatch Score" (11px, uppercase, var(--c-text-4))
  Center: HPBar (height: 8px, border-radius: 6px, no border — cleaner)
  Right: score badge — pill with colored bg:
    ≥80: background: var(--c-green-dim); color: #065F46
    ≥50: background: var(--c-amber-dim); color: #92400E
    <50: background: #FEE2E2; color: #991B1B
    Font: Plus Jakarta Sans 800, 13px

Row 4 — Matched Skills (flex wrap, gap:5px):
  Matched skill: background: var(--c-green-dim); color: #065F46; has ✓ icon
  Unmatched skill: background: var(--c-surface-2); color: var(--c-text-3); no icon
  All: border-radius:6px; padding: 4px 10px; font-size:11px; font-weight:600

Bottom action row (flex, gap:8px):
  [View Details toggle — ghost, full width left]
  [Apply Now — red, 40% width right]
  Both: height:40px; border-radius:9px; font-weight:700
```

**Expanded state:**
```
Revealed section (animate max-height: 0 → auto with overflow:hidden):
  Divider: 1px dashed var(--c-border), margin: 14px 0
  "About {company}" subheading (11px uppercase, var(--c-text-4))
  About paragraph (Space Grotesk 13px, var(--c-text-3), line-height:1.75)
  Second divider
  "Role Overview" subheading
  Job description paragraph
  Action row: [Save Role (ghost, flex:1)] [Apply Now (red, flex:2)]
```

---

### 2.8 DexReport™ Modal — Redesign

**Overlay:** `background: rgba(9, 9, 18, 0.72); backdrop-filter: blur(8px)`

**Modal container:**
```
background: var(--c-surface)
border-radius: 24px
max-width: 740px
width: calc(100% - 40px)
max-height: 88vh
overflow: hidden
display: flex
flex-direction: column
box-shadow: var(--shadow-xl)
animation: scaleIn 0.22s cubic-bezier(0.34,1.56,0.64,1)
```

**Header (fixed, no scroll):**
```
background: var(--c-navy)
padding: 20px 28px
border-radius: 24px 24px 0 0
flex-shrink: 0

[LEFT]: PokéBall(24) + "DexReport™" (Plus Jakarta Sans 900, 18px, white) + "AI-Powered Career Analysis" (11px, faint)
[RIGHT]: ✕ close button (32px circle, rgba(255,255,255,0.1), hover: rgba(255,255,255,0.2))
```

**Scrollable body (`overflow-y: auto; padding: 24px 28px; flex:1`):**

**Section 1: Score Overview (NEW — top of report)**
```
3-column stat row:
  [Total Matches] [Strong Matches ≥80%] [Avg Score]
  Each: bordered box, centered, number in large Plus Jakarta Sans 900
  Number color: green for good, amber for mid, red for low
```

**Section 2: Top 3 Picks**
```
Label: "🏆 Top Matches" (section heading style)
Three condensed MatchCard-lite items:
  Horizontal layout: [rank number circle] [company logo] [title + company] [score badge] [Apply →]
  No banner — just a 3px left border in accent color
  border-radius: 12px; border: 1.5px solid var(--c-border); padding: 12px 16px
  Stacked with 8px gap
```

**Section 3: Skills Heatmap**
```
Label: "📊 Skills Analysis"
Grid of skill pills with % match rate
Pill color intensity scales with match frequency:
  100% match → dark green
  50-99%     → medium green
  1-49%      → amber
  0%         → light gray (shown to indicate gaps)
```

**Section 4: Region Distribution**
```
Label: "🗺️ Role Distribution by Region"
Horizontal bar chart (CSS-only, no library):
  Each region: [region name, 80px fixed width] [bar, flex-grow] [count badge]
  Bar color: var(--c-red) for top region, var(--c-border) for others
  Bar: height 8px, border-radius 4px, animate width on mount
```

**Footer (fixed, no scroll):**
```
border-top: 1px solid var(--c-border)
padding: 16px 28px
flex-shrink: 0
flex-row, space-between:
  LEFT: "⬇ Download PDF" ghost button
  RIGHT: "🔗 Share Report" ghost button + "Close" red button
```

---

### 2.9 New UI Components

#### A. Skeleton Loaders
Show while Pokémon sprites load:
```css
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 400px 100%;
  animation: shimmer 1.4s ease infinite;
  border-radius: 8px;
}
```

#### B. Empty State (no results)
```
Center-aligned block, padding: 60px 24px
Large emoji: 🔍 (48px)
Title: "No roles found" (Plus Jakarta Sans 800, 18px)
Subtitle: "Try adjusting your region or category filter"
Ghost button: "Clear All Filters"
```

#### C. Urgent Banner Strip (NEW)
Above hero, full-width, dismissible:
```
background: linear-gradient(90deg, var(--c-red) 0%, #C8290A 100%)
padding: 9px 32px
text-align: center
font-size: 12px, color: white, font-weight: 700
"🔥 {urgentCount} urgent roles added this week — don't miss out"
[✕ dismiss button, right-aligned, absolute]
```

#### D. Job Count Badge (nav element, NEW)
Small red circle badge on "Browse" nav link showing total open positions count.
- `position: absolute; top: -6px; right: -10px`
- `background: var(--c-red); color: white; border-radius: 10px; font-size: 9px; font-weight: 800; padding: 1px 5px`

#### E. Tooltip (NEW, on TypeBadge hover)
```
position: absolute; bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%)
background: var(--c-text-1); color: white; border-radius: 6px; padding: 4px 10px; font-size: 11px; white-space: nowrap
Pointer triangle below tooltip
z-index: 200
Fade in on hover with 120ms delay
```

#### F. Notification Toast (NEW)
Appears bottom-right on "Apply Now" / "Save" / "Copy Link":
```
position: fixed; bottom: 24px; right: 24px
background: var(--c-navy); color: white
border-radius: 12px; padding: 12px 18px
box-shadow: var(--shadow-lg)
animation: fadeUp 0.25s ease
Auto-dismiss after 3s
"✅ Application saved!" / "🔗 Copied!" etc.
```

---

### 2.10 Interaction Patterns (New Rules)

| Interaction | Behaviour |
|---|---|
| Card hover | `translateY(-3px)` + shadow increase + border → accent color |
| Button hover | `opacity: 0.88` + `translateY(-1px)` |
| Dropdown focus | `border-color: var(--c-red)` + subtle box-shadow ring |
| Filter chip toggle | Spring animation — scale 0.92 → 1.02 → 1 |
| Analyse button click | Brief scale-down (0.96) on press, then releases |
| Modal open | `scaleIn` spring animation from 0.95 → 1 |
| Modal close | `opacity` fade out + `scale(0.97)` in 180ms |
| CV drag over drop zone | Drop zone pulses — red dashed border + PokéBall spins |
| Score bar mount | Animate from 0% to actual score over 1s with ease-out |

---

### 2.11 Responsive Breakpoints

| Breakpoint | Layout Change |
|---|---|
| ≥ 1280px | Full 3-zone layout (sidebar + content) |
| 1024–1279px | Sidebar collapses to 240px, card grid 2-col |
| 768–1023px | Sidebar becomes collapsible drawer (hamburger toggle), content full-width |
| < 768px | Single column. Sidebar hidden behind bottom sheet. Filter bar becomes horizontal scroll strip. Hero becomes single-column. |

**Mobile-specific changes:**
- Filter bar: `overflow-x: auto; flex-wrap: nowrap; -webkit-overflow-scrolling: touch`
- BrowseCards: single column, full-width
- MatchCards: banner height reduced to 80px, sprite 90px
- Bottom sheet for sidebar: slides up from bottom, 80vh max-height, drag handle indicator at top

---

### 2.12 Footer — Redesign

```
background: var(--c-navy)
border-top: 1px solid rgba(255,255,255,0.06)   ← (no thick red line)
padding: 32px 32px 24px                          ← more breathing room

Layout: 4-column grid at desktop, 2-col at tablet, 1-col at mobile

Col 1 — Brand:
  PokéBall + DexMatch wordmark
  "The Pokémon Career Network" tagline
  "© 2025 DexMatch" below

Col 2 — For Trainers:
  Browse Roles
  Upload CV
  DexReport™
  Saved Roles

Col 3 — For Employers:
  Post a Position
  Partner Gyms
  Employer Dashboard

Col 4 — Company:
  About
  Privacy
  Terms
  Support

Bottom strip (border-top rgba(255,255,255,0.06)):
  LEFT: version tag "v2.0 · Powered by DexAI"
  RIGHT: social icons (simplified circle buttons)
```

---

### 2.13 Micro-UX Details

1. **Scroll-to-top button** — appears after scrolling 300px, bottom-right, 40px circle, navy bg, white ↑ arrow
2. **Loading skeleton** on sprite images — shimmer placeholder while image fetches
3. **Active filter summary** — below filter bar when filters applied: "Showing: Sinnoh · Engineering & Tech · Senior [✕ Clear]"
4. **Company verified badge** — gold border shimmer animation (keyframe: border-color cycles gold→white→gold, 3s loop)
5. **Salary highlight** — on hover over salary, show tooltip with "₽{amount}/year equivalent"
6. **Keyboard accessibility** — all interactive elements have `:focus-visible` outlines: `outline: 2px solid var(--c-red); outline-offset: 3px`

---

## PART 3 — UPDATED COMPUTED CONSTANTS

After adding new data, update all derived constants:

```js
const TOTAL_OPENINGS   = JOBS.reduce((s, j) => s + j.openings, 0);
// Expected: ~80+ openings total

const UNIQUE_REGIONS   = [...new Set(JOBS.map(j => j.macro))];
// Expected: ["Kanto","Hoenn","Johto","Alola","Almia","Sinnoh","Unova","Kalos","Galar","Paldea"]

const UNIQUE_COMPANIES = Object.keys(COMPANIES).length;
// Expected: 26

const URGENT_COUNT     = JOBS.filter(j => j.urgent).length;
// Used in urgent banner strip

const regionCounts = useMemo(() =>
  JOBS.reduce((acc, j) => ({ ...acc, [j.macro]: (acc[j.macro] || 0) + j.openings }), {}),
  []
);
```

---

## PART 4 — IMPLEMENTATION PRIORITY ORDER

Build in this sequence for best results:

1. **Design tokens + fonts** — CSS variables and font import
2. **Animation keyframes** — all @keyframes in global style block
3. **Micro-components** — PokéBall, TypeBadge (no Pokémon type labels), HPBar, SpriteImg, Toast, Tooltip
4. **Data constants** — full COMPANIES and JOBS objects (all 26 + 30)
5. **State management** — all useState/useMemo hooks in root
6. **Navigation** — sticky nav with search bar + nav links + badge
7. **Urgent banner strip** — dismissible top bar
8. **Hero section** — two-column layout with featured role card
9. **Sticky filter bar** — region, type, level, salary, sort, view toggles
10. **Sidebar panels** — CV Scanner + Region tiles + Skills panel
11. **BrowseCard** — grid and list variants
12. **MatchCard** — full banner design with expanded state
13. **Main content area** — grid/list view switching, header row, empty states
14. **DexReport™ Modal** — all 4 sections + fixed header/footer
15. **Skeleton loaders** — for image placeholders
16. **Toast notifications** — global toast system
17. **Footer** — 4-column grid layout
18. **Responsive styles** — breakpoint adjustments last

---

*DexMatch Addendum Prompt v2.0 — Expanded Data + Modern UI/UX Overhaul*
*Apply on top of base prompt v1.1. This document supersedes v1.1 layout and design specs.*