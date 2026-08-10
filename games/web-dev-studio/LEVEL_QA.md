# Web Dev Studio - LEVEL_QA

Uniqueness + completion pass (GyanQuest). Shared `engine/*.js` untouched. Gold standard: chemistry-lab Tiny Bits form fitted to **HTML House** (structure tags), **CSS Style** (look & layout), and **JS Click** (interaction) - not melt / salt-grain chemistry.

## Mission 1 - HTML House (`js/level1.js` + `js/html-scenes.js`)

### Already good (left alone / topic-fit confirmed)
| Sub | Title | Visual confirmation |
|-----|--------|---------------------|
| 1 | Meet the Tag House | House desk → glow links → settle; exit check on `<body>` |
| 2 | Open Rooms Lab | Rooms dial + house tags; copy opens rooms not melt |
| 3 | Sort Structure | Structure / Style-script / Not (cake, sock) |
| 4 | Build More Rooms | Higher rooms threshold; nested-tag readouts |
| 5 | Why Nest Tags | Order wrap → head → body → close |
| 6 | Name the House Rule | Tags / Nest / Close / House equation |
| 7 | Stretch: Real Pages | Home / school / shop / BD news / blog |
| 8 | Myth Bust | Open tags, CSS≠HTML, giant div, etc. |
| 9 | Fluency Drill | Prompt-aware HTML checks |
| 10 | HTML Builder Mastery | Bruner path + Builder CTA |

### Fixed this pass
| Item | Problem | Fix | Confirmation |
|------|---------|-----|----------------|
| `L1_META.predict` | Generic “Guessing without checking” | Visible heading lives in `<body>` inside `<html>` house | Code: `js/level1.js` `L1_META.predict` |
| `L1_META.bdHook` | Vague “notice structure tags around you” | School notice, family photo blog, BD news headline | Code: `js/level1.js` `L1_META.bdHook` |
| HeatLab defaults | Fallback “Heat energy” risk | Web defaults: **Build / style / click level** + Quiet page→Strong | Live: Open Rooms Lab slider **Rooms**; readout **Shell only - few tags lit** |
| ScaleLab defaults | Salt grain → ions → orbitals | Web defaults: page → style/detail → rule | Code: `js/lab-activities.js` `mountScaleLab` |

### Visual confirmation (local `http://127.0.0.1:5500`)
Opened `_qa-jump.html?level=0&sub=1` → resumed mid-mission (not hub).

**Open Rooms Lab (L1 sub 2):**
- Slider: **Rooms** (not Heat energy)
- Readout: **Shell only - few tags lit** (not molecules / salt)
- Canvas: `<html>` / `<head>` / `<body>` house + “Drag - more tags = more rooms”
- Mission: **HTML House** step rail

**Passed:** lab UI is HTML-topic, not chemistry.

## Mission 2 - CSS Style (`js/level2.js` + `js/css-scenes.js`)

### Already good (left alone / topic-fit confirmed)
| Sub | Title | Visual confirmation |
|-----|--------|---------------------|
| 1 | Meet Color Size Space | Paint pots → preview links → settle |
| 2 | Style Dial Lab | Style dial; color/size/gap grow |
| 3 | Sort CSS Look | CSS / HTML / Not (onclick, rice) |
| 4 | Stronger Style Lab | Higher style threshold |
| 5 | Why Clear Look | Select → style → see → fix |
| 6 | Name the Style Rule | Select / Style / Look / Clear |
| 7 | Stretch: Surfaces | Poster / school / shop / BD ad / app |
| 8 | Myth Bust | Rainbow colors, tiny text, spacing, etc. |
| 9 | Fluency Drill | Prompt-aware CSS checks |
| 10 | Style Star Mastery | Bruner path + Style Star CTA |

### Fixed this pass
| Item | Problem | Fix | Confirmation |
|------|---------|-----|----------------|
| `L2_META.predict` | Generic “Guessing without checking” | CSS look rules: color, font-size, margin | Code: `js/level2.js` `L2_META.predict` |
| `L2_META.bdHook` | Vague “notice look & layout” | School poster, shop card gaps, rickshaw ads | Code: `js/level2.js` `L2_META.bdHook` |
| HeatLab / ScaleLab | Chemistry fallback risk | Web defaults + L2 overrides (Style / Gray→Sky accent) | Live: Style Dial Lab |

### Visual confirmation (local `http://127.0.0.1:5500`)
Opened `_qa-jump.html?level=1&sub=1` → resumed mid-mission.

**Style Dial Lab (L2 sub 2):**
- Slider: **Style** (not Heat energy)
- Readout: **Gray & cramped - hard to read**
- Canvas: styled preview + “Drag - stronger CSS look”
- Mission: **CSS Style** step rail

**Passed:** lab UI is CSS-topic, not chemistry.

## Mission 3 - JS Click (`js/level3.js` + `js/js-scenes.js`)

### Already good (left alone / topic-fit confirmed)
| Sub | Title | Visual confirmation |
|-----|--------|---------------------|
| 1 | Meet the Click | Button → onClick spark → Changed! bubble |
| 2 | Click Energy Lab | Energy dial / tap; event → code → change |
| 3 | Sort Reactions | Reaction / Static / Not (rock, tea) |
| 4 | Stronger Click Lab | Higher click threshold |
| 5 | Why Pages React | Tap → run → change → alive |
| 6 | Name the Click Rule | Event / Code / Change / Alive |
| 7 | Stretch: Real Taps | Game / form / kiosk / class / home |
| 8 | Myth Bust | HTML alone ≠ react, JS not only games, etc. |
| 9 | Fluency Drill | Prompt-aware click checks |
| 10 | Click Coder Mastery | Bruner path + Click Coder CTA |

### Fixed this pass
| Item | Problem | Fix | Confirmation |
|------|---------|-----|----------------|
| `L3_META.predict` | Generic “Guessing without checking” | Event (click/tap) runs JS that changes the page | Code: `js/level3.js` `L3_META.predict` |
| `L3_META.bdHook` | Vague “notice interaction around you” | Game Start, quiz A/B/C, BD ticket kiosk | Code: `js/level3.js` `L3_META.bdHook` |
| HeatLab / ScaleLab | Chemistry fallback risk | Web defaults + L3 overrides (Energy / Waiting→Alive) | Live: Click Energy Lab |

### Visual confirmation (local `http://127.0.0.1:5500`)
Opened `_qa-jump.html?level=2&sub=1` → resumed mid-mission.

**Click Energy Lab (L3 sub 2):**
- Slider: **Energy** (click energy - not Heat energy / molecules)
- Readout: **Waiting… no event yet**
- Canvas: CLICK ME + `onClick() { change }` + Energy %
- Mission: **JS Click** step rail

**Passed:** lab UI is JS-interaction topic, not chemistry.

## Support
- `js/lab-activities.js` - HeatLab / ScaleLab web-dev-safe defaults (no molecules / salt / Heat energy).
- `js/boot-l1.js` - `sessionStorage gq-qa-jump === "1"` → `resumePlaySession()`; else `showHub()`.
- `games/web-dev-studio/_qa-jump.html` - writes `gq-web-dev-studio-save-v2` + `gq-qa-jump=1`.
- Cache-bust `?v=webqa2` on `main.js` / boot imports (`lab-activities`, `level1`-`level3`, scenes) and `index.html`.

## Shared
- No `engine/*.js` changes.
- Work limited to `games/web-dev-studio/`.
