#!/usr/bin/env python3
"""Download unique Wikimedia Commons photos for Chemistry Lab books 1–3."""
from __future__ import annotations

import json
import os
import re
import ssl
import time
import urllib.parse
import urllib.request

ssl._create_default_https_context = ssl._create_unverified_context

UA = {
    "User-Agent": (
        "GyanQuestBookBot/1.2 (https://github.com/Tahsan0619/GyanQuest; "
        "educational offline curriculum assets)"
    )
}
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUT = os.path.join(ROOT, "games", "chemistry-lab", "assets", "book")
API = "https://commons.wikimedia.org/w/api.php"
MIN_BYTES = 12_000

# local filename -> ordered Commons titles (File: omitted). First success wins.
JOBS: list[tuple[str, list[str]]] = [
    # Mission 1 — Tiny Bits (particles / states / energy)
    (
        "m1-cover.jpg",
        ["Home-grown_salt_(ClNa)_crystals._01.jpg", "Halite-233334.jpg"],
    ),
    (
        "m1-microscope.jpg",
        ["Salt_crystals_under_the_microscope.jpg", "Sodium_chloride_crystal.jpg"],
    ),
    (
        "m1-states.jpg",
        ["Ice_water_vapor.jpg", "States_of_matter.jpg"],
    ),
    (
        "m1-melt.jpg",
        ["Melting_ice.jpg", "Ice_cube_melting.jpg", "Melting_ice_cubes.jpg"],
    ),
    (
        "m1-boil.jpg",
        ["Boiling_water.jpg", "Boiling_water_in_a_pot.jpg"],
    ),
    (
        "m1-lattice.jpg",
        [
            "Close_Up_View_Of_Sodium_Chloride_Crystals.jpg",
            "Halite-4jg47.jpg",
        ],
    ),
    (
        "m1-condense.jpg",
        [
            "Condensation_on_a_cold_glass.jpg",
            "Water_condensation.jpg",
            "Condensation.jpg",
            "Dew_drops.jpg",
        ],
    ),
    (
        "m1-steam.jpg",
        [
            "Steam_from_a_kettle.jpg",
            "Kettle_steam.jpg",
            "Steam_coming_from_kettle.jpg",
            "Boiling_kettle.jpg",
        ],
    ),
    # Mission 2 — Element Hunt (must NOT be salt-as-element)
    (
        "m2-cover.jpg",
        [
            "Periodic_table.jpg",
            "Periodic_table_large.png",
            "32-column_periodic_table.png",
        ],
    ),
    (
        "m2-iron.jpg",
        [
            "Iron_electrolytic_and_1cm3_cube.jpg",
            "Iron-3.jpg",
            "Iron_filings.jpg",
            "Rusty_nails.jpg",
        ],
    ),
    (
        "m2-copper.jpg",
        [
            "Copper_wire.jpg",
            "Copper-wire.jpg",
            "Stranded_copper_wire.jpg",
            "Native_copper.jpg",
        ],
    ),
    (
        "m2-oxygen.jpg",
        [
            "Liquid_oxygen_in_a_beaker.jpg",
            "Liquid_oxygen.jpg",
            "Oxygen_tank.jpg",
            "Scuba_tanks.jpg",
        ],
    ),
    (
        "m2-water.jpg",
        [
            "Water_drop_001.jpg",
            "Water_drop.jpg",
            "Drop_of_water.jpg",
        ],
    ),
    (
        "m2-gold.jpg",
        [
            "Native_gold_nuggets.jpg",
            "Gold_nugget.jpg",
            "Native_gold.jpg",
        ],
    ),
    (
        "m2-graphite.jpg",
        [
            "Graphite-and-diamond-with-scale.jpg",
            "Graphite-233136.jpg",
            "Pencil_graphite.jpg",
            "Graphite.jpg",
        ],
    ),
    (
        "m2-air.jpg",
        [
            "Earth_atmosphere.jpg",
            "Blue_sky.jpg",
            "Clear_blue_sky.jpg",
        ],
    ),
    # Mission 3 — Bond Buddies (links, not states-of-matter repeats)
    (
        "m3-cover.jpg",
        [
            "Water_molecule_model.png",
            "H2O_molecule.jpg",
            "Ball-and-stick_model_of_water.jpg",
            "Molecular_model_of_water.jpg",
        ],
    ),
    (
        "m3-magnet.jpg",
        [
            "Neodymium_magnet_on_a_bracket.jpg",
            "Neodymium_magnets.jpg",
            "Horseshoe_magnet.jpg",
            "Bar_magnets.jpg",
        ],
    ),
    (
        "m3-droplets.jpg",
        [
            "Water_droplets.jpg",
            "Water_drops_on_glass.jpg",
            "Rain_droplets_on_a_leaf.jpg",
        ],
    ),
    (
        "m3-modelkit.jpg",
        [
            "Molecular_model_kit.jpg",
            "Ball_and_stick_model.jpg",
            "Molecule_model.jpg",
            "Organic_chemistry_model.jpg",
        ],
    ),
    (
        "m3-nacl.jpg",
        [
            "Sodium_chloride_crystal_model.jpg",
            "NaCl_crystal_structure.png",
            "Halite_crystal.jpg",
            "Halite-233334.jpg",
        ],
    ),
    (
        "m3-sugar.jpg",
        [
            "Sugar_crystals.jpg",
            "Sucrose_crystals.jpg",
            "Granulated_sugar.jpg",
            "Sugar.jpg",
        ],
    ),
    (
        "m3-glue.jpg",
        [
            "Glue_stick.jpg",
            "White_glue.jpg",
            "Adhesive.jpg",
        ],
    ),
]


