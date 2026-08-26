# 1. Project Overview

- **What the project does.** GyanQuest (repo folder `ImpactX`) is an offline-first browser library of school mission games. `index.html` lists 28 subject titles. Each live title is a Canvas 2D hub of 10 missions: short lab activities, an 8-page digital book, and optional glossary-tap chat through a Groq proxy. A separate **Specimen Lab** at `games/3d-lab/` orbits Sketchfab GLB models with numbered pins. Optional Laravel+Sanctum stores accounts and progress. Games run without login or chat.

- **Tech stack (quoted from files).**
  - **Missions:** HTML5 Canvas 2D + vanilla ES modules. No root `package.json`. `createArena2D` uses `canvas.getContext("2d", { alpha: false })` (`games/chemistry-lab/js/arena-2d.js` lines 6–7).
  - **Shared platform:** custom `engine/js` (18 modules). No Phaser, Pixi, Unity, or Godot in the live mission path.
  - **Specimen Lab:** Three.js **r170** (`games/3d-lab/vendor/three.module.js` line 6: `const REVISION = '170'`), `GLTFLoader`, `OrbitControls`, import map in `games/3d-lab/index.html` lines 12–17.
  - **Legacy 3D:** Three.js **r128** vendored as `engine/vendor/three.min.js` (minified header `const e="128"`). Used by `games/*/_legacy3d/`, not by live `boot-l1.js` hubs.
  - **AI tutor:** Python 3 `ThreadingHTTPServer` in `tools/groq_proxy.py`. `GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"` (line 67). `PORT` default `"5500"` (line 64). Preferred model IDs `_PREFERRED_CHAT` lines 83–89: `openai/gpt-oss-20b`, `openai/gpt-oss-120b`, `qwen/qwen3.6-27b`, `groq/compound-mini`, `groq/compound`, `openai/gpt-oss-safeguard-20b`.
  - **Optional API:** PHP `^8.3`, `laravel/framework` `^13.8`, `laravel/sanctum` `^4.3`, `filament/filament` `^4.0` (`backend/composer.json` lines 9–13). Admin Vite: `vite` `^8.0.0`, `tailwindcss` `^4.0.0` (`backend/package.json` lines 9–14).
  - **Desktop pack (on disk, not in the 7 git commits):** `tools/pack_desktop.py`, `tools/desktop_app.py`, `tools/install_local.cs` (untracked as of `git status`).
  - **No** first-party WebSocket, WebRTC, or socket.io under `games/` (search of `games/**/*.js` and `games/**/*.html`: no matches).

- **Project structure.**
  ```
  index.html, js/, css/, assets/     landing catalog
  engine/js|css|locales              persist, pedagogy, hub, books, chat, i18n
  games/{28 slugs}/                  Canvas 2D clones (boot-l1.js, arena-2d.js)
  games/3d-lab/                      Three.js specimen viewer + pins
  games/*/_legacy3d/                 archived THREE curriculum (not the live hub)
  tools/groq_proxy.py                static server + POST /api/chat
  backend/                           Laravel Sanctum + Filament
  editor-packs/                      authoring split by owner
  MEGA-FEATURES.md                   proposed features (untracked; not all implemented)
  ```

- **Size.** First-party counted files excluding `.git`, `node_modules`, `vendor`, `_internal`, `dist`, `build`, `__pycache__`, `_gq_old_bundle`, and `*.min.js`: **1022 files, 314,090 lines** (`.js` 630 / 222,543; `.css` 129 / 53,165; `.php` 135 / 15,104; `.html` 89 / 12,472; `.py` 37 / 10,532; `.cs` 2 / 274). Shared `engine/js`: **18 files, 4,849 lines**. `boot-l1.js`: 28 files, 17,157 lines, **28 distinct MD5 hashes** (each game customized). `arena-2d.js`: 28 files, 10,923 lines, **23 identical copies** (MD5 `b4eeeb9e`) plus 5 variants. `games/` has **29** directories (28 subjects + `3d-lab`). `_gq_old_bundle` holds **519 extra `.py` files** and was excluded from the count. **Git:** **7 commits**. First: `2026-08-07T17:55:26+06:00` `9a81bf1` “Initial GyanQuest release: 28 Canvas mission games with shared engine.” Last: `2026-08-23T00:09:17+06:00` `b946e75` “Replace em dashes in the README with plain punctuation.” Calendar span **~16 days**. Months of development **UNKNOWN — needs author input** (git does not show pre-7-Aug work).

