# GyanQuest — Mega Features We Can Add

Ideas that would turn GyanQuest from a **library of mission games** into a **national learning platform**. These are not polish tickets. Each one is a product in its own right, but every item below can grow out of code we already have.

**What we already ship (do not rebuild):**

- 28 Canvas 2D subject games + 10-mission hubs + digital books + Groq tutor
- Offline-first saves (`localStorage` save-v2) with optional Sanctum sync
- Pedagogy telemetry already in the save blob: SOLO tiers, fluency, predictions, streaks, concept log
- 3D Specimen Lab with numbered pins and learner-editable pin JSON
- Laravel + Filament admin (approve students, crude progress view)

**The real gap:** ~52 of 280 mission slots are playable. The rest of this list assumes we keep filling those, *and* add the layers that make schools actually adopt the product.

---

## How to read this

| Tag | Meaning |
|-----|---------|
| **Impact** | Why this is “mega” for Bangladesh classrooms |
| **Builds on** | Existing files / data we should reuse |
| **First slice** | Smallest version that still feels like the feature |

Priority order at the bottom is a suggested build sequence, not a commitment.

---

## 1. ClassQuest — Teacher classroom OS

**Impact.** Schools will not roll this out as “kids open a URL.” Teachers need a roster, a “do this by Friday,” and a view of who is stuck.

**What it is.** A teacher role (today we only have `student` | `admin`) with:

- School → class → section → student roster
- Assign a **mission** (or a book) with a due date
- Live board: who finished, who is looping on the same step, who never opened it
- One-click “unlock this book for my class”
- Export a simple CSV / PDF for the head teacher

**Builds on.** `User` roles, `GameProgress` JSON, Filament panel, `concept_logs`. The save schema already has `levels_completed_count`, fluency, streaks, and concept log.

**First slice.** Teacher login + create one class + assign Force Fighter Mission 1 + a “stuck students” list (no new gameplay).

---

## 2. Misconception radar (real analytics)

**Impact.** Admins currently see four counters. Teachers need *what the class actually believes*.

**What it is.** Heatmaps per mission step:

- Most-failed tap / drag / equation
- Myth-card items the class still picks
- Glossary terms students tap but cannot rebuild in their own words
- Fluency drill pass-rate before Mastery (step 9 → 10)

Surface it as: “This class still thinks force needs continuous pushing” rather than “completion = 62%.”

**Builds on.** `written_responses` (API exists, **frontend never posts**), `concept_logs` (already posted from the book chat), `fluencyScores`, `predictions`, `hintTiers` in save-v2.

**First slice.** Wire `postResponse()` from glossary-build + quiz fails, then one Filament page: top 10 missed ideas this week.

---

## 3. Adaptive spiral engine

**Impact.** Pedagogy comments already admit we do **not** swap content on failure — we only simplify coach text after 2 wrongs. Adaptive is the difference between a game and a tutor.

**What it is.** A small rules engine that, using the existing 10-step Bruner spine:

- After 2 fails → swap the *same concept* to a simpler arena (fewer distractors)
- After a fast fluency pass → skip the easy intro on the next mission
- Spaced return: if “Newton 1” was shaky 3 days ago, inject a 60-second recall at hub open
- Keep SOLO tiers as the public reward; hide the difficulty swap from the kid

**Builds on.** `engine/js/pedagogy.js` (`wirePedagogy`), fluency gate, streaks, `conceptLog`.

**First slice.** One game (Force Fighter or Chemistry) with an alternate “lite” arena for step 4 and 7 only.

---

## 4. Full বাংলা curriculum (not just the chrome)

**Impact.** Landing promises “strict language modes.” The shell is bilingual; **mission copy, books, and scenes are mostly English.** For village classrooms this is the actual product.

**What it is.**

- Every live mission: coach lines, chip labels, quiz stems, myth cards in `bn`
- Digital books with BN pages (same 8-page spine)
- Tutor system prompt that stays in the UI language
- Optional NCTB term list so BN is textbook-accurate, not Google-translate casual

**Builds on.** `engine/locales/en.json` + `bn.json`, landing `COPY.bn`, 3D lab `games/3d-lab/js/i18n.js`. Force Fighter already has extra locale extracts.

**First slice.** Finish BN for the four gold games (Force Fighter, Chemistry Lab, Bio Explorer, Web Dev Studio) end-to-end.

---

## 5. Voice coach + low-literacy mode

**Impact.** Shared family phones, mixed reading levels, ages 9–14. Voice is how this works in a noisy classroom.

