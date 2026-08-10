#!/usr/bin/env python3
"""Slow, direct Wikimedia Commons file fetches (avoids search API spam / 429)."""
from __future__ import annotations

import json
import os
import ssl
import sys
import time
import urllib.parse
import urllib.request

UA = "GyanQuestBookBot/1.1 (educational curriculum; contact: local-dev)"
API = "https://commons.wikimedia.org/w/api.php"
SSL = ssl._create_unverified_context()
SLEEP = 2.5  # seconds between requests

# Explicit Commons filenames (no search). game -> mission -> [(local_stem, File:Name)]
FILES = {
    "bio-explorer": {
        1: [
            ("m1-cover", "File:Tomato seedling.jpg"),
            ("m1-hook", "File:Sleeping Cat.jpg"),
            ("m1-living", "File:Leaf 1 web.jpg"),
            ("m1-nonliving", "File:Granite Yerevan.jpg"),
            ("m1-energy", "File:Sunflowers.jpg"),
        ],
        2: [
            ("m2-cover", "File:Animal cell structure en.svg"),  # may skip svg
            ("m2-hook", "File:Onion cells.jpg"),
            ("m2-organelle", "File:Mitochondria, mammalian lung - TEM.jpg"),
            ("m2-membrane", "File:Cell membrane detailed diagram en.svg"),
            ("m2-nucleus", "File:HeLa cells stained with Hoechst 33258.jpg"),
        ],
        3: [
            ("m3-cover", "File:Leaves sunlight.jpg"),
            ("m3-hook", "File:Forest-canopy.jpg"),
            ("m3-producer", "File:Green grass close-up.jpg"),
            ("m3-consumer", "File:Deer grazing.jpg"),
            ("m3-decomposer", "File:Mushrooms on forest floor.jpg"),
        ],
    },
}


def api(params: dict) -> dict:
    q = urllib.parse.urlencode({**params, "format": "json"})
    req = urllib.request.Request(f"{API}?{q}", headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60, context=SSL) as r:
        return json.loads(r.read().decode("utf-8"))


def file_info(title: str) -> dict | None:
    data = api(
        {
            "action": "query",
            "titles": title,
            "prop": "imageinfo",
            "iiprop": "url|mime|size|extmetadata",
            "iiurlwidth": "1280",
        }
    )
    pages = (data.get("query") or {}).get("pages") or {}
    for p in pages.values():
        if p.get("missing") is not None:
            return None
        info = (p.get("imageinfo") or [None])[0]
        if not info:
            return None
        meta = info.get("extmetadata") or {}
        artist = (meta.get("Artist") or {}).get("value") or ""
        # strip tags
        import re

        artist = re.sub(r"<[^>]+>", "", artist).strip()[:120]
        return {
            "title": p.get("title") or title,
            "url": info.get("thumburl") or info.get("url"),
            "orig": info.get("url"),
            "mime": info.get("mime") or "",
            "artist": artist,
            "license": (meta.get("LicenseShortName") or {}).get("value") or "",
        }
    return None


def download(url: str, dest: str) -> None:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=90, context=SSL) as r, open(dest, "wb") as f:
        f.write(r.read())


def ext_for(mime: str, title: str) -> str:
    if "png" in mime:
        return ".png"
    if "webp" in mime:
        return ".webp"
    if "svg" in mime or title.lower().endswith(".svg"):
        return ".svg"
    return ".jpg"


