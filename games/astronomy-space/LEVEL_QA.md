# Astronomy & Space - LEVEL_QA

Uniqueness + completion pass (GyanQuest). Shared `engine/*.js` untouched. Gold standard: chemistry-lab Tiny Bits form fitted to **Solar Family** (Sun / planets / orbits) - not melt labs or salt zoom.

## Mission 1 - Solar Family (`js/level1.js` + `js/solar-scenes.js`)

### Already good (left alone / topic-fit confirmed)
| Sub | Title | Visual confirmation |
|-----|--------|---------------------|
| 1 | Meet the Solar Family | Desk → glow orbits → predict Earth path → settle family |
| 3 | Sort: Planet / Sun / Other | Planet / Star / Moon·comet / Not-space bins |
| 4 | Closer Orbit Lab | Distance dial + year badge; closer → quicker lap |
| 5 | Why Planets Orbit | Order: Sun → gravity path → orbit → year |
| 7 | Stretch: Sky Places | Home / school / street / BD evening / lab lamp modes |
| 8 | Myth Bust | Sun-orbits-Earth, same-size, Moon=planet, star=planet myths |
| 9 | Fluency Drill | Prompt-aware orbit / Sun / Moon / year checks |
| 10 | Orbit Scout Mastery | Bruner path + lamp-and-ball case + multi-quiz |

### Fixed
| Sub | Title | Problem | Fix | Visual confirmation |
|-----|--------|---------|-----|---------------------|
| Meta | Predict / BD hook | Generic “Guessing without checking” predict; vague bdHook | Solar-specific: who orbits whom; Dhaka rooftop / globe / Venus·Jupiter hook | Hub pedagogy meta is topic-fit (code) |
| Labs | HeatLab defaults | Fallback said “Heat energy” / “molecules locked”; badge “force lab” | Astronomy defaults → Orbit clarity + path readouts; badge “orbit lab”; L1 already passes overrides | **Orbit Clarity Lab** via QA jump: slider “Orbit clarity”; readout “Blurry…” → “Orbits clearer…”; canvas “Orbit blurry” + clarity handle |
| Labs | ScaleLab | Defaults still salt grain → ions → orbitals | Solar defaults desk → paths → PLANETS ORBIT THE SUN | Step 6 ScaleLab labels wired (orbit scrubber) |
| Arena | Backdrop | Green bio/chem desk stage | Deep space starfield + slate desk; fallback scene `solarMeet` | Canvas shows night sky, Sun, faint orbit rings, purple clarity dial |

### Support
- `js/lab-activities.js` - HeatLab/ScaleLab astronomy defaults (not melt / Tiny Bits salt).
- `js/arena-2d.js` - space backdrop; `solarMeet` fallback.
- Cache-bust `?v=solarqa1` on `main.js` / boot imports (`lab-activities`, `level1`, `solar-scenes`, `arena-2d`).
- QA helper: `tools/_qa-jump-astro.html?level=&sub=` writes `gq-astronomy-space-save-v2` + `sessionStorage gq-qa-jump=1` → `resumePlaySession()` in `boot-l1.js`.

## Missions 2-3
Out of scope for this pass (Solar Family / level1 only).

## Shared
- No `engine/*.js` changes.
- Visual verification via `http://127.0.0.1:5500/tools/_qa-jump-astro.html?level=0&sub=1` (Orbit Clarity Lab): space canvas + Orbit clarity slider; goal unlocks ≥60% with orbit readouts (no heat/molecule copy).
