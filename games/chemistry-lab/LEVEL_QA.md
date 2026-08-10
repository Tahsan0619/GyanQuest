# Chemistry Lab - LEVEL_QA

Uniqueness + visual verification pass (GyanQuest). Shared `engine/*.js` untouched.

## Mission 2 - Element Hunt (`js/level2.js` + `js/element-scenes.js`)

### Already good (left alone)
| Sub | Title | Visual confirmation |
|-----|--------|---------------------|
| 1 | Meet Element Hunt | Fe / Cu / O₂ bottles on desk; magnifier zoom shows one atom kind per sample |
| 2 | Iron: One Atom Kind | Iron lattice pack of identical Fe atoms |
| 3 | Sort: Element or Not? | Drag-sort into Element / Compound / Mixture with topic chips |
| 4 | Copper Wire Lab | Stretch handle + Cu wire; readout is stretch, not melt heat |
| 5 | Why O₂ Is Still an Element | O₂ pairs; tap/split still one atom kind |

### Fixed
| Sub | Title | Problem | Fix | Visual confirmation |
|-----|--------|---------|-----|---------------------|
| 6 | Name the Element Rule | `mountScaleLab` UI still said salt grain → ions → orbitals; canvas ignored identity scale | Optional ScaleLab labels; `elemRule` responds sample bottles → one-kind cloud → ELEMENT banner | Scrubber: “Identity scale…”, readout “Desk samples…”, then ELEMENT nameplate with Fe/Cu/O |
| 7 | Stretch: New Contexts | Anonymous atom ring for every mode | Distinct gold ring, foil sheet, charcoal lump, helium balloon, graphite pencil + Au/Al/C/He labels | Gold ring with Au atoms + mode chips (Gold/Foil/…) |
| 8 | Myth Bust | Claim/truth text only + two floating atoms | Per-myth diagrams (H₂O, air mix, NaCl, rust, O₂) | Bust water → H-O-H compound diagram + truth copy |
| 9 | Fluency Drill | Generic cyan atom grid | Prompt-aware sample visuals (Fe nail, H₂O, air, brass, …) | (wired; same drill flow) |
| 10 | Element Hunt Mastery | Thin bottles + one atom | Path pips + Fe/Cu/O₂ bottles + one-kind cloud + Element Scout banner | (wired; mastery path) |

### Support changes
- `js/chem-activities.js` - `mountScaleLab` accepts `sliderLabel`, `goalText`, `readoutLabels` (Tiny Bits defaults unchanged).
- Cache-bust query on chem-lab `main.js` / boot imports for this pass (`?v=elemhunt*` / `?v=bond1`).
- QA helper: `tools/_qa-jump-chem.html?level=&sub=` (writes `gq-chemistry-lab-save-v1`).

### Sanity - Tiny Bits
- Ice Melting Lab (M1 step 4) still shows ice cup + H₂O lattice + **Heat energy** dial after Bond Buddies edits.

## Mission 1 - Tiny Bits
Gold standard; not modified in this pass beyond ScaleLab API defaults.

## Mission 3 - Bond Buddies (`js/level3.js` + `js/bond-scenes.js`)

### Already good (left alone)
| Sub | Title | Visual confirmation |
|-----|--------|---------------------|
| 1 | Meet Bond Buddies | Lonely atoms → bond link; magnet/cup desk props |
| 3 | Sort: Bond or Not? | Bonded / Attraction / No bond zones |
| 4 | Magnet Snap Lab | Snap dial + magnet click glow |
| 5 | Why Water Sticks | H-O-H buddies + reveal steps |

### Fixed
| Sub | Title | Problem | Fix | Visual confirmation |
|-----|--------|---------|-----|---------------------|
| 2 | Attraction Pull | Watch-only motion chain | Motion acts + interactive **Attraction pull** dial (magnet gap / heat sync) | Slider “Attraction pull”; readout “Far apart - weak pull…”; N/S magnets + cup |
| 6 | Name the Bond Rule | ScaleLab defaults still said salt grain → ions → orbitals | Bond-specific ScaleLab labels; `bondRule` magnets/cup → Na-Cl link → **BONDS** banner | Slider “Bond scale: magnets → atom link → BONDS”; desk magnets at low scale |
| 7 | Stretch: New Contexts | Chip labels were raw `salt`/`o2` | Friendly Salt / O₂ / Sugar / Plastic / Protein chips + distinct lattices/chains | Salt lattice + labeled mode chips |
| 8 | Myth Bust | Claim/truth text + weak visuals | Per-myth diagrams (glue stick, magnet≠bond, mixture vs molecule, break rearrange, gas/liquid bonds) | Glue claim: glue stick + “?” atoms; truth: Na-Cl + e⁻ hint |
| 9 | Fluency Drill | Generic bonded pair | Prompt-aware visuals (water, sand mix, magnets, O₂, break, ionic, BONDS=links) | Drill prompt “Bond does?” with linked A-B |
| 10 | Bond Buddies Mastery | Thin path + weak showcase | Path pips + H₂O / O₂ / mixture trio + **Bond Explorer** banner | Mastery canvas shows bonded H₂O, double-bonded O₂, “mixture · no link” |

### Cache
- `bond-scenes.js?v=bond1`, `level3.js?v=bond1`, `main.js?v=bond1`, QA jump `?v=bond1`.

## STUB missions (4-10)
Skipped (`playable: false`).

## Shared
- No `engine/*.js` changes.
- Tiny Bits Ice Melting Lab spot-checked OK after this pass (Heat energy dial intact).
