# Backend Builder - LEVEL_QA

Uniqueness + completion pass (GyanQuest). Shared `engine/*.js` untouched. Gold standard: `games/chemistry-lab/js/level1.js` (Tiny Bits) fitted to **Server Basics**.

## Mission 1 - Server Basics (`js/level1.js` + `js/server-scenes.js`)

### Already good (left alone)
| Sub | Title | Visual confirmation |
|-----|--------|---------------------|
| 1 | Meet Client & Server | Phone (client) + rack (server); REQ/RES phases on canvas |
| 3 | Sort REQ / RES | Request / Response / Not server zones with GET/POST/JSON vs 200/500 vs CSS/cake/sock |

### Fixed
| Sub | Title | Problem | Fix | Visual confirmation |
|-----|--------|---------|-----|---------------------|
| 2 | Request Loop Lab | HeatLab readout still said salt/molecules (“Cold - molecules locked”) | Server `readoutLabels` (Quiet → Request forming → REQ flying → Loop clear); slider **Clarity** | Readout “Quiet - no clear REQ yet”; client↔server REQ/RES + orange clarity handle |
| 4 | Stronger Loop Lab | Same chemistry readout leftover | Same Clarity labels; 200 OK badge when loop clear | (wired; same lab scene) |
| 5 | Why Wait for RES | Thin order+quiz only | Added reveal causal chain (ask → work → reply → show) | (wired; reveal steps) |
| 6 | Name the Server Rule | Equation only; ScaleLab would say salt grain → ions → orbitals | Server ScaleLab labels; `serverRule` desk phone/rack → packets → **REQUEST IN · RESPONSE OUT** banner | Scrubber: “Server scale: desk → packets → REQUEST IN / RESPONSE OUT”; readout “Desk: client phone + server rack” |
| 7 | Stretch: Real Apps | Same generic REQ/RES for every mode; raw `home`/`school` chips | Distinct Home weather+cloud, School browser+grades, Shop cart, BD ticket stub, API lab terminal + friendly chips | Home: Weather phone + Cloud server + GET /wx / JSON; School context copy on Continue |
| 8 | Myth Bust | Claim/truth text only | Per-myth diagrams (browser≠server, CSS≠data, wait for RES, kids can learn, cake≠HTTP) | Myth 1: Browser + Server icons; claim “browser is the server” |
| 9 | Fluency Drill | Generic REQ/RES for every prompt | Prompt-aware visuals (Client phone, Server+RES, CSS swatch, 200 OK, 500, Sock, …) | Drill Q1 canvas prompt “Client” |
| 10 | Server Scout Mastery | Thin pips + plain REQ/RES | Path pips + phone / rack / **200 OK** trio + **Server Scout** banner; multi-quiz mastery path | Mastery canvas: Server Scout banner, Client + Server + 200 OK |

### Support changes
- `js/lab-activities.js` - `mountScaleLab` accepts `sliderLabel`, `goalText`, `readoutLabels` (chem Tiny Bits defaults unchanged when omitted).
- `js/lab-state.js` - default `mode` `home` (was leftover `cat`).
- Cache-bust: `main.js` / `boot-l1.js` / `level1.js` / `server-scenes.js` / `lab-activities.js` (`?v=server1`).
- QA helper: `tools/_qa-jump-backend.html?level=&sub=` (writes `gq-backend-builder-save-v2` + `sessionStorage` qaJump). Boot resumes mid-mission only when that QA flag is set; normal play still opens hub first.

### Pedagogy completion (vs Tiny Bits shape)
- Stretch walkthrough (5 contexts) before transfer quiz.
- Rule: equation → scale scrubber → rule quiz.
- Mastery: Bruner order → weather+portal mixed case → multi-quiz → Server Scout CTA.
- Heat labs no longer leak chemistry phase copy.

## Missions 2-3
Out of scope this pass (Routes & APIs / Auth Lite).

## STUB missions (4-10)
Skipped (`playable: false`).

## Shared
- No `engine/*.js` changes.
- Visual verification via `py -3 -m http.server 5500` on Server Basics subs 2, 6, 7, 8, 9, 10.
