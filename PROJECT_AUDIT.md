# GyanQuest / ImpactX — PROJECT AUDIT

_Generated from repository files via `tools/gen_project_audit_raw.py` + `tools/write_project_audit_md.py`. Claims below were checked against disk; where a classic `curriculum.js` 10×10 template was expected by the audit brief, the actual Chem/Canvas architecture is documented instead._

## 1. Landing Page

### What's implemented

- Root [`index.html`](index.html) title: `GyanQuest  -  Learn. Level Up. Lead.`
- Loads `/css/landing.css` and `/js/landing.js?v=unlock2` (defer).
- Sections present in HTML: hero (`.gq-hero`), games (`#games` / `#gq-catalog`), why (`#why`), vision (`#vision`), footer.
- Nav includes language toggle `#gq-lang` and **Unlock books** toggle `#gq-unlock-books` (sets `localStorage['gq-unlock-all-books']`).
- `js/landing.js` builds catalog from in-file `CATALOG` constant; bilingual `COPY.en` / `COPY.bn` via `data-i18n`.
- Catalog entries parsed from landing.js: **28** items; **28** with `live: true`, **0** with `live: false`.

### Live vs placeholder in catalog

| id | href | live |
|----|------|------|
| forceFighter | `/games/force-fighter/` | LIVE |
| chemistry | `/games/chemistry-lab/` | LIVE |
| biology | `/games/bio-explorer/` | LIVE |
| mathematics | `/games/math-quest/` | LIVE |
| environmental | `/games/eco-guardian/` | LIVE |
| ict | `/games/ict-fundamentals/` | LIVE |
| web | `/games/web-dev-studio/` | LIVE |
| backend | `/games/backend-builder/` | LIVE |
| database | `/games/database-sql/` | LIVE |
| networking | `/games/networking-internet/` | LIVE |
| cybersecurity | `/games/cyber-shield/` | LIVE |
| os | `/games/os-hardware/` | LIVE |
| ai | `/games/ai-lab/` | LIVE |
| ml | `/games/ml-lab/` | LIVE |
| dataScience | `/games/data-science/` | LIVE |
| electrical | `/games/electrical-basics/` | LIVE |
| mechanical | `/games/mechanical-basics/` | LIVE |
| civil | `/games/civil-basics/` | LIVE |
| robotics | `/games/electronics-robotics/` | LIVE |
| green | `/games/green-tech/` | LIVE |
| astronomy | `/games/astronomy-space/` | LIVE |
| geology | `/games/geology-earth/` | LIVE |
| health | `/games/human-anatomy/` | LIVE |
| genetics | `/games/genetics-biotech/` | LIVE |
| statistics | `/games/statistics-probability/` | LIVE |
| geometry | `/games/geometry-trig/` | LIVE |
| calculus | `/games/calculus-analysis/` | LIVE |
| discrete | `/games/discrete-math/` | LIVE |

### Landing copy vs reality

- **Inconsistency:** landing hero/copy still mentions **3D** mission games / `statPlayVal: "3D + missions"` in `COPY.en`, while live Force/Chem/etc. play shells are **Canvas 2D** (3D archived under `_legacy3d/`).
- **Inconsistency:** `index.html` gamesLead default text says "One live game today…" but `landing.js` COPY.en `gamesLead` says twenty-eight live mission games — applyLocale overwrites from JS.
- Verified: all `28` catalog `live:true` href folders exist under `games/`.
- No broken live hrefs found (folder exists for each live catalog entry).

## 2. Per-Game Inventory (all games under `games/`)

**Architecture note (verified):** These games do **not** primarily use a shared `curriculum.js` with 10×10 classic activity enums for the live Canvas path. Live play uses `js/missions-meta.js` (10 mission cards) + `js/levelN.js` (Bruner 10 subs for playable missions) + `js/boot-l1.js` + Canvas scenes. Where `curriculum.js` exists it is called out explicitly.

### Boot wiring (verified from each `main.js`)

- **All 28 games** import a local `js/boot-l1.js` from `main.js` (`uses_boot_l1=true`).
- **0 games** import `/engine/js/boot.js` as the live entry.
- **`curriculum.js` on disk:** ['games\\chemistry-lab\\curriculum.js']
- Chemistry boot-l1 imports curriculum?: **False**

### Artificial Intelligence

- **Folder:** `games/ai-lab/`
- **manifest.js:** id=`aiLab`, title=`Artificial Intelligence`, storageKey=`gq-ai-lab-save-v2`, localeKey=`gq-ai-lab-locale`
- **theme:** {accent: "#c084fc", accent2: "#7e22ce"}
- **listed assets:** none found as URL strings in manifest (theme/keys only or empty).
- **curriculum.js:** **ABSENT** — live path uses `missions-meta.js` + `levelN.js` (Chem/Canvas pattern)
- **Playable missions (missions-meta `playable:true`):** 2 / 10 parsed mission objects
- **Books:** level1.js, level2.js
- **_legacy3d:** yes
- **scene packs:** ai-scenes.js, predict-scenes.js

| Mission idx | Title | playable | level file | STATUS | Sub-level titles (from L*_META.subTitles) | Activity types per step (from mount* calls) |
|-------------|-------|----------|------------|--------|-------------------------------------------|-----------------------------------------------|
| 0 | What is AI? | True | js/level1.js | **REAL** | Meet AI, Watch Pattern Dial, Sort: AI or Not?, Stronger Pattern Lab, Why AI Guesses, Name the AI Rule, Stretch: Places, Myth Bust, Fluency Drill, AI Rookie Mastery | s1:demo/motion-chain+quiz+tap; s2:dial/lab-heat; s3:tap+drag-sort; s4:dial/lab-heat; s5:order+quiz; s6:equation+tap; s7:tap+quiz; s8:myth; s9:fluency-drill; s10:order+tap |
| 1 | Pattern Predict | True | js/level2.js | **REAL** | Meet Patterns, Watch Predict Dial, Sort Pattern Clues, Stronger Predict Lab, Why We Predict, Name the Predict Rule, Stretch: Places, Myth Bust, Fluency Drill, Pattern Pro Mastery | s1:demo/motion-chain+quiz+tap; s2:dial/lab-heat; s3:tap+drag-sort; s4:dial/lab-heat; s5:order+quiz; s6:equation+tap; s7:tap+quiz; s8:myth; s9:fluency-drill; s10:order+tap |
| 2 | Mission 3 | False | js/level3.js | **STUB** | (none — stub/soon) | no s1..s10 functions matched |
| 3 | Mission 4 | False | — | **STUB** | (none — stub/soon) | n/a |
| 4 | Mission 5 | False | — | **STUB** | (none — stub/soon) | n/a |
| 5 | Mission 6 | False | — | **STUB** | (none — stub/soon) | n/a |
| 6 | Mission 7 | False | — | **STUB** | (none — stub/soon) | n/a |
| 7 | Mission 8 | False | — | **STUB** | (none — stub/soon) | n/a |
| 8 | Mission 9 | False | — | **STUB** | (none — stub/soon) | n/a |
| 9 | Mission 10 | False | — | **STUB** | (none — stub/soon) | n/a |

### Astronomy & Space

- **Folder:** `games/astronomy-space/`
- **manifest.js:** id=`astronomySpace`, title=`Astronomy & Space`, storageKey=`gq-astronomy-space-save-v2`, localeKey=`gq-astronomy-space-locale`
- **theme:** {accent: "#818cf8", accent2: "#312e81"}
- **listed assets:** none found as URL strings in manifest (theme/keys only or empty).
- **curriculum.js:** **ABSENT** — live path uses `missions-meta.js` + `levelN.js` (Chem/Canvas pattern)
- **Playable missions (missions-meta `playable:true`):** 2 / 10 parsed mission objects
- **Books:** level1.js, level2.js
- **_legacy3d:** yes
- **scene packs:** sky-scenes.js, solar-scenes.js

| Mission idx | Title | playable | level file | STATUS | Sub-level titles (from L*_META.subTitles) | Activity types per step (from mount* calls) |
|-------------|-------|----------|------------|--------|-------------------------------------------|-----------------------------------------------|
| 0 | Solar Family | True | js/level1.js | **REAL** | Meet the Solar Family, Orbit Clarity Lab, Sort: Planet / Sun / Other, Closer Orbit Lab, Why Planets Orbit, Name the Orbit Rule, Stretch: Sky Places, Myth Bust, Fluency Drill, Orbit Scout Mastery | s1:demo/motion-chain+quiz+tap; s2:dial/lab-heat; s3:tap+drag-sort; s4:dial/lab-heat; s5:order+quiz; s6:equation+tap; s7:tap+quiz; s8:myth; s9:fluency-drill; s10:order+tap |
| 1 | Day & Night Sky | True | js/level2.js | **REAL** | Meet Day and Night, Spin Clarity Lab, Sort: Cause / Result, Faster Spin Lab, Why Day Follows Night, Name the Spin Rule, Stretch: BD Times, Myth Bust, Fluency Drill, Sky Watcher Mastery | s1:demo/motion-chain+quiz+tap; s2:dial/lab-heat; s3:tap+drag-sort; s4:dial/lab-heat; s5:order+quiz; s6:equation+tap; s7:tap+quiz; s8:myth; s9:fluency-drill; s10:order+tap |
| 2 | Mission 3 | False | js/level3.js | **STUB** | (none — stub/soon) | no s1..s10 functions matched |
| 3 | Mission 4 | False | — | **STUB** | (none — stub/soon) | n/a |
| 4 | Mission 5 | False | — | **STUB** | (none — stub/soon) | n/a |
| 5 | Mission 6 | False | — | **STUB** | (none — stub/soon) | n/a |
| 6 | Mission 7 | False | — | **STUB** | (none — stub/soon) | n/a |
| 7 | Mission 8 | False | — | **STUB** | (none — stub/soon) | n/a |
| 8 | Mission 9 | False | — | **STUB** | (none — stub/soon) | n/a |
| 9 | Mission 10 | False | — | **STUB** | (none — stub/soon) | n/a |

### Backend Builder

- **Folder:** `games/backend-builder/`
- **manifest.js:** id=`backendBuilder`, title=`Backend Builder`, storageKey=`gq-backend-builder-save-v2`, localeKey=`gq-backend-builder-locale`
- **theme:** {accent: "#fb923c", accent2: "#c2410c"}
- **listed assets:** none found as URL strings in manifest (theme/keys only or empty).
- **curriculum.js:** **ABSENT** — live path uses `missions-meta.js` + `levelN.js` (Chem/Canvas pattern)
- **Playable missions (missions-meta `playable:true`):** 3 / 10 parsed mission objects
- **Books:** level1.js, level2.js, level3.js
- **_legacy3d:** yes
- **scene packs:** auth-scenes.js, routes-scenes.js, server-scenes.js

| Mission idx | Title | playable | level file | STATUS | Sub-level titles (from L*_META.subTitles) | Activity types per step (from mount* calls) |
|-------------|-------|----------|------------|--------|-------------------------------------------|-----------------------------------------------|
| 0 | Server Basics | True | js/level1.js | **REAL** | Meet Client & Server, Request Loop Lab, Sort REQ / RES, Stronger Loop Lab, Why Wait for RES, Name the Server Rule, Stretch: Real Apps, Myth Bust, Fluency Drill, Server Scout Mastery | s1:demo/motion-chain+quiz+tap; s2:dial/lab-heat; s3:tap+drag-sort; s4:dial/lab-heat; s5:order+quiz; s6:equation+tap; s7:tap+quiz; s8:myth; s9:fluency-drill; s10:order+tap |
| 1 | Routes & APIs | True | js/level2.js | **REAL** | Meet Route Doors, Open Routes Lab, Sort Paths & Methods, More Doors Lab, Why Paths Matter, Name the Route Rule, Stretch: App Paths, Myth Bust, Fluency Drill, Route Ranger Mastery | s1:demo/motion-chain+quiz+tap; s2:dial/lab-heat; s3:tap+drag-sort; s4:dial/lab-heat; s5:order+quiz; s6:equation+tap; s7:tap+quiz; s8:myth; s9:fluency-drill; s10:order+tap |
| 2 | Auth Lite | True | js/level3.js | **REAL** | Meet the Gate, Unlock Lab, Sort Auth vs Public, Stronger Check Lab, Why Prove Who, Name the Auth Rule, Stretch: Real Logins, Myth Bust, Fluency Drill, Auth Guard Mastery | s1:demo/motion-chain+quiz+tap; s2:dial/lab-heat; s3:tap+drag-sort; s4:dial/lab-heat; s5:order+quiz; s6:equation+tap; s7:tap+quiz; s8:myth; s9:fluency-drill; s10:order+tap |
| 3 | Mission 4 | False | — | **STUB** | (none — stub/soon) | n/a |
| 4 | Mission 5 | False | — | **STUB** | (none — stub/soon) | n/a |
| 5 | Mission 6 | False | — | **STUB** | (none — stub/soon) | n/a |
| 6 | Mission 7 | False | — | **STUB** | (none — stub/soon) | n/a |
| 7 | Mission 8 | False | — | **STUB** | (none — stub/soon) | n/a |
| 8 | Mission 9 | False | — | **STUB** | (none — stub/soon) | n/a |
| 9 | Mission 10 | False | — | **STUB** | (none — stub/soon) | n/a |

