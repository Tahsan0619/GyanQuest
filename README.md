# GyanQuest

Interactive mission games for school subjects (Canvas 2D). Static frontend + optional Groq tutor proxy.

## Quick start (teammates)

```bash
# Frontend (from repo root)
cp .env.example .env
# Put GROQ_API_KEY in .env (optional — games work offline without chat)

py -3 tools/groq_proxy.py
# open http://127.0.0.1:5500/
```

### Optional API backend

```bash
cd backend
cp .env.example .env
# configure MySQL (or sqlite) + ADMIN_* then:
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
# API http://127.0.0.1:8000/api  · Admin http://127.0.0.1:8000/admin
```

Or without chat: `py -3 -m http.server 5500` from the repo root.

## Layout

- `games/` — 28 subject games (`boot-l1.js` + missions)
- `engine/` — shared UI, persist, pedagogy, books, mission hub, optional auth sync
- `backend/` — Laravel Sanctum API + Filament admin (optional)
- `js/` + `css/` — landing page
- `tools/groq_proxy.py` — static server + `/api/chat` proxy (key stays in `.env`)

## Notes

- Do **not** commit `.env` (gitignored). Use `.env.example`.
- Progress saves in `localStorage` per game (`save-v2`; chemistry also migrates `save-v1`).
- Reload restores hub vs in-mission screen via the `inHub` save field.
- `audio/` and `3D Assets/` stay local (gitignored) so GitHub clones stay small.
- Login on the landing page is optional; without a token the site stays fully offline.
