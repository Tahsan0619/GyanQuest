# Electrical Basics - LEVEL_QA

Uniqueness + completion pass (GyanQuest). Shared `engine/*.js` untouched. Gold standard: chemistry-lab Tiny Bits form fitted to **Circuit Loop** (closed path / bulb light) - not melt / salt-grain chemistry.

## Mission 1 - Circuit Loop (`js/level1.js` + `js/circuit-scenes.js`)

### Already good (left alone / topic-fit confirmed)
| Sub | Title | Visual confirmation |
|-----|--------|---------------------|
| 1 | Meet the Loop | Desk kit → glow → predict → settle |
| 2 | Close the Path Lab | Loop-close dial; open gap → closed path lights bulb |
| 3 | Sort Loop Parts | Closed loop / Open gap / Not a circuit |
| 4 | Brighter Loop Lab | Stronger close (~75%); continuity, not new electricity |
| 5 | Why the Bulb Lights | Order: battery → path → switch → glow |
| 6 | Name the Loop Rule | Equation + Loop ScaleLab (torch → parts → CLOSED LOOP) |
| 7 | Stretch: Places | Home / school / street / shop / lab |
| 8 | Myth Bust | Scrap wire, battery alone, open switch brighter, wood path, experts-only |
| 9 | Fluency Drill | Prompt-aware gap / closed / bulb checks |
| 10 | Loop Learner Mastery | Bruner path + torch case + multi-quiz |

### Fixed this pass
| Item | Problem | Fix | Confirmation |
|------|---------|-----|----------------|
| `L1_META.predict` | Generic “Looking for a clear pattern or rule” | Torch dark with fresh battery → open gap / switch | Code: `js/level1.js` `L1_META.predict` |
| `L1_META.bdHook` | Vague “then connect it to Circuit Loop” | Torch / room light / school kit clip - closed path | Code: `js/level1.js` `L1_META.bdHook` |
| HeatLab defaults | Fallback “Heat energy” / “molecules locked” | Circuit defaults: **Loop close** + Wide gap→Closed loop | Code + live: Close the Path Lab slider **Loop close**; readout **Wide gap - path open, bulb dark** |
| ScaleLab defaults | Salt grain → ions → orbitals risk | Circuit defaults: torch → parts → CLOSED LOOP; L1 already passes overrides | Code: `js/lab-activities.js` `mountScaleLab` |
| QA jump | Save only; always `showHub()` | `gq-qa-jump=1` → `resumePlaySession()` | Live: `_qa-jump.html?level=0&sub=1` |

### Visual confirmation (local `http://127.0.0.1:5500`)
Opened `_qa-jump.html?level=0&sub=1` → resumed mid-mission (not hub).

**Close the Path Lab (L1 sub 2):**
- Slider: **Loop close** (not Heat energy)
- Readout: **Wide gap - path open, bulb dark** (not molecules / salt)
- Canvas: battery / switch / wires / bulb; drag handle to close path
- Mission: **Circuit Loop** step rail (Step 2 active)

**Passed:** lab UI is Circuit Loop topic (closed path / bulb), not chemistry.

## Mission 2 - Voltage & Current
Out of scope for this pass (do not rebuild level2).

## Mission 3 - Safe Power
Out of scope for this pass (do not rebuild level3).

## Support
- `js/lab-activities.js` - HeatLab / ScaleLab Circuit Loop-safe defaults (no molecules / salt / Heat energy).
- `js/boot-l1.js` - `sessionStorage gq-qa-jump === "1"` → `resumePlaySession()`; else `showHub()`.
- `games/electrical-basics/_qa-jump.html` - writes `gq-electrical-basics-save-v2` + `gq-qa-jump=1`.
- Cache-bust `?v=circuitqa1` on `main.js` / boot imports (`lab-activities`, `level1`, `circuit-scenes`).

## Shared
- No `engine/*.js` changes.
- Work limited to `games/electrical-basics/`.