# 2. Core Technical Components

## 2.1 Canvas 2D arena (mission gameplay)

- **What / how.** `createArena2D` owns a 2D context, HiDPI `dpr` resize, a scene map, hit-regions, and stacked pointer intents (`sceneIntent` vs `panelIntent`) so lab handles and quiz chips do not steal each other’s drags (`games/chemistry-lab/js/arena-2d.js` lines 6–27). `prefers-reduced-motion` is read (lines 28–29). `boot-l1.js` runs `requestAnimationFrame` → `arena.tick()` (e.g. `games/chemistry-lab/js/boot-l1.js` lines 109–114). Layout comes from `computeLabLayout(w, h)` (`arena-2d.js` line 19).
- **From scratch vs library.** **From scratch** Canvas 2D. **Not** one shared renderer module: `createArena2D` is copied **28 times**. 23 of 28 `arena-2d.js` files are byte-identical.
- **Algorithms.** Hit-test registered rectangles/regions; drag state; no quadtree/BVH. No physics engine on the live 2D path.
- **Files.** `games/*/js/arena-2d.js`, `games/*/js/boot-l1.js`, per-game `*-scenes.js` / `*-activities.js`.

## 2.2 Mission hub, 10×10 save, content tiers

- **What / how.** Shared hub renders 10 cards; open requires `playable` plus sequential unlock (`engine/js/mission-hub.js` around lines 196–219). Save stores a 10×10 `completed` grid and `inHub` so reload restores hub vs in-mission (`engine/js/persist.js` `saveGame` lines 32–51). `FINISHED_SET` maps slug → uniqueness-pass mission indices (`engine/js/mission-status.js` lines 7–24); `missionContentTier` returns Playable / Under Development / Coming Soon (lines 38–42).
- **From scratch.** Custom DOM hub, not Moodle/SCORM.
- **Scale is data, not a generic engine.** 28×10 = **280** slots. `FINISHED_SET` enumerates **26** uniqueness-pass missions. `playable: true` / `"playable": true` appears on about **52** mission objects across `missions-meta.js` (one chemistry-lab comment also matches the string). Remaining slots are `playable: false` “Coming Soon” stubs.
- **Files.** `engine/js/mission-hub.js`, `engine/js/mission-status.js`, `games/*/js/missions-meta.js`.

## 2.3 Persistence and optional cloud merge

- **What / how.** `saveGame` writes JSON (`level`, `sub`, `inHub`, `completed`, `rewards`, `introSeen`, `fluencyScores`, `predictions`, `streaks`, `hintTiers`, `conceptLog`) to `localStorage` (`persist.js` 32–51), then dynamic-imports `auth-api.js` and fire-and-forgets `syncProgress` (55–61). `normalizeConceptLog` keeps last 200 term events (`.slice(-200)`, lines 145–155). Mastery sub-index 9: `canEnterMastery` requires fluency ≥ 0.8 **or** sub 8 marked complete (163–168). Cloud merge: `pullAndMergeProgress` takes remote if remote `levels_completed_count` is higher, or equal and remote timestamp is set (`engine/js/auth-api.js` 134–151). Token lives in `sessionStorage` key `gq-api-token` (`auth-api.js` lines 5, 25).
- **From scratch.** Wrapper over `localStorage` + `fetch`. Not CRDT/OT. Laravel `ProgressController::sync` (`backend/app/Http/Controllers/Api/ProgressController.php` lines 21–69) `updateOrCreate`s by `user_id`+`game_id` and counts fully-true completed rows. Validated keys (`inHub`, `introSeen`, `hintTiers`, `fluencyScores`, `conceptLog`) **match** the client payload (`auth-api.js` 103–116).
- **Files.** `engine/js/persist.js`, `engine/js/auth-api.js`, `backend/app/Http/Controllers/Api/ProgressController.php`, `backend/app/Models/GameProgress.php`.

## 2.4 Pedagogy overlay (SOLO labels, fluency gate, predict/recall)

