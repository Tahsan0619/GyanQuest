#!/usr/bin/env python3
"""
Distribute verified shared photos into each game assets/book/, then generate
all 52 theory-aligned digital books in one pass.

Images must already exist in assets/book-shared/ (verified downloads).
No network during this stage — guarantees non-broken local assets.
"""
from __future__ import annotations

import json
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GAMES = ROOT / "games"
SHARED = ROOT / "assets" / "book-shared"
SLOT_KEYS = ("cover", "hook", "model", "mechanism")

# Prefer themed subsets from shared pool when available.
THEME_PREF = {
    "chemistry-lab": [
        "Home-grown_salt_(ClNa)_crystals._01.jpg",
        "Salt_crystals_under_the_microscope.jpg",
        "Ice_water_vapor.jpg",
        "Melting_ice.jpg",
        "Close_Up_View_Of_Sodium_Chloride_Crystals.jpg",
        "Boiling_water.jpg",
    ],
    "astronomy-space": [
        "Planets2013.jpg",
        "Solar_sys.jpg",
        "The_Earth_seen_from_Apollo_17.jpg",
        "FullMoon2010.jpg",
        "Milky_Way_Arch.jpg",
    ],
    "force-fighter": [
        "Association_football.jpg",
        "Soccer_ball.jpg",
        "The_Earth_seen_from_Apollo_17.jpg",
        "Boiling_water.jpg",
        "Melting_ice.jpg",
    ],
    "bio-explorer": [
        "Helianthus_annuus_sunflower.jpg",
        "Compound_Microscope.jpg",
        "Ice_water_vapor.jpg",
        "The_Earth_seen_from_Apollo_17.jpg",
    ],
    "math-quest": [
        "Abacus_6.jpg",
        "Planets2013.jpg",
        "FullMoon2010.jpg",
        "Ice_water_vapor.jpg",
    ],
    "electrical-basics": [
        "Incandescent_light_bulb.jpg",
        "Integrated_circuit.jpg",
        "Boiling_water.jpg",
        "The_Earth_seen_from_Apollo_17.jpg",
    ],
    "ai-lab": [
        "ASIMO_4.0.jpg",
        "Integrated_circuit.jpg",
        "Planets2013.jpg",
        "The_Earth_seen_from_Apollo_17.jpg",
    ],
    "ict-fundamentals": [
        "Integrated_circuit.jpg",
        "ASIMO_4.0.jpg",
        "Planets2013.jpg",
        "Boiling_water.jpg",
    ],
    "human-anatomy": [
        "Human_brain_NIH.png",
        "The_Earth_seen_from_Apollo_17.jpg",
        "Ice_water_vapor.jpg",
        "Melting_ice.jpg",
    ],
    "eco-guardian": [
        "Temperate_deciduous_forest.jpg",
        "Amazon_River.jpg",
        "The_Earth_seen_from_Apollo_17.jpg",
        "Ice_water_vapor.jpg",
    ],
}


def extract_level_meta(level_path: Path) -> dict:
    if not level_path.exists():
        return {}
    t = level_path.read_text(encoding="utf-8", errors="replace")
    m = re.search(r"export const L\d+_META\s*=\s*\{([\s\S]*?)\n\};", t)
    if not m:
        return {}
    body = m.group(1)

    def s(name: str) -> str:
        mm = re.search(rf'{name}:\s*"([^"]*)"', body)
        return mm.group(1) if mm else ""

    everyday = []
    em = re.search(r"everyday:\s*\[([^\]]*)\]", body)
    if em:
        everyday = re.findall(r'"([^"]+)"', em.group(1))
    subs = []
    sm = re.search(r"subTitles:\s*\[([^\]]*)\]", body)
    if sm:
        subs = re.findall(r'"([^"]+)"', sm.group(1))
    return {
        "kidTitle": s("kidTitle"),
        "theme": s("theme"),
        "intro": s("intro"),
        "rewardName": s("rewardName"),
        "objective": s("objective"),
        "everyday": everyday,
        "subTitles": subs,
    }


def discover_targets() -> list[dict]:
    out = []
    for game_dir in sorted(GAMES.iterdir()):
        books_dir = game_dir / "books"
        if not books_dir.exists():
            continue
        for bp in sorted(books_dir.glob("level*.js")):
            m = re.search(r"level(\d+)\.js$", bp.name)
            if not m:
                continue
            n = int(m.group(1))
            meta = extract_level_meta(game_dir / "js" / f"level{n}.js")
            if not meta.get("kidTitle"):
                bt = bp.read_text(encoding="utf-8", errors="replace")
                tm = re.search(r'"title":\s*"([^"]+)"', bt) or re.search(r'title:\s*"([^"]+)"', bt)
                if tm:
                    meta["kidTitle"] = tm.group(1)
                sm = re.search(r'"subtitle":\s*"([^"]+)"', bt) or re.search(r'subtitle:\s*"([^"]+)"', bt)
                if sm:
                    meta["theme"] = sm.group(1)
            out.append(
                {
                    "game": game_dir.name,
                    "level": n,
                    "index": n - 1,
                    "meta": meta,
                    "out_book": bp,
                    "asset_dir": game_dir / "assets" / "book",
                }
            )
    return out


