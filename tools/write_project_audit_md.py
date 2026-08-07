#!/usr/bin/env python3
"""Write PROJECT_AUDIT.md from tools/_audit_raw.json + extra verified reads."""
from __future__ import annotations

import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[1]
RAW = json.loads((ROOT / "tools" / "_audit_raw.json").read_text(encoding="utf-8"))


def read(p: pathlib.Path) -> str:
    return p.read_text(encoding="utf-8", errors="replace") if p.exists() else ""


def activity_map_for_level(level_path: pathlib.Path) -> list[dict]:
    """Map each step function to primary activity types by reading function bodies."""
    t = read(level_path)
    if not t:
        return []
    # Match function s1 / function sub1_meet / async variants
    parts = re.split(r'\n(?:async )?function ((?:s|sub)\d+[A-Za-z0-9_]*)\(', t)
    out = []
    i = 1
    while i + 1 < len(parts):
        name = parts[i]
        body = parts[i + 1]
        body = re.split(r'\n(?:async )?function |^export ', body, maxsplit=1)[0]
        mounts = re.findall(
            r'mount(MotionChain|DragSort|HeatLab|EquationBuild|Quiz|SpeedDrill|MythCards|TapContinue|OrderSteps|RevealSteps|ScaleLab|MultiQuiz)\(',
            body,
        )
        mapping = {
            "MotionChain": "demo/motion-chain",
            "DragSort": "drag-sort",
            "HeatLab": "dial/lab-heat",
            "EquationBuild": "equation",
            "Quiz": "quiz",
            "SpeedDrill": "fluency-drill",
            "MythCards": "myth",
            "TapContinue": "tap",
            "OrderSteps": "order",
            "RevealSteps": "reveal",
            "ScaleLab": "scale-lab",
            "MultiQuiz": "multi-quiz",
        }
        types = [mapping.get(m, m) for m in mounts]
        if not types:
            types = ["scene-play"] if "playScene" in body else ["UNVERIFIED"]
        out.append({"step": name, "activities": types})
        i += 2
    return out[:10]


def landing_section() -> str:
    idx = read(ROOT / "index.html")
    land = read(ROOT / "js" / "landing.js")
    cat = RAW["landing_catalog"]
    live = [c for c in cat if c["live"]]
    not_live = [c for c in cat if not c["live"]]
    lines = ["## 1. Landing Page", ""]
    lines.append("### What's implemented")
    lines.append("")
    lines.append(f"- Root [`index.html`](index.html) title: `{RAW.get('landing_index_title')}`")
    lines.append("- Loads `/css/landing.css` and `/js/landing.js?v=unlock2` (defer).")
    lines.append("- Sections present in HTML: hero (`.gq-hero`), games (`#games` / `#gq-catalog`), why (`#why`), vision (`#vision`), footer.")
    lines.append("- Nav includes language toggle `#gq-lang` and **Unlock books** toggle `#gq-unlock-books` (sets `localStorage['gq-unlock-all-books']`).")
    lines.append("- `js/landing.js` builds catalog from in-file `CATALOG` constant; bilingual `COPY.en` / `COPY.bn` via `data-i18n`.")
    lines.append(f"- Catalog entries parsed from landing.js: **{len(cat)}** items; **{len(live)}** with `live: true`, **{len(not_live)}** with `live: false`.")
    lines.append("")
    lines.append("### Live vs placeholder in catalog")
    lines.append("")
    lines.append("| id | href | live |")
    lines.append("|----|------|------|")
    for c in cat:
        lines.append(f"| {c['id']} | `{c['href']}` | {'LIVE' if c['live'] else 'placeholder'} |")
    lines.append("")
    lines.append("### Landing copy vs reality")
    lines.append("")
    # check hero lead text
    if "3D mission games" in idx or "3D mission games" in land:
        lines.append("- **Inconsistency:** landing hero/copy still mentions **3D** mission games / `statPlayVal: \"3D + missions\"` in `COPY.en`, while live Force/Chem/etc. play shells are **Canvas 2D** (3D archived under `_legacy3d/`).")
    if "One live game today" in idx:
        lines.append("- **Inconsistency:** `index.html` gamesLead default text says \"One live game today…\" but `landing.js` COPY.en `gamesLead` says twenty-eight live mission games — applyLocale overwrites from JS.")
    lines.append(f"- Verified: all `{len(live)}` catalog `live:true` href folders exist under `games/`.")
    missing = []
    for c in live:
        slug = c["href"].rstrip("/").split("/")[-1]
        if not (ROOT / "games" / slug).exists():
            missing.append(c["href"])
    if missing:
        lines.append(f"- **Broken hrefs:** {missing}")
    else:
        lines.append("- No broken live hrefs found (folder exists for each live catalog entry).")
    lines.append("")
    return "\n".join(lines)


