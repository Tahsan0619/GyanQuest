#!/usr/bin/env python3
"""Download topic-relevant Wikimedia Commons photos for GyanQuest digital books."""
from __future__ import annotations

import json
import os
import re
import ssl
import sys
import time
import urllib.parse
import urllib.request

UA = "GyanQuestBookBot/1.0 (educational; local curriculum assets)"
API = "https://commons.wikimedia.org/w/api.php"

# Local asset fetch only - avoid broken Windows CA stores blocking Commons.
_SSL = ssl._create_unverified_context()


def _open(req: urllib.request.Request, timeout: int = 45):
    return urllib.request.urlopen(req, timeout=timeout, context=_SSL)


def api(params: dict) -> dict:
    q = urllib.parse.urlencode({**params, "format": "json"})
    req = urllib.request.Request(f"{API}?{q}", headers={"User-Agent": UA})
    with _open(req, timeout=45) as r:
        return json.loads(r.read().decode("utf-8"))


def search_file(query: str, want: int = 6) -> list[dict]:
    data = api(
        {
            "action": "query",
            "generator": "search",
            "gsrsearch": query,
            "gsrnamespace": "6",
            "gsrlimit": str(want),
            "prop": "imageinfo",
            "iiprop": "url|mime|size|extmetadata",
            "iiurlwidth": "1400",
        }
    )
    pages = (data.get("query") or {}).get("pages") or {}
    out = []
    for p in pages.values():
        info = (p.get("imageinfo") or [None])[0]
        if not info:
            continue
        mime = info.get("mime") or ""
        if not mime.startswith("image/"):
            continue
        if mime in ("image/svg+xml", "image/gif"):
            continue
        url = info.get("thumburl") or info.get("url")
        if not url:
            continue
        title = p.get("title") or ""
        meta = info.get("extmetadata") or {}
        artist = (meta.get("Artist") or {}).get("value") or ""
        license_ = (meta.get("LicenseShortName") or {}).get("value") or ""
        # Strip HTML from artist
        artist = re.sub(r"<[^>]+>", "", artist).strip()[:120]
        out.append(
            {
                "title": title,
                "url": url,
                "mime": mime,
                "artist": artist,
                "license": license_,
                "page": f"https://commons.wikimedia.org/wiki/{urllib.parse.quote(title.replace(' ', '_'))}",
            }
        )
    return out


def download(url: str, dest: str) -> None:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with _open(req, timeout=60) as r, open(dest, "wb") as f:
        f.write(r.read())


def pick_and_save(query: str, dest: str, used_urls: set[str]) -> dict | None:
    for cand in search_file(query, want=8):
        if cand["url"] in used_urls:
            continue
        # Prefer photos that look photographic (jpg/png/webp)
        ext = ".jpg"
        mime = cand["mime"]
        if "png" in mime:
            ext = ".png"
        elif "webp" in mime:
            ext = ".webp"
        path = dest if dest.lower().endswith((".jpg", ".jpeg", ".png", ".webp")) else dest + ext
        os.makedirs(os.path.dirname(path), exist_ok=True)
        try:
            download(cand["url"], path)
        except Exception as e:
            print(f"  fail {query}: {e}")
            continue
        if os.path.getsize(path) < 8000:
            os.remove(path)
            continue
        used_urls.add(cand["url"])
        return {
            "file": os.path.basename(path),
            "src": path.replace("\\", "/").split("/games/", 1)[-1],
            "query": query,
            "commons_title": cand["title"],
            "commons_page": cand["page"],
            "artist": cand["artist"],
            "license": cand["license"],
            "from_shared": False,
        }
    return None