- **What / how.** `wirePedagogy` normalizes fluency/predictions/streaks/hints/conceptLog (`engine/js/pedagogy.js` 53–62). `recordAnswer` (comment line 75: **“no content-swap adaptive difficulty yet”**) bumps streaks; ≥3 correct shows a badge; ≥2 wrong shows a text coach line (76–93). `runPreMission` chains recall → objective → predict (111–118) using `pickRecallTerms` (`engine/js/concept-viz.js` 440–452). `guardGoNext` blocks sub 9 without `canEnterMastery` (134–144). SOLO names are **mapped from star counts**, not scored artifacts (`soloTierFromStars` in `persist.js` 13–19; `applySoloToReward` in `pedagogy.js` 97–104). `SOLO_TIERS` are the four Biggs labels (`persist.js` 5–10).
- **From scratch vs theory.** UI glue over simplified SOLO + Bruner (comment in `engine/js/activities.js` lines 1–2: “Brunner”). Not an ITS, IRT, or knowledge-tracing engine.
- **Files.** `engine/js/pedagogy.js`, `engine/js/persist.js`, `engine/js/activities.js`, `engine/js/concept-viz.js`.

## 2.5 Digital books + glossary tutor

- **What / how.** Canonical 8-page spine is listed in `engine/js/book-theory.js` lines 12–32 and exported as `BOOK_PAGE_SPINE` (23–32): hook, model, mechanism, representation, mission_map, transfer, myths, mastery. `linkTerms` sorts glossary by term length descending (`engine/js/digital-book.js` 33–37). Page turn is CSS class + `requestAnimationFrame` + 480 ms timeout (`animateFlip`, 351–358), not a 3D page shader. `sendChat` waits up to 20 s if busy, builds tiered prompts, `POST /api/chat` with 18 s `AbortController` (`engine/js/book-chat.js` 261–318). First term tap uses `phase: "explain"`; later `followup` (292–293).
- **From scratch.** Custom DOM book. LLM is Groq via proxy, not a trained local model. `local_explain` in `tools/groq_proxy.py` (298–318) returns canned English if Groq fails.
- **Files.** `engine/js/digital-book.js`, `engine/js/book-chat.js`, `engine/js/book-theory.js`, `engine/js/mission-books.js`, `engine/js/book-unlock.js`, `games/*/books/`.

## 2.6 Shared HTML activity mounts

- **What / how.** `engine/js/activities.js` mounts demo/drag/reveal/equation/order/quiz. `makePointerClone` (22–26) follows the pointer during drag. Live `boot-l1` labs mostly use **per-game** activity kits; this module is more tightly tied to the legacy `engine/js/boot.js` path.
- **Files.** `engine/js/activities.js`, `engine/js/boot.js`.

## 2.7 i18n and voice

- **i18n.** `engine/js/i18n.js` plus `engine/locales/en.json` and `bn.json`. Landing/lab chrome has en/bn strings (`js/landing.js` 43–47 vs 149–153). Mission **body copy** in game JS is still mostly English. Whether full BN mission content is finished: **UNKNOWN — needs author input**.
- **Voice.** `engine/js/voice.js` line 88: `export const VOICE_MUTED = true;` — live path is muted by flag.

## 2.8 Optional Laravel API + Filament

- **What / how.** `backend/routes/api.php` lines 9–18: public `POST /register`, `/login`; Sanctum group: logout, me, `progress/sync`, `progress`, `responses`, `concept-logs`. Register sets `role => 'student'`, `status => 'pending'` (`backend/app/Http/Controllers/Api/AuthController.php` 21–27). Filament access: `role === 'admin' && status === 'approved'` (`backend/app/Models/User.php` 43–46). **No teacher role** in `User.php` fillable/logic. `postResponse` is defined in `auth-api.js` 120–123 and is **not called** from any other first-party JS (only definition hit).
- **From scratch vs framework.** Standard Sanctum + Filament CRUD. Originality is the progress JSON schema, not the framework.
- **Files.** `backend/routes/api.php`, `backend/app/Http/Controllers/Api/*`, `backend/app/Models/*`, `backend/app/Filament/*`.

## 2.9 Groq proxy / static server

- **What / how.** Serves repo root. `build_chat_chain` (180–197) prefers env models, then `_PREFERRED_CHAT` ∩ live Groq IDs, then remaining live IDs. `groq_complete` (245+) walks the chain, marks dead models, retries on selected HTTP errors. `create_server` (438–451) binds `127.0.0.1` and scans 30 ports. Registers `.glb` MIME types (430–435).
- **From scratch.** Small custom handler around `urllib.request`. Not a novel serving architecture.
- **Files.** `tools/groq_proxy.py`.