# Fallbacks if primary title missing
FALLBACKS = {
    "File:Tomato seedling.jpg": ["File:Seedlings.jpg", "File:Bean sprout.jpg"],
    "File:Sleeping Cat.jpg": ["File:Cat sleeping.jpg", "File:Sleeping cat 2.jpg"],
    "File:Leaf 1 web.jpg": ["File:Green leaf.jpg", "File:Leaf.jpg"],
    "File:Granite Yerevan.jpg": ["File:Granite.jpg", "File:Pink granite.jpg"],
    "File:Sunflowers.jpg": ["File:Sunflower.jpg", "File:Helianthus annuus sunflower.jpg"],
    "File:Animal cell structure en.svg": [
        "File:Average prokaryote cell- en.svg",
        "File:Plant cell structure svg labels.svg",
        "File:Eukaryotic cell diagram.svg",
    ],
    "File:Onion cells.jpg": [
        "File:Onion epidermis cells.jpg",
        "File:Microscope image of onion cells.jpg",
        "File:Allium epidermal cells.jpg",
    ],
    "File:Mitochondria, mammalian lung - TEM.jpg": [
        "File:Mitochondrion.jpg",
        "File:Mitochondria TEM.jpg",
    ],
    "File:Cell membrane detailed diagram en.svg": [
        "File:Cell membrane detailed diagram 4.svg",
        "File:Fluid mosaic model of cell membrane.svg",
    ],
    "File:HeLa cells stained with Hoechst 33258.jpg": [
        "File:Nucleus HE.jpg",
        "File:Cell nucleus.jpg",
    ],
    "File:Leaves sunlight.jpg": ["File:Green leaves.jpg", "File:Leaf canopy.jpg"],
    "File:Forest-canopy.jpg": ["File:Forest canopy.jpg", "File:Rainforest canopy.jpg"],
    "File:Green grass close-up.jpg": ["File:Grass close up.jpg", "File:Lawn grass.jpg"],
    "File:Deer grazing.jpg": ["File:Deer.jpg", "File:White-tailed deer.jpg"],
    "File:Mushrooms on forest floor.jpg": [
        "File:Mushrooms.jpg",
        "File:Fungus on forest floor.jpg",
        "File:Amanita muscaria 3 - cornstarch.jpg",
    ],
}


def resolve(title: str) -> dict | None:
    for t in [title] + FALLBACKS.get(title, []):
        time.sleep(SLEEP)
        try:
            info = file_info(t)
        except Exception as e:
            print(f"  api err {t}: {e}")
            time.sleep(SLEEP * 2)
            continue
        if info and info.get("url"):
            # Prefer raster; skip svg if we can find raster later - for now allow png/jpg only
            if "svg" in (info.get("mime") or "") or t.lower().endswith(".svg"):
                print(f"  skip svg {t}")
                continue
            info["resolved"] = t
            return info
        print(f"  missing {t}")
    return None


def main() -> int:
    root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    games = sys.argv[1:] or ["bio-explorer"]
    for game in games:
        plan = FILES.get(game)
        if not plan:
            print("no plan", game)
            continue
        out_dir = os.path.join(root, "games", game, "assets", "book")
        os.makedirs(out_dir, exist_ok=True)
        for mission, items in plan.items():
            credits = []
            print(f"== {game} m{mission} ==")
            for stem, title in items:
                print(f"  {stem}: {title}")
                info = resolve(title)
                if not info:
                    print("  !! failed", stem)
                    continue
                ext = ext_for(info["mime"], info.get("resolved") or title)
                # force jpg/png names expected by books
                if stem.startswith("m") and ext == ".svg":
                    print("  !! svg only, skip", stem)
                    continue
                dest = os.path.join(out_dir, f"{stem}{ext if ext != '.jpg' else '.jpg'}")
                # normalize to .jpg filename even for jpeg
                dest = os.path.join(out_dir, f"{stem}.jpg")
                try:
                    time.sleep(SLEEP)
                    download(info["url"], dest)
                except Exception as e:
                    print(f"  dl err: {e}")
                    # try original
                    try:
                        time.sleep(SLEEP)
                        download(info["orig"], dest)
                    except Exception as e2:
                        print(f"  dl err2: {e2}")
                        continue
                if os.path.getsize(dest) < 5000:
                    os.remove(dest)
                    print("  too small")
                    continue
                credits.append(
                    {
                        "file": f"{stem}.jpg",
                        "src": f"/games/{game}/assets/book/{stem}.jpg",
                        "commons_title": info.get("resolved") or title,
                        "artist": info.get("artist"),
                        "license": info.get("license"),
                        "from_shared": False,
                    }
                )
                print(f"  ok {stem}.jpg ({info.get('license')})")
            with open(os.path.join(out_dir, f"CREDITS-m{mission}.json"), "w", encoding="utf-8") as f:
                json.dump(credits, f, indent=2)
                f.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
