# GyanQuest — Google Stitch screen brief

Use this file to remake every **usable** product screen in [Google Stitch](https://stitch.withgoogle.com). It is written from the **live app** (`index.html`, `engine/`, `games/*/`, `games/3d-lab/`, `backend/app/Filament/`).

**Platform:** every screen is **web desktop**. Do not generate mobile, tablet, or phone artboards. Stitch device type is always `DESKTOP`.

**Color:** keep the **live GyanQuest palette** (deep teal night, mango-leaf green, marigold). Do not replace it with cream paper, indigo uniforms, terracotta, or any other “school notebook” theme — that reads generic. Layout and craft can change; **tokens do not**.

---

## 1. The count

**32 unique usable screens** to generate in Stitch.

That is the number of **distinct layouts** a learner, parent, or admin actually uses. It is **not** 28 games, and it is **not** 280 missions.

| Bucket | Count | Names |
|--------|------:|-------|
| Public / student chrome | 4 | Landing, Account, Mission Hub, Mission Play |
| Pedagogy overlays | 6 | Recall, Objective, Predict, Reflect, Level complete, Reset confirm |
| Lab activity cards (sit inside Mission Play) | 9 | Intro, Drag-sort, Quiz, Myth cards, Equation, Order, Fluency drill, Heat lab, Reveal |
| Book + tutor | 4 | Book cover, Book spread, Tutor chat, Concept constellation |
| 3D Specimen Lab | 4 | Viewer, Pin editor, Loading, WebGL fail |
| Admin (Filament) | 5 | Login, Dashboard, Pending approvals, Students, Student detail |
| **Total unique screens** | **32** | |

**Artboards:** **32 desktop web screens.** No mobile companions. No second breakpoint set.

### What is *not* a unique screen

Do **not** generate these as separate Stitch screens:

- **28 subject games** — they all share Mission Hub + Mission Play. Only the title, coach name, emoji/icon, canvas scene, and card copy change. Design **Chemistry Lab** as the exemplar; then restyle accents, not layout.
- **280 missions × 10 steps** — same 10-step spine, different copy. Design the 9 activity **types**, not every step.
- `_qa-jump.html`, `_legacy3d/`, `Tahsan/` showcase, vendor, Filament default settings pages.
- Tiny toasts (“On a roll!”, “Book locked”) — specify them as **states** on Hub / Play, not full screens.
- The current Stitch folder mocks.

### The 28 games (content skins of Hub + Play)

Use these names on Landing and Hub. Status is from live catalog + `FINISHED_SET`.

**Core sciences**

| Game | Hook | Catalog status |
|------|------|----------------|
| Force Fighter | Push, pull, friction & gravity | Playable |
| Chemistry Lab | Atoms, bonds, reactions | Playable |
| Bio Explorer | Cells, ecosystems, body systems | Playable |
| Math Quest | Numbers, algebra, patterns | Playable |
| Eco Guardian | Climate, resources, sustainability | Playable |

**Computer science & technology**

| Game | Hook | Catalog status |
|------|------|----------------|
| ICT Fundamentals | Digital literacy & tools | Playable |
| Web Dev Studio | HTML, CSS, JavaScript | Playable |
| Backend Builder | APIs, servers, Node & Laravel ideas | Playable |
| Database & SQL | Tables, queries, design | Playable |
| Networking & Internet | Packets, DNS, the web stack | Under Development |
| Cyber Shield | Safety, encryption, threats | Under Development |
| OS & Hardware | Processes, memory, machines | Under Development |
| Artificial Intelligence | Agents, prompts, ethics | Playable |
| Machine Learning | Models, training, data | Playable |
| Data Science | Stats, charts, insight | Under Development |

**Engineering & applied science**

| Game | Hook | Catalog status |
|------|------|----------------|
| Electrical Basics | Circuits, current, voltage | Playable |
| Mechanical Basics | Forces, machines, motion | Playable |
| Civil Basics | Structures, loads, materials | Playable |
| Electronics & Robotics | Sensors, code, builds | Under Development |
| Green Tech | Solar, wind, sustainable power | Under Development |

**Advanced sciences**

| Game | Hook | Catalog status |
|------|------|----------------|
| Astronomy & Space | Planets, orbits, cosmos | Playable |
| Geology & Earth | Rocks, plates, time | Under Development |
| Human Anatomy & Health | Organs, wellness, care | Under Development |
| Genetics & Biotech | DNA, inheritance, CRISPR ideas | Under Development |

**Mathematics extended**

| Game | Hook | Catalog status |
|------|------|----------------|
| Statistics & Probability | Chance, distributions, data | Playable |
| Geometry & Trigonometry | Shapes, angles, proofs | Under Development |
| Calculus & Analysis | Rates, areas, change | Under Development |
| Discrete Math & Logic | Sets, graphs, algorithms | Under Development |

Plus a separate product: **3D Specimen Lab** (not one of the 28; linked from Landing vision).

---

## 2. How to use this in Google Stitch

Official Stitch rule: **lock the theme first**, then generate screens with **layout + content only**. Do not put hex codes or font names in each screen prompt, or Stitch will fight itself.

1. Create a new Stitch project named **GyanQuest**.
2. Open **Edit Theme** and paste / lock the tokens in §4 (or upload that block as `DESIGN.md`).
3. Generate screens **in the order in §8** so later screens can say “copy the header from Mission Hub.”
4. In Stitch, set **device = Desktop / Web** for every screen. Never Mobile, never Tablet.
5. Paste the **Stitch prompt** under each screen. Each prompt already says `PLATFORM: Web, Desktop`.
6. After 4–5 screens, multi-select them and prompt: *Make the top header, logo mark, language control, and stamp badges identical across all selected screens.*
7. Do **not** import old Stitch folder **layouts**. Do **lock** the live color/type tokens from §4.

Prompt shape Stitch wants (3 layers, already filled in below):

1. **Anatomy** — structure
2. **Vibe** — only if theme is *not* locked; once theme is locked, skip vibe/colors
3. **Content** — real GyanQuest copy, not lorem

---

## 3. Design intelligence used (and what it changes)

Checked the highest-star Claude UI/UX skills and applied them to this product, not as decoration.

| Skill | Why it matters here |
|-------|---------------------|
| [Anthropic Frontend Design](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/frontend-design) | Spend boldness on **layout signatures** (10-bead rail, wet-asphalt cards, marigold pressable CTAs), not on inventing a new palette. Cream-paper + indigo + terracotta is the generic “school” swap — **do not use it**. Keep live GyanQuest color. |
| [UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | Accessibility, 44px targets, no emoji-as-chrome-icons, **desktop web layouts**, 16px body, visible labels, predictable back. |
| [Interface Design](https://github.com/Dammyjay93/interface-design) | Hub, Play, Admin: one focal point. Token names from this product (`--gq-bg`, `--gq-primary`, `--gq-secondary`), hierarchy via weight. |
| [Google Stitch generate-design](https://github.com/google-labs-code/stitch-skills) | Theme at project level; screen prompts = structure + real content. **DESKTOP only.** |

### Intent (Interface Design: who / verb / feel)

- **Who:** A Class 6–10 student in Bangladesh on a **computer / browser window** (lab PC, teacher laptop, or home desktop). A teacher may glance over the shoulder. English and বাংলা must never mix on one chrome.
- **Verb:** Pick a subject → pick a mission → finish **10 hands-on steps** → optionally read the **8-page book** and ask the tutor.
- **Feel:** **Monsoon Lab** — humid dusk, wet-asphalt panels, mango-leaf green for live/growth, marigold for the quest button. National science club at night, not a cream edtech template, not a toy cartoon, not Filament-as-the-game.

### Product domain (do not design generic “edtech”)

Territory: monsoon sky, wet asphalt, mango leaf, marigold / rickshaw-gold highlight, salt/ice/steam kitchen science, brass pins on a specimen, NCTB mission language. The **color world is already decided** in `css/design-tokens.css`.

**Signature (one thing this product is remembered by):** a **10-bead step rail** — ten large clickable beads in a row. Tiny 10px dots are forbidden. Status marks are **lab stamps** (Playable / Under Development / Coming Soon / Done / Locked), not bland SaaS pills.

### Defaults we reject on purpose

1. **Cream / kraft / indigo / vermillion “exercise book”** — generic AI school look. Forbidden.
2. Cream landing + terracotta serif “wellness” template.
3. Broadsheet / hairline newspaper layout.
4. Emoji as the only chrome icon (⚗️ on catalog cards is content, not the nav).
5. 28 different visual identities per subject.
6. Mobile / phone chrome, bottom nav, stacked single-column lab, full-width sheets.

### Aesthetic risk (Frontend Design: spend boldness in one place)

**Keep the live palette. Make the 10-bead rail and marigold mechanical CTA the loud things.** Wet-asphalt card sheen, tight green glow on *live* items only, 2px offset on Play/Next. 3D Specimen Lab uses the same tokens; the canvas well is the dark surface, not a second brand.

---

## 4. Lock this in Stitch first (`DESIGN.md`)

Paste into Stitch theme. Screen prompts below assume this is already applied.

These tokens are the **live product** (`css/design-tokens.css`). Lock them. Do not “improve” them toward cream or indigo.

```yaml
---
name: GyanQuest
colors:
  surface: '#101413'
  surface-dim: '#101413'
  surface-bright: '#363a39'
  surface-container-lowest: '#0b0f0e'
  surface-container-low: '#181c1b'
  surface-container: '#1c201f'
  surface-container-high: '#272b2a'
  surface-container-highest: '#313635'
  on-surface: '#e0e3e1'
  on-surface-variant: '#bdcac0'
  inverse-surface: '#e0e3e1'
  inverse-on-surface: '#2d3130'
  outline: '#87948b'
  outline-variant: '#3e4942'
  surface-tint: '#71daa7'
  primary: '#71daa7'
  on-primary: '#003823'
  primary-container: '#35a373'
  on-primary-container: '#00311e'
  inverse-primary: '#006c47'
  secondary: '#f8bd45'
  on-secondary: '#412d00'
  secondary-container: '#bc8709'
  on-secondary-container: '#392600'
  tertiary: '#b5c9d8'
  on-tertiary: '#20333e'
  tertiary-container: '#8093a1'
  on-tertiary-container: '#192c37'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  background: '#101413'
  on-background: '#e0e3e1'
  surface-variant: '#313635'
typography:
  display-hero:
    fontFamily: Syne
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Syne
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  ui-action-lg:
    fontFamily: Sora
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.5'
    letterSpacing: 0.02em
  body-main:
    fontFamily: Sora
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  bengali-support:
    fontFamily: Noto Sans Bengali
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.8'
  label-caps:
    fontFamily: Sora
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-desktop: 64px
  container-max: 1280px
---
```

### Brand rules for Stitch (put in the DESIGN.md body)

**Brand & style.** GyanQuest is an offline-first library of school **mission games** for Bangladesh. Visual world: **Monsoon Lab** — deep teal night (`#101413`), wet-asphalt card sheen, mango-leaf green (`#71daa7`) for live/growth/Playable, marigold (`#f8bd45`) for quest actions. Chalk-white (`#e0e3e1`) for reading. This is the shipped palette. Do not swap it for cream paper, indigo, or terracotta.

**Color roles**

- Deep teal / surface (`#101413`) — page background.
- Chalk-white (`on-surface`) — all reading text.
- Mango-leaf green (`primary`) — live stamps, completed beads, success, focus, Playable.
- Marigold (`secondary`) — primary actions only: Play now, Log in, Send, Next step, Bust it. 2px bottom offset.
- Teal-grey containers — cards, docks, rails.
- Error coral (`#ffb4ab`) — fail states, reject, WebGL fail.
- Tight green/gold glow (5–10px) on *active* live items only — not a full-page neon wash.

**Type**

- **Syne** 700–800 for game titles, GYANQUEST wordmark, “Choose a mission.”
- **Sora** for buttons, coach, quizzes, data.
- **Noto Sans Bengali** whenever `lang=bn`. Line-height 1.8. Never mix EN and BN in the same chrome.
- 16px minimum body. Quiz options wrap; never shrink below 16px to fit.

**Shape**

- Cards: 8px. Buttons: 4px. Status stamps: pill.
- Primary (marigold) button: 2px bottom offset. Press = shift 2px down.
- 1–2px borders on tappable cards (`outline-variant`). Live cards get a green-tinted border.

**A11y (must show in mocks)**

- Click targets ≥ 44×44px (beads, chips, book terms, pin numbers) even on desktop.
- Visible focus ring (mango-leaf, 3px).
- Keyboard focus on every button.
- Alt text on book figures and logo.
- Contrast ≥ 4.5:1 for body on `#101413`. Marigold is for **filled buttons** (dark brown text on gold), not tiny gold-on-teal labels.
- `prefers-reduced-motion`: no page-flip animation; instant page swap.

**Icons**

- Simple line icons for chrome (book, missions, language, back). Subject cards may keep one emoji as **content** (catalog identity), not as the nav.

**Copy voice**

- Active, specific, kid-plain. “Play now,” “Finish 10 steps to open the book,” “Pass the fluency drill (80%) before Mastery.”
- Errors never apologize; they say what to do. Empty states invite an action.
- Same word for the same action everywhere (Play / Book / Next step / Try again).

---

## 5. Shared product rules (every student screen)

### Language

- Control: a single control that reads **বাংলা** when UI is English, and **English** when UI is Bangla.
- Strict mode: entire chrome swaps. Do not show mixed labels.

### Auth (optional)

- Offline play works without login.
- Register creates `role=student`, `status=pending` (must wait for admin).
- Login syncs progress when API is up.
- Landing host: **Log in** or truncated name + **Log out**.

### Progression (must be visible in Hub + Play)

- 10 missions per game. Mission N unlocks when mission N−1 has all 10 steps true.
- Each mission: 10 steps. Step 9 = Fluency drill (need ~80%). Step 10 = Mastery (blocked until fluency).
- Book unlocks when the mission’s 10 steps are done, **or** landing “Unlock books” is On.
- Hub badges: **Playable** / **Under Development** / **Coming Soon** / **Locked** (sequence) / **Done · {SOLO tier}**.
- SOLO names from stars, shown only on Done: unistructural, multistructural, relational, extended-abstract. Kids see a short stamp like **Done · relational**, not a lecture.

### Canonical 10-step spine (Bruner)

Use Chemistry Lab Mission 1 **Tiny Bits** as the exemplar labels:

1. Meet Tiny Bits  
2. Salt Crystal Pattern  
3. Sort: Matter or Not?  
4. Ice Melting Lab  
5. Why Steam Rises  
6. Name the Particle Rule  
7. Stretch: New Contexts  
8. Myth Bust  
9. Fluency Drill  
10. Tiny Bits Mastery  

### Canonical 8-page book spine

Even count for left/right spreads: Hook → Model → Mechanism → Representation → Mission map → Transfer → Myths → Mastery.

Glossary terms in the page body are **tappable**. Tap opens Tutor chat on that word (first tap = explain, later = follow-up).

### Shared student header (copy this)

Left: back **← GyanQuest** + game title (e.g. Chemistry Lab) + one-line subject (Atoms, bonds & reactions!).  
Right: language select, optional reward stamp, **☰ Missions** (hidden while already on Hub).

---

## 6. User journeys (so screens connect)

```
Landing
  ├─ Log in → Account modal → (pending note or signed-in name)
  ├─ Play now / Force Fighter card → Mission Hub
  ├─ Any of 28 game cards → same Hub template
  └─ Open the 3D Lab → Specimen Lab

Mission Hub
  ├─ Play (unlocked) → Pedagogy chain → Mission Play
  ├─ Play (locked) → toast: finish previous 10 steps
  ├─ Book (unlocked) → Book cover → spreads → term tap → Tutor
  └─ Book (locked) → toast: finish 10 steps or Unlock books on home

Mission Play
  ├─ 10 beads / Next step / Try again / Hint
  ├─ Fluency fail → stay on step 9; toast: 80% before Mastery
  ├─ Step 10 done → Level complete → Hub or next mission
  └─ ☰ Missions → Hub (save remembers inHub)

Admin /admin
  ├─ Login
  ├─ Dashboard stats
  ├─ Pending Approvals (approve / reject)
  └─ Students → Student detail (per-game progress)
```

---

## 7. The 32 screens

For each screen: **job**, **layout**, **real content**, **states**, **Stitch prompt**. After the theme is locked, paste only the prompt.

---

### 01 — Landing (Game library)

**Job.** Convince a student (or teacher) this is for Bangladesh, then get them into a game. Focal point: the **catalog**, not a fake 3-stat hero.

**Device.** Web desktop only (`DESKTOP`). Wide sticky header. Catalog is a multi-column grid.

**Layout**

```
[sticky header: logo GyanQuest | Games  Why  Vision | Log in | Unlock books: Off | বাংলা | Play now]
[hero: logo mark, GYANQUEST, tagline, 2-sentence lead, Play now + Explore games]
[catalog: 5 track headings, card grid of 28 games with stamp]
[why: 4 short pillars]
[vision: national sentence + 3D Specimen Lab callout]
[footer]
```

**Content (English)**

- Badge: Interactive learning for Bangladesh  
- H1: GyanQuest  
- Tagline: Learn. Level Up. Lead.  
- Lead: GyanQuest is a growing library of 2D mission games — বাংলা and English — that turn textbooks into labs you can touch on any phone.  
- Play now → Force Fighter  
- Catalog heading: Game library  
- Catalog lead: Twenty-eight live mission games — same shared engine, every subject playable.  
- Tracks: Core sciences · Computer science & technology · Engineering & applied science · Advanced sciences · Mathematics extended  
- Card: emoji, title, one-line hook, stamp (Playable / Under Development / Coming Soon)  
- Why: Learn by doing / বাংলা + English / Any device / National scale (see landing copy)  
- Vision: Digitalizing Bangladesh, one subject at a time  
- Specimen Lab: Open now · Inspect real models. Numbered pins. Tap to zoom and read. Place pins if a label sits off. CTA: Open the 3D Lab  
- Unlock books: Off | On (tells the truth: books open without finishing levels)

**States:** logged out vs name+Log out; Unlock books Off/On; BN locale; card stamps as in the 28-game table.

**Stitch prompt**

```
A marketing-plus-catalog home for GyanQuest, a Bangladesh school mission-game library. The page’s job is to get a Class 6–10 student into a game in the browser. Web desktop, wide dark lab page, sticky header. Use the locked GyanQuest theme (deep teal, mango-leaf green, marigold) — do not invent a cream or indigo palette.

PLATFORM: Web, Desktop

PAGE STRUCTURE:
1. Header: Left — square logo mark + wordmark “GyanQuest”. Center — text links Games, Why GyanQuest, Vision. Right — Log in, a small toggle “Unlock books: Off”, language button “বাংলা”, primary button “Play now”.
2. Hero: Small uppercase badge “Interactive learning for Bangladesh”. Logo. Huge wordmark. Tagline “Learn. Level Up. Lead.” Two sentences about 2D mission games in Bangla and English that turn textbooks into labs on any phone. Two buttons: Play now, Explore games. Do not use a big-number + three-stats template; if you show figures, make them quiet and secondary.
3. Primary: “Game library” with lead “Twenty-eight live mission games — same shared engine, every subject playable.” Five track sections. Each section is a heading plus a card grid. Every card has a subject emoji, title, one-line hook, and a rubber-stamp badge: Playable, Under Development, or Coming Soon. Include all 28 games listed in the brief (Force Fighter through Discrete Math). Playable cards look pressable; Coming Soon cards look stamped and quieter.
4. Why we outperform: four short pillars — Learn by doing; Bangla + English; Any device; National scale.
5. Vision block: “Digitalizing Bangladesh, one subject at a time” plus a nested callout for “3D Specimen Lab” with tag Open now and button “Open the 3D Lab”.
6. Footer: GyanQuest — Learn. Level Up. Lead. © ImpactX.

Focal point is the catalog. Signature: rubber-stamp badges on cards, not generic pills.
```

---

### 02 — Account (login / register)

**Job.** Optional account. Play offline anytime. Login syncs progress.

**Device.** Modal centered on the Landing desktop page. One artboard. Not a separate mobile screen.

**Layout:** dimmed backdrop over the landing; centered card ~420px; title; note; fields Name / Email / Password; message line; Close · Register · Log in.

**Copy**

- Title: GyanQuest account  
- Note: Optional — play offline anytime. Login syncs progress when the API is running.  
- Placeholders: Your name · you@example.com · dots  
- Success: Signed in.  
- Errors: real API message, or “Login failed”  
- After register: student is **pending** until admin approves — show that clearly if register succeeds without a token.

**States:** empty, signing in, error near fields, pending-approval, signed-in (this screen closes; header shows name).

**Stitch prompt**

```
A compact account dialog over the GyanQuest landing. Purpose: optional login/register. Offline play always works.

PLATFORM: Web, Desktop

PAGE STRUCTURE:
1. Dimmed full-page backdrop.
2. Center card, aria dialog “Account”. Header: “GyanQuest account” + close X.
3. Helper text: “Optional — play offline anytime. Login syncs progress when the API is running.”
4. Visible labels, not placeholder-only: Name (for register), Email, Password. Focus ring on inputs.
5. Live message area under fields (empty / Signing in… / error / pending approval).
6. Footer actions right-aligned: Close, Register, Log in (Log in is the primary stamp-red action).

Show the error state: “These credentials do not match” under the password field. Touch targets 44px.
```

---

### 03 — Mission Hub

**Job.** Choose one of 10 missions. Focal point: the **card grid**.

**Device.** Web desktop only. Multi-column card grid. Same header as Landing (back + game title + language).

**Layout**

```
[header: ← GyanQuest | Chemistry Lab / Atoms, bonds & reactions! | language]
[eyebrow pill: Chemistry Lab]
[title: Choose a mission]
[sub: 10 missions · 10 steps each. Finish one mission to unlock the next.]
[grid of 10 cards]
```

Each card:

- Top-right: **Book** or **Locked** (book control)
- Emoji
- Mission 1 … Mission 10
- Kid title + one-line hook
- Stamp: Playable / Under Development / Coming Soon / Locked / Done · relational

**Chemistry Lab exemplar cards**

| # | Title | Hook | Stamp (typical) |
|---|-------|------|-----------------|
| 1 | Tiny Bits | Salt, ice, and steam reveal tiny moving particles. | Playable |
| 2 | Element Hunt | Hunt pure substances and name the building blocks. | Playable |
| 3 | Bond Buddies | See how atoms link up as friends and families. | Playable |
| 4 | Mix & Match | Separate, dissolve, and sort everyday mixtures. | Coming Soon |
| 5 | Reaction Time | Watch matter rearrange when reactions fire. | Coming Soon |
| 6 | Acid & Base | Taste-safe clues for sour, soapy, and neutral. | Coming Soon |
| 7 | States of Matter | Solid, liquid, gas — same stuff, different motion. | Coming Soon |
| 8 | Periodic Path | Walk the table’s neighborhoods and patterns. | Coming Soon |
| 9 | Lab Safety | Gear up and keep the lab safe for everyone. | Coming Soon |
| 10 | Chem Boss | Synthesis / champion mission | Coming Soon |

(Force Fighter, Bio Explorer, Web Dev Studio also have 3 playable missions; others often 1. Visual pattern is the same.)

**States:** Mission 2 locked until Mission 1’s 10 steps are done; Book locked vs Book; Done stamp with SOLO name.

**Stitch prompt**

```
Mission picker for Chemistry Lab inside GyanQuest. Student must choose one of ten missions. Web desktop. Copy header language from the product: back to GyanQuest, game title, language select. No hamburger of extra nav. No phone column layout.

PLATFORM: Web, Desktop

PAGE STRUCTURE:
1. Header: “← GyanQuest”, brand “Chemistry Lab”, subtitle “Atoms, bonds & reactions!”, language select English/বাংলা.
2. Centered intro: small eyebrow “Chemistry Lab”, headline “Choose a mission”, sub “10 missions · 10 steps each. Finish one mission to unlock the next.”
3. Card grid, three columns. Ten cards.

Each card:
- Top-right small control “Book” (unlocked on Mission 1) or “Locked”.
- Large subject mark, “Mission 1” … “Mission 10”, kid title, one-line hook.
- Rubber-stamp: Playable, Under Development, Coming Soon, Locked, or Done · relational.
Missions 1–3 Playable (Tiny Bits, Element Hunt, Bond Buddies). Missions 4–10 Coming Soon and visually quieter. Mission 2 can be shown Locked with stamp “Locked” for the sequence state on a second artboard if needed.

Focal point: the play area of the first Playable card. Do not add a sidebar.
```

---

### 04 — Mission Play (lab chrome)

**Job.** Do the current step. Focal point: **canvas + current activity**, not the chrome.

**Device.** Web desktop only. Split stage: canvas left (~40%), coach dock right (~60%). Never stack canvas above dock.

**Chrome (always)**

- Same header as Hub, plus **☰ Missions**
- Row: mission title “Mission 1: Tiny Bits”
- Progress bar + “N steps left”
- **10-bead rail:** beads 1–10, done = mango-leaf fill, current = mango-leaf ring, locked = empty. Each bead is large and clickable — never shrink to 10px dots. All ten beads visible in one row on desktop.
- Stage: 2D lab canvas (placeholder illustration of salt/ice/steam, not a blank grey box) + live caption
- Coach dock: avatar mark, **Coach Molecule**, coach sentence, Next / hide panel / Try again
- Dock body: the activity card (screens 11–19)
- Footer: scores, Reset all, Hint, Next step

**Coach examples:** “Everything you can touch (and even air) is made of tiny moving particles.” After 3 correct: “You're on a roll — nice streak!” After 2 wrong: “Here's a simpler take: slow down, eliminate one wrong option, then try again.”

**Collapsed dock (desktop):** dock becomes a 52px strip so the canvas dominates.

**Stitch prompt**

```
In-mission lab for GyanQuest Chemistry Lab, Mission 1 Tiny Bits, step 3 of 10. The student sorts matter vs not-matter while a 2D lab canvas plays. This screen is the chrome; the activity card sits in the coach dock.

PLATFORM: Web, Desktop

PAGE STRUCTURE:
1. Header: ← GyanQuest, Chemistry Lab, language, ☰ Missions.
2. Title row: “Mission 1: Tiny Bits”. Thin progress bar. Label “7 steps left”.
3. Signature 10-bead step rail, all ten beads in one row. Beads 1–2 filled (done), bead 3 current with a strong ring, 4–10 empty. Labels can appear on the current bead only: “Sort: Matter or Not?”. Beads are large, not tiny dots.
4. Stage: left canvas well showing a simple 2D lab scene (salt, ice, cup) with a live caption. Right coach dock. Do not stack them vertically.
5. Coach dock header: coach mark, name “Coach Molecule”, one coach sentence, buttons Next, “−” hide panel, “Try again”.
6. Dock body: a task card (leave a clearly labeled activity card region; quiz/chips will be detailed in other screens).
7. Footer: Reset all, Hint, primary “Next step ▶”.

Focal point: canvas + current bead. One marigold primary button only (Next step).
```

Generate a **second artboard** of this screen with dock collapsed (desktop) if you need it — same IDs, not a new product screen.

---

### 05 — Quick recall (pre-mission)

**Job.** Remind 3 glossary terms from the concept log, then continue.

**Layout:** overlay card on Mission Play (dimmed). Eyebrow Quick recall. H3 Remember these? List of 3 terms + subject. Continue.

**Example terms:** particle · molecule · lattice

**Stitch prompt**

```
A modal overlay on the mission-play lab. Pre-mission “Quick recall”.

PLATFORM: Web, Desktop

PAGE STRUCTURE:
Centered card over a dimmed lab. Eyebrow “Quick recall”. Heading “Remember these?”. Three list rows, each a bold term and a muted subject (Chemistry Lab / Tiny Bits). One primary button “Continue”. No extra links. Large tap target.
```

---

### 06 — Objective compass (pre-mission)

**Job.** Show the mission objective and Bangladesh everyday hook.

**Copy (Tiny Bits)**

- Eyebrow: Objective compass  
- H3: Tiny Bits  
- Objective: By the end of this mission, you'll be able to explain particles of matter in your own words.  
- BD hook: Bangladesh everyday: notice particles of matter around you — then connect it to Tiny Bits.  
- Coach line repeats the hook.  
- Button: Got it  

**Stitch prompt**

```
Pre-mission objective overlay on the lab.

PLATFORM: Web, Desktop

PAGE STRUCTURE:
Centered card. Eyebrow “Objective compass”. Title “Tiny Bits”. Body objective sentence. Secondary everyday hook about Bangladesh kitchens (salt, ice, steam). Small coach quote. Primary “Got it”.
```

---

### 07 — Predict (pre-mission)

**Job.** Force a prediction before play. Saves option index.

**Copy**

- Eyebrow: Predict  
- Q: Before we start — what do you think matters most in Tiny Bits?  
- Options (full-width buttons): Guessing without checking · Looking for a clear pattern or rule · Skipping the practice steps  

**Stitch prompt**

```
Pre-mission predict overlay. Student taps one of three choices. No submit button — the option is the action.

PLATFORM: Web, Desktop

PAGE STRUCTURE:
Card. Eyebrow “Predict”. Question as heading. Three stacked option buttons, 44px+ tall, wrapping text allowed. Do not use radio + separate Continue.
```

---

### 08 — Predict → Reflect (post-mastery)

**Job.** Compare early prediction to what they can now teach.

**Copy**

- Eyebrow: Predict → Reflect  
- H3: What you thought vs what you know  
- Your prediction: option **2**.  
- What you know now: re-read the mission rule step — you can teach it in one clear sentence.  
- Continue  

**Stitch prompt**

```
Post-mission reflect overlay after mastery.

PLATFORM: Web, Desktop

PAGE STRUCTURE:
Card. Eyebrow “Predict → Reflect”. Heading “What you thought vs what you know”. Two short paragraphs: prediction was option 2; now they can teach the rule in one sentence. Primary Continue.
```

---

### 09 — Level complete (mission gate)

**Job.** Celebrate 10/10 and send them to the next mission or back to Hub.

**Copy**

- Title: Level 1 complete / All 10 steps complete  
- Body: You finished all 10 guided blocks for this mission. When you are ready, open the next course block.  
- Next mission: Element Hunt  
- Buttons: Back to missions · Begin Level 2  
- Reward stamp: Tiny Rookie (stars → SOLO name)

**Stitch prompt**

```
Mission-complete gate after Chemistry Lab Tiny Bits.

PLATFORM: Web, Desktop

PAGE STRUCTURE:
Centered celebration card on the lab. Stamp-like badge “Tiny Rookie” and “Done · relational”. Heading “All 10 steps complete”. Short body. Next mission name “Element Hunt”. Two actions: Back to missions (ghost), Begin Level 2 (primary).
```

---

### 10 — Reset confirm

**Job.** Dangerous reset of all 10×10 progress.

**Copy**

- Reset everything?  
- This clears all missions, step checkmarks, badges, and saved place. You will start again at Level 1, Step 1.  
- This cannot be undone.  
- Keep my progress · Yes, reset all  

**Stitch prompt**

```
Destructive confirm dialog.

PLATFORM: Web, Desktop

PAGE STRUCTURE:
Dialog. Title “Reset everything?”. Two sentences of consequences. “This cannot be undone.” Actions: Keep my progress (primary safe), Yes, reset all (danger, not the default).
```

---

### 11 — Activity: Intro / tap continue

**Job.** Read a short hook, look at the canvas, tap Continue.

**Copy example**

- Title: Meet Tiny Bits  
- Body: Everything you can touch (and even air) is made of tiny moving particles. We start with salt, ice, and steam.  
- Everyday: Salt grains next to the oil bottle · Ice melting in a cup · Steam rising above a hot pan  
- Continue  

**Stitch prompt**

```
Coach-dock activity card for an intro step. This card sits in the right dock of Mission Play. Do not redesign the whole app chrome; show the card clearly, optionally with a cropped lab behind it. Web desktop.

PLATFORM: Web, Desktop

PAGE STRUCTURE:
Card titled “Meet Tiny Bits”. Short paragraph. Three everyday examples as a small list. Primary Continue. Optional demo badge “Example / demonstration”.
```

---

### 12 — Activity: Drag-sort

**Job.** Put chips into two (or more) zones. Canvas and chips stay in sync.

**Copy example (step 3)**

- Title: Sort: Matter or Not?  
- Hint: Drag on the canvas or use chips here — both stay in sync.  
- Zones: Matter · Not matter  
- Chips: salt · ice · steam · light · idea · song  
- Status: 0 of 6 placed  
- Place here on each zone (keyboard/touch fallback)  
- Reset sort  

Wrong drop: “That label doesn't belong here.” Right: “Nice sorting!”

**Stitch prompt**

```
Hands-on sort activity card inside the GyanQuest coach dock.

PLATFORM: Web, Desktop

PAGE STRUCTURE:
Card title “Sort: Matter or Not?”. Hint about drag on canvas or chips. Two drop zones with labels Matter / Not matter and a “Place here” button under each. A chip bank of six wrapping chips. Status “2 of 6 placed”. Reset sort. Chips 44px tall. Selected chip looks pressed.
```

---

### 13 — Activity: Quiz

**Job.** Pick the best answer. Wrong stays enabled (try again). Right auto-advances after a short beat.

**Copy example**

- Title: Check  
- Q: What is the same about salt, ice, and steam?  
- Options: They are all tiny moving particles of matter · Only ice is matter · Steam is not made of particles  
- Status: empty / Not quite — watch the canvas and try again. / Yes!  

**Stitch prompt**

```
Single-question quiz card in the coach dock.

PLATFORM: Web, Desktop

PAGE STRUCTURE:
Title “Check”. Question. Three full-width option buttons that wrap. Status line for wrong/right. Show one option in a “not quite” error state and the status text. Do not use tiny radio rows.
```

---

### 14 — Activity: Myth cards

**Job.** Conceptual change: claim → bust.

**Copy**

- Badge: Myth 1 of 3  
- Claim: “Steam is empty air, not matter.”  
- What do you think?  
- Sounds true · Bust it — it's false  
- After bust: short truth + Next myth  

**Stitch prompt**

```
Myth-bust activity card.

PLATFORM: Web, Desktop

PAGE STRUCTURE:
Badge “Myth 1 of 3”. Heading. Strong claim sentence. Two choices: Sounds true (secondary), Bust it — it's false (primary). Status area. Hidden-until-ready “Next myth” primary.
```

---

### 15 — Activity: Equation / name the rule

**Job.** Drag tiles onto a rail in the correct order (symbolic step).

**Copy**

- Title: Build the idea / Name the Particle Rule  
- Hint: Drag the tiles onto the rail in the correct order.  
- Tiles: matter · is made of · tiny · moving · particles  
- Locked in! / Order isn't right yet.  

**Stitch prompt**

```
Tile-equation builder in the coach dock.

PLATFORM: Web, Desktop

PAGE STRUCTURE:
Title “Name the Particle Rule”. Hint. A horizontal rail with empty slots. A bank of five tiles. Check/lock feedback line. Large tiles, no tiny tokens.
```

---

### 16 — Activity: Order steps

**Job.** Reorder a cause → effect story.

**Copy**

- Title: Put the steps in order  
- Hint: Drag tiles to reorder the story.  
- Check order  
- Perfect sequence. / Not yet. Think cause → effect.  

**Stitch prompt**

```
Ordered-steps activity card.

PLATFORM: Web, Desktop

PAGE STRUCTURE:
Title “Put the steps in order”. Numbered stack of 4–5 reorderable rows with drag handles. Check order button. Status line.
```

---

### 17 — Activity: Fluency drill (step 9)

**Job.** Rapid quiz. Need 80% to continue. Gate for Mastery.

**In-progress copy**

- Badge: Q 3 / 8  
- Question + options (same pattern as quiz)

**Result copy**

- Drill passed! / Almost — review & retry  
- You scored 7 of 8 (88%).  
- Need 80% to continue.  
- Continue / Retry drill  

If they try to skip to step 10: toast **Pass the fluency drill (80%+) before Mastery.** Coach: **Mastery is locked until fluency hits 80%.**

**Stitch prompt**

```
Fluency drill card, result state after a pass.

PLATFORM: Web, Desktop

PAGE STRUCTURE:
Card “Drill passed!”. Score 7 of 8 (88%). One sentence. Continue primary, Retry drill secondary. Small note: Mastery stays locked under 80%.
```

Also generate the **in-question** state if you want both artboards (same screen).

---

### 18 — Activity: Heat / scale lab

**Job.** Move a slider until a threshold; canvas shows ice → water → steam.

**Copy**

- Title: Ice Melting Lab  
- Slider: Heat  
- Readouts: still ice / melting / steam rising  
- Continue enabled only when heat is high enough  

**Stitch prompt**

```
Lab-control activity with a large heat slider.

PLATFORM: Web, Desktop

PAGE STRUCTURE:
Title “Ice Melting Lab”. One labeled range input occupying full width. Live readout “Steam rising”. Primary Continue enabled. Touch-friendly slider.
```

---

### 19 — Activity: Reveal steps

**Job.** Reveal examples one at a time (iconic).

**Copy**

- Reveal next example / Continue when done  
- Step counter  

**Stitch prompt**

```
Reveal-next activity card.

PLATFORM: Web, Desktop

PAGE STRUCTURE:
Title “Why Steam Rises”. A large example panel (captioned photo or diagram). Caption. Button “Reveal next example”. Counter “2 / 4”.
```

---

### 20 — Digital book — cover

**Job.** Open the mission book. Focal point: cover art + title.

**Layout:** full-screen backdrop; centered book cover (portrait); eyebrow “particles of matter”; title Tiny Bits; “Tap the cover to open”; Close; nav: Prev disabled, label Cover — tap to open, Open.

**Stitch prompt**

```
Full-screen digital book cover for Chemistry Lab mission Tiny Bits.

PLATFORM: Web, Desktop

PAGE STRUCTURE:
Dimmed backdrop. Centered closed-book cover with a real-science photo (salt crystals), not a stock 3D book mock. Eyebrow “particles of matter”. Title “Tiny Bits”. Hint “Tap the cover to open”. Close control. Bottom nav: Prev disabled, label “Cover — tap to open”, button Open.
```

---

### 21 — Digital book — spread

**Job.** Read two pages, no page scroll. Tap glossary terms. Optional photo carousel.

**Layout:** left page + spine + right page. Page numbers 1 and 2. Nav: Prev · Pages 1–2 of 8 · Next. Close.

**Page 1 (hook):** title Why Tiny Bits?; carousel figure (salt microscope); 3 short paragraphs. Terms **particle** and **molecule** look tappable (underline + stamp color, not tiny red).

**Page 2 (model):** Solid, liquid, gas; large figure; short copy.

**Stitch prompt**

```
Open digital book spread, pages 1–2 of 8, GyanQuest Tiny Bits. Pages do not scroll; content is a fixed two-page spread. Always dual-page on this desktop artboard. Never a single stacked page.

PLATFORM: Web, Desktop

PAGE STRUCTURE:
Backdrop. Close. Book shell with left page and right page and a thin spine. Left: “Why Tiny Bits?” plus a two-slide photo carousel (salt under microscope) and three short paragraphs. The words particle and molecule are clearly tappable glossary marks. Right: “Solid, liquid, gas” with a large figure and two short paragraphs. Page numbers 1 and 2. Bottom nav Prev, “Pages 1–2 of 8”, Next. Generous margins like a real textbook. No browser scrollbar on the page bodies.
```

---

### 22 — Tutor chat

**Job.** Explain hard words simply. Opens from FAB **Ask** or from a book term.

**Layout:** FAB bottom-right “Ask”. Open panel: header GyanQuest Tutor / “Ask anything — or tap a red word in the book” / Close. Message list (bot + user). Input + Send.

**First bot line:** Hi! I explain hard words and ideas simply. Tap a red word in a mission book, or ask me anything.

**Term-open example:** user bubble “particle” then bot explanation in simple English (or BN if UI is BN).

**States:** busy (Send disabled, bot typing); timeout fallback still shows a simple local explanation.

**Stitch prompt**

```
Floating tutor chat for GyanQuest, open state, over a dimmed book.

PLATFORM: Web, Desktop

PAGE STRUCTURE:
Floating panel, bottom-right of the desktop window (not a full-width phone sheet). Header: “GyanQuest Tutor”, sub “Ask anything — or tap a word in the book”, Close. Message thread: bot welcome, user “particle”, bot short explanation of particle in kid English. Composer: text field “Type a question...”, Send primary. Large send control. Do not make it look like a generic AI SaaS chatbot with sparkle logos.
```

---

### 23 — Concept constellation

**Job.** Show terms the student has explored; mention terms shared across subjects.

**Copy**

- Title: Concept constellation  
- Terms you explored. Shared across subjects: energy, particle (or “none yet”)  
- Nodes as stamps/chips  
- Empty: Explore book words to grow your map.  
- Close  

**Stitch prompt**

```
Overlay map of glossary terms the student has tapped.

PLATFORM: Web, Desktop

PAGE STRUCTURE:
Dialog. Title “Concept constellation”. One sentence about shared terms. A cluster of term nodes (particle, molecule, force, energy…) not a generic org-chart. Close. Empty-state variant: “Explore book words to grow your map.”
```

---

### 24 — Specimen Lab — viewer

**Job.** Orbit a real 3D specimen, tap numbered pins, read the callout.

**Device.** Web desktop only. Three-pane lab: catalog rail | 3D well | parts sheet. Catalog is always visible — no drawer.

**Layout**

```
[header: GyanQuest / Specimen Lab | specimen name | Specimens | বাংলা | Games]
[left rail: Specimens title, subject tabs, list]
[center well: 3D canvas, numbered pins, callout, hint, Reset view, Show all]
[right sheet: credit, Parts list]
```

**Subjects:** All · Anatomy · Biology · Chemistry · Space · Machines · Instruments · Math  

**Exemplar specimen:** Animal cell — Organelles of a typical animal cell. Credit: Lauri Purhonen · CC-BY.

**Hint:** Drag to orbit · Scroll to zoom · Tap a number  

**Parts:** numbered list; tap focuses the same pin.

**Stitch prompt**

```
GyanQuest 3D Specimen Lab, Animal cell selected. Desktop three-pane lab. Dark well for the model; header and side panels use the same locked GyanQuest theme (deep teal, mango-leaf, marigold) — not a cream or indigo chrome.

PLATFORM: Web, Desktop

PAGE STRUCTURE:
1. Header: logo + “GyanQuest” / “Specimen Lab”, centered specimen title “Animal cell”, actions Specimens, বাংলা, Games.
2. Left rail: heading Specimens, hint “Pick a model. Numbers on it are parts — tap one to zoom.” Subject tabs (All, Anatomy, Biology…). Scrollable list of specimens; Animal cell selected.
3. Center: large 3D well with a cell model, numbered pin markers 1–8, a callout card “1 Nucleus” plus a two-sentence body, orbit hint, tools Reset view and Show all.
4. Right sheet: Sketchfab-style credit, Parts heading, ordered list of part names matching pins.

Focal point: the model + the active numbered pin. Pins are brass numbered discs, ≥44px.
```

---

### 25 — Specimen Lab — pin editor

**Job.** Learner (or author) places/edits pins. Same shell, editor section visible.

**Fields:** Name, What this is, Local position `x y z`, Copy coordinates, Delete this pin, Download pin file, Load pin file, Restore original pins. Toggle **Place pins** pressed.

**Stitch prompt**

```
Specimen Lab with Pin editor open on the right sheet. Place pins is pressed.

PLATFORM: Web, Desktop

PAGE STRUCTURE:
Same header and 3D well as the viewer. Right sheet shows “Pin editor”, lead text, fields Name and What this is, a coordinates code line, Copy coordinates, Delete this pin (danger), Download pin file, Load pin file, Restore original pins. One pin selected on the model.
```

---

### 26 — Specimen Lab — loading

**Job.** Heavy GLB (e.g. heart 74.9 MB) needs patience.

**Copy:** Loading specimen · bar · Large file — give it a moment.

**Stitch prompt**

```
Specimen Lab loading overlay on the 3D well. Label “Loading specimen”, determinate bar ~40%, small warning “Large file — give it a moment.”
PLATFORM: Web, Desktop
```

---

### 27 — Specimen Lab — WebGL fail

**Job.** Honest failure, way back to games.

**Copy:** WebGL failed / this browser cannot run the lab. Link Games.

**Stitch prompt**

```
Specimen Lab failure state in the well. Clear error, no stack trace. Button “Games” back to the library.
PLATFORM: Web, Desktop
```

---

### 28 — Admin login

**Job.** Filament admin at `/admin`. Only `role=admin` and `status=approved`.

**Stitch prompt**

```
Admin sign-in for GyanQuest school staff. Web desktop. Quiet, dense, trustworthy. Same locked GyanQuest tokens (deep teal, mango-leaf, marigold), more tool-like density than the student hub.

PLATFORM: Web, Desktop

PAGE STRUCTURE:
Centered login: GyanQuest Admin, Email, Password, Remember me, Sign in. Helper: Students use the game site; this is for approvers only.
```

---

### 29 — Admin dashboard

**Job.** Four live stats (poll ~6s).

**Widgets:** Students · Pending approvals · Active (24h) · Most-played game  

**Nav:** Dashboard, Pending Approvals, Students.

**Stitch prompt**

```
GyanQuest admin dashboard. Left nav. Four stat cards: Students 128, Pending approvals 7 (warning), Active (24h) 23, Most-played game force-fighter. No fake charts. Dense tool layout. One focal number: pending approvals.

PLATFORM: Web, Desktop
```

---

### 30 — Admin — Pending approvals

**Job.** Approve or reject new students.

**Table:** Name, Email, Registered. Row actions: Approve (confirm), Reject (confirm).

**Stitch prompt**

```
Admin table “Pending Approvals”. Columns name, email, registered datetime. Each row: Approve and Reject. Confirmation pattern implied. Empty state: “No students waiting.”

PLATFORM: Web, Desktop
```

---

### 31 — Admin — Students

**Job.** Find a student, filter status, open detail.

**Columns:** Name, Email, Status badge (pending/approved/rejected), Registered, Games count, Levels done, Last active.

**Stitch prompt**

```
Admin “Students” table with search and status filter. Status as stamps. Clickable rows. Polling implied, not a spinner festival.

PLATFORM: Web, Desktop
```

---

### 32 — Admin — Student detail

**Job.** See per-game progress and written responses.

**Infolist:** name, email, status. Repeatable: game_id, current_level, current_sub, levels_completed_count, last_synced. Written responses: game, source, term, content, time.

**Stitch prompt**

```
Admin student record view. Header name + email + status. Section “Per-game progress” as a compact table (chemistry-lab, level 0, sub 3, 1 level done…). Section “Written responses” — may be empty: “No written responses yet” (the live client rarely posts these).

PLATFORM: Web, Desktop
```

---

## 8. Generate in this order

1. Landing (01) — establishes catalog cards and stamps  
2. Mission Hub (03) — copy card language from Landing  
3. Mission Play (04) — establishes 10-bead rail  
4. Account (02)  
5. Activity cards 11–19 (can be cropped dock cards, same rail visible)  
6. Pedagogy 05–10  
7. Book 20–21, Tutor 22, Constellation 23  
8. Specimen Lab 24–27  
9. Admin 28–32  
10. Multi-select student screens → unify header, stamps, beads  

**Do not** generate 28 Hub clones. If you want a second subject, duplicate Hub and only change: title Force Fighter, subtitle Push, pull, friction & gravity, coach name, mission titles.

**Do not** generate mobile, tablet, or phone variants of any screen.

---

## 9. States checklist (hunt these in the mocks)

Every interactive screen should show or have a sibling artboard for:

- Default  
- Hover / pressed (primary button offset)  
- Disabled (Next step when gated, Book locked)  
- Error (quiz wrong, login fail, WebGL fail)  
- Empty (constellation none yet, pending none)  
- Loading (specimen, signing in)  
- Success (drill passed, mission done)  
- Bengali chrome sample on Landing **or** Hub (one artboard is enough)

---

## 10. What “good” looks like when you review Stitch output

Reject a screen if:

- It uses cream paper, indigo uniforms, terracotta, or any “exercise book” palette instead of the locked GyanQuest tokens.  
- It is a mobile/phone layout (bottom nav, stacked lab, full-width sheets, hamburger-only chrome).  
- Mission steps are tiny unusable dots.  
- Body text is under 16px.  
- Quiz options are cramped radios.  
- Emoji replaces all chrome icons.  
- EN and BN mix in one header.  
- Landing hero is “big 28 + 2 languages + gradient orbs” as the whole story.  
- Admin looks like a consumer game, or student Hub looks like Filament.

Keep a screen if:

- Deep teal + mango-leaf + marigold match the live product.  
- The 10-bead rail and lab stamps are the memory.  
- Layout is a full desktop web app (wide catalog, split lab, two-page book, three-pane 3D).  
- Chemistry Lab Tiny Bits copy is real, not lorem.

---

*Source of screens: live GyanQuest code. Palette and type: live `css/design-tokens.css` (Syne / Sora / Noto Sans Bengali). All Stitch artboards: web desktop only.*
