# GyanQuest — Technology Choices & Design Rationale

This document explains **what we built with**, **why those options beat common alternatives**, and **why mission levels are Canvas 2D while only the Force Fighter playground is 3D**.

---

## 1. Stack overview

| Layer | Technology | Role |
|--------|------------|------|
| Gameplay | HTML5 Canvas 2D + vanilla JavaScript | Subject missions, arenas, interactions |
| Shared platform | Custom `engine/` (JS + CSS) | Mission hub, pedagogy, save/restore, UI chrome |
| Landing | HTML / CSS / JS | Subject browser, entry to games |
| AI tutor (optional) | Python proxy + Groq API | Chat help without exposing API keys |
| Auth & admin (optional) | Laravel + Sanctum + Filament | Login, sync, admin panel |
| Data (optional) | MySQL or SQLite | Accounts and synced progress |
| 3D playground only | Three.js (WebGL) | Free-play physics sandbox in Force Fighter |

**Design principle:** core learning works **offline-first** in the browser. Server pieces (tutor, API, admin) are optional enhancements—not blockers.

---

## 2. What we used and why it is better

### HTML5 Canvas 2D + vanilla JavaScript (mission levels)

**What it is:** Browser-native 2D drawing and game loops, with a shared engine and per-subject game packages (`games/*/`).

**Why not heavier game engines (Unity WebGL, Godot export, Phaser, Pixi)?**

| Alternative | Why we did not choose it as the default |
|-------------|----------------------------------------|
| **Unity / Unreal WebGL** | Large downloads, longer load times, harder to run on low-end school devices; overkill for curriculum missions |
| **Full frameworks (Phaser, Pixi)** | Extra dependency weight and abstraction; our pedagogy (hub → mission → feedback → save) is custom and easier to own in plain JS |
| **Pure DOM / CSS games** | Weak for drag physics, hit-testing, and smooth arena animation at scale |

**Why Canvas 2D wins for GyanQuest**

- Runs in any modern browser with **no install**
- Small payload → faster on school Wi‑Fi and older laptops/phones
- One reusable engine pattern across **28+ subject games**
- Easy to teach, debug, and extend as a student team
- Full control over mission UX (coach text, chips, books, hub state)

---

### Custom shared `engine/` (not a third-party LMS)

**What it is:** Shared UI, persistence (`localStorage` save-v2), pedagogy helpers, digital books, mission hub, optional auth sync.

**Why better than bolting games onto Moodle / generic quiz apps**

- Games and learning flow stay one product, not iframes inside a LMS
- Progress restores **hub vs in-mission** correctly after reload
- Same patterns for every subject → consistent learner experience
- Offline play remains first-class

---

### Python + Groq proxy (optional AI tutor)

**What it is:** Local/static server proxy (`tools/groq_proxy.py`) that calls Groq; API key stays in `.env`.

**Why not calling the model from the browser, or using heavier backends only for chat?**

| Alternative | Downside |
|-------------|----------|
| Browser → API key | Keys leak; unsafe for classrooms |
| Always-on Node/Java service | More ops for a feature that must stay optional |
| Cloud-only tutor gate | Breaks offline-first promise |

**Why this is better**

- Keys never ship to clients
- Games work **even if chat is down**
- Groq is fast and simple for short tutoring replies
- Minimal stack for teammates to run (`py -3 tools/groq_proxy.py`)

---

### Laravel + Sanctum + Filament (optional backend)

**What it is:** PHP API for auth/sync; Filament admin; MySQL or SQLite.

**Why not Firebase / custom Node / full SPA backend as the core?**

| Alternative | Tradeoff |
|-------------|----------|
| **Firebase-only** | Vendor lock-in; weaker fit for school-owned / self-hosted admin |
| **Node as required core** | Another runtime for every deploy; we already need simple static hosting |
| **No backend** | Fine for solo play; weak for accounts, teachers, admin |

**Why Laravel stack fits**

- Sanctum covers token auth cleanly for a SPA/static front
- Filament gives a governed admin UI quickly (roles, content ops)
- SQLite for light setups; MySQL when the school needs a real DB
- Entirely **optional**—landing + games still work without login

