# Civil Basics - LEVEL_QA

Uniqueness + completion pass (GyanQuest). Shared `engine/*.js` untouched. Gold standard: chemistry-lab Tiny Bits form fitted to **Strong Structures** (triangles / load path / braces) - not melt / salt-grain chemistry.

## Mission 1 - Strong Structures (`js/level1.js` + `js/struct-scenes.js`)

### Already good (left alone / topic-fit confirmed)
| Sub | Title | Visual confirmation |
|-----|--------|---------------------|
| 1 | Meet Strong Shapes | Desk frames → load share → braces → settle |
| 2 | Strength Dial | Strength dial; tippy frame → braces + wide base |
| 3 | Sort Strong Ideas | Strong / Weak / Not structure |
| 4 | Stronger Bridge Lab | Truss path (~75%); load reaches ground |
| 5 | Why It Holds | Order: base → braces → path → holds |
| 6 | Name the Structure Rule | Equation + Structure ScaleLab (desk → members → STRUCTURE) |
| 7 | Stretch: Places | Home / school / street / shop / lab |
| 8 | Myth Bust | Taller, triangles-art, base width, braces, concrete-only |
| 9 | Fluency Drill | Prompt-aware triangle / base / brace checks |
| 10 | Structure Scout Mastery | Bruner path + shelf/bridge case + multi-quiz |

### Fixed this pass
| Item | Problem | Fix | Confirmation |
|------|---------|-----|----------------|
| `L1_META.predict` | Generic “Looking for a clear pattern or rule” | Tall bookshelf tips → skinny base / missing braces | Code: `js/level1.js` `L1_META.predict` |
| `L1_META.bdHook` | Vague “then connect it to Strong Structures” | Shelf brackets / model bridges / road trusses / racks | Code: `js/level1.js` `L1_META.bdHook` |
| HeatLab defaults | Fallback “Heat energy” / “molecules locked” | Structure defaults: **Strength (braces + base)** + Tippy→Strong | Code + live: Strength Dial slider **Strength (braces + base)**; readout **Tippy - skinny base, no braces** |
| ScaleLab defaults | Salt grain → ions → orbitals risk | Structure defaults: desk → members → STRUCTURE; L1 already passes overrides | Code: `js/lab-activities.js` `mountScaleLab` |
| QA jump | Save only; always resume on `inHub===false` | `gq-qa-jump=1` → `resumePlaySession()`; else hub | Live: `_qa-jump.html?level=0&sub=1` |

### Visual confirmation (local `http://127.0.0.1:5500`)
Opened `_qa-jump.html?level=0&sub=1` → resumed mid-mission (not hub).

**Strength Dial (L1 sub 2):**
- Slider: **Strength (braces + base)** (not Heat energy)
- Readout: **Tippy - skinny base, no braces** (not molecules / salt)
- Canvas: tippy frame / braces / load block; drag handle to strengthen
- Mission: **Strong Structures** step rail (Step 2 active)

**Passed:** lab UI is Strong Structures topic (triangles / load), not chemistry.

## Mission 2
Out of scope for this pass (do not rebuild level2).

## Mission 3
Out of scope for this pass (do not rebuild level3).

## Support
- `js/lab-activities.js` - HeatLab / ScaleLab Strong Structures-safe defaults (no molecules / salt / Heat energy).
- `js/boot-l1.js` - `sessionStorage gq-qa-jump === "1"` → `resumePlaySession()`; else `showHub()`.
- `games/civil-basics/_qa-jump.html` - writes `gq-civil-basics-save-v2` + `gq-qa-jump=1`.
- Cache-bust `?v=structqa1` on `main.js` / boot imports (`lab-activities`, `level1`, `struct-scenes`).

## Shared
- No `engine/*.js` changes.
- Work limited to `games/civil-basics/`.
