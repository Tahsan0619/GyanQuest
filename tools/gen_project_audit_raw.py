#!/usr/bin/env python3
"""Generate raw audit facts from the repo (no guessing)."""
from __future__ import annotations

import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / "tools" / "_audit_raw.json"

def read(p: pathlib.Path) -> str:
    return p.read_text(encoding="utf-8", errors="replace") if p.exists() else ""

def localstorage_keys() -> list[str]:
    keys = set()
    pats = [
        re.compile(r'localStorage\.(?:get|set|remove)Item\(\s*[\'"]([^\'"]+)[\'"]'),
        re.compile(r'localStorage\.(?:get|set|remove)Item\(\s*`([^`$]+)`'),
        re.compile(r'storageKey\s*:\s*[\'"]([^\'"]+)[\'"]'),
        re.compile(r'localeStorageKey\s*\|\|\s*[\'"]([^\'"]+)[\'"]'),
        re.compile(r'localeKey\s*:\s*[\'"]([^\'"]+)[\'"]'),
        re.compile(r'saveKey\s*:\s*[\'"]([^\'"]+)[\'"]'),
    ]
    for p in ROOT.rglob("*"):
        if p.suffix.lower() not in {".js", ".html", ".mjs", ".ts"}:
            continue
        if any(x in p.parts for x in ("node_modules", ".git", "_legacy3d", "vendor")):
            continue
        try:
            t = read(p)
        except Exception:
            continue
        for pat in pats:
            for m in pat.finditer(t):
                keys.add(m.group(1))
    return sorted(keys)

def landing_catalog():
    t = read(ROOT / "js" / "landing.js")
    # extract CATALOG items with live flags
    items = []
    for m in re.finditer(
        r'\{\s*id:\s*"([^"]+)"\s*,\s*emoji:\s*"([^"]*)"\s*,\s*href:\s*"([^"]*)"\s*,\s*live:\s*(true|false)',
        t,
    ):
        items.append({"id": m.group(1), "emoji": m.group(2), "href": m.group(3), "live": m.group(4) == "true"})
    return items

def parse_missions_meta(text: str):
    missions = []
    # Split mission objects after MISSIONS = [
    m = re.search(r'export const MISSIONS\s*=\s*\[', text)
    if not m:
        return missions
    body = text[m.end() :]
    # find matching closing ]; at top level — use simple brace objects
    depth = 0
    start = None
    objs = []
    for i, ch in enumerate(body):
        if ch == "{":
            if depth == 0:
                start = i
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0 and start is not None:
                objs.append(body[start : i + 1])
                start = None
        elif ch == "]" and depth == 0:
            break

    def field(block: str, name: str) -> str:
        mm = re.search(rf'(?:^|[,\s]){name}\s*:\s*"([^"]*)"', block, re.M)
        if mm:
            return mm.group(1)
        mm = re.search(rf'"{name}"\s*:\s*"([^"]*)"', block)
        return mm.group(1) if mm else ""

    for block in objs:
        mid = field(block, "id")
        if not mid:
            continue
        playable = bool(
            re.search(r'(?:^|[,\s])playable\s*:\s*true\b', block, re.M)
            or re.search(r'"playable"\s*:\s*true\b', block)
        )
        missions.append(
            {
                "id": mid,
                "kidTitle": field(block, "kidTitle"),
                "theme": field(block, "theme"),
                "hook": field(block, "hook"),
                "playable": playable,
            }
        )
    return missions

def extract_meta(level_path: pathlib.Path):
    t = read(level_path)
    m = re.search(r'export const L\d+_META\s*=\s*\{([\s\S]*?)\n\};', t)
    if not m:
        return None
    body = m.group(1)
    def s(name):
        mm = re.search(rf'{name}:\s*"([^"]*)"', body)
        return mm.group(1) if mm else ""
    subs = re.findall(r'subTitles:\s*\[([^\]]*)\]', body)
    sub_list = re.findall(r'"([^"]+)"', subs[0]) if subs else []
    # detect runners
    runners = re.findall(r'function ((?:s|sub)\d+[A-Za-z0-9_]*)\(', t)
    # activity mounts used per function roughly
    mounts = sorted(set(re.findall(r'mount(MotionChain|DragSort|HeatLab|EquationBuild|Quiz|SpeedDrill|MythCards|TapContinue|OrderSteps|Boss)\(', t)))
    stampy = bool(re.search(r'Meet the Idea|Yes A|STAMP GENERIC|Coming soon this idea', t, re.I))
    has_deep = 'mountDragSort' in t or 'mountMotionChain' in t or 'mountHeatLab' in t
    return {
        "kidTitle": s("kidTitle"),
        "theme": s("theme"),
        "intro": s("intro"),
        "rewardName": s("rewardName"),
        "subTitles": sub_list,
        "runners": runners,
        "mounts": mounts,
        "stampy": stampy,
        "has_deep_mounts": has_deep,
        "bytes": len(t),
        "exists": True,
    }

