# Bio Explorer - LEVEL_QA

Uniqueness + completion pass (GyanQuest). Shared `engine/*.js` untouched. Gold standard: chemistry-lab Tiny Bits - fitted to **life / cells / plants**.

## Mission 1 - Living or Not (`js/level1.js` + `js/life-scenes.js`)

### Already good
| Sub | Title | Notes |
|-----|--------|-------|
| 1 | Meet Living Clues | Desk life clues → big idea |
| 3 | Sort: Living or Not? | Living / Not / Tricky (fire) |
| 5-10 | Rule → Mastery | Life rule, stretch (rice/seed…), myths, drill, mastery |

### Fixed
| Sub | Title | Problem | Fix | Visual confirmation |
|-----|--------|---------|-----|---------------------|
| Meta | Predict / BD | Generic guess/skip predict | Grow/energy/make-more-life predict; mango/cat/phone hook | (meta) |
| 2 | Seed Sprout Lab | Risk of HeatLab melt copy | Water/sprout dial + dormant-living readouts | Seed Sprout Lab; readout “Dry seed - still living, waiting” |
| 4 | Watch Growth | Heat framing | Day-marker growth dial | (wired) |

## Mission 2 - Cell City (`js/level2.js` + `js/cell-scenes.js`)

### Fixed
| Sub | Title | Problem | Fix | Visual confirmation |
|-----|--------|---------|-----|---------------------|
| Meta | Predict | Generic | Cell = basic living unit | (meta) |
| Labs | Zoom / Membrane | Heat defaults | Microscope zoom + membrane focus readouts | (wired; prior scene deepen) |
| Scenes | Stretch/myths | Thin canvases | Distinct cell-city visuals in `cell-scenes.js` | (wired) |

## Mission 3 - Plant Power (`js/level3.js` + `js/plant-scenes.js`)

### Fixed
| Sub | Title | Problem | Fix | Visual confirmation |
|-----|--------|---------|-----|---------------------|
| Meta | Predict | Generic | Light + water + air (CO₂) | (meta) |
| Labs | Sun / Grow | Heat defaults | Sun energy + growth-stage dials | (wired) |
| Scenes | BD stretch | Thin | Mango/rice/bee plant stories | (wired) |

## Support
- `bio-activities.js` - ScaleLab accepts `sliderLabel` / `goalText` / `readoutLabels` (no salt leak if used).
- Cache-bust `?v=bioqa1`; QA jump `_qa-jump.html` + `gq-qa-jump` → `resumePlaySession`.

## Shared
- No `engine/*.js` changes.
- Visual: Seed Sprout Lab via local server.
