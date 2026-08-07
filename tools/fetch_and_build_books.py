#!/usr/bin/env python3
"""
Polite, resume-safe image fetch + theory-aligned book generation for all 52 missions.

Respects Wikimedia robot policy (https://w.wiki/4wJS):
  - Identifiable User-Agent with project URL
  - Slow pacing (~1 request / 5s)
  - Direct upload.wikimedia.org MD5 paths (no search API)
  - Skip already-valid local files
"""
from __future__ import annotations

import hashlib
import json
import re
import ssl
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

ssl._create_default_https_context = ssl._create_unverified_context

ROOT = Path(__file__).resolve().parents[1]
GAMES = ROOT / "games"
UA = {
    "User-Agent": (
        "GyanQuestBookBot/3.1 (https://github.com/Tahsan0619/GyanQuest; "
        "educational offline curriculum mirror; contact via GitHub issues)"
    )
}
MIN_BYTES = 8_000
PAUSE = 5.0  # seconds between Wikimedia requests

# 4 photo slots + transfer carousel reuses them → fewer network hits, still multi-image pages.
SLOT_KEYS = ("cover", "hook", "model", "mechanism")

# Known-good Commons filenames (photos/png only). MD5 path, no API.
POOL: dict[str, list[str]] = {
    "chemistry-lab": [
        "Home-grown_salt_(ClNa)_crystals._01.jpg",
        "Salt_crystals_under_the_microscope.jpg",
        "Ice_water_vapor.jpg",
        "Melting_ice.jpg",
        "Close_Up_View_Of_Sodium_Chloride_Crystals.jpg",
        "Boiling_water.jpg",
        "Periodic_table.jpg",
    ],
    "force-fighter": [
        "Soccer_ball.jpg",
        "Tug_of_war.jpg",
        "Skateboarding.jpg",
        "Newton%27s_cradle.gif",
        "Friction.jpg",
        "Pushing.jpg",
    ],
    "astronomy-space": [
        "Planets2013.jpg",
        "Solar_sys.jpg",
        "The_Earth_seen_from_Apollo_17.jpg",
        "FullMoon2010.jpg",
        "Milky_Way_Arch.jpg",
        "Earth_Western_Hemisphere.jpg",
    ],
    "bio-explorer": [
        "Sunflower.jpg",
        "Onion_cells.jpg",
        "Leaf.jpg",
        "Amoeba.jpg",
        "Microscope.jpg",
        "Plant.jpg",
    ],
    "math-quest": [
        "Abacus.jpg",
        "Chocolate.jpg",
        "Orange.jpg",
        "Pizza.jpg",
        "Base_ten.jpg",
        "Counting.jpg",
    ],
    "default": [
        "The_Earth_seen_from_Apollo_17.jpg",
        "Planets2013.jpg",
        "Solar_sys.jpg",
        "Boiling_water.jpg",
        "Ice_water_vapor.jpg",
        "Melting_ice.jpg",
        "FullMoon2010.jpg",
        "Home-grown_salt_(ClNa)_crystals._01.jpg",
        "Salt_crystals_under_the_microscope.jpg",
        "Close_Up_View_Of_Sodium_Chloride_Crystals.jpg",
        "Microscope.jpg",
        "Sunflower.jpg",
        "Soccer_ball.jpg",
        "Books.jpg",
        "Globe.jpg",
        "Classroom.jpg",
        "Laboratory.jpg",
        "Computer_keyboard.jpg",
        "Laptop.jpg",
        "Battery.jpg",
        "Light_bulb.jpg",
        "Recycling.jpg",
        "Forest.jpg",
        "River.jpg",
        "Mountain.jpg",
        "DNA.jpg",
        "Heart.jpg",
        "Brain.jpg",
        "Robot.jpg",
        "Circuit.jpg",
    ],
}

