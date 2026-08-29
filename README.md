# GyanQuest

**Learn. Level Up. Lead.**

GyanQuest is an interactive learning platform for Bangladesh and beyond. It turns school subjects into Canvas 2D mission games, digital books, a 3D Specimen Lab, and a Socratic AI tutor. Content targets roughly ages **9-14**, with **English** and **Bengali** UI chrome. Everything runs in the browser and works offline except the optional Groq tutor and Laravel API.

**Repository:** [github.com/Tahsan0619/GyanQuest](https://github.com/Tahsan0619/GyanQuest)

---

## Table of contents

- [What you get](#what-you-get)
- [Game library](#game-library)
- [How a mission works](#how-a-mission-works)
- [Digital books](#digital-books)
- [AI tutor (Socratic)](#ai-tutor-socratic)
- [3D Specimen Lab](#3d-specimen-lab)
- [Quick start](#quick-start)
- [Configuration](#configuration)
- [Project layout](#project-layout)
- [Progress and local assets](#progress-and-local-assets)
- [Optional backend](#optional-backend)
- [Documentation](#documentation)
- [Credits](#credits)

---

## What you get

| Feature | What it does |
|---------|----------------|
| **28 subject games** | Canvas 2D labs with a 10-step mission hub per game (intro, guided steps, fluency drill, mastery) |
| **Digital books** | 8-page mission companions with photos, glossary terms, and a fixed pedagogical spine |
| **AI tutor** | Floating **Ask** panel on every game; Groq answers through a local proxy so the API key never ships to the browser |
| **3D Specimen Lab** | 33 GLB models with numbered part pins (cells, organs, space, lab gear, and more) |
| **Pedagogy engine** | Recall prompts, predict-then-reflect, fluency gate before mastery, hint tiers, concept constellation |
| **Landing hub** | Game library, Bengali/English toggle, optional login, dev **Unlock books** toggle |
| **Optional API** | Laravel + Sanctum + Filament admin for accounts and progress sync |

**Tech at a glance:** vanilla JavaScript modules, Canvas 2D, Three.js (3D lab only), CSS, Python static server + Groq proxy, optional PHP/Laravel backend. No React build step for the games themselves.

---

## Game library

Each folder under `games/` is a self-contained subject app with `boot-l1.js`, mission scenes, and (where live) mission books.

| Game | Folder | Notes |
|------|--------|-------|
| Force Fighter | `force-fighter` | Physics: inertia, push/pull, action-reaction |
| Bio Explorer | `bio-explorer` | Life, cells, plant power |
| Chemistry Lab | `chemistry-lab` | Atoms, bonds, elements |
| Eco Guardian | `eco-guardian` | Ecosystems, waste, planet balance |
| Astronomy & Space | `astronomy-space` | Solar system, orbits, scale |
| Statistics & Probability | `statistics-probability` | Mean, mode, data |
| Electrical Basics | `electrical-basics` | Circuits, voltage, current |
| Mechanical Basics | `mechanical-basics` | Levers, gears, work |
| Civil Basics | `civil-basics` | Structures, load paths |
| Web Dev Studio | `web-dev-studio` | HTML, CSS, JavaScript |
| ICT Fundamentals | `ict-fundamentals` | Input/process/output, bits |
| Math Quest | `math-quest` | Place value, fractions |
| AI Lab | `ai-lab` | Rules, training, testing AI ideas |
| Machine Learning | `ml-lab` | Data splits, epochs, evaluation |
| Backend Builder | `backend-builder` | Routes, JSON, servers |
| Database & SQL | `database-sql` | Tables, queries |
| Cyber Shield | `cyber-shield` | Safety, passwords, privacy |
| Human Anatomy & Health | `human-anatomy` | Body systems |
| Green Tech | `green-tech` | Renewables, sustainability |
| Data Science | `data-science` | Data thinking |
| Discrete Math & Logic | `discrete-math` | Logic, sets |
| Calculus & Analysis | `calculus-analysis` | Change, limits (intro) |
| Geometry & Trigonometry | `geometry-trig` | Shapes, angles |
| Geology & Earth | `geology-earth` | Rocks, Earth systems |
| Genetics & Biotech | `genetics-biotech` | DNA, inheritance |
| Electronics & Robotics | `electronics-robotics` | Components, circuits |
| Networking & Internet | `networking-internet` | Packets, routers |
| OS & Hardware | `os-hardware` | CPU, memory, OS |
| **Specimen Lab (3D)** | `3d-lab` | Rotatable models, part pins (separate from the 28 Canvas games) |

Open the home page at `/` and pick any tile, or go directly to e.g. `/games/bio-explorer/`.

---

## How a mission works

1. **Mission hub** - Pick one of 10 levels (missions). Each mission has substeps shown on a progress rail.
2. **Canvas scenes** - Drag, tap, sort, and animate to learn by doing (not just reading).
3. **Coach text** - Short hints at the bottom; streak and wrong-answer nudges via the pedagogy layer.
4. **Fluency drill** - Substep 8 checks speed/accuracy before mastery unlocks.
5. **Mastery** - Substep 9/10: teach-back style wrap-up.
6. **Book button** - Opens the mission digital book when unlocked (finish the mission or use **Unlock books** on the home page for development).

Progress is saved in **`localStorage`** per game (`save-v2`). Reloading restores hub vs in-mission state via the `inHub` field.

---

## Digital books

Every live mission book follows the same **8-page spine** (see `engine/js/book-theory.js`):

1. Hook (why this matters)  
2. Core model  
3. Mechanism  
4. Representation  
5. Mission map (links to the 10 game steps)  
6. Transfer (everyday Bangladesh-friendly examples)  
7. Myths (fix common misconceptions)  
8. Mastery checklist  

**Red glossary words** in the book are tappable. They open the AI tutor (see below). Books use real generated or curated images where available; design follows cognitive load, dual coding, and spiral scaffolding principles documented in the engine.

---

## AI tutor (Socratic)

The tutor is a floating **Ask** button on every game page.

### Setup (required for live AI)

```bash
cp .env.example .env
# Add: GROQ_API_KEY=your_key_here

py -3 tools/groq_proxy.py
# Serves the site AND POST /api/chat on http://127.0.0.1:5500/
```

Do **not** use plain `http.server` if you want live tutor replies (offline fallback still works but is generic).

### Book word flow (Socratic)

When you tap a **red glossary term**:

1. Tutor asks: *What do you think this word means?* (your words first)  
2. You type your answer.  
3. Tutor replies in four parts:  
   - **What it means** (correct definition in context)  
   - **What you said** (fair restatement)  
   - **How close** (right, partly right, or off track, kindly)  
   - **Compare** (link your idea to the real meaning)  
4. Ends with one **Socratic follow-up question** about the topic (not "Do you want to learn more?").

### Free chat

Ask anything from the **Ask** panel. The tutor uses Socratic questioning: it builds on what you say instead of dumping a lecture.

### Formatting

Replies render **bold**, bullet lists, and numbered lists in the chat panel (not raw `**` markdown in the bubble).

### Models

Default chain starts with `openai/gpt-oss-20b` and falls back through other live Groq chat models if one is retired or rate-limited. Set `GROQ_MODEL` or `GROQ_MODELS` in `.env`. Restart the proxy after changes.

---

## 3D Specimen Lab

URL: `/games/3d-lab/`

- **33 specimens** across anatomy, biology, chemistry, space, machines, instruments, and math manipulatives  
- Drag to orbit, scroll to zoom, tap a **numbered pin** to focus a part  
- **Pin editor** (dev): drag pins, download JSON placements  
- Large space models (Earth, Moon, solar system) use embedded textures; hard-refresh after updates  

**3D model files** are not in git (too large). After clone, download GLBs into `sketchfab models/` using `sketchfab models/DOWNLOAD_LIST.md`. The detailed mouth model uses `human_mouth_detailed.glb` in that folder.

---

## Quick start

```bash
git clone https://github.com/Tahsan0619/GyanQuest.git
cd GyanQuest
cp .env.example .env
# Optional: GROQ_API_KEY=...

py -3 tools/groq_proxy.py
```

Open **http://127.0.0.1:5500/**

| Goal | Action |
|------|--------|
| Play without AI | `py -3 -m http.server 5500` (tutor uses offline fallback text) |
| Open any mission book | Home page: toggle **Unlock books: On** |
| Bengali UI | Tap **বাংলা** on the landing page or in a game header |
| Printable overview | Open `docs/a4-features/` in the browser (A4 feature sheets) |

---

## Configuration

| Variable | File | Purpose |
|----------|------|---------|
| `GROQ_API_KEY` | `.env` | Groq API key for `/api/chat` |
| `GROQ_MODEL` | `.env` | Preferred chat model (default `openai/gpt-oss-20b`) |
| `GROQ_MODELS` | `.env` | Optional comma-separated fallback list |
| `PORT` | `.env` | Proxy port (default `5500`) |

Never commit `.env`. Use `.env.example` as the template.

---

## Project layout

```
GyanQuest/
├── index.html              # Landing / game library
├── js/  css/  assets/      # Home page
├── games/                  # 28 Canvas games + 3d-lab
│   └── <subject>/
│       ├── boot-l1.js        # Hub + mission boot
│       ├── js/               # Scenes, state, activities
│       ├── books/            # Digital book data (level1.js, ...)
│       └── assets/           # Book art, UI sprites
├── engine/
│   ├── js/                   # Hub UI, books, tutor, pedagogy, persist
│   └── css/
├── tools/
│   └── groq_proxy.py         # Static server + Groq proxy
├── backend/                  # Optional Laravel API + Filament admin
├── docs/a4-features/         # Printable feature sheets + snapshots
├── sketchfab models/         # Local GLBs (gitignored)
├── MEGA-FEATURES.md          # Roadmap notes
└── RESEARCH_AUDIT.md         # Architecture audit for reviews/papers
```

---

## Progress and local assets

- **Saves:** `localStorage` keys per game; chemistry also migrates legacy `save-v1`.  
- **Concept log:** Glossary terms you explore feed recall prompts and the constellation view.  
- **Gitignored (keep local):** `.env`, `audio/`, `3D Assets/`, `sketchfab models/*.glb`, `*.glb`, `/dist/`, `/build/`.  
- **Clone size:** Repo is kept pushable; download 3D models separately after clone.

---

## Optional backend

For multi-device accounts and admin:

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

- API: `http://127.0.0.1:8000/api`  
- Admin: `http://127.0.0.1:8000/admin`  

Login on the GyanQuest home page is optional; games work fully without a token.

---

## Documentation

| Doc | Contents |
|-----|----------|
| [docs/a4-features/](docs/a4-features/) | A4 printable sheets: Canvas games, digital book, AI tutor, 3D lab |
| [MEGA-FEATURES.md](MEGA-FEATURES.md) | Feature roadmap and impact notes |
| [RESEARCH_AUDIT.md](RESEARCH_AUDIT.md) | Codebase map for education/CS reviews |
| [sketchfab models/DOWNLOAD_LIST.md](sketchfab%20models/DOWNLOAD_LIST.md) | Which GLB files to download for Specimen Lab |

---

## Credits

GyanQuest / ImpactX: mission design, engine, UI, and integration.

Third-party assets (CC-BY and similar) are credited in-game and in book `CREDITS-GEN.md` files where applicable. 3D models come from Sketchfab and NASA kits; book figures are generated or curated per mission.

---

## License

See repository and in-game credits for asset-specific licenses. Project code and original content are part of the GyanQuest / ImpactX educational initiative.