## 2.10 Legacy THREE curriculum runner

- **What / how.** `engine/js/boot.js` + `engine/js/arena.js` build a WebGL arena and rAF tick. Imported from `games/*/_legacy3d/` (present under all 28 subject folders; Force Fighter has the largest leftover: `games/force-fighter/_legacy3d/js/main.js`). Live Force Fighter `index.html` is the Canvas 2D hub. Landing playground CTA is `/games/3d-lab/` (`index.html` lines 117–123), not `_legacy3d`.
- **Files.** `engine/js/boot.js`, `engine/js/arena.js`, `engine/js/asset-loader.js`, `games/*/_legacy3d/`.

# 3. "Online" / Multiplayer or Networked Features

- **Networking model.** **None for multiplayer.** No WebSocket, WebRTC, or peer sync in first-party game code. `MEGA-FEATURES.md` §11 (lines 202–216) describes a future teacher-paced room and states “True multiplayer is expensive and the wrong fit.” Filament vendor `echo.js` bundles Pusher; games do not import it.
- **What is synchronized, how often, conflicts.**
  1. **Tutor:** on each glossary send, `fetch("/api/chat")` (`book-chat.js` 313–318) → `groq_proxy.py` → Groq. Cadence = user taps, not a tick. Latency = 18 s abort + `local_explain` fallback. No world-state sync.
  2. **Progress (optional login):** `syncProgress` after each local `saveGame` (fire-and-forget). `pullAndMergeProgress` on login-ish pull. Conflict rule = more completed levels wins (`auth-api.js` 147–151). Not vector clocks / last-write-wins on a field level.
  3. **Concept logs:** `POST /api/concept-logs` if a token exists.
  4. **Written responses:** route exists; **client never posts**.
- **Backend.** Auth with pending student approval, JSON progress blobs, Filament admin counters. **No matchmaking, no live class session, no teacher roster APIs.**
- **Discrepancy to raise.** If the project is pitched as a 3D **online multiplayer** game, **that is not in the code.** Live 3D is a single-player GLB viewer. “Online” in this repo means optional HTTPS LLM + optional REST progress. `TECHNOLOGY.md` still describes Force Fighter’s Three.js sandbox as the 3D playground (lines 17, 147–149, 176); the shipping landing instead links Specimen Lab (`index.html` 117–123; commit `f634ae4` “Ship 3D Specimen Lab…”).

# 4. 3D-Specific Implementation Details

- **Rendering approach.** Three.js r170 `WebGLRenderer` + `OrbitControls` + `GLTFLoader` (`games/3d-lab/js/viewer.js` lines 1–3). Not a from-scratch WebGL engine.
- **Custom shaders / lighting (first-party).**
  - Pin focus: GLSL `FOCUS_VERT` / `FOCUS_FRAG` (lines 5–25) dim and desaturate by world-space distance to a focus point; injected with `material.onBeforeCompile` (`_installFocus`, lines 322–349+).
  - Cheap DoF-like mix: `MIX_VERT` / `MIX_FRAG` (27–49) lerp a sharp RT vs a smaller blur RT by UV distance to focus. `_initPost` builds `ShaderMaterial` (191–214).
  - `specGlossPlugin` (51–78) maps `KHR_materials_pbrSpecularGlossiness` to metalness/roughness so older Sketchfab materials load.
  - Lights: hemisphere/dir/rim setup in the same viewer (rim around lines 184–186); not a custom BRDF paper.
- **Performance techniques.** Dual render targets for the mix pass. Three.js default frustum culling may apply to meshes; **first-party code does not implement** LOD, GPU instancing, texture atlasing, or object pooling. `_setIsolate` (`viewer.js` 520+) darkens non-selected meshes but has **no callers** besides its definition. Catalog blurbs still say “Tap a number to isolate” (`catalog.js` line 23) — UI does not call isolate.
- **Assets / pipeline.** `export const CATALOG` has **33** `file:` GLB entries (`catalog.js`). `MODEL_BASE = "/sketchfab%20models/"` (line 415). Pins: `localStorage` key `gq-3d-lab-pins-v1` (`games/3d-lab/js/app.js` lines 7, 11–23); defaults in `annotations.js` snap to named nodes (`target`) or local XYZ. `.glb` files are gitignored (`.gitignore` `sketchfab models/*.glb`). **No** in-repo Draco/meshopt bake script. Physics: **none** (no cannon/ammo/rapier in `games/3d-lab/js`).