# Exact filenames we already confirmed via direct URL in this project session.
VERIFIED = [
    "The_Earth_seen_from_Apollo_17.jpg",
    "Boiling_water.jpg",
    "Planets2013.jpg",
    "Solar_sys.jpg",
    "Ice_water_vapor.jpg",
    "Home-grown_salt_(ClNa)_crystals._01.jpg",
    "Salt_crystals_under_the_microscope.jpg",
    "Close_Up_View_Of_Sodium_Chloride_Crystals.jpg",
    "Melting_ice.jpg",
    "FullMoon2010.jpg",
]


def commons_url(filename: str) -> str:
    name = filename.replace(" ", "_")
    # Undo accidental double-encoding markers
    name = urllib.parse.unquote(name)
    h = hashlib.md5(name.encode("utf-8")).hexdigest()
    return f"https://upload.wikimedia.org/wikipedia/commons/{h[0]}/{h[:2]}/{urllib.parse.quote(name)}"


def http_bytes(url: str, timeout: int = 90) -> bytes:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def is_valid_image(blob: bytes) -> bool:
    if not blob or len(blob) < MIN_BYTES:
        return False
    return (
        blob[:3] == b"\xff\xd8\xff"
        or blob[:8] == b"\x89PNG\r\n\x1a\n"
        or blob[:6] in (b"GIF87a", b"GIF89a")
        or (blob[:4] == b"RIFF" and blob[8:12] == b"WEBP")
    )


def ext_for(blob: bytes) -> str:
    if blob[:3] == b"\xff\xd8\xff":
        return ".jpg"
    if blob[:8] == b"\x89PNG\r\n\x1a\n":
        return ".png"
    if blob[:6] in (b"GIF87a", b"GIF89a"):
        return ".gif"
    if blob[:4] == b"RIFF" and blob[8:12] == b"WEBP":
        return ".webp"
    return ".jpg"


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


def pool_for(game: str) -> list[str]:
    # Prefer verified names first, then game pool, then default.
    names = []
    for n in VERIFIED + POOL.get(game, []) + POOL["default"]:
        n = urllib.parse.unquote(n)
        if n not in names and not n.lower().endswith(".svg"):
            names.append(n)
    return names


def existing_slot(asset_dir: Path, stem: str, game: str) -> dict | None:
    for ext in (".jpg", ".png", ".webp", ".gif"):
        p = asset_dir / f"{stem}{ext}"
        if p.exists() and p.stat().st_size >= MIN_BYTES and is_valid_image(p.read_bytes()):
            return {"file": p.name, "src": f"/games/{game}/assets/book/{p.name}", "cached": True}
    # Tiny Bits legacy
    if game == "chemistry-lab" and stem.startswith("m1-"):
        legacy = {
            "m1-cover": "m1-cover.jpg",
            "m1-hook": "m1-particles.jpg",
            "m1-model": "m1-states.jpg",
            "m1-mechanism": "m1-melt.jpg",
        }
        name = legacy.get(stem)
        if name:
            p = asset_dir / name
            if p.exists() and is_valid_image(p.read_bytes()):
                return {"file": name, "src": f"/games/chemistry-lab/assets/book/{name}", "cached": True}
    return None


def download_one(asset_dir: Path, stem: str, filename: str, game: str, used_files: set[str]) -> dict | None:
    if filename in used_files:
        return None
    url = commons_url(filename)
    try:
        blob = http_bytes(url)
    except Exception as e:
        print(f"    skip {filename}: {e}", flush=True)
        time.sleep(PAUSE)
        return None
    time.sleep(PAUSE)
    if not is_valid_image(blob):
        print(f"    reject {filename} (invalid/small)", flush=True)
        return None
    ext = ext_for(blob)
    path = asset_dir / f"{stem}{ext}"
    path.write_bytes(blob)
    used_files.add(filename)
    print(f"    OK {stem}{ext} <- {filename} ({len(blob)} B)", flush=True)
    return {
        "file": path.name,
        "src": f"/games/{game}/assets/book/{path.name}",
        "source": f"https://commons.wikimedia.org/wiki/File:{urllib.parse.quote(filename)}",
        "bytes": len(blob),
        "commons": filename,
    }