def api_info(title: str) -> dict | None:
    q = urllib.parse.quote(title)
    url = (
        f"{API}?action=query&titles=File:{q}&prop=imageinfo"
        "&iiprop=url|mime|size|extmetadata&iiurlwidth=1400&format=json"
    )
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r:
        data = json.load(r)
    for p in data["query"]["pages"].values():
        if "imageinfo" in p:
            return p["imageinfo"][0]
    return None


def search_file(query: str) -> list[dict]:
    params = urllib.parse.urlencode(
        {
            "action": "query",
            "generator": "search",
            "gsrsearch": query,
            "gsrnamespace": "6",
            "gsrlimit": "8",
            "prop": "imageinfo",
            "iiprop": "url|mime|size|extmetadata",
            "iiurlwidth": "1400",
            "format": "json",
        }
    )
    req = urllib.request.Request(f"{API}?{params}", headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r:
        data = json.load(r)
    pages = (data.get("query") or {}).get("pages") or {}
    out = []
    for p in pages.values():
        info = (p.get("imageinfo") or [None])[0]
        if not info:
            continue
        mime = info.get("mime") or ""
        if not mime.startswith("image/") or mime in ("image/svg+xml", "image/gif"):
            continue
        url = info.get("thumburl") or info.get("url")
        if url:
            out.append({"title": p.get("title") or "", "info": info, "url": url})
    return out


def save_from_info(local: str, title: str, info: dict, credits: list) -> bool:
    mime = info.get("mime") or ""
    if mime in ("image/svg+xml", "image/gif"):
        return False
    url = info.get("thumburl") or info.get("url")
    if not url:
        return False
    path = os.path.join(OUT, local)
    req = urllib.request.Request(url.split("?")[0] if "thumb" not in url else url, headers=UA)
    # Prefer thumburl (already sized) when present
    get_url = info.get("thumburl") or info.get("url")
    req = urllib.request.Request(get_url, headers=UA)
    with urllib.request.urlopen(req, timeout=120) as r:
        data = r.read()
    if len(data) < MIN_BYTES:
        print(f"  too small {title} ({len(data)})")
        return False
    with open(path, "wb") as f:
        f.write(data)
    meta = info.get("extmetadata") or {}
    lic = (meta.get("LicenseShortName") or {}).get("value", "?")
    artist = re.sub("<[^>]+>", "", (meta.get("Artist") or {}).get("value") or "?")[:120].strip()
    credits.append(
        {
            "file": local,
            "commons_title": f"File:{title}" if not title.startswith("File:") else title,
            "source": f"https://commons.wikimedia.org/wiki/File:{urllib.parse.quote(title)}",
            "license": lic,
            "artist": artist,
            "bytes": len(data),
        }
    )
    print(f"  saved {local} {len(data)} bytes {lic} <- {title}")
    return True


def download_local(local: str, titles: list[str], credits: list) -> bool:
    path = os.path.join(OUT, local)
    if os.path.exists(path) and os.path.getsize(path) >= MIN_BYTES:
        print(f"KEEP {local} ({os.path.getsize(path)} bytes)")
        return True
    print(f"GET {local}")
    for title in titles:
        try:
            info = api_info(title)
            if not info:
                print(f"  miss {title}")
                continue
            if save_from_info(local, title, info, credits):
                return True
        except Exception as e:
            print(f"  ERR {title}: {e}")
        time.sleep(0.8)
    # last resort: search using filename stem words
    q = local.replace(".jpg", "").replace("m1-", "").replace("m2-", "").replace("m3-", "").replace("-", " ")
    try:
        for cand in search_file(q + " photo"):
            t = (cand["title"] or "").replace("File:", "")
            if save_from_info(local, t, cand["info"], credits):
                return True
            time.sleep(0.5)
    except Exception as e:
        print(f"  search fail {local}: {e}")
    print(f"FAIL {local}")
    return False


def main() -> int:
    os.makedirs(OUT, exist_ok=True)
    credits: list[dict] = []
    ok = 0
    for local, titles in JOBS:
        if download_local(local, titles, credits):
            ok += 1
        time.sleep(0.6)
    by_file = {c["file"]: c for c in credits}
    # merge keepers that were already on disk
    for local, _ in JOBS:
        path = os.path.join(OUT, local)
        if local not in by_file and os.path.exists(path):
            by_file[local] = {
                "file": local,
                "note": "already on disk",
                "bytes": os.path.getsize(path),
            }
    final = [by_file[k] for k, _ in JOBS if k in by_file]
    with open(os.path.join(OUT, "CREDITS.json"), "w", encoding="utf-8") as f:
        json.dump(final, f, indent=2)
        f.write("\n")
    missing = [name for name, _ in JOBS if not os.path.exists(os.path.join(OUT, name)) or os.path.getsize(os.path.join(OUT, name)) < MIN_BYTES]
    print("DONE", ok, "/", len(JOBS), "missing", missing)
    return 1 if missing else 0


if __name__ == "__main__":
    raise SystemExit(main())
