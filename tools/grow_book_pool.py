#!/usr/bin/env python3
"""Grow book-shared pool via Openverse search + verified downloads (Wikimedia preferred)."""
from __future__ import annotations

import json
import ssl
import time
import urllib.parse
import urllib.request
from pathlib import Path

ssl._create_default_https_context = ssl._create_unverified_context

ROOT = Path(__file__).resolve().parents[1]
SHARED = ROOT / "assets" / "book-shared"
UA = {
    "User-Agent": (
        "GyanQuestBookBot/3.2 (https://github.com/Tahsan0619/GyanQuest; "
        "educational offline curriculum mirror)"
    )
}
OPENVERSE = "https://api.openverse.org/v1/images/"
MIN_BYTES = 12_000
PER_QUERY = 4
PAUSE_SEARCH = 1.2
PAUSE_DL = 2.0

# theme -> search queries (educational, concrete)
QUERIES: dict[str, list[str]] = {
    "physics": [
        "newton cradle",
        "skateboard motion",
        "tug of war rope",
        "bowling ball",
        "friction rubber",
        "pushing cart",
        "ice skating",
        "dominoes falling",
        "billiard balls collide",
        "wagon wheels",
    ],
    "chemistry": [
        "bunsen burner flame",
        "test tubes laboratory",
        "salt crystals",
        "rust metal",
        "copper wire",
        "boiling water steam",
        "ice melting",
        "periodic table",
        "sugar crystals",
        "erlenmeyer flask",
    ],
    "biology": [
        "onion cells microscope",
        "green leaf closeup",
        "sunflower plant",
        "seedling sprout",
        "butterfly insect",
        "fish underwater",
        "tree bark texture",
        "amoeba microscope",
        "bean sprout",
        "moss forest",
    ],
    "math": [
        "abacus counting",
        "dice game",
        "ruler measurement",
        "protractor angle",
        "pizza slices fraction",
        "graph paper math",
        "tangram puzzle",
        "playing cards numbers",
        "base ten blocks",
        "number line classroom",
    ],
    "space": [
        "planet jupiter",
        "saturn rings",
        "full moon night",
        "milky way stars",
        "earth from space",
        "rocket launch",
        "mars surface",
        "orion nebula",
        "international space station",
        "solar system diagram",
    ],
    "anatomy": [
        "human heart anatomy",
        "human brain",
        "skeleton bones",
        "lungs anatomy",
        "eye closeup",
        "muscle anatomy",
        "neuron cell",
        "blood cells microscope",
    ],
    "eco": [
        "recycling bins plastic",
        "solar panels rooftop",
        "wind turbines field",
        "compost soil",
        "rainforest trees",
        "coral reef underwater",
        "bicycle city",
        "plastic pollution beach",
        "electric car charging",
        "landfill waste",
    ],
    "electrical": [
        "led light circuit",
        "battery AA",
        "breadboard electronics",
        "multimeter tool",
        "electric motor",
        "solar cell panel",
        "resistor components",
        "power outlet plug",
        "copper wire coil",
        "light bulb glowing",
    ],
    "computing": [
        "computer motherboard",
        "cpu processor chip",
        "ram memory module",
        "ssd solid state",
        "ethernet cable router",
        "server room data center",
        "laptop programming code",
        "computer keyboard closeup",
        "usb flash drive",
        "network switch",
    ],
    "ai_data": [
        "robot industrial arm",
        "barcode scanner",
        "spreadsheet charts",
        "bar chart graph",
        "pie chart data",
        "self driving car sensor",
        "qr code phone",
        "database server rack",
        "machine learning whiteboard",
    ],
    "civil_mech": [
        "steel bridge structure",
        "construction crane",
        "gears mechanical",
        "pulley system",
        "lever fulcrum",
        "concrete building",
        "wheel and axle",
        "screw thread closeup",
    ],
    "general": [
        "science classroom laboratory",
        "students notebook pencil",
        "magnifying glass investigation",
        "thermometer temperature",
        "balance scale science",
        "stopwatch timing",
        "globe earth classroom",
        "blackboard chalk",
    ],
}