---

### localStorage (save-v2) for progress

**Why not only a server database?**

- Instant save/restore with no network
- Works in computer labs with flaky internet
- Server sync can layer on later; offline is never broken

---

## 3. Why mission levels are 2D (not 3D)

All curriculum levels across subjects use **Canvas 2D arenas** (for example Force Fighter’s `arena-2d.js`).

### Learning goals first

Levels teach one concept at a time: push/pull, friction, cells, circuits, SQL tables, etc.  
2D keeps the screen **readable**: arrows, chips, labels, and feedback stay clear. Extra depth often hides the idea behind camera control.

### Performance and access

GyanQuest targets village classrooms and city prep centers with mixed devices. 2D means:

- Lower GPU/CPU cost
- Shorter load times (no heavy 3D asset packs per level)
- Stable frame rates on older hardware
- Smaller repo / clones (`3D Assets` stay local/gitignored)

### Faster content scale

We ship **many subjects and missions**. Authoring and QA for 2D scenes (layout, hit regions, chips, books) is much faster than building, lighting, and testing a 3D scene per lesson.

### Pedagogy fit

Mission loop = explore → attempt → feedback → retry → save.  
2D is enough for drag, tap, scrub, myth-bust, and quiz beats without fighting a 3D camera.

### Consistency

One 2D engine pattern across games → same hub, coach, and save model. Learners do not relearn controls every subject.

**Bottom line:** levels are 2D because **clarity, speed, reach, and scale** matter more for curriculum missions than cinematic 3D.

---

## 4. Why only the playground is 3D

The **3D Playground** lives under Force Fighter’s Three.js sandbox (`games/force-fighter/_legacy3d/`). It is a **free-play physics lab**, not a graded mission path.

Landing copy: spawn cars, crates, rocks; drag to push; change ice/friction and see what happens. Status: under active development.

### Why 3D belongs here (and not in every level)

| Factor | Playground (3D) | Mission levels (2D) |
|--------|-----------------|---------------------|
| Purpose | Open experimentation | Structured learning outcomes |
| Camera | Orbit / spatial feel helps intuition for mass & force | Fixed clear view for instructions |
| Assets | Shared spawn catalog (OBJ + Three.js) | Light Canvas drawings / SVG |
| Success criteria | “What happens if…?” | Pass missions, books, quizzes |
| Device load | Acceptable as an optional lab | Must stay light for every subject |

### Why not make all Force Fighter levels 3D?

- Guided missions need **predictable UI** (coach, chips, panels). 3D cameras and occlusion fight that.
- Shipping 10+ levels × many subjects in 3D would blow load time, asset size, and team bandwidth.
- 3D is reserved where spatial play **adds science value**—feeling collisions, mass, and surfaces—not where it only looks cooler.
- Roadmap may add limited 3D **inside** lessons later; today, curriculum remains 2D by design.

### Why Three.js for that playground?

- Industry-standard WebGL library; no Unity install for learners
- OBJ loading + OrbitControls fit a spawn-and-push lab
- Isolated from the 2D mission pipeline so a sandbox experiment cannot break curriculum saves

**Bottom line:** **3D = sandbox playground** for curiosity and physics feel; **2D = whole level path** for reliable, scalable classroom learning.

---

## 5. Architecture (short)

```
Learner
  → Landing + Mission Hub
  → Shared engine (UI · pedagogy · persistence)
  → Subject game package (boot · missions · levels)
  → Canvas 2D gameplay
  → localStorage (save-v2)

Optional:
  → Groq tutor proxy
  → Laravel Sanctum API + Filament + MySQL/SQLite

Force Fighter only (optional lab):
  → Three.js 3D Playground (free play)
```

---

## 6. One-line summary for presentations

**We use Canvas 2D + a shared JS engine so dozens of school missions stay fast, offline, and clear; we add Laravel/Groq only when accounts or tutoring help; and we keep Three.js 3D for Force Fighter’s playground alone—where free spatial physics helps learning without slowing or confusing the structured 2D level path.**
