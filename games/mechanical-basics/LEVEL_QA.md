# Mechanical Basics - LEVEL_QA

Uniqueness + completion pass (GyanQuest). Shared `engine/*.js` untouched. Gold standard: chemistry-lab Tiny Bits form fitted to **Levers & Gears** (force/distance/turn trade) - not melt / salt-grain chemistry.

## Mission 1 - Levers & Gears (`js/level1.js` + `js/lever-scenes.js`)

### Already good (left alone / topic-fit confirmed)
| Sub | Title | Visual confirmation |
|-----|--------|---------------------|
| 1 | Meet Lever & Gear | Desk machines → glow → predict → settle |
| 2 | Advantage Dial | Mechanical-advantage dial; low push → easier lift |
| 3 | Sort Machines | Lever / Gear / Neither |
| 4 | Stronger Advantage | Stronger trade (~75%); same lever + gear model |
| 5 | Why It Helps | Order: fulcrum → effort arm → load rises → gears retune |
| 6 | Name the Machine Rule | Equation + Machine ScaleLab (desk → arms → RULE) |
| 7 | Stretch: Places | Home / school / street / bike shop / lab |
| 8 | Myth Bust | Heavier-only, gears look cool, fulcrum irrelevant, factories-only, infinite force |
| 9 | Fluency Drill | Fulcrum / gear turn / glue / effort arm / scissors / ramp |
| 10 | Lever Learner Mastery | Bruner path Meet → Sort → Lab → Rule → Myth → Win |

### Fixed this pass
| Item | Problem | Fix | Confirmation |
|------|---------|-----|----------------|
| `L1_META.predict` | Generic “Looking for a clear pattern or rule” | Drain cover / short pry → longer effort arm or gear trade | Code: `js/level1.js` `L1_META.predict` |
| `L1_META.bdHook` | Vague “then connect it to Levers & Gears” | Seesaw / bottle opener / bike gears on a flyover | Code: `js/level1.js` `L1_META.bdHook` |
| HeatLab defaults | Fallback “Heat energy” / “molecules locked” | Lever defaults: **Mechanical advantage** + Low advantage→High advantage | Code + live: Advantage Dial slider **Mechanical advantage**; readout **Low advantage - hard push needed** |
| ScaleLab defaults | Salt grain → ions → orbitals risk | Lever defaults: desk tools → arms labeled → RULE; L1 already passes overrides | Code: `js/lab-activities.js` `mountScaleLab` |
| QA jump | Save only; always `showHub()` | `gq-qa-jump=1` → `resumePlaySession()` | Live: `_qa-jump.html?level=0&sub=1` |

### Visual confirmation (local `http://127.0.0.1:5500`)
Opened `_qa-jump.html?level=0&sub=1` → resumed mid-mission (not hub).

**Advantage Dial (L1 sub 2):**
- Slider: **Mechanical advantage** (not Heat energy)
- Readout: **Low advantage - hard push needed** (not molecules / salt)
- Canvas: lever beam + meshing gears; drag handle to boost advantage
- Mission: **Levers & Gears** step rail (Step 2 active)

**Passed:** lab UI is Levers & Gears topic (force/distance/turn trade), not chemistry.

## Mission 2 - Motion Machines
Out of scope for this pass (do not rebuild level2).

## Mission 3 - Forces at Work
Out of scope for this pass (do not rebuild level3).

## Support
- `js/lab-activities.js` - HeatLab / ScaleLab Levers & Gears-safe defaults (no molecules / salt / Heat energy).
- `js/boot-l1.js` - `sessionStorage gq-qa-jump === "1"` → `resumePlaySession()`; else `showHub()`.
- `games/mechanical-basics/_qa-jump.html` - writes `gq-mechanical-basics-save-v2` + `gq-qa-jump=1`.
- Cache-bust `?v=leverqa1` on `main.js` / boot imports (`lab-activities`, `level1`, `lever-scenes`).

## Shared
- No `engine/*.js` changes.
- Work limited to `games/mechanical-basics/`.