def http_json(url: str) -> dict:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=45) as r:
        return json.loads(r.read().decode("utf-8", "replace"))


def http_bytes(url: str) -> bytes:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=90) as r:
        return r.read()


def is_valid(blob: bytes) -> bool:
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
    return ".webp"


def search(q: str) -> list[dict]:
    params = urllib.parse.urlencode(
        {
            "q": q,
            "page_size": 12,
            "license_type": "commercial,modification",
            "category": "photograph",
        }
    )
    try:
        data = http_json(f"{OPENVERSE}?{params}")
    except Exception as e:
        print(f"  search fail {q}: {e}", flush=True)
        return []
    hits = []
    for item in data.get("results") or []:
        url = (item.get("url") or "").split("?")[0]
        if not url:
            continue
        hits.append(
            {
                "url": url,
                "id": item.get("id") or url,
                "title": item.get("title") or q,
                "license": item.get("license"),
                "creator": item.get("creator"),
                "foreign": item.get("foreign_landing_url"),
            }
        )
    # prefer wikimedia / nasa / stable hosts
    def rank(h):
        u = h["url"].lower()
        if "wikimedia.org" in u or "wikipedia.org" in u:
            return 0
        if "nasa.gov" in u:
            return 1
        if "staticflickr.com" in u:
            return 2
        return 5

    hits.sort(key=rank)
    return hits


def main():
    SHARED.mkdir(parents=True, exist_ok=True)
    credits_all = []
    used_urls = set()
    ok = fail = 0

    for theme, queries in QUERIES.items():
        theme_dir = SHARED / theme
        theme_dir.mkdir(parents=True, exist_ok=True)
        print(f"\n## {theme}", flush=True)
        got = 0
        for q in queries:
            if got >= 10:  # cap per theme
                break
            hits = search(q)
            time.sleep(PAUSE_SEARCH)
            saved = 0
            for hit in hits:
                if hit["url"] in used_urls:
                    continue
                try:
                    blob = http_bytes(hit["url"])
                except Exception as e:
                    print(f"  dl err: {e}", flush=True)
                    time.sleep(PAUSE_DL)
                    continue
                time.sleep(PAUSE_DL)
                if not is_valid(blob):
                    continue
                ext = ext_for(blob)
                safe_q = re_slug(q)
                dest = theme_dir / f"{safe_q}-{got+1}{ext}"
                # avoid overwrite
                n = 1
                while dest.exists():
                    n += 1
                    dest = theme_dir / f"{safe_q}-{got+1}-{n}{ext}"
                dest.write_bytes(blob)
                # flat mirror with unique name
                flat = SHARED / f"{theme}-{dest.name}"
                flat.write_bytes(blob)
                used_urls.add(hit["url"])
                got += 1
                ok += 1
                saved += 1
                print(f"  OK {dest.name} ({len(blob)} B) [{q}]", flush=True)
                credits_all.append(
                    {
                        "file": str(dest.relative_to(SHARED)).replace("\\", "/"),
                        "theme": theme,
                        "query": q,
                        "source": hit.get("foreign") or hit["url"],
                        "license": hit.get("license"),
                        "bytes": len(blob),
                    }
                )
                if saved >= PER_QUERY or got >= 10:
                    break
            if saved == 0:
                fail += 1

    (SHARED / "CREDITS.json").write_text(json.dumps(credits_all, indent=2), encoding="utf-8")
    print(f"\nDONE ok={ok} empty_queries~={fail} files={len(list(SHARED.rglob('*.jp*')))+len(list(SHARED.rglob('*.png')))}", flush=True)


def re_slug(s: str) -> str:
    import re

    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:40]


if __name__ == "__main__":
    main()
