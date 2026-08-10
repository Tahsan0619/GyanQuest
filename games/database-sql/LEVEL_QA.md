# Database & SQL - LEVEL_QA

Uniqueness + completion pass (GyanQuest). Shared `engine/*.js` untouched. Gold standard: `games/chemistry-lab/js/level1.js` (Tiny Bits) + `games/backend-builder/js/level1.js` (Server Basics) fitted to **Tables & Rows**.

## Mission 1 - Tables & Rows (`js/level1.js` + `js/table-scenes.js`)

### Sub audit vs `L1_META.subTitles`
| # | Title | Ped shape | Depth status |
|---|--------|-----------|--------------|
| 1 | Meet the Grid | Motion chain (desk→columns→rows→predict→settle) + exit quiz | Deepened - predict beat + row highlight |
| 2 | Class Register Pattern | Messy pile → register assemble + field quizzes | Good - sticky pile vs neat grid |
| 3 | Sort: Table or Not? | Intro + 8-chip drag sort (table / messy / not) | Good - canvas zones sync with chips |
| 4 | Fill Rows Lab | HeatLab as **Row fill** + structure quiz + reveal | Fixed - no heat/molecule readouts |
| 5 | Why Find Needs Structure | Order steps + find-glow causal chain + quiz | Good - scan name → city cell |
| 6 | Name the Table Rule | Equation + ScaleLab scrubber + rule quiz | Fixed - table-scale labels (not salt grain) |
| 7 | Stretch: Real Lists | 5 context walkthrough + transfer quiz | Deepened - unique canvas per mode |
| 8 | Myth Bust | 5 myths with claim→truth diagrams | Deepened - per-myth visuals |
| 9 | Fluency Drill | 8 prompt-aware items, 80% pass | Deepened - prompt-matched canvas |
| 10 | Table Scout Mastery | Bruner order → mixed case → multi-quiz | Deepened - contacts + register + shop showcase |

### Fixed / deepened this pass
| Sub | Title | Problem | Fix | Visual confirmation |
|-----|--------|---------|-----|---------------------|
| meta | Predict | Generic “guessing / pattern / skip” | Topic predict: neat rows under named columns vs sticky pile | Pre-mission predict card (pedagogy) |
| 1 | Meet the Grid | No in-mission predict beat | Act 4 predict phase + dashed row highlight | Meet canvas: “Whole kid = one row across?” |
| 2 | Class Register | Chem distractors (“Heat energy packets”) | Table-only wrong answers | Field check opts have no chemistry |
| 4 | Fill Rows Lab | HeatLab defaults leaked molecules / Heat energy | Defaults + `FILL_READOUTS`: Empty → Full register; slider **Row fill** | Readout “Empty slots - headers only”; teal fill handle |
| 5 | Why Find… | Chem distractor (“vanish when heated”) | Table distractors | Find-glow Maya→Ctg chain |
| 6 | Name the Table Rule | ScaleLab salt grain → ions → orbitals risk | Table ScaleLab labels; canvas sheet→headers→ROW/COLUMN banner | Scrubber: “Table scale: sheet → columns → rows → cell” |
| 7 | Stretch: Real Lists | Same grid chrome for every mode | Distinct Contacts phone, Register book, Shop shelf, Fare board, SQL terminal | Home: phone + contacts grid; Shop: shelf boxes + sku grid |
| 8 | Myth Bust | Thin claim/truth | Per-myth diagrams (math book, sticky pile, row≠col, 18+, cake) | Myth 1 claim: Math book; truth: App + grid |
| 9 | Fluency Drill | Weak prompt visuals | `drawDrillVisual` by prompt (row/column/cell/mess/id/register/rule) | Drill Q1 canvas prompt “One row” + row highlight |
| 10 | Table Scout Mastery | Thin mini-grids only | Phone + register grid + shop shelf + **Table Scout** banner | Mastery canvas trio + path pips |

### Support changes
- `js/lab-activities.js` - HeatLab / ScaleLab defaults are table-themed (Row fill; sheet→columns→rows→cell). Header comment no longer says Bio Explorer.
- `js/lab-state.js` - default `mode` `home` (was leftover `cat`); prompt `Table drill`.
- Cache-bust: `main.js` / `boot-l1.js` / `level1.js` / `table-scenes.js` / `lab-activities.js` / `index.html` (`?v=tables2`).
- QA helper: `tools/_qa-jump-db.html?level=&sub=` writes `gq-database-sql-save-v2` + `sessionStorage` `gq-qa-jump=1`. Boot calls `resumePlaySession()` only when that flag is set; normal play still opens hub first.

### Pedagogy completion (vs Tiny Bits shape)
- Topic-specific predict (not generic pattern/guess).
- Stretch walkthrough (5 contexts) before transfer quiz.
- Rule: equation → scale scrubber → rule quiz.
- Mastery: Bruner order → contacts+shop mixed case → multi-quiz → Table Scout CTA.
- No student-visible chemistry leftovers (Heat energy, molecules, salt grain, pure heat).

## Missions 2-3
Out of scope this pass (SELECT Stories / Keys & Joins).

## STUB missions (4-10)
Skipped (`playable: false`).

## Shared
- No `engine/*.js` changes.
- Visual verification via `http://127.0.0.1:5500/tools/_qa-jump-db.html?level=0&sub=N` on Tables & Rows subs 4, 6, 7, 8, 10 (and spot-check 1/9).