**What it is.**

- Play coach lines as `bn-BD` / `en-US` TTS, with optional pre-recorded WAVs
- “Listen to this book page” button
- Tap-to-hear glossary terms before the Groq tutor
- Respect data: default TTS on-device; WAVs only when `/audio/<game>/<locale>/` exists

**Builds on.** `engine/js/voice.js` already exists and is **wired only in legacy `boot.js`**. Live `boot-l1.js` games do not import it. `audio/` is gitignored.

**First slice.** Hook `voice.js` into one `boot-l1.js` (Chemistry) for intro + coach dock only.

---

## 6. Specimen Lab → mission deep link (3D practicals)

**Impact.** The 3D lab is the most distinctive thing we have, and it is currently a side toy. Competitors are quiz apps; we have real meshes + editable pins.

**What it is.** Missions that open a specimen with a task:

- “Pin the mitochondria, then return to Cell City”
- “Isolate the heart chambers, then answer the 2D quiz”
- Teacher-shared pin sets (JSON already export/import)
- Practical exam mode: numbered pins, timed, scored, no free orbit until submit

**Builds on.** `games/3d-lab/` catalog (33 specimens), pin store `gq-3d-lab-pins-v1`, Sketchfab models.

**First slice.** Bio Explorer Mission 2 (Cell City) “Open specimen” button → cell model with 3 required pins.

---

## 7. Force Fighter 3D playground revival

**Impact.** Docs already argue 3D belongs in a **sandbox**, not in every lesson. We built that sandbox and then unlinked it.

**What it is.** Bring `games/force-fighter/_legacy3d/` back as a named mode: **Physics Playground**.

- Free-play after Mission 3 (or teacher unlock)
- Challenges: “make the crate move without touching it for 2 seconds”
- Save playground snapshots into progress
- Keep Canvas 2D as the curriculum path (do not 3D-ify the 10-step missions)

**Builds on.** Legacy Three.js arena, `engine/js/boot.js`, `engine/js/arena.js`.

**First slice.** A hub card “Playground (3D)” that opens the old sandbox with a back-to-hub button.

---

## 8. Knowledge constellation (cross-game map)

**Impact.** Kids play 28 silos. The concept log is capped at 200 terms per game and never becomes a *map of what they know*.

**What it is.** A home-screen constellation:

- Nodes = glossary terms / NCTB outcomes
- Edges = “you used this in Chemistry *and* Force Fighter”
- Dim nodes you have not rebuilt in your own words
- Teacher view: class-level gaps (“energy” weak across Eco, Electrical, Green Tech)

**Builds on.** `engine/js/concept-viz.js` (`openConstellation`), `conceptLog` in persist, `POST /api/concept-logs`.

**First slice.** Landing “My map” for logged-in students: union of concept logs across games, click a node → last book page.

---

## 9. Installable classroom pack (PWA + offline kit)

**Impact.** “Any device, no install” is good. School Wi‑Fi dying mid-mission is the real constraint. We are offline-first for *saves*, not for *assets*.

**What it is.**

- `manifest.json` + service worker: cache engine, current game, books, one specimen
- “Download this game for offline” on the hub
- USB / LAN classroom pack: one teacher laptop runs `groq_proxy.py` + Laravel; phones hit `http://teacher-ip:5500`
- Optional: no-Groq classroom mode with local_explain only (already a proxy fallback)

**Builds on.** Static frontend, proxy on 5500, localStorage saves.

**First slice.** PWA install on Android Chrome + cache of Force Fighter + engine CSS/JS.

---

## 10. NCTB / exam-board mission map

**Impact.** Head teachers ask “does this cover Class 8 science, chapter 3?” If we cannot answer, we stay a demo.

**What it is.** Each mission tagged with:

- Class (6–10), subject, chapter / competency code
- SSC / Dakhil topic tags for the CS & engineering tracks
- Landing filter: “Class 8 Physics” → Force Fighter M1–M3 + relevant books
- Printable coverage sheet for the school inspector

**Builds on.** `missions-meta.js` per game, editor packs (`editor-packs/`, `EDITOR-CURRICULUM-BIBLE.md`).

**First slice.** Tag the four gold games’ live missions; add a Class / Subject filter on the landing catalog.

---

## 11. Live class session (same room, not multiplayer MMO)

**Impact.** True multiplayer is expensive and the wrong fit. A *teacher-paced room* is mega and doable.

**What it is.** Teacher starts a session code. Students join on phones.