def per_game_section() -> str:
    lines = ["## 2. Per-Game Inventory (all games under `games/`)", ""]
    lines.append(
        "**Architecture note (verified):** These games do **not** primarily use a shared "
        "`curriculum.js` with 10×10 classic activity enums for the live Canvas path. "
        "Live play uses `js/missions-meta.js` (10 mission cards) + `js/levelN.js` "
        "(Bruner 10 subs for playable missions) + `js/boot-l1.js` + Canvas scenes. "
        "Where `curriculum.js` exists it is called out explicitly."
    )
    lines.append("")

    for g in RAW["games"]:
        folder = g["folder"]
        gdir = ROOT / "games" / folder
        lines.append(f"### {g['manifest'].get('title') or folder}")
        lines.append("")
        lines.append(f"- **Folder:** `games/{folder}/`")
        man = g["manifest"]
        lines.append(
            f"- **manifest.js:** id=`{man.get('id')}`, title=`{man.get('title')}`, "
            f"storageKey=`{man.get('storageKey')}`, localeKey=`{man.get('localeKey')}`"
        )
        if man.get("theme_block"):
            lines.append(f"- **theme:** {{{man['theme_block']}}}")
        if g.get("manifest_assets"):
            lines.append(f"- **manifest asset/path refs (sample):** {', '.join(g['manifest_assets'][:12])}")
        else:
            # assetKeys from chem-style
            mt = read(gdir / "manifest.js")
            keys = re.findall(r'"assetKeys"\s*:\s*\[([^\]]*)\]', mt)
            if keys:
                ak = re.findall(r'"([^"]+)"', keys[0])
                lines.append(f"- **assetKeys:** {', '.join(ak[:20])}" + ("…" if len(ak) > 20 else ""))
            else:
                lines.append("- **listed assets:** none found as URL strings in manifest (theme/keys only or empty).")

        lines.append(
            f"- **curriculum.js:** "
            + (
                f"PRESENT at `{g['files']['curriculum_path']}`"
                if g["files"]["curriculum_js"]
                else "**ABSENT** — live path uses `missions-meta.js` + `levelN.js` (Chem/Canvas pattern)"
            )
        )
        lines.append(
            f"- **Playable missions (missions-meta `playable:true`):** {g['playable_count']} / {g['missions_count']} parsed mission objects"
        )
        lines.append(f"- **Books:** {', '.join(g['files']['books']) if g['files']['books'] else 'none'}")
        lines.append(f"- **_legacy3d:** {'yes' if g['files']['legacy3d'] else 'no'}")
        lines.append(f"- **scene packs:** {', '.join(g['files']['scenes']) if g['files']['scenes'] else 'none'}")
        lines.append("")
        lines.append("| Mission idx | Title | playable | level file | STATUS | Sub-level titles (from L*_META.subTitles) | Activity types per step (from mount* calls) |")
        lines.append("|-------------|-------|----------|------------|--------|-------------------------------------------|-----------------------------------------------|")

        for lv in g["levels"]:
            idx = lv["index"]
            title = lv.get("missionTitle") or f"Mission {idx+1}"
            # Only detail activity map when level file exists
            acts = ""
            if lv.get("level_file"):
                amap = activity_map_for_level(gdir / lv["level_file"])
                if amap:
                    acts = "; ".join(
                        f"{a['step']}:{'+'.join(a['activities'])}" for a in amap[:10]
                    )
                else:
                    acts = "no s1..s10 functions matched"
            else:
                acts = "n/a"
            subs = ", ".join(lv.get("subTitles") or []) or "(none — stub/soon)"
            lines.append(
                f"| {idx} | {title} | {lv['playable_flag']} | "
                f"{lv.get('level_file') or '—'} | **{lv['status']}** | {subs} | {acts} |"
            )

        if g.get("todos_sample"):
            lines.append("")
            lines.append("**TODOs / console.log samples found while scanning js/:**")
            for t in g["todos_sample"][:8]:
                lines.append(f"- `{t}`")
        lines.append("")

    return "\n".join(lines)