### Bio Explorer

- **Folder:** `games/bio-explorer/`
- **manifest.js:** id=`bioExplorer`, title=`Bio Explorer`, storageKey=`gq-bio-explorer-save-v2`, localeKey=`gq-bio-explorer-locale`
- **theme:** {accent: "#22c55e", accent2: "#15803d", sky: 2042156, floor: 2171169, fog: 527365,}
- **listed assets:** none found as URL strings in manifest (theme/keys only or empty).
- **curriculum.js:** **ABSENT** — live path uses `missions-meta.js` + `levelN.js` (Chem/Canvas pattern)
- **Playable missions (missions-meta `playable:true`):** 3 / 10 parsed mission objects
- **Books:** level1.js, level2.js, level3.js
- **_legacy3d:** yes
- **scene packs:** cell-scenes.js, life-scenes.js, plant-scenes.js

| Mission idx | Title | playable | level file | STATUS | Sub-level titles (from L*_META.subTitles) | Activity types per step (from mount* calls) |
|-------------|-------|----------|------------|--------|-------------------------------------------|-----------------------------------------------|
| 0 | Living or Not | True | js/level1.js | **REAL** | Meet Living Clues, Seed Sprout Lab, Sort: Living or Not?, Watch Growth, Why Seeds Count, Name the Life Rule, Stretch: New Contexts, Myth Bust, Fluency Drill, Living Rookie Mastery | sub1_meet:demo/motion-chain+quiz+tap; sub2_sprout:dial/lab-heat+quiz; sub3_sort:tap+drag-sort; sub4_watch:dial/lab-heat; sub5_explain:order+quiz; sub6_rule:equation+tap; sub7_stretch:tap+quiz; sub8_myths:myth; sub9_drill:fluency-drill; sub10_mastery:order+tap |
| 1 | Cell City | True | js/level2.js | **REAL** | Meet Cell City, Zoom Lab, Sort: Cell Stories, Membrane Peek, Cell Jobs, Name the Cell Rule, Stretch: New Contexts, Myth Bust, Fluency Drill, Cell Scout Mastery | sub1_meet:demo/motion-chain+quiz+tap; sub2_zoom:dial/lab-heat; sub3_sort:tap+drag-sort; sub4_membrane:dial/lab-heat+quiz; sub5_jobs:order; sub6_rule:equation+tap; sub7_stretch:tap+quiz; sub8_myths:myth; sub9_drill:fluency-drill; sub10_mastery:order+tap |
| 2 | Plant Power | True | js/level3.js | **REAL** | Meet Plant Power, Sun Energy Lab, Sort: Plant Needs, Grow Stages, Food vs Soil, Name the Plant Rule, Stretch: BD Stories, Myth Bust, Fluency Drill, Plant Explorer Mastery | sub1_meet:demo/motion-chain+quiz+tap; sub2_sun:dial/lab-heat; sub3_sort:tap+drag-sort; sub4_grow:dial/lab-heat; sub5_food:order+quiz; sub6_rule:equation+tap; sub7_stretch:tap+quiz; sub8_myths:myth; sub9_drill:fluency-drill; sub10_mastery:order+tap |
| 3 | Body Systems | False | — | **STUB** | (none — stub/soon) | n/a |
| 4 | Food Chains | False | — | **STUB** | (none — stub/soon) | n/a |
| 5 | Micro Worlds | False | — | **STUB** | (none — stub/soon) | n/a |
| 6 | Genetics Sparks | False | — | **STUB** | (none — stub/soon) | n/a |
| 7 | Health Habits | False | — | **STUB** | (none — stub/soon) | n/a |
| 8 | Biodiversity BD | False | — | **STUB** | (none — stub/soon) | n/a |
| 9 | Bio Boss | False | — | **STUB** | (none — stub/soon) | n/a |

### Calculus & Analysis

- **Folder:** `games/calculus-analysis/`
- **manifest.js:** id=`calculusAnalysis`, title=`Calculus & Analysis`, storageKey=`gq-calculus-analysis-save-v2`, localeKey=`gq-calculus-analysis-locale`
- **theme:** {accent: "#c4b5fd", accent2: "#5b21b6"}
- **listed assets:** none found as URL strings in manifest (theme/keys only or empty).
- **curriculum.js:** **ABSENT** — live path uses `missions-meta.js` + `levelN.js` (Chem/Canvas pattern)
- **Playable missions (missions-meta `playable:true`):** 1 / 10 parsed mission objects
- **Books:** level1.js
- **_legacy3d:** yes
- **scene packs:** slope-scenes.js

| Mission idx | Title | playable | level file | STATUS | Sub-level titles (from L*_META.subTitles) | Activity types per step (from mount* calls) |
|-------------|-------|----------|------------|--------|-------------------------------------------|-----------------------------------------------|
| 0 | Slope Stories | True | js/level1.js | **REAL** | Meet Slope Stories, Slope Clarity Lab, Sort: Slope / Not, Steeper Lab, Why Slope Means Rate, Name the Slope Rule, Stretch: Hills & Graphs, Myth Bust, Fluency Drill, Slope Scout Mastery | s1:demo/motion-chain+quiz+tap; s2:dial/lab-heat; s3:tap+drag-sort; s4:dial/lab-heat; s5:order+quiz; s6:equation+tap; s7:tap+quiz; s8:myth; s9:fluency-drill; s10:order+tap |
| 1 | Mission 2 | False | js/level2.js | **STUB** | (none — stub/soon) | no s1..s10 functions matched |
| 2 | Mission 3 | False | js/level3.js | **STUB** | (none — stub/soon) | no s1..s10 functions matched |
| 3 | Mission 4 | False | — | **STUB** | (none — stub/soon) | n/a |
| 4 | Mission 5 | False | — | **STUB** | (none — stub/soon) | n/a |
| 5 | Mission 6 | False | — | **STUB** | (none — stub/soon) | n/a |
| 6 | Mission 7 | False | — | **STUB** | (none — stub/soon) | n/a |
| 7 | Mission 8 | False | — | **STUB** | (none — stub/soon) | n/a |
| 8 | Mission 9 | False | — | **STUB** | (none — stub/soon) | n/a |
| 9 | Mission 10 | False | — | **STUB** | (none — stub/soon) | n/a |

### Chemistry Lab

- **Folder:** `games/chemistry-lab/`
- **manifest.js:** id=`chemistry`, title=`Chemistry Lab`, storageKey=`gq-chemistry-lab-save-v1`, localeKey=`gq-chemistry-lab-locale`
- **assetKeys:** desk, bottle, bottleKetchup, bottleMustard, cup, apple, pan, bowl, can, boxSmall, boxLarge, barrel, magnet, cone
- **curriculum.js:** PRESENT at `games\chemistry-lab\curriculum.js`
- **Playable missions (missions-meta `playable:true`):** 3 / 10 parsed mission objects
- **Books:** level1.js, level2.js, level3.js
- **_legacy3d:** no
- **scene packs:** atom-scenes.js, bond-scenes.js, element-scenes.js

| Mission idx | Title | playable | level file | STATUS | Sub-level titles (from L*_META.subTitles) | Activity types per step (from mount* calls) |
|-------------|-------|----------|------------|--------|-------------------------------------------|-----------------------------------------------|
| 0 | Tiny Bits | True | js/level1.js | **REAL** | Meet Tiny Bits, Salt Crystal Pattern, Sort: Matter or Not?, Ice Melting Lab, Why Steam Rises, Name the Particle Rule, Stretch: New Contexts, Myth Bust, Fluency Drill, Tiny Bits Mastery | sub1_meet:demo/motion-chain+quiz+tap; sub2_salt:demo/motion-chain+quiz+quiz; sub3_sort:tap+drag-sort+quiz; sub4_ice:dial/lab-heat+quiz+reveal; sub5_steam:dial/lab-heat+reveal+quiz; sub6_rule:equation+scale-lab+quiz; sub7_stretch:quiz+tap; sub8_myths:myth; sub9_drill:fluency-drill; sub10_mastery:order+tap+multi-quiz+tap |
| 1 | Element Hunt | True | js/level2.js | **REAL** | Meet Element Hunt, Iron: One Atom Kind, Sort: Element or Not?, Copper Wire Lab, Why O₂ Is Still an Element, Name the Element Rule, Stretch: New Contexts, Myth Bust, Fluency Drill, Element Hunt Mastery | sub1_meet:demo/motion-chain+quiz+tap; sub2_iron:demo/motion-chain+quiz+quiz; sub3_sort:tap+drag-sort+quiz; sub4_copper:dial/lab-heat+reveal+quiz; sub5_oxygen:demo/motion-chain+reveal+quiz; sub6_rule:equation+scale-lab+quiz; sub7_stretch:quiz+tap; sub8_myths:myth; sub9_drill:fluency-drill+tap; sub10_mastery:order+tap+multi-quiz+tap |
| 2 | Bond Buddies | True | js/level3.js | **REAL** | Meet Bond Buddies, Attraction Pull, Sort: Bond or Not?, Magnet Snap Lab, Why Water Sticks, Name the Bond Rule, Stretch: New Contexts, Myth Bust, Fluency Drill, Bond Buddies Mastery | sub1_meet:demo/motion-chain+quiz+tap; sub2_attract:demo/motion-chain+quiz; sub3_sort:tap+drag-sort+quiz; sub4_snap:dial/lab-heat+reveal+quiz; sub5_water:demo/motion-chain+reveal+quiz; sub6_rule:equation+scale-lab+quiz; sub7_stretch:quiz+tap; sub8_myths:myth; sub9_drill:fluency-drill+tap; sub10_mastery:order+tap+multi-quiz+tap |
| 3 | Mix & Match | False | — | **STUB** | (none — stub/soon) | n/a |
| 4 | Reaction Time | False | — | **STUB** | (none — stub/soon) | n/a |
| 5 | Acid & Base | False | — | **STUB** | (none — stub/soon) | n/a |
| 6 | States of Matter | False | — | **STUB** | (none — stub/soon) | n/a |
| 7 | Periodic Path | False | — | **STUB** | (none — stub/soon) | n/a |
| 8 | Lab Safety | False | — | **STUB** | (none — stub/soon) | n/a |
| 9 | Chem Boss | False | — | **STUB** | (none — stub/soon) | n/a |

**TODOs / console.log samples found while scanning js/:**
- `activity-controller.test.js:86: console.log …`

### Civil Basics

- **Folder:** `games/civil-basics/`
- **manifest.js:** id=`civilBasics`, title=`Civil Basics`, storageKey=`gq-civil-basics-save-v2`, localeKey=`gq-civil-basics-locale`
- **theme:** {accent: "#a8a29e", accent2: "#57534e"}
- **listed assets:** none found as URL strings in manifest (theme/keys only or empty).
- **curriculum.js:** **ABSENT** — live path uses `missions-meta.js` + `levelN.js` (Chem/Canvas pattern)
- **Playable missions (missions-meta `playable:true`):** 1 / 10 parsed mission objects
- **Books:** level1.js
- **_legacy3d:** yes
- **scene packs:** struct-scenes.js