def shared_files() -> list[Path]:
    files = []
    for p in sorted(SHARED.iterdir()):
        if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp", ".gif"} and p.stat().st_size >= 8000:
            files.append(p)
    return files


def pick_sources(game: str, level: int, shared: list[Path]) -> list[Path]:
    by_name = {p.name: p for p in shared}
    preferred = []
    for name in THEME_PREF.get(game, []):
        if name in by_name:
            preferred.append(by_name[name])
    # fill from all shared, rotated by level
    rot = (level - 1) * 2
    rotated = shared[rot:] + shared[:rot]
    out = []
    for p in preferred + rotated:
        if p not in out:
            out.append(p)
    return out


def is_valid(p: Path) -> bool:
    if not p.exists() or p.stat().st_size < 8000:
        return False
    b = p.read_bytes()[:16]
    return (
        b[:3] == b"\xff\xd8\xff"
        or b[:8] == b"\x89PNG\r\n\x1a\n"
        or b[:6] in (b"GIF87a", b"GIF89a")
        or (b[:4] == b"RIFF")
    )


def install_images(target: dict, shared: list[Path]) -> dict[str, dict]:
    asset_dir = target["asset_dir"]
    asset_dir.mkdir(parents=True, exist_ok=True)
    game = target["game"]
    n = target["level"]
    imgs: dict[str, dict] = {}

    # Preserve Tiny Bits originals
    if game == "chemistry-lab" and n == 1:
        legacy = {
            "cover": "m1-cover.jpg",
            "hook": "m1-particles.jpg",
            "model": "m1-states.jpg",
            "mechanism": "m1-melt.jpg",
            "representation": "m1-lattice.jpg",
            "transfer_a": "m1-boil.jpg",
            "transfer_b": "m1-melt.jpg",
            "transfer_c": "m1-cover.jpg",
        }
        for slot, name in legacy.items():
            p = asset_dir / name
            if is_valid(p):
                imgs[slot] = {"file": name, "src": f"/games/chemistry-lab/assets/book/{name}"}
        return imgs

    sources = pick_sources(game, n, shared)
    for i, slot in enumerate(SLOT_KEYS):
        if not sources:
            break
        src = sources[i % len(sources)]
        # unique-ish filename per slot
        dest_name = f"m{n}-{slot}{src.suffix.lower()}"
        dest = asset_dir / dest_name
        if not is_valid(dest):
            shutil.copy2(src, dest)
        if not is_valid(dest):
            continue
        imgs[slot] = {"file": dest_name, "src": f"/games/{game}/assets/book/{dest_name}"}

    # representation + transfer carousels
    avail = [imgs[k] for k in SLOT_KEYS if k in imgs]
    if avail:
        imgs.setdefault("representation", avail[-1])
        for i, key in enumerate(("transfer_a", "transfer_b", "transfer_c")):
            imgs[key] = avail[i % len(avail)]

    credits = [
        {"file": v["file"], "src": v["src"], "from_shared": True}
        for v in imgs.values()
    ]
    (asset_dir / f"CREDITS-m{n}.json").write_text(json.dumps(credits, indent=2), encoding="utf-8")
    return imgs


def main():
    try:
        sys.stdout.reconfigure(line_buffering=True)
    except Exception:
        pass
    sys.path.insert(0, str(ROOT / "tools"))
    from build_all_mission_books import build_book

    shared = shared_files()
    if len(shared) < 4:
        print(f"ERROR: need >=4 verified shared images in {SHARED}, found {len(shared)}")
        return 1
    print(f"Shared verified photos: {len(shared)}")
    for p in shared:
        print(f"  - {p.name} ({p.stat().st_size} B)")

    targets = discover_targets()
    print(f"\nInstalling images + generating {len(targets)} books…")
    results = []
    for t in targets:
        imgs = install_images(t, shared)
        print(f"  {t['game']} L{t['level']}: {len(imgs)} slots · {t['meta'].get('kidTitle')}")
        try:
            if t["game"] == "chemistry-lab" and t["level"] == 1:
                print("    keep handcrafted Tiny Bits book")
            else:
                js = build_book(t, imgs)
                t["out_book"].write_text(js, encoding="utf-8", newline="\n")
            results.append({"game": t["game"], "level": t["level"], "images": len(imgs)})
        except Exception as e:
            print(f"    ERROR {e}")
            results.append({"game": t["game"], "level": t["level"], "error": str(e)})

    summary = ROOT / "tools" / "book_build_summary.json"
    summary.write_text(json.dumps(results, indent=2), encoding="utf-8")
    ok = sum(1 for r in results if not r.get("error"))
    print(f"\nDONE {ok}/{len(results)} -> {summary}")
    return 0 if ok == len(results) else 1


if __name__ == "__main__":
    raise SystemExit(main())