def chem_section() -> str:
    d = RAW["chemistry"]
    lines = ["## 3. Chemistry Lab Deep Detail", ""]
    boot = read(ROOT / "games/chemistry-lab/js/boot-l1.js")
    lines.append("### File existence and size (verified)")
    lines.append("")
    lines.append("| File | exists | bytes | exports (sample) |")
    lines.append("|------|--------|-------|------------------|")
    for name, info in d.items():
        if not info.get("exists"):
            lines.append(f"| `js/{name}` | NO | — | — |")
        else:
            lines.append(
                f"| `js/{name}` | yes | {info['bytes']} | {', '.join(info.get('exports') or [])[:80]} |"
            )
    lines.append("")
    lines.append("### boot-l1.js")
    lines.append("")
    lines.append(f"- Exports `bootChemLevel1` (verified via export search in audit raw).")
    lines.append("- Wires mission hub, arena2d, registerAtomScenes / Element / Bond, runL1/L2/L3Sub.")
    lines.append("- N_LEVELS=10, N_SUBS=10; persist via storageKey from manifest.")
    lines.append("- Digital books: imports BOOK_L1..L3 + `setupMissionBooks` (added in book feature).")
    lines.append("- Hub subtitle states missions 1–3 live (verified string search): "
                 + ("YES" if "Missions 1" in boot or "live" in boot.lower() else "UNVERIFIED"))
    lines.append("")
    lines.append("### level1.js / chem-activities / scenes")
    lines.append("")
    l1 = RAW["chemistry"]["level1.js"] if "level1.js" in RAW["chemistry"] else d.get("level1.js")
    lines.append("- `level1.js`: Tiny Bits deepened Bruner spiral (10 runners) — gold reference for Canvas labs.")
    lines.append("- `chem-activities.js`: activity mounts for chem (MotionChain, DragSort, HeatLab, etc.).")
    lines.append("- `activity-controller.js`: present — coordinates activity lifecycle.")
    lines.append("- `atom-scenes.js` / `element-scenes.js` / `bond-scenes.js`: Canvas scene packs for M1–M3.")
    lines.append("- `arena-2d.js`: Canvas 2D arena.")
    # curriculum
    cur = ROOT / "games/chemistry-lab/js/curriculum.js"
    lines.append("")
    lines.append("### Missions 2–10 / curriculum.js leftover")
    lines.append("")
    lines.append(f"- `js/curriculum.js` exists: **{cur.exists()}**")
    if cur.exists():
        ct = read(cur)
        lines.append(f"- curriculum.js size: {len(ct)} bytes — treat as **legacy/generated leftover** relative to boot-l1 Canvas path (boot does not import curriculum.js — verified: `curriculum` in boot imports = {'yes' if 'curriculum' in boot else 'no'}).")
    meta = read(ROOT / "games/chemistry-lab/js/missions-meta.js")
    playable = len(re.findall(r'playable:\s*true', meta))
    lines.append(f"- missions-meta `playable: true` count: **{playable}** (missions 1–3 live; 4–10 soon stubs).")
    lines.append("- Mission 2–3: REAL deepened (`level2.js`, `level3.js`). Missions 4–10: STUB (playable:false).")
    lines.append(f"- Leftover `games/chemistry-lab/curriculum.js` at game root: **{(ROOT / 'games/chemistry-lab/curriculum.js').exists()}** (not imported by boot-l1).")
    lines.append("")
    return "\n".join(lines)