| Mission idx | Title | playable | level file | STATUS | Sub-level titles (from L*_META.subTitles) | Activity types per step (from mount* calls) |
|-------------|-------|----------|------------|--------|-------------------------------------------|-----------------------------------------------|
| 0 | Strong Structures | True | js/level1.js | **REAL** | Meet Strong Shapes, Strength Dial, Sort Strong Ideas, Stronger Bridge Lab, Why It Holds, Name the Structure Rule, Stretch: Places, Myth Bust, Fluency Drill, Structure Scout Mastery | s1:demo/motion-chain+quiz+tap; s2:dial/lab-heat; s3:tap+drag-sort; s4:dial/lab-heat; s5:order+quiz; s6:equation+tap; s7:tap+quiz; s8:myth; s9:fluency-drill; s10:order+tap |
| 1 | Mission 2 | False | js/level2.js | **STUB** | (none — stub/soon) | no s1..s10 functions matched |
| 2 | Mission 3 | False | js/level3.js | **STUB** | (none — stub/soon) | no s1..s10 functions matched |
| 3 | Mission 4 | False | — | **STUB** | (none — stub/soon) | n/a |
| 4 | Mission 5 | False | — | **STUB** | (none — stub/soon) | n/a |
| 5 | Mission 6 | False | — | **STUB** | (none — stub/soon) | n/a |
| 6 | Mission 7 | False | — | **STUB** | (none — stub/soon) | n/a |
| 7 | Mission 8 | False | — | **STUB** | (none — stub/soon) | n/a |
| 8 | Mission 9 | False | — | **STUB** | (none — stub/soon) | n/a |
| 9 | Mission 10 | False | — | **STUB** | (none — stub/soon) | n/a |

### Cyber Shield

- **Folder:** `games/cyber-shield/`
- **manifest.js:** id=`cyberShield`, title=`Cyber Shield`, storageKey=`gq-cyber-shield-save-v2`, localeKey=`gq-cyber-shield-locale`
- **theme:** {accent: "#f87171", accent2: "#b91c1c"}
- **listed assets:** none found as URL strings in manifest (theme/keys only or empty).
- **curriculum.js:** **ABSENT** — live path uses `missions-meta.js` + `levelN.js` (Chem/Canvas pattern)
- **Playable missions (missions-meta `playable:true`):** 1 / 10 parsed mission objects
- **Books:** level1.js
- **_legacy3d:** yes
- **scene packs:** pass-scenes.js

| Mission idx | Title | playable | level file | STATUS | Sub-level titles (from L*_META.subTitles) | Activity types per step (from mount* calls) |
|-------------|-------|----------|------------|--------|-------------------------------------------|-----------------------------------------------|
| 0 | Password Power | True | js/level1.js | **REAL** | Meet Passwords, Watch Strength Dial, Sort Strong vs Weak, Stronger Secret Lab, Why Length Helps, Name the Password Rule, Stretch: Places, Myth Bust, Fluency Drill, Password Pro Mastery | s1:demo/motion-chain+quiz+tap; s2:dial/lab-heat; s3:tap+drag-sort; s4:dial/lab-heat; s5:order+quiz; s6:equation+tap; s7:tap+quiz; s8:myth; s9:fluency-drill; s10:order+tap |
| 1 | Mission 2 | False | js/level2.js | **STUB** | (none — stub/soon) | no s1..s10 functions matched |
| 2 | Mission 3 | False | js/level3.js | **STUB** | (none — stub/soon) | no s1..s10 functions matched |
| 3 | Mission 4 | False | — | **STUB** | (none — stub/soon) | n/a |
| 4 | Mission 5 | False | — | **STUB** | (none — stub/soon) | n/a |
| 5 | Mission 6 | False | — | **STUB** | (none — stub/soon) | n/a |
| 6 | Mission 7 | False | — | **STUB** | (none — stub/soon) | n/a |
| 7 | Mission 8 | False | — | **STUB** | (none — stub/soon) | n/a |
| 8 | Mission 9 | False | — | **STUB** | (none — stub/soon) | n/a |
| 9 | Mission 10 | False | — | **STUB** | (none — stub/soon) | n/a |

### Data Science

- **Folder:** `games/data-science/`
- **manifest.js:** id=`dataScience`, title=`Data Science`, storageKey=`gq-data-science-save-v2`, localeKey=`gq-data-science-locale`
- **theme:** {accent: "#22d3ee", accent2: "#0e7490"}
- **listed assets:** none found as URL strings in manifest (theme/keys only or empty).
- **curriculum.js:** **ABSENT** — live path uses `missions-meta.js` + `levelN.js` (Chem/Canvas pattern)
- **Playable missions (missions-meta `playable:true`):** 1 / 10 parsed mission objects
- **Books:** level1.js
- **_legacy3d:** yes
- **scene packs:** chart-scenes.js

| Mission idx | Title | playable | level file | STATUS | Sub-level titles (from L*_META.subTitles) | Activity types per step (from mount* calls) |
|-------------|-------|----------|------------|--------|-------------------------------------------|-----------------------------------------------|
| 0 | Chart Stories | True | js/level1.js | **REAL** | Meet Charts, Watch Story Dial, Sort Chart Parts, Clearer Chart Lab, Why Charts Help, Name the Chart Rule, Stretch: Places, Myth Bust, Fluency Drill, Chart Scout Mastery | s1:demo/motion-chain+quiz+tap; s2:dial/lab-heat; s3:tap+drag-sort; s4:dial/lab-heat; s5:order+quiz; s6:equation+tap; s7:tap+quiz; s8:myth; s9:fluency-drill; s10:order+tap |
| 1 | Mission 2 | False | js/level2.js | **STUB** | (none — stub/soon) | no s1..s10 functions matched |
| 2 | Mission 3 | False | js/level3.js | **STUB** | (none — stub/soon) | no s1..s10 functions matched |
| 3 | Mission 4 | False | — | **STUB** | (none — stub/soon) | n/a |
| 4 | Mission 5 | False | — | **STUB** | (none — stub/soon) | n/a |
| 5 | Mission 6 | False | — | **STUB** | (none — stub/soon) | n/a |
| 6 | Mission 7 | False | — | **STUB** | (none — stub/soon) | n/a |
| 7 | Mission 8 | False | — | **STUB** | (none — stub/soon) | n/a |
| 8 | Mission 9 | False | — | **STUB** | (none — stub/soon) | n/a |
| 9 | Mission 10 | False | — | **STUB** | (none — stub/soon) | n/a |

### Database & SQL

- **Folder:** `games/database-sql/`
- **manifest.js:** id=`databaseSql`, title=`Database & SQL`, storageKey=`gq-database-sql-save-v2`, localeKey=`gq-database-sql-locale`
- **theme:** {accent: "#2dd4bf", accent2: "#0f766e"}
- **listed assets:** none found as URL strings in manifest (theme/keys only or empty).
- **curriculum.js:** **ABSENT** — live path uses `missions-meta.js` + `levelN.js` (Chem/Canvas pattern)
- **Playable missions (missions-meta `playable:true`):** 3 / 10 parsed mission objects
- **Books:** level1.js, level2.js, level3.js
- **_legacy3d:** yes
- **scene packs:** join-scenes.js, select-scenes.js, table-scenes.js

| Mission idx | Title | playable | level file | STATUS | Sub-level titles (from L*_META.subTitles) | Activity types per step (from mount* calls) |
|-------------|-------|----------|------------|--------|-------------------------------------------|-----------------------------------------------|
| 0 | Tables & Rows | True | js/level1.js | **TEMPLATE** | Meet the Grid, Fill Rows Lab, Sort Table Parts, Neater Grid Lab, Why Rows & Columns, Name the Table Rule, Stretch: Real Lists, Myth Bust, Fluency Drill, Table Scout Mastery | s1:demo/motion-chain+quiz+tap; s2:dial/lab-heat; s3:tap+drag-sort; s4:dial/lab-heat; s5:order+quiz; s6:equation+tap; s7:tap+quiz; s8:myth; s9:fluency-drill; s10:order+tap |
| 1 | SELECT Stories | True | js/level2.js | **REAL** | Meet SELECT, Filter Dial Lab, Sort Ask vs Write, Sharper Query Lab, Why WHERE Helps, Name the SELECT Rule, Stretch: Real Questions, Myth Bust, Fluency Drill, Query Kid Mastery | s1:demo/motion-chain+quiz+tap; s2:dial/lab-heat; s3:tap+drag-sort; s4:dial/lab-heat; s5:order+quiz; s6:equation+tap; s7:tap+quiz; s8:myth; s9:fluency-drill; s10:order+tap |
| 2 | Keys & Joins | True | js/level3.js | **REAL** | Meet Key Links, Match Dial Lab, Sort Keys & Joins, Stronger Link Lab, Why Keys Matter, Name the Join Rule, Stretch: Real Links, Myth Bust, Fluency Drill, Join Junior Mastery | s1:demo/motion-chain+quiz+tap; s2:dial/lab-heat; s3:tap+drag-sort; s4:dial/lab-heat; s5:order+quiz; s6:equation+tap; s7:tap+quiz; s8:myth; s9:fluency-drill; s10:order+tap |
| 3 | Mission 4 | False | — | **STUB** | (none — stub/soon) | n/a |
| 4 | Mission 5 | False | — | **STUB** | (none — stub/soon) | n/a |
| 5 | Mission 6 | False | — | **STUB** | (none — stub/soon) | n/a |
| 6 | Mission 7 | False | — | **STUB** | (none — stub/soon) | n/a |
| 7 | Mission 8 | False | — | **STUB** | (none — stub/soon) | n/a |
| 8 | Mission 9 | False | — | **STUB** | (none — stub/soon) | n/a |
| 9 | Mission 10 | False | — | **STUB** | (none — stub/soon) | n/a |

### Discrete Math & Logic

- **Folder:** `games/discrete-math/`
- **manifest.js:** id=`discreteMath`, title=`Discrete Math & Logic`, storageKey=`gq-discrete-math-save-v2`, localeKey=`gq-discrete-math-locale`
- **theme:** {accent: "#f9a8d4", accent2: "#9d174d"}
- **listed assets:** none found as URL strings in manifest (theme/keys only or empty).
- **curriculum.js:** **ABSENT** — live path uses `missions-meta.js` + `levelN.js` (Chem/Canvas pattern)
- **Playable missions (missions-meta `playable:true`):** 1 / 10 parsed mission objects
- **Books:** level1.js
- **_legacy3d:** yes
- **scene packs:** logic-scenes.js

| Mission idx | Title | playable | level file | STATUS | Sub-level titles (from L*_META.subTitles) | Activity types per step (from mount* calls) |
|-------------|-------|----------|------------|--------|-------------------------------------------|-----------------------------------------------|
| 0 | Logic Lite | True | js/level1.js | **REAL** | Meet AND OR NOT, Logic Clarity Lab, Sort: Logic / Not, Gate Lab, Why Gates Decide, Name the Logic Rule, Stretch: Daily Decide, Myth Bust, Fluency Drill, Logic Learner Mastery | s1:demo/motion-chain+quiz+tap; s2:dial/lab-heat; s3:tap+drag-sort; s4:dial/lab-heat; s5:order+quiz; s6:equation+tap; s7:tap+quiz; s8:myth; s9:fluency-drill; s10:order+tap |
| 1 | Mission 2 | False | js/level2.js | **STUB** | (none — stub/soon) | no s1..s10 functions matched |
| 2 | Mission 3 | False | js/level3.js | **STUB** | (none — stub/soon) | no s1..s10 functions matched |
| 3 | Mission 4 | False | — | **STUB** | (none — stub/soon) | n/a |
| 4 | Mission 5 | False | — | **STUB** | (none — stub/soon) | n/a |
| 5 | Mission 6 | False | — | **STUB** | (none — stub/soon) | n/a |
| 6 | Mission 7 | False | — | **STUB** | (none — stub/soon) | n/a |
| 7 | Mission 8 | False | — | **STUB** | (none — stub/soon) | n/a |
| 8 | Mission 9 | False | — | **STUB** | (none — stub/soon) | n/a |
| 9 | Mission 10 | False | — | **STUB** | (none — stub/soon) | n/a |

### Eco Guardian

- **Folder:** `games/eco-guardian/`
- **manifest.js:** id=`ecoGuardian`, title=`Eco Guardian`, storageKey=`gq-eco-guardian-save-v2`, localeKey=`gq-eco-guardian-locale`
- **theme:** {accent: "#34d399", accent2: "#047857"}
- **listed assets:** none found as URL strings in manifest (theme/keys only or empty).
- **curriculum.js:** **ABSENT** — live path uses `missions-meta.js` + `levelN.js` (Chem/Canvas pattern)
- **Playable missions (missions-meta `playable:true`):** 1 / 10 parsed mission objects
- **Books:** level1.js
- **_legacy3d:** yes
- **scene packs:** waste-scenes.js