def classify_level(game: str, idx: int, meta_info, playable: bool, has_level_file: bool):
    if not playable:
        return "STUB"
    if not has_level_file or not meta_info:
        return "MISSING"
    if meta_info.get("stampy"):
        return "TEMPLATE"
    # Heuristic: deepened if 10 runners and deep mounts and substantial size
    if meta_info.get("has_deep_mounts") and len(meta_info.get("runners") or []) >= 10 and meta_info.get("bytes", 0) > 4000:
        # Gold/hand-authored vs generated-deepen both look "REAL" by checklist
        return "REAL"
    if meta_info.get("bytes", 0) < 2500:
        return "TEMPLATE"
    return "REAL"

def scan_game(gdir: pathlib.Path):
    name = gdir.name
    js = gdir / "js"
    manifest = {}
    mt = read(gdir / "manifest.js")
    for key in ("id", "title", "storageKey", "localeKey", "saveKey", "slug"):
        m = re.search(rf'(?:^|[,\s]|"){key}"?\s*:\s*[\'"]([^\'"]+)[\'"]', mt, re.M)
        if m:
            manifest[key] = m.group(1)
    # theme accents
    m = re.search(r'theme\s*:\s*\{([^}]+)\}', mt, re.S)
    if m:
        manifest["theme_block"] = re.sub(r'\s+', ' ', m.group(1).strip())[:200]
    assets = re.findall(r'[\'"](/[^\'"]+\.(?:svg|png|jpg|wav|mp3))[\'"]', mt)

    missions = parse_missions_meta(read(js / "missions-meta.js"))
    curriculum_exists = (js / "curriculum.js").exists() or (gdir / "curriculum.js").exists()
    curriculum_path = None
    for cand in (js / "curriculum.js", gdir / "curriculum.js"):
        if cand.exists():
            curriculum_path = str(cand.relative_to(ROOT))
            break

    levels = []
    for i in range(10):
        playable = False
        mid = None
        title = None
        if i < len(missions):
            playable = missions[i].get("playable", False)
            mid = missions[i].get("id")
            title = missions[i].get("kidTitle")
        level_path = js / f"level{i+1}.js"
        meta_info = extract_meta(level_path) if level_path.exists() else None
        # Only first N playable map to level1..N in this project pattern
        # For non-playable beyond, level file may still exist as stub
        status = classify_level(name, i, meta_info, playable, level_path.exists())
        # If playable false but level file exists as deepen leftover unused — STUB
        if not playable and level_path.exists():
            status = "STUB"
        if not playable and not level_path.exists():
            status = "STUB"
        levels.append({
            "index": i,
            "missionId": mid,
            "missionTitle": title or (meta_info or {}).get("kidTitle"),
            "playable_flag": playable,
            "level_file": f"js/level{i+1}.js" if level_path.exists() else None,
            "subTitles": (meta_info or {}).get("subTitles") or [],
            "runners": (meta_info or {}).get("runners") or [],
            "mounts": (meta_info or {}).get("mounts") or [],
            "status": status,
            "bytes": (meta_info or {}).get("bytes"),
        })

    files = {
        "boot_l1": (js / "boot-l1.js").exists(),
        "arena_2d": (js / "arena-2d.js").exists(),
        "lab_activities": (js / "lab-activities.js").exists() or (js / "chem-activities.js").exists(),
        "books": sorted([p.name for p in (gdir / "books").glob("level*.js")]) if (gdir / "books").exists() else [],
        "legacy3d": (gdir / "_legacy3d").exists(),
        "curriculum_js": curriculum_exists,
        "curriculum_path": curriculum_path,
        "scenes": sorted([p.name for p in js.glob("*-scenes.js")]) if js.exists() else [],
    }

    # TODOs / FIXME in game js
    todos = []
    for p in js.glob("*.js") if js.exists() else []:
        for i, line in enumerate(read(p).splitlines(), 1):
            if re.search(r'\b(TODO|FIXME|XXX|HACK)\b', line, re.I):
                todos.append(f"{p.name}:{i}: {line.strip()[:120]}")
            if "console.log" in line and "console.log(" in line:
                if len(todos) < 30:
                    todos.append(f"{p.name}:{i}: console.log …")

    return {
        "folder": name,
        "manifest": manifest,
        "manifest_assets": assets[:40],
        "missions_count": len(missions),
        "playable_count": sum(1 for m in missions if m.get("playable")),
        "missions": missions,
        "levels": levels,
        "files": files,
        "todos_sample": todos[:25],
    }

def chem_detail():
    g = ROOT / "games" / "chemistry-lab"
    detail = {}
    for name in ["boot-l1.js", "level1.js", "level2.js", "level3.js", "chem-activities.js",
                 "activity-controller.js", "atom-scenes.js", "arena-2d.js", "curriculum.js",
                 "element-scenes.js", "bond-scenes.js"]:
        p = g / "js" / name
        if not p.exists():
            detail[name] = {"exists": False}
            continue
        t = read(p)
        exports = re.findall(r'^export (?:async )?function (\w+)|^export const (\w+)', t, re.M)
        ex = [a or b for a, b in exports]
        detail[name] = {
            "exists": True,
            "bytes": len(t),
            "exports": ex[:40],
            "has_TODO": bool(re.search(r'TODO|FIXME', t)),
            "imports": re.findall(r'from\s+[\'"]([^\'"]+)[\'"]', t)[:30],
        }
    return detail

