# Force Fighter - LEVEL_QA

Uniqueness + completion pass (GyanQuest). Shared `engine/*.js` untouched. Gold standard: `games/chemistry-lab/js/level1.js` (Tiny Bits) fitted to **inertia / F=ma / force pairs**.

## Mission 1 - The Lazy Rock (`js/level1.js` + `js/rock-scenes.js`)

### Already good (left alone / topic-fit confirmed)
| Sub | Title | Visual confirmation |
|-----|--------|---------------------|
| 1 | Meet the Lazy Rock | Door / ball / sleepy rock desk → wake → coast → settle |
| 3 | Sort: Force or Not? | No net / Balanced / Unbalanced zones with drift, shove, park chips |
| 5 | Why It Coasts | Reveal chain: push ends → low friction coast → name inertia |
| 6 | Name the Inertia Rule | Equation tokens Stay still / or coast / until / FORCE |
| 7 | Stretch: New Contexts | Door / Ice / Space / Belt / Asteroid modes with distinct canvases |
| 8 | Myth Bust | Per-myth sceneMyth indices (forever kick, constant push, rest≠no forces) |
| 9 | Fluency Drill | Prompt-aware inertia checks |
| 10 | Lazy Rock Mastery | Order story + zero-net-force claim |

### Fixed
| Sub | Title | Problem | Fix | Visual confirmation |
|-----|--------|---------|-----|---------------------|
| Meta | Predict / BD hook | Generic “guessing without checking” predict | Rock-specific wake question; rickshaw/football/trolley hook | Hub meta copy topic-fit |
| 2 | Coast & Glide | HeatLab framing (“heating ice”) | `mountForceDial` + Coast speed slider + coast readouts | Rock on lane; readout “Medium coast” → “Fast coast - still flat speed ✓”; Done enables ≥60% |
| 4 | Wall Hit Lab | Thin “Approach” heat dial copy | Approach to wall labels Far→HIT - wall force opposite | (wired; opposite-force quiz) |

## Mission 2 - Push Power (`js/level2.js` + `js/push-scenes.js`)

### Fixed
| Sub | Title | Problem | Fix | Visual confirmation |
|-----|--------|---------|-----|---------------------|
| Meta | Theme / objective | Wrote `F = m / a` (wrong) | Corrected to `F = m·a`; crate light-vs-heavy predict | Meta shows multiplication law |
| Labs | Crate / Live sim | Chemistry heat defaults | Force dial: Force / mass chips; a = F/m readouts | (wired; truck/bike/sofa stretch) |
| Stretch | Contexts | Generic modes | Truck / Bike / Sofa / Rocket / Elevator chips + distinct push canvases | (wired) |
| Myths / Drill / Mastery | Copy | F=ma myths + number drill | Topic claims (F≠speed, not m+a, zero F ≠ zero v) | (wired) |

## Mission 3 - Push & Pull Pairs (`js/level3.js` + `js/pair-scenes.js`)

### Fixed
| Sub | Title | Problem | Fix | Visual confirmation |
|-----|--------|---------|-----|---------------------|
| Meta | Predict | Generic predict | Wall pushes back question | Topic-fit |
| 2 | Watch the Pair | Thin single tap | MotionChain rower → balloon pair acts | (wired) |
| 4 | Rocket Pair Lab | HeatLab melt framing | Throttle dial for exhaust↓ / rocket↑ | (wired) |
| 5 | Rope Scale Lab | Risk of Tiny Bits salt zoom feel | Rope tension dial + “not a Tiny Bits salt zoom” copy; ~120 N quiz | Tension labels Soft→Strong - scale ≈ one side |
| 6 | Walking pairs | Thin | STEP motionChain foot/ground arrows | (wired) |
| Stretch / Myths | Contexts | Generic | Balloon / rower / weight / bug / tug + pair myths | (wired) |

## Support
- `force-activities.js` - `mountForceDial` alias; defaults are push/pull not melt chemistry.
- Cache-bust `?v=forceqa1` on `main.js` / boot imports.
- QA helper: `tools/_qa-jump-force.html?level=&sub=` (+ `gq-qa-jump` session flag → `resumePlaySession` in boot).

## Shared
- No `engine/*.js` changes.
- Visual verification via `py -3 -m http.server 5500`: L1 Coast & Glide interacted (slider + readout + goal unlock).