# 5. Novelty & Technical Contribution Candidates

What is **more than using a library the normal way**, without inflating it:

1. **Curriculum-shaped save + gates.** 10×10 grid, `inHub` restore, fluency ≥ 0.8 (or sub-8 complete) before mastery sub-9, concept-log cap 200, SOLO **names from stars**. This is a **coherent product schema**. It is **not** a validated learning-science result. The code states adaptive content swap is **not** implemented (`pedagogy.js` line 75).
2. **Book spine + glossary → proxied Socratic chat.** Theory tags (`book-theory.js`) + longest-first term linking + phase/tier prompts + Groq model fallback chain (`groq_proxy.py` 180–197) + local canned tutor + API key off-device. Classroom engineering. **Not** a new NLP method.
3. **Specimen lab focus shaders + editable pins.** World-space focus dim, screen-space blur mix, spec-gloss GLTF plugin, learner-editable pins in `localStorage`. Visualization **craft**. Not a graphics-systems contribution (no LOD/culling/benchmarks). Isolate is unfinished relative to catalog copy.
4. **Clone-and-specialize 2D labs.** 23/28 arenas are identical copies; 28 `boot-l1.js` files all differ. An **authoring-process** observation (scalability problem), not a novel engine architecture.

**Not novel:** Laravel Sanctum, Filament CRUD, `localStorage`, Canvas `requestAnimationFrame`, Three.js GLTF + orbit, PyInstaller/desktop stubs.

**No in-repo performance or learning benchmarks** (no before/after FPS, no ablation of the fluency gate, no learning-gain table).

**Plain assessment:** a Q1 **CS systems / graphics** paper is **not** supported by this codebase as it stands. A possible **education-technology / CHI / vis-for-learning case study** would rest on the *combination* (mission hub + book + LLM tutor + 3D pins, offline-first, bilingual chrome) — still needing an RQ, related work, and evaluation that **are not in the repo**.

# 6. Evaluation, Testing & Metrics Already Present

- **Automated tests.** `games/chemistry-lab/js/activity-controller.test.js`: Node `assert` on `heatPhase`, `shellCountsForProgress`, `pointOnRotatedEllipse` (header lines 1–12). Run comment: `node games/chemistry-lab/js/activity-controller.test.js`. Laravel `backend/tests/Unit/ExampleTest.php` lines 13–15: `$this->assertTrue(true)`. `backend/tests/Feature/ExampleTest.php` `GET /` expects 200. `backend/phpunit.xml` lists Unit + Feature. **No** tests for persist merge, pedagogy gates, Groq proxy, or 3D lab.
- **Benchmarks / profiling.** No first-party FPS overlay, `stats.js`, or timing logs. `performance.now()` is used for animation pulses, not evaluation. Stitch mock `stitch_gyanquest_design_system/.../code.html` line 230 shows the literal `60.0 FPS` — **design mock, not a measured client**.
- **User-facing metrics.** Pedagogy fields in save JSON + optional Sanctum columns. No analytics SDK, A/B assignment, or pre/post instrument in code.
- **Documented results.** Per-game `LEVEL_QA.md` files are **content QA checklists**. No “Raw Future” scores, judge rubric, or user-study numbers anywhere in the repo (search of `.md`/`.html`/`.js`/`.txt`: no Raw Future hits except this audit’s questions).

**No evaluation dataset currently exists in the codebase.**

# 7. Reproducibility Snapshot