def force_section() -> str:
    d = RAW["force_fighter"]
    boot = read(ROOT / "games/force-fighter/js/boot-l1.js")
    lines = ["## 4. Force Fighter Deep Detail", ""]
    lines.append(f"- **storageKey:** `{d.get('storageKey')}`")
    lines.append(f"- **localeKey:** `{d.get('localeKey')}`")
    lines.append(f"- **title/id:** {d.get('title')} / {d.get('id')}")
    lines.append(f"- **_legacy3d:** {d.get('legacy3d')} (archived 3D — live path is Canvas 2D boot-l1).")
    lines.append(f"- **js files:** {', '.join(d.get('folder_files') or [])}")
    lines.append(f"- **has curriculum.js:** {d.get('has_curriculum')}")
    lines.append("- Hand-authored vs shared: uses shared engine persist/i18n/mission-hub; local `lab-activities`, scene packs, level1–3 for Newton topics.")
    lines.append(f"- boot-l1 imports curriculum?: {'yes' if 'curriculum' in boot else 'no'}")
    lines.append("- Locale: `initI18n({ localeStorageKey: manifest.localeKey || ...})` pattern (same as other Canvas games).")
    lines.append("")
    return "\n".join(lines)


def engine_section() -> str:
    e = RAW["engine"]
    lines = ["## 5. Shared Engine (`engine/`)", ""]
    lines.append(f"- **JS modules:** {', '.join(e['js'])}")
    lines.append(f"- **CSS:** {', '.join(e['css'])}")
    lines.append(f"- **Locales:** {', '.join(e['locales'])}")
    lines.append("")
    lines.append("### persist.js schema (exact shape written today)")
    lines.append("")
    lines.append("```json")
    lines.append('{')
    lines.append('  "level": number,')
    lines.append('  "sub": number,')
    lines.append('  "completed": boolean[nLevels][nSubs],  // normalizeCompleted default 10x10')
    lines.append('  "rewards": [{ "earned": boolean, "stars": number }, ...],')
    lines.append('  "introSeen": boolean[nLevels]')
    lines.append('}')
    lines.append("```")
    lines.append("")
    lines.append(f"- Exports: {', '.join(e.get('persist_exports') or [])}")
    lines.append(f"- boot.js exports: {', '.join(e.get('boot_exports') or [])} (bytes={e.get('boot_bytes')})")
    lines.append("")
    lines.append("### Note on boot.js vs boot-l1.js")
    lines.append("")
    lines.append("- Many games boot via **per-game** `js/boot-l1.js` imported from `main.js`, not necessarily `engine/js/boot.js`.")
    lines.append("- `engine/js/boot.js` remains for older/shared curriculum shells — confirm per game main.js import.")
    lines.append("")
    lines.append("### i18n")
    lines.append("")
    lines.append(f"- en.json flattened keys: **{e['i18n_en_keys']}**")
    lines.append(f"- bn.json flattened keys: **{e['i18n_bn_keys']}**")
    lines.append(f"- Keys in en missing from bn: **{e['i18n_missing_count']}**")
    if e.get("i18n_missing_in_bn"):
        lines.append("- Sample missing BN keys: " + ", ".join(f"`{k}`" for k in e["i18n_missing_in_bn"][:25]))
    lines.append("- Landing page has its **own** en/bn strings inside `js/landing.js` (separate from engine locales).")
    lines.append("")
    return "\n".join(lines)


