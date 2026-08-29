# GyanQuest

Interactive learning platform for school subjects (ages 9–14). Canvas 2D mission games, digital books, a 3D Specimen Lab, and a Socratic AI tutor — bilingual (English / Bengali) and offline-first.

**Live repo:** [github.com/Tahsan0619/GyanQuest](https://github.com/Tahsan0619/GyanQuest)

---

## What is included

| Area | Description |
|------|-------------|
| **28 subject games** | Chemistry, biology, astronomy, statistics, electrical, civil, cyber, web dev, and more — each with a 10-step mission hub |
| **Digital books** | 8-page mission companions with red glossary terms; tap a term to open the tutor |
| **AI tutor** | Floating **Ask** button on every game; Groq-powered via local `/api/chat` proxy (API key never in the browser) |
| **3D Specimen Lab** | 33 rotatable GLB models with numbered part pins (`games/3d-lab/`) |
| **Pedagogy layer** | Recall, predict → reflect, fluency gate, concept constellation, hint tiers |
| **Optional backend** | Laravel API + Filament admin for accounts and progress sync |

---

## Quick start

```bash
# 1. Clone and configure
git clone https://github.com/Tahsan0619/GyanQuest.git
cd GyanQuest
cp .env.example .env
# Add GROQ_API_KEY=... to .env (optional — games work without chat)

# 2. Run static server + tutor proxy (recommended)
py -3 tools/groq_proxy.py
# Open http://127.0.0.1:5500/

# 3. Unlock books on the home page (dev toggle) to open mission books from any game
```

**Without chat:** `py -3 -m http.server 5500` from repo root (tutor will show offline hints).

### Optional API backend

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
# API http://127.0.0.1:8000/api  ·  Admin http://127.0.0.1:8000/admin
```

---

## AI tutor (Socratic)

- Start **`tools/groq_proxy.py`** — serves the site **and** proxies `POST /api/chat` to Groq.
- Default model chain starts with `openai/gpt-oss-20b`; falls back automatically if a model is retired.
- **Free chat:** Ask anything; the tutor uses Socratic questioning (what do *you* think? then build on your answer).
- **Book glossary tap:**  
  1. Tutor asks: *What do you think this word means?*  
  2. You reply in your own words.  
  3. Tutor responds with **What it means**, **What you said**, **How close**, **Compare**, then a follow-up question.
- Replies support **bold**, bullet lists, and numbered lists (rendered in the chat panel, not raw `**` stars).
- If Groq is offline, a local fallback still answers in the same structure.

Put `GROQ_API_KEY` in `.env`. Restart the proxy after changing keys or models.

---

## 3D Specimen Lab

Open **Games → Specimen Lab** or `/games/3d-lab/`.

- 33 specimens (cells, organs, space models, lab equipment, etc.)
- Drag to orbit, scroll to zoom, tap numbered pins to focus parts
- Large space models (Earth, Moon, solar system) embed big textures — use **`groq_proxy.py`** or hard-refresh after updates
- GLB files live in `sketchfab models/` (gitignored). See `sketchfab models/DOWNLOAD_LIST.md`.

---

## Project layout

```
GyanQuest/
├── games/           # 28 Canvas mission games + 3d-lab
├── engine/          # Shared hub, books, tutor, pedagogy, persist
├── tools/           # groq_proxy.py (static + /api/chat)
├── backend/         # Optional Laravel API
├── docs/a4-features/  # Printable feature sheets (Canvas, Book, Tutor, 3D Lab)
├── js/ css/         # Landing page
└── index.html       # Home / game library
```

---

## Progress and assets

- Progress saves in **`localStorage`** per game (`save-v2`).
- Reload restores hub vs in-mission via the `inHub` field.
- **Do not commit `.env`** (gitignored). Use `.env.example`.
- **`audio/`**, **`3D Assets/`**, and **`sketchfab models/*.glb`** stay local so GitHub clones stay small.

---

## Docs

- `MEGA-FEATURES.md` — roadmap and feature notes  
- `RESEARCH_AUDIT.md` — architecture audit for papers / reviews  
- `docs/a4-features/` — A4 printable overviews with live snapshots  

---

## License and credits

Mission content, UI, and engine code are part of the GyanQuest / ImpactX project.  
3D models and book art credit their respective authors (CC-BY where noted in-game).