| Mission idx | Title | playable | level file | STATUS | Sub-level titles (from L*_META.subTitles) | Activity types per step (from mount* calls) |
|-------------|-------|----------|------------|--------|-------------------------------------------|-----------------------------------------------|
| 0 | Waste Watch | True | js/level1.js | **REAL** | Meet the Bins, Fill Recycle Goal, Sort the Litter, Clean-up Lab, Why Reduce First, Name the 3R Rule, Stretch: BD Places, Myth Bust, Fluency Drill, Waste Watcher Mastery | s1:demo/motion-chain+quiz+tap; s2:dial/lab-heat; s3:tap+drag-sort; s4:dial/lab-heat; s5:order+quiz; s6:equation+tap; s7:tap+quiz; s8:myth; s9:fluency-drill; s10:order+tap |
| 1 | Mission 2 | False | js/level2.js | **STUB** | (none — stub/soon) | no s1..s10 functions matched |
| 2 | Mission 3 | False | js/level3.js | **STUB** | (none — stub/soon) | no s1..s10 functions matched |
| 3 | Mission 4 | False | — | **STUB** | (none — stub/soon) | n/a |
| 4 | Mission 5 | False | — | **STUB** | (none — stub/soon) | n/a |
| 5 | Mission 6 | False | — | **STUB** | (none — stub/soon) | n/a |
| 6 | Mission 7 | False | — | **STUB** | (none — stub/soon) | n/a |
| 7 | Mission 8 | False | — | **STUB** | (none — stub/soon) | n/a |
| 8 | Mission 9 | False | — | **STUB** | (none — stub/soon) | n/a |
| 9 | Mission 10 | False | — | **STUB** | (none — stub/soon) | n/a |

### Electrical Basics

- **Folder:** `games/electrical-basics/`
- **manifest.js:** id=`electricalBasics`, title=`Electrical Basics`, storageKey=`gq-electrical-basics-save-v2`, localeKey=`gq-electrical-basics-locale`
- **theme:** {accent: "#facc15", accent2: "#a16207"}
- **listed assets:** none found as URL strings in manifest (theme/keys only or empty).
- **curriculum.js:** **ABSENT** — live path uses `missions-meta.js` + `levelN.js` (Chem/Canvas pattern)
- **Playable missions (missions-meta `playable:true`):** 3 / 10 parsed mission objects
- **Books:** level1.js, level2.js, level3.js
- **_legacy3d:** yes
- **scene packs:** circuit-scenes.js, safe-scenes.js, volt-scenes.js

| Mission idx | Title | playable | level file | STATUS | Sub-level titles (from L*_META.subTitles) | Activity types per step (from mount* calls) |
|-------------|-------|----------|------------|--------|-------------------------------------------|-----------------------------------------------|
| 0 | Circuit Loop | True | js/level1.js | **REAL** | Meet the Loop, Close the Path Lab, Sort Loop Parts, Brighter Loop Lab, Why the Bulb Lights, Name the Loop Rule, Stretch: Places, Myth Bust, Fluency Drill, Loop Learner Mastery | s1:demo/motion-chain+quiz+tap; s2:dial/lab-heat; s3:tap+drag-sort; s4:dial/lab-heat; s5:order+quiz; s6:equation+tap; s7:tap+quiz; s8:myth; s9:fluency-drill; s10:order+tap |
| 1 | Voltage & Current | True | js/level2.js | **REAL** | Meet V and I, Push Dial Lab, Sort V vs I, Stronger Push Lab, Push then Flow, Name the V-I Rule, Stretch: Power Uses, Myth Bust, Fluency Drill, Volt Scout Mastery | s1:demo/motion-chain+quiz+tap; s2:dial/lab-heat; s3:tap+drag-sort; s4:dial/lab-heat; s5:order; s6:equation+tap; s7:tap+quiz; s8:myth; s9:fluency-drill; s10:order+tap |
| 2 | Safe Power | True | js/level3.js | **TEMPLATE** | Meet Safe Power, Safety Dial Lab, Sort Safe / Unsafe, Safer Habits Lab, Safety Steps, Name the Safe Rule, Stretch: Places, Myth Bust, Fluency Drill, Safety Star Mastery | s1:demo/motion-chain+quiz+tap; s2:dial/lab-heat; s3:tap+drag-sort; s4:dial/lab-heat; s5:order; s6:equation+tap; s7:tap+quiz; s8:myth; s9:fluency-drill; s10:order+tap |
| 3 | Mission 4 | False | — | **STUB** | (none — stub/soon) | n/a |
| 4 | Mission 5 | False | — | **STUB** | (none — stub/soon) | n/a |
| 5 | Mission 6 | False | — | **STUB** | (none — stub/soon) | n/a |
| 6 | Mission 7 | False | — | **STUB** | (none — stub/soon) | n/a |
| 7 | Mission 8 | False | — | **STUB** | (none — stub/soon) | n/a |
| 8 | Mission 9 | False | — | **STUB** | (none — stub/soon) | n/a |
| 9 | Mission 10 | False | — | **STUB** | (none — stub/soon) | n/a |

### Electronics & Robotics

- **Folder:** `games/electronics-robotics/`
- **manifest.js:** id=`electronicsRobotics`, title=`Electronics & Robotics`, storageKey=`gq-electronics-robotics-save-v2`, localeKey=`gq-electronics-robotics-locale`
- **theme:** {accent: "#4ade80", accent2: "#15803d"}
- **listed assets:** none found as URL strings in manifest (theme/keys only or empty).
- **curriculum.js:** **ABSENT** — live path uses `missions-meta.js` + `levelN.js` (Chem/Canvas pattern)
- **Playable missions (missions-meta `playable:true`):** 1 / 10 parsed mission objects
- **Books:** level1.js
- **_legacy3d:** yes
- **scene packs:** bot-scenes.js

| Mission idx | Title | playable | level file | STATUS | Sub-level titles (from L*_META.subTitles) | Activity types per step (from mount* calls) |
|-------------|-------|----------|------------|--------|-------------------------------------------|-----------------------------------------------|
| 0 | Sensor Bot | True | js/level1.js | **REAL** | Meet Sensor Bot, Loop Dial Lab, Sort Sense Decide Act, Stronger Loop Lab, Why the Bot Moves, Name the Bot Rule, Stretch: Places, Myth Bust, Fluency Drill, Bot Builder Mastery | s1:demo/motion-chain+quiz+tap; s2:dial/lab-heat; s3:tap+drag-sort; s4:dial/lab-heat; s5:order+quiz; s6:equation+tap; s7:tap+quiz; s8:myth; s9:fluency-drill; s10:order+tap |
| 1 | Mission 2 | False | js/level2.js | **STUB** | (none — stub/soon) | no s1..s10 functions matched |
| 2 | Mission 3 | False | js/level3.js | **STUB** | (none — stub/soon) | no s1..s10 functions matched |
| 3 | Mission 4 | False | — | **STUB** | (none — stub/soon) | n/a |
| 4 | Mission 5 | False | — | **STUB** | (none — stub/soon) | n/a |
| 5 | Mission 6 | False | — | **STUB** | (none — stub/soon) | n/a |
| 6 | Mission 7 | False | — | **STUB** | (none — stub/soon) | n/a |
| 7 | Mission 8 | False | — | **STUB** | (none — stub/soon) | n/a |
| 8 | Mission 9 | False | — | **STUB** | (none — stub/soon) | n/a |
| 9 | Mission 10 | False | — | **STUB** | (none — stub/soon) | n/a |

### Force Fighter

- **Folder:** `games/force-fighter/`
- **manifest.js:** id=`forceFighter`, title=`Force Fighter`, storageKey=`gq-force-fighter-save-v2`, localeKey=`gq-force-fighter-locale`
- **theme:** {accent: "#f59e0b", accent2: "#b45309", sky: 4337966, floor: 2894892, fog: 292524,}
- **listed assets:** none found as URL strings in manifest (theme/keys only or empty).
- **curriculum.js:** **ABSENT** — live path uses `missions-meta.js` + `levelN.js` (Chem/Canvas pattern)
- **Playable missions (missions-meta `playable:true`):** 3 / 10 parsed mission objects
- **Books:** level1.js, level2.js, level3.js
- **_legacy3d:** yes
- **scene packs:** pair-scenes.js, push-scenes.js, rock-scenes.js

| Mission idx | Title | playable | level file | STATUS | Sub-level titles (from L*_META.subTitles) | Activity types per step (from mount* calls) |
|-------------|-------|----------|------------|--------|-------------------------------------------|-----------------------------------------------|
| 0 | The Lazy Rock | True | js/level1.js | **REAL** | Meet the Lazy Rock, Coast & Glide, Sort: Force or Not?, Wall Hit Lab, Why It Coasts, Name the Inertia Rule, Stretch: New Contexts, Myth Bust, Fluency Drill, Lazy Rock Mastery | sub1_meet:demo/motion-chain+quiz+tap; sub2_glide:dial/lab-heat+quiz; sub3_sort:tap+drag-sort+quiz; sub4_wall:dial/lab-heat+quiz; sub5_explain:reveal+quiz; sub6_rule:equation+quiz; sub7_stretch:quiz+tap; sub8_myths:myth; sub9_drill:fluency-drill; sub10_mastery:order+quiz |
| 1 | Push Power | True | js/level2.js | **REAL** | Meet Push Power, Watch F, m, a, Sort: Force  /  Mass  /  Accel, Crate Push Lab, Live F = m / a Sim, Name the Second Law, Stretch: New Contexts, Myth Bust, Number Drill, Push Power Mastery | sub1_meet:demo/motion-chain+quiz; sub2_watch:tap; sub3_sort:drag-sort+quiz; sub4_crate:dial/lab-heat+quiz; sub5_sim:dial/lab-heat; sub6_rule:equation+quiz; sub7_stretch:quiz+tap; sub8_myths:myth; sub9_drill:fluency-drill; sub10_mastery:order+quiz |
| 2 | Push & Pull Pairs | True | js/level3.js | **REAL** | Meet Force Pairs, Watch the Pair, Sort: Action  /  Reaction, Rocket Pair Lab, Rope Scale Lab, Walking Pairs, Name the Pair Rule, Stretch: New Contexts, Myth Bust, Pairs Mastery | sub1_meet:demo/motion-chain+quiz; sub2_watch:tap+quiz; sub3_sort:drag-sort; sub4_rocket:dial/lab-heat+quiz; sub5_rope:dial/lab-heat+quiz; sub6_walk:demo/motion-chain+quiz; sub7_rule:equation+quiz; sub8_stretch:quiz+tap; sub9_myths:myth; sub10_mastery:order+fluency-drill |
| 3 | Friction Fun | False | — | **STUB** | (none — stub/soon) | n/a |
| 4 | Forces in Balance | False | — | **STUB** | (none — stub/soon) | n/a |
| 5 | Ramp & Slide | False | — | **STUB** | (none — stub/soon) | n/a |
| 6 | Rope Rescue | False | — | **STUB** | (none — stub/soon) | n/a |
| 7 | Push & Pull Together | False | — | **STUB** | (none — stub/soon) | n/a |
| 8 | Force Mix | False | — | **STUB** | (none — stub/soon) | n/a |
| 9 | Force Boss | False | — | **STUB** | (none — stub/soon) | n/a |

### Genetics & Biotech

- **Folder:** `games/genetics-biotech/`
- **manifest.js:** id=`geneticsBiotech`, title=`Genetics & Biotech`, storageKey=`gq-genetics-biotech-save-v2`, localeKey=`gq-genetics-biotech-locale`
- **theme:** {accent: "#67e8f9", accent2: "#0e7490"}
- **listed assets:** none found as URL strings in manifest (theme/keys only or empty).
- **curriculum.js:** **ABSENT** — live path uses `missions-meta.js` + `levelN.js` (Chem/Canvas pattern)
- **Playable missions (missions-meta `playable:true`):** 1 / 10 parsed mission objects
- **Books:** level1.js
- **_legacy3d:** yes
- **scene packs:** trait-scenes.js

