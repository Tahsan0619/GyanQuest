# AI Lab - LEVEL_QA

Uniqueness + completion pass (GyanQuest). Shared `engine/*.js` untouched. Gold standard: chemistry-lab Tiny Bits form fitted to **What is AI?** (examples / patterns / guesses) - not melt / salt-grain chemistry.

## Mission 1 - What is AI? (`js/level1.js` + `js/ai-scenes.js`)

### Already good (left alone / topic-fit confirmed)
| Sub | Title | Visual confirmation |
|-----|--------|---------------------|
| 1 | Meet AI | Desk photo tags / voice / maps → pattern glow → settle |
| 2 | Watch Pattern Dial | Pattern clarity dial; photos + voice; messy → lined-up examples |
| 3 | Sort: AI or Not? | AI tool / Not AI / Tricky zones |
| 4 | Stronger Pattern Lab | Guess confidence dial + example pile; reveal why more examples help |
| 5 | Why AI Guesses | Order: examples → patterns → guess → check |
| 6 | Name the AI Rule | Equation + AI ScaleLab (tools → patterns → rule) |
| 7 | Stretch: Places | Home / school / street / BD shop / lab |
| 8 | Myth Bust | Magic brain, no data, one wrong guess, every button, adults-only |
| 9 | Fluency Drill | Prompt-aware patterns / examples / switch checks |
| 10 | AI Rookie Mastery | Bruner path + phone/shop case + multi-quiz |

### Fixed this pass
| Item | Problem | Fix | Confirmation |
|------|---------|-----|----------------|
| `L1_META.predict` | Generic “Looking for a clear pattern or rule” | Photo-tagger / many examples predict | Code: `js/level1.js` `L1_META.predict` |
| `L1_META.bdHook` | Vague “notice pattern-guessing tools” | Phone tags, voice helper, Dhaka map routes | Code: `js/level1.js` `L1_META.bdHook` |
| HeatLab defaults | Fallback “Heat energy” / “molecules locked” | AI defaults: **Pattern clarity / guess confidence** + Messy→Solid | Code + live: Watch Pattern Dial slider **Pattern clarity**; readout **Messy examples - guess is noisy** |
| ScaleLab defaults | Salt grain → ions → orbitals risk | AI defaults: tools → patterns → rule; L1 already passes overrides | Code: `js/lab-activities.js` `mountScaleLab` |
| QA jump | Save only; always `showHub()` | `gq-qa-jump=1` → `resumePlaySession()` | Live: `_qa-jump.html?level=0&sub=1` |

### Visual confirmation (local `http://127.0.0.1:5500`)
Opened `_qa-jump.html?level=0&sub=1` → resumed mid-mission (not hub).

**Watch Pattern Dial (L1 sub 2):**
- Slider: **Pattern clarity** (not Heat energy)
- Readout: **Messy examples - guess is noisy** (not molecules / salt)
- Canvas: Photos + Voice + “Messy examples - drag dial to clarify”
- Copy contrast: “data quality - not melting ice…” (intentional anti-chem note)
- Mission: **What is AI?** step rail (Step 2 active)

**Passed:** lab UI is AI-topic (examples / patterns / guesses), not chemistry.

## Mission 2 - Pattern Predict
Out of scope for this pass (do not rebuild level2).

## Support
- `js/lab-activities.js` - HeatLab / ScaleLab AI-safe defaults (no molecules / salt / Heat energy).
- `js/boot-l1.js` - `sessionStorage gq-qa-jump === "1"` → `resumePlaySession()`; else `showHub()`.
- `games/ai-lab/_qa-jump.html` - writes `gq-ai-lab-save-v2` + `gq-qa-jump=1`.
- Cache-bust `?v=aiqa1` on `main.js` / boot imports (`lab-activities`, `level1`, `ai-scenes`).

## Shared
- No `engine/*.js` changes.
- Work limited to `games/ai-lab/`.