# Finished-set book image plans: game -> mission -> list of (filename_stem, search query)
PLANS = {
    "bio-explorer": {
        1: [
            ("m1-cover", "seedling plant growing soil photo"),
            ("m1-hook", "sleeping cat animal photo"),
            ("m1-living", "green leaf close up photosynthesis"),
            ("m1-nonliving", "granite rock stone close up"),
            ("m1-energy", "sunflower facing sun field"),
        ],
        2: [
            ("m2-cover", "animal cell microscope biology"),
            ("m2-hook", "onion epidermis cells microscope"),
            ("m2-organelle", "mitochondria electron micrograph"),
            ("m2-membrane", "cell membrane lipid bilayer diagram educational"),
            ("m2-nucleus", "cell nucleus microscopy"),
        ],
        3: [
            ("m3-cover", "food chain ecosystem wildlife"),
            ("m3-hook", "forest ecosystem trees sunlight"),
            ("m3-producer", "grass photosynthesis green plant"),
            ("m3-consumer", "deer grazing meadow"),
            ("m3-decomposer", "mushroom fungi forest floor"),
        ],
    },
    "force-fighter": {
        1: [
            ("m1-cover", "skateboard motion street photo"),
            ("m1-hook", "soccer football kick grass"),
            ("m1-cradle", "Newton cradle physics demonstration"),
            ("m1-friction", "bicycle brake pad wheel"),
            ("m1-push", "child pushing shopping cart"),
        ],
        2: [
            ("m2-cover", "spring scale force measurement"),
            ("m2-hook", "tug of war rope pull"),
            ("m2-balance", "balanced seesaw playground"),
            ("m2-vector", "arrow force diagram physics chalkboard"),
            ("m2-net", "two people pushing box opposite"),
        ],
        3: [
            ("m3-cover", "rocket launch thrust flame"),
            ("m3-hook", "swimmer pushing wall pool"),
            ("m3-recoil", "cannon recoil historical demonstration"),
            ("m3-action", "ice skater push apart pair"),
            ("m3-balloon", "balloon rocket experiment string"),
        ],
    },
    "math-quest": {
        1: [
            ("m1-cover", "abacus counting beads"),
            ("m1-tens", "base ten blocks classroom"),
            ("m1-place", "place value chart classroom math"),
            ("m1-bundle", "bundle of ten sticks math"),
            ("m1-number", "number line classroom wall"),
        ],
    },
    "eco-guardian": {
        1: [
            ("m1-cover", "ocean plastic pollution beach cleanup"),
            ("m1-forest", "rainforest canopy biodiversity"),
            ("m1-recycle", "recycling bins sorted waste"),
            ("m1-energy", "solar panels rooftop renewable"),
            ("m1-water", "clean river freshwater nature"),
        ],
    },
    "ict-fundamentals": {
        1: [
            ("m1-cover", "computer motherboard circuit board close"),
            ("m1-input", "computer keyboard mouse desk"),
            ("m1-process", "CPU processor chip macro"),
            ("m1-output", "computer monitor screen display"),
            ("m1-storage", "SSD hard drive storage photo"),
        ],
        2: [
            ("m2-cover", "wifi router wireless network home"),
            ("m2-signal", "radio antenna communication tower"),
            ("m2-packet", "ethernet cable network switch"),
            ("m2-devices", "smartphone tablet laptop together"),
            ("m2-path", "fiber optic cable glowing"),
        ],
    },
    "web-dev-studio": {
        1: [
            ("m1-cover", "HTML code editor screen"),
            ("m1-structure", "website wireframe sketch paper"),
            ("m1-tags", "HTML tags source code screenshot"),
            ("m1-browser", "web browser window desktop"),
            ("m1-page", "simple webpage layout design"),
        ],
        2: [
            ("m2-cover", "CSS stylesheet code colorful"),
            ("m2-layout", "responsive web design devices"),
            ("m2-color", "color palette design swatches"),
            ("m2-box", "CSS box model diagram"),
            ("m2-style", "frontend developer desk monitor"),
        ],
        3: [
            ("m3-cover", "JavaScript code laptop screen"),
            ("m3-event", "computer mouse click interaction"),
            ("m3-dom", "DOM tree diagram web"),
            ("m3-script", "programming console terminal"),
            ("m3-interactive", "interactive website UI buttons"),
        ],
    },
    "backend-builder": {
        1: [
            ("m1-cover", "server rack data center"),
            ("m1-api", "API request response diagram"),
            ("m1-route", "HTTP request browser server"),
            ("m1-json", "JSON data code screenshot"),
            ("m1-server", "nodejs server terminal code"),
        ],
    },
    "database-sql": {
        1: [
            ("m1-cover", "database table spreadsheet rows"),
            ("m1-table", "SQL database schema diagram"),
            ("m1-row", "spreadsheet rows columns data"),
            ("m1-query", "SQL SELECT query code"),
            ("m1-key", "primary key database concept diagram"),
        ],
    },
    "ai-lab": {
        1: [
            ("m1-cover", "artificial intelligence neural network visualization"),
            ("m1-train", "machine learning training dataset"),
            ("m1-pattern", "pattern recognition shapes"),
            ("m1-robot", "friendly educational robot classroom"),
            ("m1-decide", "decision tree flowchart diagram"),
        ],
    },
    "ml-lab": {
        1: [
            ("m1-cover", "scatter plot machine learning"),
            ("m1-data", "data points chart graph"),
            ("m1-model", "regression line scatter plot"),
            ("m1-feature", "feature engineering data columns"),
            ("m1-predict", "prediction forecast chart arrow"),
        ],
    },
    "electrical-basics": {
        1: [
            ("m1-cover", "electric circuit breadboard LED"),
            ("m1-current", "electric current wire copper"),
            ("m1-voltage", "battery voltage AA cells"),
            ("m1-resistance", "resistor electronic component"),
            ("m1-switch", "light switch wall electricity"),
        ],
    },
    "mechanical-basics": {
        1: [
            ("m1-cover", "gear mechanism machine close"),
            ("m1-lever", "lever fulcrum playground seesaw"),
            ("m1-pulley", "pulley system lifting weight"),
            ("m1-wheel", "wheel and axle wagon"),
            ("m1-inclined", "inclined plane ramp moving box"),
        ],
    },
    "civil-basics": {
        1: [
            ("m1-cover", "bridge structure steel architecture"),
            ("m1-beam", "concrete beam construction site"),
            ("m1-foundation", "building foundation construction"),
            ("m1-load", "bridge load traffic cars"),
            ("m1-material", "reinforced concrete rebar"),
        ],
    },
    "astronomy-space": {
        1: [
            ("m1-cover", "Milky Way night sky stars"),
            ("m1-planet", "Saturn planet rings NASA"),
            ("m1-orbit", "Earth Moon orbit illustration"),
            ("m1-sun", "Sun solar surface NASA"),
            ("m1-telescope", "telescope observatory night"),
        ],
    },
    "statistics-probability": {
        1: [
            ("m1-cover", "dice probability chance"),
            ("m1-chart", "bar chart statistics classroom"),
            ("m1-mean", "average calculation chalkboard math"),
            ("m1-sample", "survey clipboard data collection"),
            ("m1-spread", "histogram distribution graph"),
        ],
    },
    "chemistry-lab": {
        1: [
            ("m1-cover", "salt crystals close up"),
            ("m1-particles", "sand grains macro photo"),
            ("m1-states", "ice water steam states matter"),
            ("m1-lattice", "crystal lattice model chemistry"),
            ("m1-boil", "boiling water kettle steam"),
        ],
        2: [
            ("m2-cover", "periodic table classroom wall"),
            ("m2-atom", "atom model science classroom"),
            ("m2-element", "copper metal element sample"),
            ("m2-compound", "water molecule model kit"),
            ("m2-symbol", "chemical symbols chalk board"),
        ],
        3: [
            ("m3-cover", "chemical reaction fizz beaker"),
            ("m3-reactant", "lab beakers reagents chemistry"),
            ("m3-product", "precipitation reaction test tube"),
            ("m3-balance", "balance scale laboratory"),
            ("m3-mix", "mixing solution stirring rod"),
        ],
    },
}


def main() -> int:
    root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    games = sys.argv[1:] or list(PLANS.keys())
    used: set[str] = set()
    for game in games:
        plan = PLANS.get(game)
        if not plan:
            print(f"skip unknown {game}")
            continue
        for mission, items in plan.items():
            out_dir = os.path.join(root, "games", game, "assets", "book")
            os.makedirs(out_dir, exist_ok=True)
            credits = []
            print(f"== {game} m{mission} ==")
            for stem, query in items:
                dest = os.path.join(out_dir, f"{stem}.jpg")
                print(f"  {stem}: {query}")
                meta = pick_and_save(query, dest, used)
                if not meta:
                    print(f"  !! no image for {query}")
                    continue
                # normalize src path for web
                meta["src"] = f"/games/{game}/assets/book/{meta['file']}"
                credits.append(meta)
                print(f"  ok {meta['file']} ({meta.get('license')})")
                time.sleep(0.35)
            cred_path = os.path.join(out_dir, f"CREDITS-m{mission}.json")
            with open(cred_path, "w", encoding="utf-8") as f:
                json.dump(credits, f, indent=2)
                f.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