| Mission idx | Title | playable | level file | STATUS | Sub-level titles (from L*_META.subTitles) | Activity types per step (from mount* calls) |
|-------------|-------|----------|------------|--------|-------------------------------------------|-----------------------------------------------|
| 0 | Trait Tokens | True | js/level1.js | **REAL** | Meet Trait Tokens, Trait Clarity Lab, Sort: Inherit / Not, Family Clue Lab, Why Traits Pass, Name the Trait Rule, Stretch: Family Stories, Myth Bust, Fluency Drill, Trait Tracker Mastery | s1:demo/motion-chain+quiz+tap; s2:dial/lab-heat; s3:tap+drag-sort; s4:dial/lab-heat; s5:order+quiz; s6:equation+tap; s7:tap+quiz; s8:myth; s9:fluency-drill; s10:order+tap |
| 1 | Mission 2 | False | js/level2.js | **STUB** | (none — stub/soon) | no s1..s10 functions matched |
| 2 | Mission 3 | False | js/level3.js | **STUB** | (none — stub/soon) | no s1..s10 functions matched |
| 3 | Mission 4 | False | — | **STUB** | (none — stub/soon) | n/a |
| 4 | Mission 5 | False | — | **STUB** | (none — stub/soon) | n/a |
| 5 | Mission 6 | False | — | **STUB** | (none — stub/soon) | n/a |
| 6 | Mission 7 | False | — | **STUB** | (none — stub/soon) | n/a |
| 7 | Mission 8 | False | — | **STUB** | (none — stub/soon) | n/a |
| 8 | Mission 9 | False | — | **STUB** | (none — stub/soon) | n/a |
| 9 | Mission 10 | False | — | **STUB** | (none — stub/soon) | n/a |

### Geology & Earth

- **Folder:** `games/geology-earth/`
- **manifest.js:** id=`geologyEarth`, title=`Geology & Earth`, storageKey=`gq-geology-earth-save-v2`, localeKey=`gq-geology-earth-locale`
- **theme:** {accent: "#d6d3d1", accent2: "#78716c"}
- **listed assets:** none found as URL strings in manifest (theme/keys only or empty).
- **curriculum.js:** **ABSENT** — live path uses `missions-meta.js` + `levelN.js` (Chem/Canvas pattern)
- **Playable missions (missions-meta `playable:true`):** 1 / 10 parsed mission objects
- **Books:** level1.js
- **_legacy3d:** yes
- **scene packs:** rock-scenes.js

| Mission idx | Title | playable | level file | STATUS | Sub-level titles (from L*_META.subTitles) | Activity types per step (from mount* calls) |
|-------------|-------|----------|------------|--------|-------------------------------------------|-----------------------------------------------|
| 0 | Rock Cycle Lite | True | js/level1.js | **REAL** | Meet Rock Types, Cycle Clarity Lab, Sort: Type / Form / Not, Pressure Lab, Why Rocks Transform, Name the Cycle Rule, Stretch: BD Rocks, Myth Bust, Fluency Drill, Rock Ranger Mastery | s1:demo/motion-chain+quiz+tap; s2:dial/lab-heat; s3:tap+drag-sort; s4:dial/lab-heat; s5:order+quiz; s6:equation+tap; s7:tap+quiz; s8:myth; s9:fluency-drill; s10:order+tap |
| 1 | Mission 2 | False | js/level2.js | **STUB** | (none — stub/soon) | no s1..s10 functions matched |
| 2 | Mission 3 | False | js/level3.js | **STUB** | (none — stub/soon) | no s1..s10 functions matched |
| 3 | Mission 4 | False | — | **STUB** | (none — stub/soon) | n/a |
| 4 | Mission 5 | False | — | **STUB** | (none — stub/soon) | n/a |
| 5 | Mission 6 | False | — | **STUB** | (none — stub/soon) | n/a |
| 6 | Mission 7 | False | — | **STUB** | (none — stub/soon) | n/a |
| 7 | Mission 8 | False | — | **STUB** | (none — stub/soon) | n/a |
| 8 | Mission 9 | False | — | **STUB** | (none — stub/soon) | n/a |
| 9 | Mission 10 | False | — | **STUB** | (none — stub/soon) | n/a |

### Geometry & Trigonometry

- **Folder:** `games/geometry-trig/`
- **manifest.js:** id=`geometryTrig`, title=`Geometry & Trigonometry`, storageKey=`gq-geometry-trig-save-v2`, localeKey=`gq-geometry-trig-locale`
- **theme:** {accent: "#93c5fd", accent2: "#1d4ed8"}
- **listed assets:** none found as URL strings in manifest (theme/keys only or empty).
- **curriculum.js:** **ABSENT** — live path uses `missions-meta.js` + `levelN.js` (Chem/Canvas pattern)
- **Playable missions (missions-meta `playable:true`):** 2 / 10 parsed mission objects
- **Books:** level1.js, level2.js
- **_legacy3d:** yes
- **scene packs:** angle-scenes.js, shape-scenes.js

| Mission idx | Title | playable | level file | STATUS | Sub-level titles (from L*_META.subTitles) | Activity types per step (from mount* calls) |
|-------------|-------|----------|------------|--------|-------------------------------------------|-----------------------------------------------|
| 0 | Shape Studio | True | js/level1.js | **REAL** | Meet the Shape Crew, Build Side Count, Sort: Triangle, Square, Circle, Property Lab, Why Properties Matter, Name the Shape Rule, Stretch: BD Shape Stories, Myth Bust, Fluency Drill, Shape Scout Mastery | s1:demo/motion-chain+quiz+tap; s2:dial/lab-heat; s3:tap+drag-sort; s4:dial/lab-heat; s5:order+quiz; s6:equation+tap; s7:tap+quiz; s8:myth; s9:fluency-drill; s10:order+tap |
| 1 | Angle Adventures | True | js/level2.js | **TEMPLATE** | Meet the Turn, Open the Angle, Sort: Acute, Right, Obtuse, Degree Lab, Why We Measure Turns, Name the Angle Rule, Stretch: BD Angle Stories, Myth Bust, Fluency Drill, Angle Ace Mastery | s1:demo/motion-chain+quiz+tap; s2:dial/lab-heat; s3:tap+drag-sort; s4:dial/lab-heat; s5:order+quiz; s6:equation+tap; s7:tap+quiz; s8:myth; s9:fluency-drill; s10:order+tap |
| 2 | Mission 3 | False | js/level3.js | **STUB** | (none — stub/soon) | no s1..s10 functions matched |
| 3 | Mission 4 | False | — | **STUB** | (none — stub/soon) | n/a |
| 4 | Mission 5 | False | — | **STUB** | (none — stub/soon) | n/a |
| 5 | Mission 6 | False | — | **STUB** | (none — stub/soon) | n/a |
| 6 | Mission 7 | False | — | **STUB** | (none — stub/soon) | n/a |
| 7 | Mission 8 | False | — | **STUB** | (none — stub/soon) | n/a |
| 8 | Mission 9 | False | — | **STUB** | (none — stub/soon) | n/a |
| 9 | Mission 10 | False | — | **STUB** | (none — stub/soon) | n/a |

### Green Tech

- **Folder:** `games/green-tech/`
- **manifest.js:** id=`greenTech`, title=`Green Tech`, storageKey=`gq-green-tech-save-v2`, localeKey=`gq-green-tech-locale`
- **theme:** {accent: "#86efac", accent2: "#166534"}
- **listed assets:** none found as URL strings in manifest (theme/keys only or empty).
- **curriculum.js:** **ABSENT** — live path uses `missions-meta.js` + `levelN.js` (Chem/Canvas pattern)
- **Playable missions (missions-meta `playable:true`):** 1 / 10 parsed mission objects
- **Books:** level1.js
- **_legacy3d:** yes
- **scene packs:** clean-scenes.js

| Mission idx | Title | playable | level file | STATUS | Sub-level titles (from L*_META.subTitles) | Activity types per step (from mount* calls) |
|-------------|-------|----------|------------|--------|-------------------------------------------|-----------------------------------------------|
| 0 | Clean Energy | True | js/level1.js | **REAL** | Meet Clean Power, Clean Dial Lab, Sort Energy Sources, More Clean Lab, Why Clean Helps, Name the Clean Rule, Stretch: Places, Myth Bust, Fluency Drill, Clean Champ Mastery | s1:demo/motion-chain+quiz+tap; s2:dial/lab-heat; s3:tap+drag-sort; s4:dial/lab-heat; s5:order+quiz; s6:equation+tap; s7:tap+quiz; s8:myth; s9:fluency-drill; s10:order+tap |
| 1 | Mission 2 | False | js/level2.js | **STUB** | (none — stub/soon) | no s1..s10 functions matched |
| 2 | Mission 3 | False | js/level3.js | **STUB** | (none — stub/soon) | no s1..s10 functions matched |
| 3 | Mission 4 | False | — | **STUB** | (none — stub/soon) | n/a |
| 4 | Mission 5 | False | — | **STUB** | (none — stub/soon) | n/a |
| 5 | Mission 6 | False | — | **STUB** | (none — stub/soon) | n/a |
| 6 | Mission 7 | False | — | **STUB** | (none — stub/soon) | n/a |
| 7 | Mission 8 | False | — | **STUB** | (none — stub/soon) | n/a |
| 8 | Mission 9 | False | — | **STUB** | (none — stub/soon) | n/a |
| 9 | Mission 10 | False | — | **STUB** | (none — stub/soon) | n/a |

### Human Anatomy & Health

- **Folder:** `games/human-anatomy/`
- **manifest.js:** id=`humanAnatomy`, title=`Human Anatomy & Health`, storageKey=`gq-human-anatomy-save-v2`, localeKey=`gq-human-anatomy-locale`
- **theme:** {accent: "#fb7185", accent2: "#be123c"}
- **listed assets:** none found as URL strings in manifest (theme/keys only or empty).
- **curriculum.js:** **ABSENT** — live path uses `missions-meta.js` + `levelN.js` (Chem/Canvas pattern)
- **Playable missions (missions-meta `playable:true`):** 2 / 10 parsed mission objects
- **Books:** level1.js, level2.js
- **_legacy3d:** yes
- **scene packs:** body-scenes.js, heart-scenes.js

| Mission idx | Title | playable | level file | STATUS | Sub-level titles (from L*_META.subTitles) | Activity types per step (from mount* calls) |
|-------------|-------|----------|------------|--------|-------------------------------------------|-----------------------------------------------|
| 0 | Body Map | True | js/level1.js | **REAL** | Meet the Organ Team, Map Clarity Lab, Sort: Organ / Support / Not, Teamwork Lab, Why Organs Team, Name the Body Rule, Stretch: Daily Body, Myth Bust, Fluency Drill, Body Mapper Mastery | s1:demo/motion-chain+quiz+tap; s2:dial/lab-heat; s3:tap+drag-sort; s4:dial/lab-heat; s5:order+quiz; s6:equation+tap; s7:tap+quiz; s8:myth; s9:fluency-drill; s10:order+tap |
| 1 | Heart Beat | True | js/level2.js | **REAL** | Meet the Pump, Pulse Clarity Lab, Sort: Circulation / Notice / Not, Stronger Pulse Lab, Why Blood Moves, Name the Pump Rule, Stretch: Active Days, Myth Bust, Fluency Drill, Pulse Pro Mastery | s1:demo/motion-chain+quiz+tap; s2:dial/lab-heat; s3:tap+drag-sort; s4:dial/lab-heat; s5:order+quiz; s6:equation+tap; s7:tap+quiz; s8:myth; s9:fluency-drill; s10:order+tap |
| 2 | Mission 3 | False | js/level3.js | **STUB** | (none — stub/soon) | no s1..s10 functions matched |
| 3 | Mission 4 | False | — | **STUB** | (none — stub/soon) | n/a |
| 4 | Mission 5 | False | — | **STUB** | (none — stub/soon) | n/a |
| 5 | Mission 6 | False | — | **STUB** | (none — stub/soon) | n/a |
| 6 | Mission 7 | False | — | **STUB** | (none — stub/soon) | n/a |
| 7 | Mission 8 | False | — | **STUB** | (none — stub/soon) | n/a |
| 8 | Mission 9 | False | — | **STUB** | (none — stub/soon) | n/a |
| 9 | Mission 10 | False | — | **STUB** | (none — stub/soon) | n/a |

### ICT Fundamentals

