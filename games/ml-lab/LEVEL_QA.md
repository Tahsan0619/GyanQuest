# Machine Learning - LEVEL_QA

Uniqueness + completion pass (GyanQuest). Shared `engine/*.js` untouched. Gold standard: Tiny Bits form fitted to **train vs test / Teach the Model**.

## Visibility bug (root cause)

| Symptom | Cause | Fix |
|---------|--------|-----|
| Landing catalog showed Machine Learning, but in-game hub was blank (header only) | `js/level1.js` SyntaxError: unescaped `"prove"` inside a double-quoted string → module import failed → boot never reached `showHub()` | Escaped with curly quotes; hub mounts again |

## Mission 1 - Teach the Model (`js/level1.js` + `js/ml-scenes.js`)

### Fixed
| Sub | Title | Problem | Fix | Visual confirmation |
|-----|--------|---------|-----|---------------------|
| Meta | Predict / BD | Generic guess/skip | Fair test-set predict; fruit/handwriting/spam hook | (meta) |
| 2 | Watch Train Dial | HeatLab chem defaults if omitted | Train strength + ML readouts | (wired) |
| 4 | Stronger Train Lab | Same | Train quality labels | (wired) |
| 5 | Why Models Learn | Syntax crash on quiz | Fixed quote in “prove” question | Boot loads; hub visible |
| 7 | Stretch: Places | Single thin tap | Fruit / hand / mail / shop / lab walkthrough | (wired) |
| Defaults | lab-activities | molecules/Heat energy | ML train defaults | (code) |

### Already topic-fit
| Sub | Title |
|-----|--------|
| 1 | Meet Training |
| 3 | Sort Train vs Test |
| 6 | Name the Train Rule |
| 8-10 | Myths / Drill / Mastery |

## Support
- QA jump: `_qa-jump.html` + `gq-qa-jump` → `resumePlaySession`
- Cache-bust `?v=mlqa1`

## Shared
- No `engine/*.js` changes.
- Hub visibility verified after syntax fix.
