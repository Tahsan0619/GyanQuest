# Statistics & Probability - LEVEL_QA

Uniqueness + completion pass (GyanQuest). Shared `engine/*.js` untouched. Gold standard: `games/chemistry-lab/js/level1.js` (Tiny Bits) fitted to **Mean & Mode** (sum÷count balance + most-common peak - not chemistry heat melt).

## Mission 1 - Mean & Mode (`js/level1.js` + `js/mean-scenes.js`)

### Already good (left alone)
| Sub | Title | Notes |
|-----|--------|--------|
| 1 | Meet Mean & Mode | Motion chain: data bars → mean line → predict peak → mode stacks |
| 2 | Balance the Mean | HeatLab already had `sliderLabel: "Outlier pull"` + mean/mode `readoutLabels` |
| 3 | Sort: Mean, Mode, or Not? | Mean / Mode / Not a summary zones |
| 4 | Data Peak Lab | HeatLab peak clarity labels; mode stacks + mean line |
| 5 | Why Both Summaries | Order + two-questions reveal + quiz |
| 6 | Name the Average Rule | Equation + ScaleLab with list → mean → mode scrubber |
| 7 | Stretch: BD Data Stories | Marks, prices, cricket, bus, scores modes |
| 8 | Myth Bust | Mean≠mode, mode ties, count divider, everyday |
| 9 | Fluency Drill | Prompt-aware mean/mode checks |
| 10 | Mean Scout Mastery | Bruner path → snack-price case → multi-quiz |

### Fixed this pass
| Item | Problem | Fix | Confirmation |
|------|---------|-----|----------------|
| `L1_META.predict` | Generic “Guessing without checking” | Mean vs mode predict: sum÷count vs most common | Code: `js/level1.js` `L1_META.predict` |
| `L1_META.bdHook` | Vague “notice averages around you” | Class marks, cricket totals, shop price tags | Code: `js/level1.js` `L1_META.bdHook` |
| HeatLab defaults | Fallback still said “molecules locked” / “Heat energy” if labels omitted | Stats defaults: **Data clarity** + clustered → pattern → mean/mode clear → locked | Code: `js/lab-activities.js` `mountHeatLab` |
| HeatLab badge | Fallback `ATOM_ASSET_PATHS.life` / “force lab” | `m1` badge + “data lab” | Code: `js/lab-activities.js` |
| ScaleLab | Chemistry defaults risk | Already Mean & Mode defaults + L1 passes overrides | Code: slider “Average scale: list → mean → mode” |
| QA jump | Boot always `showHub()`; jump helper missing | Boot resumes when `sessionStorage gq-qa-jump === "1"`; `_qa-jump.html` sets flag + save | Live: jump landed on Step 2 Balance the Mean |

### Visual confirmation (local `http://127.0.0.1:5500`)
Opened `games/statistics-probability/_qa-jump.html?level=0&sub=1` → resumed mid-mission (not hub).

**Balance the Mean lab (sub 2):**
- Slider label: **Outlier pull** (not Heat energy)
- Readout: **Data clustered - mean near the crowd** (not molecules locked / salt grain)
- Coach: outlier dial - mean moves, mode stays with crowd
- Canvas tip: “Dial outlier pull - watch the mean line move.”
- Step rail: Mean & Mode titles (Meet Mean & Mode, Balance the Mean, …)

**Passed:** lab UI is mean/mode-topic, not chemistry.

### Support changes
- `js/boot-l1.js` - `gq-qa-jump === "1"` → `resumePlaySession()`; else `showHub()`.
- `_qa-jump.html` - writes `gq-statistics-probability-save-v2` + `sessionStorage.setItem("gq-qa-jump", "1")`.
- `js/lab-activities.js` - HeatLab stats-safe defaults; ScaleLab already had mean/mode override support.
- Cache-bust `?v=meanqa1` on `main.js` / boot imports / `index.html`.

## Missions 2-3
Out of scope this pass (Chance Games / later).

## STUB missions
Skipped.

## Shared
- No `engine/*.js` changes.
- Work limited to `games/statistics-probability/`.