- **Folder:** `games/ict-fundamentals/`
- **manifest.js:** id=`ictFundamentals`, title=`ICT Fundamentals`, storageKey=`gq-ict-fundamentals-save-v2`, localeKey=`gq-ict-fundamentals-locale`
- **theme:** {accent: "#60a5fa", accent2: "#1d4ed8"}
- **listed assets:** none found as URL strings in manifest (theme/keys only or empty).
- **curriculum.js:** **ABSENT** — live path uses `missions-meta.js` + `levelN.js` (Chem/Canvas pattern)
- **Playable missions (missions-meta `playable:true`):** 3 / 10 parsed mission objects
- **Books:** level1.js, level2.js, level3.js
- **_legacy3d:** yes
- **scene packs:** bits-scenes.js, files-scenes.js, io-scenes.js

| Mission idx | Title | playable | level file | STATUS | Sub-level titles (from L*_META.subTitles) | Activity types per step (from mount* calls) |
|-------------|-------|----------|------------|--------|-------------------------------------------|-----------------------------------------------|
| 0 | Computer Bits | True | js/level1.js | **REAL** | Meet the Inside Team, Busy PC Lab, Sort the Jobs, RAM Fill Lab, Why Three Parts, Name the Bits Rule, Stretch: Devices, Myth Bust, Fluency Drill, Bit Scout Mastery | s1:demo/motion-chain+quiz+tap; s2:dial/lab-heat; s3:tap+drag-sort; s4:dial/lab-heat; s5:order+quiz; s6:equation+tap; s7:tap+quiz; s8:myth; s9:fluency-drill; s10:order+tap |
| 1 | Input & Output | True | js/level2.js | **REAL** | Meet I/O Devices, Type -> Screen Lab, Sort Input/Output, Signal Lab, Path of a Keypress, Name the I/O Rule, Stretch: Real Life, Myth Bust, Fluency Drill, I/O Ranger Mastery | s1:demo/motion-chain+quiz+tap; s2:dial/lab-heat; s3:tap+drag-sort; s4:dial/lab-heat; s5:order; s6:equation+tap; s7:tap+quiz; s8:myth; s9:fluency-drill; s10:order+tap |
| 2 | Files & Folders | True | js/level3.js | **REAL** | Meet Files & Folders, Save Bar Lab, Sort into Folders, Save Again Lab, Find Path Story, Name the File Rule, Stretch: Places, Myth Bust, Fluency Drill, File Finder Mastery | s1:demo/motion-chain+quiz+tap; s2:dial/lab-heat; s3:tap+drag-sort; s4:dial/lab-heat; s5:order; s6:equation+tap; s7:tap+quiz; s8:myth; s9:fluency-drill; s10:order+tap |
| 3 | Mission 4 | False | — | **STUB** | (none — stub/soon) | n/a |
| 4 | Mission 5 | False | — | **STUB** | (none — stub/soon) | n/a |
| 5 | Mission 6 | False | — | **STUB** | (none — stub/soon) | n/a |
| 6 | Mission 7 | False | — | **STUB** | (none — stub/soon) | n/a |
| 7 | Mission 8 | False | — | **STUB** | (none — stub/soon) | n/a |
| 8 | Mission 9 | False | — | **STUB** | (none — stub/soon) | n/a |
| 9 | Mission 10 | False | — | **STUB** | (none — stub/soon) | n/a |

### Math Quest

- **Folder:** `games/math-quest/`
- **manifest.js:** id=`mathQuest`, title=`Math Quest`, storageKey=`gq-math-quest-save-v2`, localeKey=`gq-math-quest-locale`
- **theme:** {accent: "#38bdf8", accent2: "#0369a1"}
- **listed assets:** none found as URL strings in manifest (theme/keys only or empty).
- **curriculum.js:** **ABSENT** — live path uses `missions-meta.js` + `levelN.js` (Chem/Canvas pattern)
- **Playable missions (missions-meta `playable:true`):** 2 / 10 parsed mission objects
- **Books:** level1.js, level2.js
- **_legacy3d:** yes
- **scene packs:** frac-scenes.js, num-scenes.js

| Mission idx | Title | playable | level file | STATUS | Sub-level titles (from L*_META.subTitles) | Activity types per step (from mount* calls) |
|-------------|-------|----------|------------|--------|-------------------------------------------|-----------------------------------------------|
| 0 | Number Sense | True | js/level1.js | **REAL** | Meet Tens & Ones, Build a Number, Sort: Tens or Ones?, Place Chart Lab, Why Place Matters, Name the Place Rule, Stretch: BD Stories, Myth Bust, Fluency Drill, Number Scout Mastery | s1:demo/motion-chain+quiz+tap; s2:dial/lab-heat+quiz; s3:tap+drag-sort; s4:dial/lab-heat; s5:order+quiz; s6:equation+tap; s7:tap+quiz; s8:myth; s9:fluency-drill; s10:order+tap |
| 1 | Fraction Friends | True | js/level2.js | **REAL** | Meet Fair Shares, Shade the Whole, Sort: Equal or Not?, Parts Lab, Name Numerator & Denominator, Name the Fraction Rule, Stretch: BD Stories, Myth Bust, Fluency Drill, Fraction Friend Mastery | s1:demo/motion-chain+quiz+tap; s2:dial/lab-heat; s3:tap+drag-sort; s4:dial/lab-heat+quiz; s5:order; s6:equation+tap; s7:tap+quiz; s8:myth; s9:fluency-drill; s10:order+tap |
| 2 | Mission 3 | False | js/level3.js | **STUB** | (none — stub/soon) | no s1..s10 functions matched |
| 3 | Mission 4 | False | — | **STUB** | (none — stub/soon) | n/a |
| 4 | Mission 5 | False | — | **STUB** | (none — stub/soon) | n/a |
| 5 | Mission 6 | False | — | **STUB** | (none — stub/soon) | n/a |
| 6 | Mission 7 | False | — | **STUB** | (none — stub/soon) | n/a |
| 7 | Mission 8 | False | — | **STUB** | (none — stub/soon) | n/a |
| 8 | Mission 9 | False | — | **STUB** | (none — stub/soon) | n/a |
| 9 | Mission 10 | False | — | **STUB** | (none — stub/soon) | n/a |

### Mechanical Basics

- **Folder:** `games/mechanical-basics/`
- **manifest.js:** id=`mechanicalBasics`, title=`Mechanical Basics`, storageKey=`gq-mechanical-basics-save-v2`, localeKey=`gq-mechanical-basics-locale`
- **theme:** {accent: "#fdba74", accent2: "#9a3412"}
- **listed assets:** none found as URL strings in manifest (theme/keys only or empty).
- **curriculum.js:** **ABSENT** — live path uses `missions-meta.js` + `levelN.js` (Chem/Canvas pattern)
- **Playable missions (missions-meta `playable:true`):** 3 / 10 parsed mission objects
- **Books:** level1.js, level2.js, level3.js
- **_legacy3d:** yes
- **scene packs:** lever-scenes.js, motion-scenes.js, work-scenes.js

| Mission idx | Title | playable | level file | STATUS | Sub-level titles (from L*_META.subTitles) | Activity types per step (from mount* calls) |
|-------------|-------|----------|------------|--------|-------------------------------------------|-----------------------------------------------|
| 0 | Levers & Gears | True | js/level1.js | **REAL** | Meet Lever & Gear, Advantage Dial, Sort Machines, Stronger Advantage, Why It Helps, Name the Machine Rule, Stretch: Places, Myth Bust, Fluency Drill, Lever Learner Mastery | s1:demo/motion-chain+quiz+tap; s2:dial/lab-heat; s3:tap+drag-sort; s4:dial/lab-heat; s5:order+quiz; s6:equation+tap; s7:tap+quiz; s8:myth; s9:fluency-drill; s10:order+tap |
| 1 | Motion Machines | True | js/level2.js | **REAL** | Meet Motion Links, Belt Dial Lab, Sort Transfer Parts, Tighter Transfer, Why Motion Passes, Name the Transfer Rule, Stretch: Places, Myth Bust, Fluency Drill, Motion Scout Mastery | s1:demo/motion-chain+quiz+tap; s2:dial/lab-heat; s3:tap+drag-sort; s4:dial/lab-heat; s5:order+quiz; s6:equation+tap; s7:tap+quiz; s8:myth; s9:fluency-drill; s10:order+tap |
| 2 | Forces at Work | True | js/level3.js | **REAL** | Meet Force & Work, Work Dial Lab, Sort Work Cases, Bigger Work Lab, Why Work Happens, Name the Work Rule, Stretch: Places, Myth Bust, Fluency Drill, Work Warrior Mastery | s1:demo/motion-chain+quiz+tap; s2:dial/lab-heat; s3:tap+drag-sort; s4:dial/lab-heat; s5:order+quiz; s6:equation+tap; s7:tap+quiz; s8:myth; s9:fluency-drill; s10:order+tap |
| 3 | Mission 4 | False | — | **STUB** | (none — stub/soon) | n/a |
| 4 | Mission 5 | False | — | **STUB** | (none — stub/soon) | n/a |
| 5 | Mission 6 | False | — | **STUB** | (none — stub/soon) | n/a |
| 6 | Mission 7 | False | — | **STUB** | (none — stub/soon) | n/a |
| 7 | Mission 8 | False | — | **STUB** | (none — stub/soon) | n/a |
| 8 | Mission 9 | False | — | **STUB** | (none — stub/soon) | n/a |
| 9 | Mission 10 | False | — | **STUB** | (none — stub/soon) | n/a |

### Machine Learning

- **Folder:** `games/ml-lab/`
- **manifest.js:** id=`mlLab`, title=`Machine Learning`, storageKey=`gq-ml-lab-save-v2`, localeKey=`gq-ml-lab-locale`
- **theme:** {accent: "#f472b6", accent2: "#be185d"}
- **listed assets:** none found as URL strings in manifest (theme/keys only or empty).
- **curriculum.js:** **ABSENT** — live path uses `missions-meta.js` + `levelN.js` (Chem/Canvas pattern)
- **Playable missions (missions-meta `playable:true`):** 1 / 10 parsed mission objects
- **Books:** level1.js
- **_legacy3d:** yes
- **scene packs:** ml-scenes.js

| Mission idx | Title | playable | level file | STATUS | Sub-level titles (from L*_META.subTitles) | Activity types per step (from mount* calls) |
|-------------|-------|----------|------------|--------|-------------------------------------------|-----------------------------------------------|
| 0 | Teach the Model | True | js/level1.js | **REAL** | Meet Training, Watch Train Dial, Sort Train vs Test, Stronger Train Lab, Why Models Learn, Name the Train Rule, Stretch: Places, Myth Bust, Fluency Drill, Model Mentor Mastery | s1:demo/motion-chain+quiz+tap; s2:dial/lab-heat; s3:tap+drag-sort; s4:dial/lab-heat; s5:order+quiz; s6:equation+tap; s7:tap+quiz; s8:myth; s9:fluency-drill; s10:order+tap |
| 1 | Mission 2 | False | js/level2.js | **STUB** | (none — stub/soon) | no s1..s10 functions matched |
| 2 | Mission 3 | False | js/level3.js | **STUB** | (none — stub/soon) | no s1..s10 functions matched |
| 3 | Mission 4 | False | — | **STUB** | (none — stub/soon) | n/a |
| 4 | Mission 5 | False | — | **STUB** | (none — stub/soon) | n/a |
| 5 | Mission 6 | False | — | **STUB** | (none — stub/soon) | n/a |
| 6 | Mission 7 | False | — | **STUB** | (none — stub/soon) | n/a |
| 7 | Mission 8 | False | — | **STUB** | (none — stub/soon) | n/a |
| 8 | Mission 9 | False | — | **STUB** | (none — stub/soon) | n/a |
| 9 | Mission 10 | False | — | **STUB** | (none — stub/soon) | n/a |

### Networking & Internet

- **Folder:** `games/networking-internet/`
- **manifest.js:** id=`networkingInternet`, title=`Networking & Internet`, storageKey=`gq-networking-internet-save-v2`, localeKey=`gq-networking-internet-locale`
- **theme:** {accent: "#818cf8", accent2: "#4338ca"}
- **listed assets:** none found as URL strings in manifest (theme/keys only or empty).
- **curriculum.js:** **ABSENT** — live path uses `missions-meta.js` + `levelN.js` (Chem/Canvas pattern)
- **Playable missions (missions-meta `playable:true`):** 1 / 10 parsed mission objects
- **Books:** level1.js
- **_legacy3d:** yes
- **scene packs:** packet-scenes.js