def process_images(target: dict, pool_cursor: dict[str, int]) -> dict[str, dict]:
    asset_dir = target["asset_dir"]
    asset_dir.mkdir(parents=True, exist_ok=True)
    game = target["game"]
    pool = pool_for(game)
    cursor = pool_cursor.setdefault(game, (target["level"] - 1) * len(SLOT_KEYS))
    used_files: set[str] = set()
    imgs: dict[str, dict] = {}
    credits = []
    prefix = f"m{target['level']}"

    for slot in SLOT_KEYS:
        stem = f"{prefix}-{slot}"
        cached = existing_slot(asset_dir, stem, game)
        if cached:
            imgs[slot] = cached
            print(f"    cache {stem} -> {cached['file']}", flush=True)
            continue
        # walk pool until success
        attempts = 0
        while attempts < len(pool):
            filename = pool[cursor % len(pool)]
            cursor += 1
            attempts += 1
            credit = download_one(asset_dir, stem, filename, game, used_files)
            if credit:
                imgs[slot] = credit
                credits.append(credit)
                break
        else:
            print(f"    FAIL {stem}", flush=True)

    pool_cursor[game] = cursor

    # Synthesize transfer slots from available photos for carousels
    avail = [imgs[k] for k in SLOT_KEYS if k in imgs]
    for i, key in enumerate(("transfer_a", "transfer_b", "transfer_c")):
        if avail:
            imgs[key] = avail[i % len(avail)]

    (asset_dir / f"CREDITS-m{target['level']}.json").write_text(
        json.dumps(credits, indent=2), encoding="utf-8"
    )
    return imgs


def main():
    try:
        sys.stdout.reconfigure(line_buffering=True)
    except Exception:
        pass
    sys.path.insert(0, str(ROOT / "tools"))
    from build_all_mission_books import build_book

    targets = discover_targets()
    print(f"Discovered {len(targets)} books", flush=True)
    print(f"Polite pace: {PAUSE}s between Wikimedia requests", flush=True)

    # PHASE 1: download/verify all images
    print("\n=== PHASE 1: download & verify images ===", flush=True)
    pool_cursor: dict[str, int] = {}
    image_map: dict[tuple, dict] = {}
    for t in targets:
        print(f"\n== images {t['game']} L{t['level']} · {t['meta'].get('kidTitle')}", flush=True)
        try:
            image_map[(t["game"], t["level"])] = process_images(t, pool_cursor)
        except Exception as e:
            print(f"ERROR images {t['game']} L{t['level']}: {e}", flush=True)
            image_map[(t["game"], t["level"])] = {}

    # PHASE 2: generate all books from verified local assets
    print("\n=== PHASE 2: generate all theory-aligned books ===", flush=True)
    results = []
    for t in targets:
        imgs = image_map.get((t["game"], t["level"]), {})
        print(f"book {t['game']} L{t['level']} ({len(imgs)} slots)", flush=True)
        try:
            if t["game"] == "chemistry-lab" and t["level"] == 1:
                print("  keep handcrafted Tiny Bits", flush=True)
            else:
                js = build_book(t, imgs)
                t["out_book"].write_text(js, encoding="utf-8", newline="\n")
            results.append({"game": t["game"], "level": t["level"], "images": len(imgs)})
        except Exception as e:
            print(f"ERROR book {t['game']} L{t['level']}: {e}", flush=True)
            results.append({"game": t["game"], "level": t["level"], "error": str(e)})

    summary = ROOT / "tools" / "book_build_summary.json"
    summary.write_text(json.dumps(results, indent=2), encoding="utf-8")
    ok = sum(1 for r in results if not r.get("error"))
    filled = sum(r.get("images", 0) for r in results if not r.get("error"))
    print(f"\nDONE {ok}/{len(results)} books, {filled} image slots → {summary}", flush=True)
    return 0 if ok == len(results) else 1


if __name__ == "__main__":
    raise SystemExit(main())