def force_detail():
    g = ROOT / "games" / "force-fighter"
    detail = {"folder_files": sorted(p.name for p in (g / "js").glob("*.js")) if (g / "js").exists() else []}
    mt = read(g / "manifest.js")
    for key in ("storageKey", "localeKey", "title", "id"):
        m = re.search(rf'{key}\s*:\s*[\'"]([^\'"]+)[\'"]', mt)
        if m:
            detail[key] = m.group(1)
    detail["legacy3d"] = (g / "_legacy3d").exists()
    detail["has_curriculum"] = (g / "js" / "curriculum.js").exists()
    return detail

def engine_detail():
    eng = ROOT / "engine"
    out = {"js": sorted(p.name for p in (eng / "js").glob("*.js")),
           "css": sorted(p.name for p in (eng / "css").glob("*.css")),
           "locales": sorted(p.name for p in (eng / "locales").glob("*")) if (eng / "locales").exists() else []}
    persist = read(eng / "js" / "persist.js")
    # extract save shape comments / stringify
    out["persist_save_snippet"] = []
    for m in re.finditer(r'JSON\.stringify\(\{([^}]+)\}', persist, re.S):
        out["persist_save_snippet"].append(re.sub(r'\s+', ' ', m.group(1))[:300])
    out["persist_exports"] = re.findall(r'^export function (\w+)', persist, re.M)
    boot = read(eng / "js" / "boot.js")
    out["boot_exports"] = re.findall(r'^export (?:async )?function (\w+)', boot, re.M)
    out["boot_bytes"] = len(boot)
    # i18n keys
    en = {}
    bn = {}
    en_path = eng / "locales" / "en.json"
    bn_path = eng / "locales" / "bn.json"
    if en_path.exists():
        en = json.loads(read(en_path))
    if bn_path.exists():
        bn = json.loads(read(bn_path))
    def flatten(d, prefix=""):
        items = {}
        if isinstance(d, dict):
            for k, v in d.items():
                items.update(flatten(v, f"{prefix}.{k}" if prefix else k))
        else:
            items[prefix] = d
        return items
    en_f = flatten(en)
    bn_f = flatten(bn)
    missing_bn = sorted(set(en_f) - set(bn_f))
    out["i18n_en_keys"] = len(en_f)
    out["i18n_bn_keys"] = len(bn_f)
    out["i18n_missing_in_bn"] = missing_bn[:80]
    out["i18n_missing_count"] = len(missing_bn)
    return out

def voice_scan():
    """Which games reference voice / have audio assets."""
    rows = []
    for g in sorted((ROOT / "games").iterdir()):
        if not g.is_dir():
            continue
        js = read(g / "js" / "boot-l1.js") + read(g / "main.js")
        has_voice_import = "voice.js" in js or "/engine/js/voice" in js
        audio_files = list(g.rglob("*.wav")) + list(g.rglob("*.mp3")) + list(g.rglob("*.ogg"))
        # exclude legacy
        audio_files = [p for p in audio_files if "_legacy3d" not in p.parts]
        rows.append({
            "game": g.name,
            "imports_voice": has_voice_import,
            "audio_count": len(audio_files),
            "audio_sample": [str(p.relative_to(g)) for p in audio_files[:5]],
        })
    return rows

def backend_scan():
    hits = []
    for p in ROOT.rglob("*"):
        if p.suffix.lower() not in {".js", ".py", ".html", ".md"}:
            continue
        if any(
            x in p.parts
            for x in (".git", "node_modules", "_legacy3d", "_gq_old_bundle", "3D Assets", ".venv", "site-packages")
        ):
            continue
        if "PROJECT_AUDIT" in p.name or "_audit" in p.name:
            continue
        t = read(p)
        if re.search(r'\b(express\.|fastapi|Flask\(|mongodb|postgres|sqlite3|passport\.|supabase)\b', t):
            hits.append(str(p.relative_to(ROOT)))
    return hits

def main():
    games = []
    for g in sorted((ROOT / "games").iterdir()):
        if g.is_dir() and not g.name.startswith("."):
            games.append(scan_game(g))
    data = {
        "landing_catalog": landing_catalog(),
        "landing_index_title": re.search(r'<title>([^<]+)</title>', read(ROOT / "index.html")).group(1) if (ROOT / "index.html").exists() else None,
        "games_count": len(games),
        "games": games,
        "chemistry": chem_detail(),
        "force_fighter": force_detail(),
        "engine": engine_detail(),
        "localStorage_keys": localstorage_keys(),
        "voice": voice_scan(),
        "backendish_files": backend_scan()[:60],
        "has_groq_proxy": (ROOT / "tools" / "groq_proxy.py").exists(),
        "has_env_example": (ROOT / ".env.example").exists(),
    }
    OUT.write_text(json.dumps(data, indent=2), encoding="utf-8")
    print("Wrote", OUT, "games", len(games))

if __name__ == "__main__":
    main()