| Mission idx | Title | playable | level file | STATUS | Sub-level titles (from L*_META.subTitles) | Activity types per step (from mount* calls) |
|-------------|-------|----------|------------|--------|-------------------------------------------|-----------------------------------------------|
| 0 | Packets Travel | True | js/level1.js | **REAL** | Meet Packets, Watch Path Dial, Sort Packet Parts, Clearer Path Lab, Why Packets Move, Name the Packet Rule, Stretch: Places, Myth Bust, Fluency Drill, Packet Pilot Mastery | s1:demo/motion-chain+quiz+tap; s2:dial/lab-heat; s3:tap+drag-sort; s4:dial/lab-heat; s5:order+quiz; s6:equation+tap; s7:tap+quiz; s8:myth; s9:fluency-drill; s10:order+tap |
| 1 | Mission 2 | False | js/level2.js | **STUB** | (none — stub/soon) | no s1..s10 functions matched |
| 2 | Mission 3 | False | js/level3.js | **STUB** | (none — stub/soon) | no s1..s10 functions matched |
| 3 | Mission 4 | False | — | **STUB** | (none — stub/soon) | n/a |
| 4 | Mission 5 | False | — | **STUB** | (none — stub/soon) | n/a |
| 5 | Mission 6 | False | — | **STUB** | (none — stub/soon) | n/a |
| 6 | Mission 7 | False | — | **STUB** | (none — stub/soon) | n/a |
| 7 | Mission 8 | False | — | **STUB** | (none — stub/soon) | n/a |
| 8 | Mission 9 | False | — | **STUB** | (none — stub/soon) | n/a |
| 9 | Mission 10 | False | — | **STUB** | (none — stub/soon) | n/a |

### OS & Hardware

- **Folder:** `games/os-hardware/`
- **manifest.js:** id=`osHardware`, title=`OS & Hardware`, storageKey=`gq-os-hardware-save-v2`, localeKey=`gq-os-hardware-locale`
- **theme:** {accent: "#94a3b8", accent2: "#334155"}
- **listed assets:** none found as URL strings in manifest (theme/keys only or empty).
- **curriculum.js:** **ABSENT** — live path uses `missions-meta.js` + `levelN.js` (Chem/Canvas pattern)
- **Playable missions (missions-meta `playable:true`):** 1 / 10 parsed mission objects
- **Books:** level1.js
- **_legacy3d:** yes
- **scene packs:** box-scenes.js

| Mission idx | Title | playable | level file | STATUS | Sub-level titles (from L*_META.subTitles) | Activity types per step (from mount* calls) |
|-------------|-------|----------|------------|--------|-------------------------------------------|-----------------------------------------------|
| 0 | Inside the Box | True | js/level1.js | **REAL** | Meet the Box, Watch Team Dial, Sort HW vs OS, Smoother Team Lab, Why OS Manages, Name the Box Rule, Stretch: Places, Myth Bust, Fluency Drill, Box Scout Mastery | s1:demo/motion-chain+quiz+tap; s2:dial/lab-heat; s3:tap+drag-sort; s4:dial/lab-heat; s5:order+quiz; s6:equation+tap; s7:tap+quiz; s8:myth; s9:fluency-drill; s10:order+tap |
| 1 | Mission 2 | False | js/level2.js | **STUB** | (none — stub/soon) | no s1..s10 functions matched |
| 2 | Mission 3 | False | js/level3.js | **STUB** | (none — stub/soon) | no s1..s10 functions matched |
| 3 | Mission 4 | False | — | **STUB** | (none — stub/soon) | n/a |
| 4 | Mission 5 | False | — | **STUB** | (none — stub/soon) | n/a |
| 5 | Mission 6 | False | — | **STUB** | (none — stub/soon) | n/a |
| 6 | Mission 7 | False | — | **STUB** | (none — stub/soon) | n/a |
| 7 | Mission 8 | False | — | **STUB** | (none — stub/soon) | n/a |
| 8 | Mission 9 | False | — | **STUB** | (none — stub/soon) | n/a |
| 9 | Mission 10 | False | — | **STUB** | (none — stub/soon) | n/a |

### Statistics & Probability

- **Folder:** `games/statistics-probability/`
- **manifest.js:** id=`statisticsProbability`, title=`Statistics & Probability`, storageKey=`gq-statistics-probability-save-v2`, localeKey=`gq-statistics-probability-locale`
- **theme:** {accent: "#fbbf24", accent2: "#b45309"}
- **listed assets:** none found as URL strings in manifest (theme/keys only or empty).
- **curriculum.js:** **ABSENT** — live path uses `missions-meta.js` + `levelN.js` (Chem/Canvas pattern)
- **Playable missions (missions-meta `playable:true`):** 2 / 10 parsed mission objects
- **Books:** level1.js, level2.js
- **_legacy3d:** yes
- **scene packs:** chance-scenes.js, mean-scenes.js

| Mission idx | Title | playable | level file | STATUS | Sub-level titles (from L*_META.subTitles) | Activity types per step (from mount* calls) |
|-------------|-------|----------|------------|--------|-------------------------------------------|-----------------------------------------------|
| 0 | Mean & Mode | True | js/level1.js | **REAL** | Meet Mean & Mode, Balance the Mean, Sort: Mean, Mode, or Not?, Data Peak Lab, Why Both Summaries, Name the Average Rule, Stretch: BD Data Stories, Myth Bust, Fluency Drill, Mean Scout Mastery | s1:demo/motion-chain+quiz+tap; s2:dial/lab-heat+quiz; s3:tap+drag-sort; s4:dial/lab-heat; s5:order+quiz; s6:equation+tap; s7:tap+quiz; s8:myth; s9:fluency-drill; s10:order+tap |
| 1 | Chance Games | True | js/level2.js | **REAL** | Meet Chance Tools, Fair Share Dial, Sort: Likely, Unlikely, Impossible, Trial Lab, Why Probability is a Share, Name the Chance Rule, Stretch: BD Chance Stories, Myth Bust, Fluency Drill, Chance Champ Mastery | s1:demo/motion-chain+quiz+tap; s2:dial/lab-heat; s3:tap+drag-sort; s4:dial/lab-heat; s5:order+quiz; s6:equation+tap; s7:tap+quiz; s8:myth; s9:fluency-drill; s10:order+tap |
| 2 | Mission 3 | False | js/level3.js | **STUB** | (none — stub/soon) | no s1..s10 functions matched |
| 3 | Mission 4 | False | — | **STUB** | (none — stub/soon) | n/a |
| 4 | Mission 5 | False | — | **STUB** | (none — stub/soon) | n/a |
| 5 | Mission 6 | False | — | **STUB** | (none — stub/soon) | n/a |
| 6 | Mission 7 | False | — | **STUB** | (none — stub/soon) | n/a |
| 7 | Mission 8 | False | — | **STUB** | (none — stub/soon) | n/a |
| 8 | Mission 9 | False | — | **STUB** | (none — stub/soon) | n/a |
| 9 | Mission 10 | False | — | **STUB** | (none — stub/soon) | n/a |

### Web Dev Studio

- **Folder:** `games/web-dev-studio/`
- **manifest.js:** id=`webDevStudio`, title=`Web Dev Studio`, storageKey=`gq-web-dev-studio-save-v2`, localeKey=`gq-web-dev-studio-locale`
- **theme:** {accent: "#a78bfa", accent2: "#6d28d9"}
- **listed assets:** none found as URL strings in manifest (theme/keys only or empty).
- **curriculum.js:** **ABSENT** — live path uses `missions-meta.js` + `levelN.js` (Chem/Canvas pattern)
- **Playable missions (missions-meta `playable:true`):** 3 / 10 parsed mission objects
- **Books:** level1.js, level2.js, level3.js
- **_legacy3d:** yes
- **scene packs:** css-scenes.js, html-scenes.js, js-scenes.js

| Mission idx | Title | playable | level file | STATUS | Sub-level titles (from L*_META.subTitles) | Activity types per step (from mount* calls) |
|-------------|-------|----------|------------|--------|-------------------------------------------|-----------------------------------------------|
| 0 | HTML House | True | js/level1.js | **REAL** | Meet the Tag House, Open Rooms Lab, Sort Structure, Build More Rooms, Why Nest Tags, Name the House Rule, Stretch: Real Pages, Myth Bust, Fluency Drill, HTML Builder Mastery | s1:demo/motion-chain+quiz+tap; s2:dial/lab-heat; s3:tap+drag-sort; s4:dial/lab-heat; s5:order+quiz; s6:equation+tap; s7:tap+quiz; s8:myth; s9:fluency-drill; s10:order+tap |
| 1 | CSS Style | True | js/level2.js | **REAL** | Meet Color Size Space, Style Dial Lab, Sort CSS Look, Stronger Style Lab, Why Clear Look, Name the Style Rule, Stretch: Surfaces, Myth Bust, Fluency Drill, Style Star Mastery | s1:demo/motion-chain+quiz+tap; s2:dial/lab-heat; s3:tap+drag-sort; s4:dial/lab-heat; s5:order+quiz; s6:equation+tap; s7:tap+quiz; s8:myth; s9:fluency-drill; s10:order+tap |
| 2 | JS Click | True | js/level3.js | **REAL** | Meet the Click, Click Energy Lab, Sort Reactions, Stronger Click Lab, Why Pages React, Name the Click Rule, Stretch: Real Taps, Myth Bust, Fluency Drill, Click Coder Mastery | s1:demo/motion-chain+quiz+tap; s2:dial/lab-heat; s3:tap+drag-sort; s4:dial/lab-heat; s5:order+quiz; s6:equation+tap; s7:tap+quiz; s8:myth; s9:fluency-drill; s10:order+tap |
| 3 | Mission 4 | False | — | **STUB** | (none — stub/soon) | n/a |
| 4 | Mission 5 | False | — | **STUB** | (none — stub/soon) | n/a |
| 5 | Mission 6 | False | — | **STUB** | (none — stub/soon) | n/a |
| 6 | Mission 7 | False | — | **STUB** | (none — stub/soon) | n/a |
| 7 | Mission 8 | False | — | **STUB** | (none — stub/soon) | n/a |
| 8 | Mission 9 | False | — | **STUB** | (none — stub/soon) | n/a |
| 9 | Mission 10 | False | — | **STUB** | (none — stub/soon) | n/a |

## 3. Chemistry Lab Deep Detail

### File existence and size (verified)

| File | exists | bytes | exports (sample) |
|------|--------|-------|------------------|
| `js/boot-l1.js` | yes | 21091 | bootChemLevel1 |
| `js/level1.js` | yes | 22660 | L1_META, runL1Sub |
| `js/level2.js` | yes | 21005 | L2_META, runL2Sub |
| `js/level3.js` | yes | 20075 | L3_META, runL3Sub |
| `js/chem-activities.js` | yes | 34005 | cancelActiveActivity, playScene, badgeHtml, mountMotionChain, mountDragSort, mou |
| `js/activity-controller.js` | yes | 6498 | getActiveSession, createActivitySession, stopActivitySession, sortSlotPositions, |
| `js/atom-scenes.js` | yes | 68732 | chemLabState, easeOutCubic, easeInOutQuad, setHeatTarget, pulseFailFeedback, pul |
| `js/arena-2d.js` | yes | 10928 | createArena2D |
| `js/curriculum.js` | NO | — | — |
| `js/element-scenes.js` | yes | 42996 | registerElementScenes, ELEM_ASSET_PATHS |
| `js/bond-scenes.js` | yes | 40718 | registerBondScenes, BOND_ASSET_PATHS |

### boot-l1.js

- Exports `bootChemLevel1` (verified via export search in audit raw).
- Wires mission hub, arena2d, registerAtomScenes / Element / Bond, runL1/L2/L3Sub.
- N_LEVELS=10, N_SUBS=10; persist via storageKey from manifest.
- Digital books: imports BOOK_L1..L3 + `setupMissionBooks` (added in book feature).
- Hub subtitle states missions 1–3 live (verified string search): YES

### level1.js / chem-activities / scenes