- **Run frontend (`README.md` lines 7–13):** copy `.env.example` → `.env`, optional `GROQ_API_KEY`, `py -3 tools/groq_proxy.py`, open `http://127.0.0.1:5500/`. Without chat: `py -3 -m http.server 5500` from repo root.
- **Optional API (`README.md` lines 18–26):** `cd backend`, `.env`, `composer install`, `php artisan key:generate`, `php artisan migrate --seed`, `php artisan serve` → `http://127.0.0.1:8000/api` and `/admin`.
- **3D models:** gitignored `sketchfab models/*.glb`; clone without those files → catalog URLs 404. `audio/` and `3D Assets/` also gitignored (`.gitignore` lines 27–28, 35).
- **Docs for an outsider.** `README.md` is enough to boot the static site. `TECHNOLOGY.md` explains 2D-vs-3D intent but is **partly stale** vs the live Specimen Lab link. `editor-packs/` and `EDITOR-CURRICULUM-BIBLE.md` help authors. `MEGA-FEATURES.md` is untracked and mixes shipped vs proposed. Engine comments are readable; 28-way `boot-l1.js` clones are hard to treat as one engine.
- **Reproducible research artifact:** **partial** (runnable demo if local assets exist; **not** a reproducible experiment).

# 8. Gaps Against Typical Research-Paper Requirements

- **[ ] A clearly stated problem/research question** — **Missing.** README/tech docs state a **product** (mission games for Bangladesh schools). No RQ, hypothesis, or gap statement vs prior ITS/vis/games papers.
- **[ ] A method section’s worth of describable technical approach** — **Partial.** Hub, save schema, book spine, Groq fallback chain, and 3D pin+shader path are describable as a **system**. There is no methods protocol (sampling, intervention vs control, analysis plan).
- **[ ] Comparison against existing tools/approaches (related work)** — **Missing** as academic related work. `TECHNOLOGY.md` lines 29–35 compare Unity/Phaser/Pixi as **stack choices**, not as empirical baselines (no PhET, Kahoot, Duolingo, Moodle study).
- **[ ] Quantitative evaluation/results** — **Missing.** No learning gains, time-on-task, workload scales, FPS tables, or fluency-gate ablation.
- **[ ] Reproducible setup** — **Partial.** README + proxy + artisan steps exist; large gitignored GLBs/audio; 7-commit history does not capture full authoring; untracked desktop/MEGA files.
- **[ ] A discussion of limitations** — **Partial.** `pedagogy.js` line 75 admits no adaptive content swap; `mission-status.js` lines 1–3 admit a small uniqueness-pass set; `TECHNOLOGY.md` limits 3D to a playground (now inconsistent with Specimen Lab). No paper-style threats-to-validity section.

# 9. Open Questions for the Author

1. What is the **research question** (if any), versus a product/demo for a competition?
2. What was **“Raw Future” / “second place”** judged on? Scores, rubric, written judge feedback? (Not in repo. Commit `f634ae4` mentions “BrainChild pitch materials” — those materials’ claims are **UNKNOWN — needs author input**.)
3. **Team size**, roles, and who owns engine vs each game vs 3D lab vs Laravel. `editor-packs/README.md` names Tahsan, Mohaimenul, Mufrid, Tanha as curriculum pack owners — not a paper contribution table.
4. **True development calendar** before `2026-08-07` (`git log` is 7 commits / ~16 days).
5. **Target learners** (grade, NCTB mapping, rural vs urban). Was Bengali **mission content** (not chrome) user-tested?
6. Was **“online” 3D** ever meant as multiplayer, or only “opens in a browser + optional login”? Code is single-player.
7. Any **school pilot** (n, hours, pre/post tests) stored outside git?
8. Why **clone 28 arenas** (23 identical) instead of one `engine/js/arena-2d.js`? Authoring experiment or time pressure?
9. Is SOLO-from-stars considered a **valid SOLO assessment**, or a reward skin? Any expert review?
10. Groq tutor: any **safety/accuracy** audit vs hallucination on science terms?
11. Intended **venue** (EdTech vs graphics vs CHI)? That changes whether shaders vs pedagogy matter.
12. `postResponse` unused — was a writing study planned?
13. Specimen lab: who authored pins? Inter-rater agreement? Curriculum alignment per specimen? Why is isolate unimplemented while catalog copy promises it?
14. Desktop `GyanQuest-Setup.exe` / `Install.exe` — in or out of a paper’s “system”?
15. Ethics / IRB if any minors used the build.
16. Should `TECHNOLOGY.md` still claim Force Fighter 3D playground as the live 3D path, given landing + `games/3d-lab/`?

---

*Audit method: repository files + `git log` / `git status` (7 commits, 2026-08-07 → 2026-08-23; untracked MEGA-FEATURES and desktop tools noted). Claims not evidenced in code are marked UNKNOWN. `MEGA-FEATURES.md` treated as a wishlist unless implemented.*
