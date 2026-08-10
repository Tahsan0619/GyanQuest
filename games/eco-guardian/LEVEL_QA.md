# Eco Guardian - LEVEL_QA

Uniqueness + completion pass (GyanQuest). Shared `engine/*.js` untouched. Gold standard: chemistry-lab Tiny Bits form fitted to **Waste Watch** (bins / 3Rs / BD waste) - not particle zoom or melt labs.

## Mission 1 - Waste Watch (`js/level1.js` + `js/waste-scenes.js`)

### Already good (left alone / topic-fit confirmed)
| Sub | Title | Visual confirmation |
|-----|--------|---------------------|
| 1 | Meet the Bins | Desk litter → three bins → compost glow → Reduce→Reuse→Recycle settle |
| 2 | Fill Recycle Goal | Recycle fill dial + bottles/cans stack; copy says “not melting anything” |
| 3 | Sort the Litter | Recycle / Compost / Landfill·special zones with bottle, peel, battery chips |
| 4 | Clean-up Lab | Higher recycle-fill threshold; conservation-of-care quiz |
| 5 | Why Reduce First | Order steps reduce → reuse → recycle → respect |
| 6 | Name the 3R Rule | Equation tokens Reduce/Reuse/Recycle/Respect + priority ScaleLab |
| 7 | Stretch: BD Places | Home / school / market / park / river modes |
| 8 | Myth Bust | Plastic, peels, recycle-alone, batteries, river myths |
| 9 | Fluency Drill | Prompt-aware bin / 3R checks |
| 10 | Waste Watcher Mastery | Bruner path + kitchen/market case + multi-quiz |

### Fixed
| Sub | Title | Problem | Fix | Visual confirmation |
|-----|--------|---------|-----|---------------------|
| Meta | Predict / BD hook | Generic “Guessing without checking” predict; vague bdHook | Waste-specific: dump-one-bag vs reduce→reuse→recycle+right bin; BD peels/paper/bags hook | Hub pedagogy meta is topic-fit (code) |
| Labs | HeatLab defaults | Fallback still said “Heat energy” / “molecules locked” | Eco `mountHeatLab` defaults → Recycle fill + packaging readouts; L1 calls already pass overrides | **Fill Recycle Goal** via QA jump: slider “Recycle fill”; readout “Almost empty - keep sorting clean packaging”; canvas “Drag to fill recycle”; no melt/chemistry copy |
| Labs | ScaleLab | Overrides already accepted; waste defaults in place | Confirmed `sliderLabel` / `readoutLabels` / `goalText` overrides; pile→bins→3R defaults | Step 6 shows Reduce/Reuse/Recycle/Respect tokens; ScaleLab labels wired (priority scrubber) |

### Support
- `js/lab-activities.js` - HeatLab eco defaults (recycle fill, not melt); ScaleLab already accepted label overrides.
- Cache-bust `?v=wasteqa1` on `main.js` / boot imports (`lab-activities`, `level1`, `waste-scenes`).
- QA helper: `games/eco-guardian/_qa-jump.html?level=&sub=` writes `gq-eco-guardian-save-v2` + `sessionStorage gq-qa-jump=1` → `resumePlaySession()` in `boot-l1.js`.

## Missions 2-3
Out of scope for this pass (Waste Watch / level1 only).

## Shared
- No `engine/*.js` changes.
- Visual verification via `http://127.0.0.1:5500/games/eco-guardian/_qa-jump.html?level=0&sub=1` (Fill Recycle Goal) and `?level=0&sub=5` (Name the 3R Rule tokens).