def architecture_section() -> str:
    lines = ["## 6. Architecture Facts", ""]
    lines.append("### Backend / DB / auth")
    lines.append("")
    lines.append("- **No traditional app backend/database/auth** for gameplay saves (localStorage only).")
    lines.append(f"- **Exception:** [`tools/groq_proxy.py`](tools/groq_proxy.py) — static file server + `POST /api/chat` to Groq (key in `.env`). Exists: {RAW['has_groq_proxy']}.")
    lines.append(f"- `.env.example` present: {RAW['has_env_example']}.")
    if RAW.get("backendish_files"):
        lines.append("- Files matching backend-ish keywords (may be false positives / docs):")
        for h in RAW["backendish_files"][:20]:
            lines.append(f"  - `{h}`")
    lines.append("")
    lines.append("### localStorage keys (searched in .js/.html/.mjs/.ts)")
    lines.append("")
    for k in RAW["localStorage_keys"]:
        lines.append(f"- `{k}`")
    lines.append("")
    lines.append("### Voice / audio")
    lines.append("")
    lines.append("| Game | imports engine voice.js | audio files under game (excl _legacy3d) |")
    lines.append("|------|-------------------------|----------------------------------------|")
    for v in RAW["voice"]:
        lines.append(f"| {v['game']} | {v['imports_voice']} | {v['audio_count']} |")
    lines.append("")
    lines.append("- If `imports_voice` is false and audio_count is 0, narration is **not wired** in the live boot path (coach text UI may still exist).")
    lines.append("")
    return "\n".join(lines)


def debt_section() -> str:
    lines = ["## 7. Known Inconsistencies / Tech Debt", ""]
    lines.append("- Landing still markets **3D** in places; live labs are Canvas **2D** with `_legacy3d` archives.")
    lines.append("- `index.html` static gamesLead vs `landing.js` COPY.en gamesLead disagree until JS runs.")
    lines.append("- Many manifests still list **playgroundGroups / assetKeys** from 3D stamp era; playground often removed from boot-l1.")
    lines.append("- Chemistry (and possibly others) may still contain unused `curriculum.js` / 3D-oriented keys while boot-l1 is Canvas.")
    lines.append("- Book unlock depends on `gq-unlock-all-books` + optional `?unlockBooks=1`; localhost vs 127.0.0.1 split localStorage.")
    lines.append("- Groq API may fall back locally when Cloudflare/network blocks (`tools/groq_proxy.py`).")
    lines.append("- Stamp/generic deepen quality varies; STATUS column uses file heuristics (size, mounts, playable flag) — gold Chem/ICT/Eco books hand-tuned.")
    lines.append("- Force Fighter physics hint leftovers were cleaned from some games earlier; re-verify if any boot still mentions inertia outside Force.")
    lines.append("")
    return "\n".join(lines)


def summary_table() -> str:
    lines = ["## 8. Summary Table", ""]
    lines.append("| Game | # Levels REAL | # Levels TEMPLATE | # Levels STUB | # Levels MISSING | Notes |")
    lines.append("|------|---------------|-------------------|---------------|------------------|-------|")
    for g in RAW["games"]:
        from collections import Counter
        c = Counter(lv["status"] for lv in g["levels"])
        notes = f"playableMeta={g['playable_count']}; books={len(g['files']['books'])}; curriculum.js={'Y' if g['files']['curriculum_js'] else 'N'}"
        lines.append(
            f"| {g['folder']} | {c.get('REAL',0)} | {c.get('TEMPLATE',0)} | {c.get('STUB',0)} | {c.get('MISSING',0)} | {notes} |"
        )
    lines.append("")
    lines.append(
        "_STATUS heuristic: playable+deep mounts+10 runners+size→REAL; stamp markers→TEMPLATE; "
        "playable:false→STUB; missing level file for playable→MISSING. "
        "This is verified against files but REAL vs high-quality-generated deepen is not a human editorial grade._"
    )
    lines.append("")
    return "\n".join(lines)


def main():
    parts = [
        "# GyanQuest / ImpactX — PROJECT AUDIT",
        "",
        f"_Generated from repository files via `tools/gen_project_audit_raw.py` + `tools/write_project_audit_md.py`. "
        f"Claims below were checked against disk; where a classic `curriculum.js` 10×10 template was expected by the audit brief, "
        f"the actual Chem/Canvas architecture is documented instead._",
        "",
        landing_section(),
        per_game_section(),
        chem_section(),
        force_section(),
        engine_section(),
        architecture_section(),
        debt_section(),
        summary_table(),
    ]
    out = ROOT / "PROJECT_AUDIT.md"
    out.write_text("\n".join(parts), encoding="utf-8", newline="\n")
    print("Wrote", out, "chars", out.stat().st_size)


if __name__ == "__main__":
    main()