- `level1.js`: Tiny Bits deepened Bruner spiral (10 runners) — gold reference for Canvas labs.
- `chem-activities.js`: activity mounts for chem (MotionChain, DragSort, HeatLab, etc.).
- `activity-controller.js`: present — coordinates activity lifecycle.
- `atom-scenes.js` / `element-scenes.js` / `bond-scenes.js`: Canvas scene packs for M1–M3.
- `arena-2d.js`: Canvas 2D arena.

### Missions 2–10 / curriculum.js leftover

- `games/chemistry-lab/curriculum.js` exists: **True** (root of game, not under `js/`)
- `games/chemistry-lab/js/curriculum.js` exists: **False**
- boot-l1.js imports curriculum: **False** (unused leftover relative to Canvas boot)
- missions-meta `playable: true` count: **3** (missions 1–3 live; 4–10 soon stubs).
- Mission 2–3: REAL deepened (`level2.js`, `level3.js`). Missions 4–10: STUB (playable:false).
- Leftover `games/chemistry-lab/curriculum.js` at game root: **True** (not imported by boot-l1).

## 4. Force Fighter Deep Detail

- **storageKey:** `gq-force-fighter-save-v2`
- **localeKey:** `gq-force-fighter-locale`
- **title/id:** Force Fighter / forceFighter
- **_legacy3d:** True (archived 3D — live path is Canvas 2D boot-l1).
- **js files:** activity-controller.js, arena-2d.js, boot-l1.js, force-activities.js, force-state.js, level1.js, level2.js, level3.js, mission-hub.js, missions-meta.js, pair-scenes.js, push-scenes.js, rock-scenes.js, scene-layout.js
- **has curriculum.js:** False
- Hand-authored vs shared: uses shared engine persist/i18n/mission-hub; local `lab-activities`, scene packs, level1–3 for Newton topics.
- boot-l1 imports curriculum?: no
- Locale: `initI18n({ localeStorageKey: manifest.localeKey || ...})` pattern (same as other Canvas games).

## 5. Shared Engine (`engine/`)

- **JS modules:** activities.js, arena.js, asset-loader.js, book-chat.js, book-unlock.js, boot.js, concept-viz.js, digital-book.js, i18n.js, mission-books.js, mission-hub.js, persist.js, timings.js, voice.js
- **CSS:** book-chat.css, concept-viz.css, design-tokens.css, digital-book.css, engine.css, kid-theme.css, mission-hub.css, styles.css, voice.css
- **Locales:** bn.json, en.json

### persist.js schema (exact shape written today)

```json
{
  "level": number,
  "sub": number,
  "completed": boolean[nLevels][nSubs],  // normalizeCompleted default 10x10
  "rewards": [{ "earned": boolean, "stars": number }, ...],
  "introSeen": boolean[nLevels]
}
```

- Exports: loadSave, saveGame, clearSave, normalizeCompleted, normalizeIntroSeen, normalizeRewards, levelDoneCount
- boot.js exports: bootGame (bytes=27576)

### Note on boot.js vs boot-l1.js

- **Verified:** all 28 `games/*/main.js` files import local `boot-l1.js`; none import `engine/js/boot.js` as entry.
- Many games boot via **per-game** `js/boot-l1.js` imported from `main.js`, not necessarily `engine/js/boot.js`.
- `engine/js/boot.js` remains for older/shared curriculum shells — confirm per game main.js import.

### i18n

- en.json flattened keys: **99**
- bn.json flattened keys: **99**
- Keys in en missing from bn: **0**
- Landing page has its **own** en/bn strings inside `js/landing.js` (separate from engine locales).

## 6. Architecture Facts

### Backend / DB / auth

- **No traditional app backend/database/auth** for gameplay saves (localStorage only).
- **Exception:** [`tools/groq_proxy.py`](tools/groq_proxy.py) — static file server + `POST /api/chat` to Groq (key in `.env`). Exists: True.
- `.env.example` present: True.

### localStorage keys (searched in .js/.html/.mjs/.ts)

Direct `localStorage.(get|set|remove)Item('...')` literals **plus** every `storageKey` / `localeKey` string found in `games/*/manifest.js` and landing unlock/locale keys:

- `gyanquest-locale` (landing language)
- `gq-unlock-all-books` (landing unlock-books toggle)
- `gq-chemistry-lab-save-v1` / `gq-chemistry-lab-locale` (Chemistry uses save-v1; most others use save-v2)

Also from codebase scan:
- `gq-ai-lab-locale`
- `gq-ai-lab-save-v2`
- `gq-astronomy-space-locale`
- `gq-astronomy-space-save-v2`
- `gq-backend-builder-locale`
- `gq-backend-builder-save-v2`
- `gq-bio-explorer-locale`
- `gq-bio-explorer-save-v2`
- `gq-calculus-analysis-locale`
- `gq-calculus-analysis-save-v2`
- `gq-civil-basics-locale`
- `gq-civil-basics-save-v2`
- `gq-cyber-shield-locale`
- `gq-cyber-shield-save-v2`
- `gq-data-science-locale`
- `gq-data-science-save-v2`
- `gq-database-sql-locale`
- `gq-database-sql-save-v2`
- `gq-discrete-math-locale`
- `gq-discrete-math-save-v2`
- `gq-eco-guardian-locale`
- `gq-eco-guardian-save-v2`
- `gq-electrical-basics-locale`
- `gq-electrical-basics-save-v2`
- `gq-electronics-robotics-locale`
- `gq-electronics-robotics-save-v2`
- `gq-force-fighter-locale`
- `gq-force-fighter-save-v2`
- `gq-genetics-biotech-locale`
- `gq-genetics-biotech-save-v2`
- `gq-geology-earth-locale`
- `gq-geology-earth-save-v2`
- `gq-geometry-trig-locale`
- `gq-geometry-trig-save-v2`
- `gq-green-tech-locale`
- `gq-green-tech-save-v2`
- `gq-human-anatomy-locale`
- `gq-human-anatomy-save-v2`
- `gq-ict-fundamentals-locale`
- `gq-ict-fundamentals-save-v2`
- `gq-math-quest-locale`
- `gq-math-quest-save-v2`
- `gq-mechanical-basics-locale`
- `gq-mechanical-basics-save-v2`
- `gq-ml-lab-locale`
- `gq-ml-lab-save-v2`
- `gq-networking-internet-locale`
- `gq-networking-internet-save-v2`
- `gq-os-hardware-locale`
- `gq-os-hardware-save-v2`
- `gq-statistics-probability-locale`
- `gq-statistics-probability-save-v2`
- `gq-web-dev-studio-locale`
- `gq-web-dev-studio-save-v2`

### Voice / audio

| Game | imports engine voice.js | audio files under game (excl _legacy3d) |
|------|-------------------------|----------------------------------------|
| ai-lab | False | 0 |
| astronomy-space | False | 0 |
| backend-builder | False | 0 |
| bio-explorer | False | 0 |
| calculus-analysis | False | 0 |
| chemistry-lab | False | 0 |
| civil-basics | False | 0 |
| cyber-shield | False | 0 |
| data-science | False | 0 |
| database-sql | False | 0 |
| discrete-math | False | 0 |
| eco-guardian | False | 0 |
| electrical-basics | False | 0 |
| electronics-robotics | False | 0 |
| force-fighter | False | 0 |
| genetics-biotech | False | 0 |
| geology-earth | False | 0 |
| geometry-trig | False | 0 |
| green-tech | False | 0 |
| human-anatomy | False | 0 |
| ict-fundamentals | False | 0 |
| math-quest | False | 0 |
| mechanical-basics | False | 0 |
| ml-lab | False | 0 |
| networking-internet | False | 0 |
| os-hardware | False | 0 |
| statistics-probability | False | 0 |
| web-dev-studio | False | 0 |

- If `imports_voice` is false and audio_count is 0, narration is **not wired** in the live boot path (coach text UI may still exist).

## 7. Known Inconsistencies / Tech Debt

- Landing still markets **3D** in places; live labs are Canvas **2D** with `_legacy3d` archives.
- `index.html` static gamesLead vs `landing.js` COPY.en gamesLead disagree until JS runs.
- Many manifests still list **playgroundGroups / assetKeys** from 3D stamp era; playground often removed from boot-l1.
- Chemistry (and possibly others) may still contain unused `curriculum.js` / 3D-oriented keys while boot-l1 is Canvas.
- Book unlock depends on `gq-unlock-all-books` + optional `?unlockBooks=1`; localhost vs 127.0.0.1 split localStorage.
- Groq API may fall back locally when Cloudflare/network blocks (`tools/groq_proxy.py`).
- Stamp/generic deepen quality varies; STATUS column uses file heuristics (size, mounts, playable flag) — gold Chem/ICT/Eco books hand-tuned.
- Force Fighter physics hint leftovers were cleaned from some games earlier; re-verify if any boot still mentions inertia outside Force.

## 8. Summary Table

| Game | # Levels REAL | # Levels TEMPLATE | # Levels STUB | # Levels MISSING | Notes |
|------|---------------|-------------------|---------------|------------------|-------|
| ai-lab | 2 | 0 | 8 | 0 | playableMeta=2; books=2; curriculum.js=N |
| astronomy-space | 2 | 0 | 8 | 0 | playableMeta=2; books=2; curriculum.js=N |
| backend-builder | 3 | 0 | 7 | 0 | playableMeta=3; books=3; curriculum.js=N |
| bio-explorer | 3 | 0 | 7 | 0 | playableMeta=3; books=3; curriculum.js=N |
| calculus-analysis | 1 | 0 | 9 | 0 | playableMeta=1; books=1; curriculum.js=N |
| chemistry-lab | 3 | 0 | 7 | 0 | playableMeta=3; books=3; curriculum.js=Y |
| civil-basics | 1 | 0 | 9 | 0 | playableMeta=1; books=1; curriculum.js=N |
| cyber-shield | 1 | 0 | 9 | 0 | playableMeta=1; books=1; curriculum.js=N |
| data-science | 1 | 0 | 9 | 0 | playableMeta=1; books=1; curriculum.js=N |
| database-sql | 2 | 1 | 7 | 0 | playableMeta=3; books=3; curriculum.js=N |
| discrete-math | 1 | 0 | 9 | 0 | playableMeta=1; books=1; curriculum.js=N |
| eco-guardian | 1 | 0 | 9 | 0 | playableMeta=1; books=1; curriculum.js=N |
| electrical-basics | 2 | 1 | 7 | 0 | playableMeta=3; books=3; curriculum.js=N |
| electronics-robotics | 1 | 0 | 9 | 0 | playableMeta=1; books=1; curriculum.js=N |
| force-fighter | 3 | 0 | 7 | 0 | playableMeta=3; books=3; curriculum.js=N |
| genetics-biotech | 1 | 0 | 9 | 0 | playableMeta=1; books=1; curriculum.js=N |
| geology-earth | 1 | 0 | 9 | 0 | playableMeta=1; books=1; curriculum.js=N |
| geometry-trig | 1 | 1 | 8 | 0 | playableMeta=2; books=2; curriculum.js=N |
| green-tech | 1 | 0 | 9 | 0 | playableMeta=1; books=1; curriculum.js=N |
| human-anatomy | 2 | 0 | 8 | 0 | playableMeta=2; books=2; curriculum.js=N |
| ict-fundamentals | 3 | 0 | 7 | 0 | playableMeta=3; books=3; curriculum.js=N |
| math-quest | 2 | 0 | 8 | 0 | playableMeta=2; books=2; curriculum.js=N |
| mechanical-basics | 3 | 0 | 7 | 0 | playableMeta=3; books=3; curriculum.js=N |
| ml-lab | 1 | 0 | 9 | 0 | playableMeta=1; books=1; curriculum.js=N |
| networking-internet | 1 | 0 | 9 | 0 | playableMeta=1; books=1; curriculum.js=N |
| os-hardware | 1 | 0 | 9 | 0 | playableMeta=1; books=1; curriculum.js=N |
| statistics-probability | 2 | 0 | 8 | 0 | playableMeta=2; books=2; curriculum.js=N |
| web-dev-studio | 3 | 0 | 7 | 0 | playableMeta=3; books=3; curriculum.js=N |

_STATUS heuristic: playable+deep mounts+10 runners+size→REAL; stamp markers→TEMPLATE; playable:false→STUB; missing level file for playable→MISSING. This is verified against files but REAL vs high-quality-generated deepen is not a human editorial grade._