- Teacher locks everyone on Mission 2, step 4
- “Show your prediction” — class histogram of predict chips
- Freeze / unfreeze arenas
- End with a 3-question boss quiz, scores on the board
- Works on LAN; no accounts required if the teacher issued guest names

**Builds on.** Pedagogy predict/reflect, quiz steps, optional Sanctum.

**First slice.** Session code + force-open one mission URL + teacher sees “N students on step X” (presence only).

---

## 12. Learner passport + parent snapshot

**Impact.** Completion stars stay trapped in one phone’s `localStorage`. Parents and next year’s teacher cannot see anything.

**What it is.**

- Student passport: games touched, SOLO mix, fluency medals, books unlocked, 3D pins authored
- Share link / QR (read-only) for parents — no extra parent account in v1
- Certificate PDF: “Completed Chemistry Lab Missions 1–3”
- Optional parent weekly SMS/email later (not v1)

**Builds on.** `GameProgress` blobs, rewards + SOLO, book unlock rules.

**First slice.** Logged-in landing: passport card + download PNG certificate for any finished mission.

---

## 13. Author studio (content CMS for the remaining 228 missions)

**Impact.** Filling 280 slots by hand-editing JS does not scale. This is how 10 Coming Soon subjects become real.

**What it is.** A browser editor (teachers / team, not kids):

- Pick activity type (drag-sort, equation, myth card, fluency drill, …)
- Edit coach copy EN/BN
- Attach a book 8-page spine
- Preview the Canvas arena
- Export the same files `levelN.js` / `missions-meta.js` already consume
- Pin JSON editor already exists in 3D lab — same idea for 2D missions

**Builds on.** Shared activity kits (`chem-activities.js` / `force-activities.js` clones), `book-theory.js` page types, editor-pack DOCX curriculum.

**First slice.** Form that writes one myth-card + one quiz JSON and hot-reloads in `_qa-jump.html`.

---

## 14. Safer, smarter tutor (classroom Groq)

**Impact.** The tutor is a differentiator *if* teachers trust it. Right now it is a global FAB with CORS `*` and a generic 9–14 prompt.

**What it is.**

- Tutor grounded on the **open book page + glossary**, not the open web
- Language lock (BN session stays BN)
- Teacher kill-switch and “ask your teacher” fallback (already exists when key is missing)
- Log questions into `written_responses` so radar (feature 2) can see confusion
- Optional: allam / BN-capable models first when locale is `bn`

**Builds on.** `tools/groq_proxy.py`, `engine/js/book-chat.js`, hint `tier` 1–3, local_explain fallback.

**First slice.** Send `{ pageId, term, locale }` and prepend the book paragraph to the system prompt.

---

## 15. School license + lab kiosk mode

**Impact.** The path to national scale is institutions, not viral kids.

**What it is.**

- School org account: N teacher seats, student codes instead of email
- Kiosk: one tablet, many students — PIN to switch learner, no leftover chat history
- Admin: pending approvals already exist; add bulk CSV invite
- No payments required in v1: license = a code in `.env` / Filament

**Builds on.** Register → `status=pending` → Filament approve, Sanctum tokens in `sessionStorage`.

**First slice.** Bulk approve CSV + “kiosk PIN” on the landing auth modal.

---

## What *not* to treat as mega (already the platform)

Do not spend a milestone on these unless they are broken:

- Another 10-card hub or another subject *shell*
- Another Groq chat FAB
- Another Filament student table
- 3D-ifying every lesson (conflicts with `TECHNOLOGY.md`)
- Cloud-only LMS that kills offline play

---

## Suggested build order

If we can only ship three megas after finishing more missions:

| Order | Feature | Why first |
|-------|---------|-----------|
| 1 | **ClassQuest** (teacher class + assign) | Unlocks school pilots |
| 2 | **Misconception radar** | We already store the data; frontend just does not send all of it |
| 3 | **বাংলা content + voice** | Makes the 52 live missions usable in the actual classroom |

Then: PWA offline pack → Specimen Lab practicals → adaptive engine → author studio.

Everything else (passport, live session, NCTB map, playground, license) stacks on ClassQuest.

---

## Honest capacity note

28 games × 10 missions = **280 slots**. About **52** are playable. A mega classroom layer on empty missions will look hollow.

**Parallel tracks:**

- **Content track:** finish uniqueness-pass missions (editor packs already assign owners)
- **Platform track:** ClassQuest + radar + BN/voice

Those two tracks should not wait on each other. ClassQuest can assign Force Fighter Mission 1 tomorrow; content can keep filling Chemistry M4–M10 the same week.
