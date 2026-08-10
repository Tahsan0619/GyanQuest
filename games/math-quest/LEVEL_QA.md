# Math Quest - LEVEL_QA

Uniqueness + completion pass (GyanQuest). Shared `engine/*.js` untouched. Gold standard: `games/chemistry-lab/js/level1.js` (Tiny Bits) fitted to **Number Sense** (tens & ones / place value - not chemistry particle zoom).

## Mission 1 - Number Sense (`js/level1.js` + `js/num-scenes.js`)

### Already good (left alone)
| Sub | Title | Notes |
|-----|--------|--------|
| 1 | Meet Tens & Ones | Motion chain: ten-rod, cubes, egg carton → TENS\|ONES chart → 23 ≠ 2+3 |
| 2 | Build a Number | HeatLab already had `sliderLabel: "Build value"` + place-value `readoutLabels` |
| 3 | Sort: Tens or Ones? | Tens / Ones / Not place value zones (rod, taka, eggs vs letter/color) |
| 4 | Place Chart Lab | HeatLab place labels; reveal steps for bundling → columns → value |
| 5 | Why Place Matters | Order + 32 vs 23 reveal + quiz |
| 6 | Name the Place Rule | Equation + ScaleLab with place scrubber labels (ones → ten-rod → chart) |
| 7 | Stretch: BD Stories | Eggs, taka, cricket, bus, beads modes |
| 8 | Myth Bust | Place-value myths (23≠2+3, ten-rod, 32≠23, zero, everyday) |
| 9 | Fluency Drill | Prompt-aware tens/ones checks |
| 10 | Number Scout Mastery | Bruner path → market+cricket case → multi-quiz |

### Fixed this pass
| Item | Problem | Fix | Confirmation |
|------|---------|-----|----------------|
| `L1_META.predict` | Generic “Guessing without checking” | Number Sense predict: what makes 23 ≠ 2+3 → place names value | Code: `js/level1.js` `L1_META.predict` |
| `L1_META.bdHook` | Vague “notice tens & ones around you” | Egg cartons, 10-taka notes, cricket scores | Code: `js/level1.js` `L1_META.bdHook` |
| HeatLab defaults | Fallback still said “molecules locked” / “Heat energy” if labels omitted | Math defaults: **Build value** + Small number → Growing → Near goal → Place value power | Code: `js/lab-activities.js` `mountHeatLab` |
| ScaleLab | Chemistry defaults risk | Already place-value defaults + L1 passes overrides | Code: slider “Place scale: ones → ten-rod → chart”; readouts low/mid/high place copy |
| QA jump | Boot always `showHub()`; jump helper missing `gq-qa-jump` | Boot resumes when `sessionStorage gq-qa-jump === "1"`; helper sets flag + `gq-math-quest-save-v2` | Live: jump landed on Step 2 Build a Number |

### Visual confirmation (local `http://127.0.0.1:5500`)
Opened `tools/_qa-jump-math.html?level=0&sub=1` → resumed mid-mission (not hub).

**Build a Number lab (sub 2):**
- Slider label: **Build value** (not Heat energy)
- Readout: **Small number - add tens** (not molecules locked / salt grain)
- Coach: tens/ones dial to reach 25+
- Canvas description: “Drag to build a number - tens and ones.”
- Step rail: Number Sense titles (Meet Tens & Ones, Build a Number, …)

**Passed:** lab UI is number-topic, not chemistry.

### Support changes
- `js/boot-l1.js` - `gq-qa-jump === "1"` → `resumePlaySession()`; else `showHub()`.
- `tools/_qa-jump-math.html` - writes `gq-math-quest-save-v2` + `sessionStorage.setItem("gq-qa-jump", "1")`.
- `js/lab-activities.js` - HeatLab math-safe defaults; ScaleLab already had place-value override support.

## Missions 2-3
Out of scope this pass (Fraction Friends / later).

## STUB missions
Skipped.

## Shared
- No `engine/*.js` changes.
- Work limited to `games/math-quest/` + `tools/_qa-jump-math.html`.
