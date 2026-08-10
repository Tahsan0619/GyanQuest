# ICT Fundamentals - LEVEL_QA

Uniqueness + completion pass (GyanQuest). Shared `engine/*.js` untouched. Gold standard: chemistry-lab Tiny Bits form fitted to **Computer Bits** (CPU / RAM / storage) and **Input & Output** (devices in and out) - not melt / salt-grain chemistry.

## Mission 1 - Computer Bits (`js/level1.js` + `js/bits-scenes.js`)

### Already good (left alone / topic-fit confirmed)
| Sub | Title | Visual confirmation |
|-----|--------|---------------------|
| 1 | Meet the Inside Team | Desk CPU / RAM / storage → glow links → power-off settle |
| 2 | Busy PC Lab | CPU work dial + RAM fill; copy says workload not temperature |
| 3 | Sort the Jobs | CPU / RAM / Storage / Not zones (calc, open app, SSD vs snack/paint) |
| 4 | RAM Fill Lab | Higher threshold; power-off reveal (RAM clears, storage stays) |
| 5 | Why Three Parts | Order think → hold → keep → power-off |
| 6 | Name the Bits Rule | Equation + Bits ScaleLab (desk → open RAM → storage stays) |
| 7 | Stretch: Devices | Phone / laptop / lab / game / class modes |
| 8 | Myth Bust | RAM≠storage, CPU not only gaming, phones have SoC, etc. |
| 9 | Fluency Drill | Prompt-aware CPU / RAM / storage checks |
| 10 | Bit Scout Mastery | Bruner path + phone/lab case + multi-quiz |

### Fixed this pass
| Item | Problem | Fix | Confirmation |
|------|---------|-----|----------------|
| `L1_META.predict` | Generic “Guessing without checking” | Saved-photo / storage-vs-RAM predict | Code: `js/level1.js` `L1_META.predict` |
| `L1_META.bdHook` | Vague “notice CPU / RAM / storage around you” | Phone chip, school lab PC, homework file | Code: `js/level1.js` `L1_META.bdHook` |
| HeatLab defaults | Fallback “Heat energy” / “molecules locked” | ICT defaults: **Work / signal level** + Idle→Rising→Busy→Full | Code + live: Busy PC Lab slider **CPU work (open apps)**; readout **Idle - few open apps in RAM** |
| ScaleLab defaults | Salt grain → ions → orbitals risk | ICT defaults: desk → detail → rule; L1 already passes Bits overrides | Code: `js/lab-activities.js` `mountScaleLab` |

### Visual confirmation (local `http://127.0.0.1:5500`)
Opened `_qa-jump.html?level=0&sub=1` → resumed mid-mission (not hub).

**Busy PC Lab (L1 sub 2):**
- Slider: **CPU work (open apps)** (not Heat energy)
- Readout: **Idle - few open apps in RAM** (not molecules / salt)
- Canvas: CPU + RAM (fast memory) + “Drag - more CPU work fills RAM”
- Coach: “not a chemistry melt”
- Mission: **Computer Bits** step rail

**Passed:** lab UI is hardware-topic, not chemistry.

## Mission 2 - Input & Output (`js/level2.js` + `js/io-scenes.js`)

### Already good (left alone / topic-fit confirmed)
| Sub | Title | Visual confirmation |
|-----|--------|---------------------|
| 1 | Meet I/O Devices | Keyboard / screen / mic / speaker → IN/OUT labels → loop settle |
| 2 | Type -> Screen Lab | Input signal dial; letters on OUT screen; “not melting temperature” |
| 3 | Sort Input/Output | Input / Output / Both / Not (cake) zones |
| 4 | Signal Lab | Higher signal threshold + reveal path |
| 5 | Path of a Keypress | Press → process → show → read |
| 6 | Name the I/O Rule | Equation + I/O ScaleLab (devices → signal → rule) |
| 7 | Stretch: Real Life | Class / game / call / print / music |
| 8 | Myth Bust | Monitor≠input, mic≠output, touchscreen both, etc. |
| 9 | Fluency Drill | Prompt-aware I/O checks |
| 10 | I/O Ranger Mastery | Bruner path + call/print case + multi-quiz |

### Fixed this pass
| Item | Problem | Fix | Confirmation |
|------|---------|-----|----------------|
| `L2_META.predict` | Generic “Guessing without checking” | Type→screen Input→Process→Output predict | Code: `js/level2.js` `L2_META.predict` |
| `L2_META.bdHook` | Vague “notice devices in and out” | Homework typing, video-call mic/speaker, class touchscreen | Code: `js/level2.js` `L2_META.bdHook` |
| HeatLab / ScaleLab | Same chemistry fallback risk as L1 | ICT defaults + L2 overrides (Input signal / Quiet→Full Hello) | Live: Type -> Screen Lab |

### Visual confirmation (local `http://127.0.0.1:5500`)
Opened `_qa-jump.html?level=1&sub=1` → resumed mid-mission.

**Type -> Screen Lab (L2 sub 2):**
- Slider: **Input signal** (not Heat energy)
- Readout: **Quiet - waiting for keypresses**
- Canvas: IN keyboard → OUT screen with “HI”
- Coach: “signal, not heat”
- Mission: **Input & Output** step rail

**Passed:** lab UI is I/O-topic, not chemistry.

## Mission 3 - Files & Folders
Out of scope for this pass (do not rebuild level3).

## Support
- `js/lab-activities.js` - HeatLab / ScaleLab ICT-safe defaults (no molecules / salt / Heat energy).
- `js/boot-l1.js` - `sessionStorage gq-qa-jump === "1"` → `resumePlaySession()`; else `showHub()`.
- `games/ict-fundamentals/_qa-jump.html` - writes `gq-ict-fundamentals-save-v2` + `gq-qa-jump=1`.
- Cache-bust `?v=ictqa2` on `main.js` / boot imports (`lab-activities`, `level1`, `level2`, scenes).

## Shared
- No `engine/*.js` changes.
- Work limited to `games/ict-fundamentals/`.
