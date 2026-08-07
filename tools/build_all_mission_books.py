#!/usr/bin/env python3
"""
Build ALL GyanQuest mission digital books in one pass.

Pipeline:
  1) Discover every games/*/books/levelN.js target from level META + missions-meta
  2) Search Openverse (CC-licensed) for verified educational photos
  3) Download into games/<game>/assets/book/ with magic-byte + size checks
  4) Generate theory-aligned 8-page books (see engine/js/book-theory.js)

Theories applied on every page spine:
  Cognitive Load, Dual Coding / Mayer Multimedia, Constructivism,
  Conceptual Change, Spiral scaffold, Retrieval practice.
"""
from __future__ import annotations

import json
import os
import re
import ssl
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ssl._create_default_https_context = ssl._create_unverified_context

ROOT = Path(__file__).resolve().parents[1]
GAMES = ROOT / "games"
UA = {"User-Agent": "GyanQuestBookBot/2.0 (educational curriculum; local assets)"}
MIN_BYTES = 8_000
MAX_WORKERS = 1  # sequential downloads — Wikimedia rate-limits parallel bursts
OPENVERSE = "https://api.openverse.org/v1/images/"
COMMONS_API = "https://commons.wikimedia.org/w/api.php"

# Per-slot search queries keyed later by theme keywords.
SLOT_KEYS = ("cover", "hook", "model", "mechanism", "representation", "transfer_a", "transfer_b", "transfer_c")


def http_json(url: str, timeout: int = 45) -> dict:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode("utf-8", errors="replace"))


def http_bytes(url: str, timeout: int = 90) -> bytes:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def is_valid_image(blob: bytes) -> bool:
    if not blob or len(blob) < MIN_BYTES:
        return False
    if blob[:3] == b"\xff\xd8\xff":  # jpeg
        return True
    if blob[:8] == b"\x89PNG\r\n\x1a\n":  # png
        return True
    if blob[:6] in (b"GIF87a", b"GIF89a"):
        return True
    if blob[:4] == b"RIFF" and blob[8:12] == b"WEBP":
        return True
    return False


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
    terms = []
    # optional objective / predict from pedagogy
    return {
        "kidTitle": s("kidTitle"),
        "theme": s("theme"),
        "intro": s("intro"),
        "rewardName": s("rewardName"),
        "objective": s("objective"),
        "predict": s("predict"),
        "bdHook": s("bdHook"),
        "everyday": everyday,
        "subTitles": subs,
        "terms": terms,
    }


def discover_targets() -> list[dict]:
    """Every existing books/levelN.js OR playable mission with a levelN.js."""
    out = []
    for game_dir in sorted(GAMES.iterdir()):
        if not game_dir.is_dir():
            continue
        books_dir = game_dir / "books"
        js_dir = game_dir / "js"
        if not js_dir.exists():
            continue
        # Prefer existing book files as the source of truth (52 REAL/TEMPLATE)
        levels = sorted(books_dir.glob("level*.js")) if books_dir.exists() else []
        if not levels:
            # fallback: level files that exist
            levels = sorted(js_dir.glob("level*.js"))
            use_as_books = False
        else:
            use_as_books = True
        for bp in levels:
            m = re.search(r"level(\d+)\.js$", bp.name)
            if not m:
                continue
            n = int(m.group(1))
            level_path = js_dir / f"level{n}.js"
            meta = extract_level_meta(level_path)
            if not meta.get("kidTitle"):
                # try parse title from existing book
                if use_as_books and bp.exists():
                    bt = bp.read_text(encoding="utf-8", errors="replace")
                    tm = re.search(r'title:\s*"([^"]+)"', bt)
                    if tm:
                        meta["kidTitle"] = tm.group(1)
                    sm = re.search(r'subtitle:\s*"([^"]+)"', bt)
                    if sm:
                        meta["theme"] = sm.group(1)
            out.append(
                {
                    "game": game_dir.name,
                    "level": n,
                    "index": n - 1,
                    "meta": meta,
                    "out_book": game_dir / "books" / f"level{n}.js",
                    "asset_dir": game_dir / "assets" / "book",
                }
            )
    return out


def queries_for(target: dict) -> dict[str, list[str]]:
    """Build Openverse search queries per image slot from curriculum text."""
    meta = target["meta"]
    title = meta.get("kidTitle") or f"Mission {target['level']}"
    theme = meta.get("theme") or title
    game = target["game"].replace("-", " ")
    everyday = meta.get("everyday") or []
    ex0 = everyday[0] if everyday else theme
    ex1 = everyday[1] if len(everyday) > 1 else title

    # Domain-flavored extras improve hit quality
    flavor = {
        "chemistry-lab": ["chemistry laboratory", "science experiment", "molecules"],
        "force-fighter": ["physics force", "pushing object", "friction"],
        "bio-explorer": ["biology cell", "plant leaf microscope", "living organism"],
        "math-quest": ["math classroom", "counting blocks", "fraction pizza"],
        "astronomy-space": ["solar system", "night sky stars", "planet earth"],
        "human-anatomy": ["human heart anatomy", "body organs", "medical illustration"],
        "eco-guardian": ["recycling bins", "compost soil", "plastic waste"],
        "electrical-basics": ["electric circuit", "battery wire", "light bulb"],
        "web-dev-studio": ["laptop coding", "website design", "keyboard computer"],
        "database-sql": ["data table spreadsheet", "server rack", "database"],
        "ai-lab": ["robot artificial intelligence", "neural network diagram", "computer chip"],
        "ict-fundamentals": ["computer hardware CPU", "RAM memory chips", "SSD drive"],
    }.get(target["game"], ["education science classroom"])

    base = f"{title} {theme} {game}"
    return {
        "cover": [f"{title} {flavor[0]}", f"{theme} photograph", f"{ex0} close up"],
        "hook": [f"{ex0} {flavor[0]}", f"{theme} real life", f"{title} example"],
        "model": [f"{theme} diagram", f"{flavor[1] if len(flavor)>1 else theme}", f"{title} concept"],
        "mechanism": [f"{theme} process", f"{ex1} change", f"{flavor[-1]} action"],
        "representation": [f"{theme} detail closeup", f"{title} structure", f"{flavor[0]} macro"],
        "transfer_a": [f"{ex0} everyday", f"{theme} home", f"classroom {theme}"],
        "transfer_b": [f"{ex1} real world", f"{title} practice", f"{flavor[0]} outdoor"],
        "transfer_c": [f"{theme} student learning", f"{title} activity", f"science {theme}"],
    }


def search_commons(query: str, limit: int = 8) -> list[dict]:
    """Search Wikimedia Commons; prefer JPEG/PNG photograph thumbnails."""
    params = urllib.parse.urlencode(
        {
            "action": "query",
            "format": "json",
            "generator": "search",
            "gsrsearch": query,
            "gsrnamespace": 6,  # File:
            "gsrlimit": limit,
            "prop": "imageinfo",
            "iiprop": "url|mime|size|extmetadata",
            "iiurlwidth": 1280,
        }
    )
    try:
        data = http_json(f"{COMMONS_API}?{params}")
    except Exception as e:
        print(f"  commons search fail [{query[:40]}]: {e}")
        return []
    pages = (data.get("query") or {}).get("pages") or {}
    out = []
    for p in pages.values():
        info = (p.get("imageinfo") or [None])[0]
        if not info:
            continue
        mime = (info.get("mime") or "").lower()
        if not mime.startswith("image/"):
            continue
        if "svg" in mime or "djvu" in mime or "tiff" in mime:
            continue
        url = info.get("thumburl") or info.get("url")
        if not url:
            continue
        url = url.split("?")[0]
        meta = info.get("extmetadata") or {}
        out.append(
            {
                "url": url,
                "title": p.get("title") or query,
                "foreign": f"https://commons.wikimedia.org/wiki/{urllib.parse.quote(p.get('title') or '')}",
                "license": (meta.get("LicenseShortName") or {}).get("value", "commons"),
                "creator": re.sub("<[^>]+>", "", (meta.get("Artist") or {}).get("value", ""))[:80],
                "id": str(p.get("pageid") or url),
                "provider": "commons",
            }
        )
    return out


def search_openverse(query: str, page_size: int = 8) -> list[dict]:
    params = urllib.parse.urlencode(
        {
            "q": query,
            "page_size": page_size,
            "license_type": "commercial,modification",
            "category": "photograph",
            "source": "wikimedia,flickr,met,nasa,rawpixel",
        }
    )
    url = f"{OPENVERSE}?{params}"
    try:
        data = http_json(url)
    except Exception as e:
        print(f"  openverse search fail [{query[:40]}]: {e}")
        return []
    results = []
    for item in data.get("results") or []:
        url_img = item.get("url") or ""
        if not url_img:
            continue
        # Prefer stable hosts; skip known flaky CDNs later in download
        results.append(
            {
                "url": url_img.split("?")[0],
                "title": item.get("title") or query,
                "foreign": item.get("foreign_landing_url") or "",
                "license": item.get("license") or "",
                "creator": item.get("creator") or "",
                "id": item.get("id") or "",
                "provider": "openverse",
            }
        )
    # Prefer Wikimedia URLs from Openverse first
    results.sort(key=lambda h: (0 if "wikimedia.org" in h["url"] else 1))
    return results


def search_images(query: str) -> list[dict]:
    hits = search_commons(query)
    time.sleep(0.45)
    if len(hits) >= 2:
        return hits
    extra = search_openverse(query)
    time.sleep(0.35)
    seen = {h["url"] for h in hits}
    for h in extra:
        if h["url"] not in seen:
            hits.append(h)
            seen.add(h["url"])
    return hits


def download_slot(asset_dir: Path, stem: str, queries: list[str], used_urls: set[str]) -> dict | None:
    """Try queries until a valid unique image is saved. Returns credit dict."""
    asset_dir.mkdir(parents=True, exist_ok=True)
    for ext in (".jpg", ".png", ".webp", ".gif"):
        existing = asset_dir / f"{stem}{ext}"
        if existing.exists() and existing.stat().st_size >= MIN_BYTES:
            blob = existing.read_bytes()
            if is_valid_image(blob):
                return {
                    "file": existing.name,
                    "path": str(existing),
                    "src": f"/games/{asset_dir.parts[-3]}/assets/book/{existing.name}",
                    "cached": True,
                }

    for q in queries:
        hits = search_images(q)
        for hit in hits[:6]:
            url = hit["url"]
            if url in used_urls:
                continue
            try:
                blob = http_bytes(url)
            except Exception as e:
                print(f"    dl err {type(e).__name__}")
                continue
            if not is_valid_image(blob):
                print(f"    reject broken/small")
                continue
            ext = ext_for(blob)
            path = asset_dir / f"{stem}{ext}"
            path.write_bytes(blob)
            used_urls.add(url)
            rel = f"/games/{asset_dir.parts[-3]}/assets/book/{path.name}"
            credit = {
                "file": path.name,
                "src": rel,
                "path": str(path),
                "source": hit.get("foreign") or url,
                "license": hit.get("license"),
                "creator": hit.get("creator"),
                "query": q,
                "bytes": len(blob),
                "provider": hit.get("provider"),
                "cached": False,
            }
            print(f"    OK {stem}{ext} ({len(blob)} B) [{hit.get('provider')}] {q[:36]}")
            return credit
        time.sleep(0.5)
    print(f"    FAIL {stem}")
    return None


def js_escape_book(obj) -> str:
    return json.dumps(obj, ensure_ascii=True, indent=2)


def build_book(target: dict, imgs: dict[str, dict]) -> str:
    meta = target["meta"]
    title = meta.get("kidTitle") or f"Mission {target['level']}"
    theme = meta.get("theme") or "explore"
    intro = meta.get("intro") or meta.get("objective") or f"Learn the core idea behind {title}."
    objective = meta.get("objective") or intro
    everyday = meta.get("everyday") or []
    ex0 = everyday[0] if everyday else "something you see every day"
    ex1 = everyday[1] if len(everyday) > 1 else ex0
    subs = meta.get("subTitles") or []
    steps = subs[:6] if subs else [
        "Meet the idea",
        "Try it",
        "Sort examples",
        "Lab check",
        "Explain",
        "Rule",
    ]
    game = target["game"]
    subject = f"{game.replace('-', ' ').title()} / {title}"

    def src(key: str, fallback_keys: list[str] | None = None) -> str | None:
        if key in imgs and imgs[key].get("src"):
            return imgs[key]["src"]
        for k in fallback_keys or []:
            if k in imgs and imgs[k].get("src"):
                return imgs[k]["src"]
        return None

    cover_src = src("cover", ["hook", "model"]) or ""
    hook_src = src("hook", ["cover", "model"])
    model_src = src("model", ["cover", "hook"])
    mech_src = src("mechanism", ["model", "hook"])
    repr_src = src("representation", ["model", "cover"])
    t_a = src("transfer_a", ["hook", "cover"])
    t_b = src("transfer_b", ["mechanism", "model"])
    t_c = src("transfer_c", ["representation", "cover"])

    # Glossary from theme + title words
    raw = re.findall(r"[A-Za-z][A-Za-z-]{2,}", f"{theme} {title} {intro} {' '.join(subs)}")
    skip = {
        "this", "that", "with", "from", "your", "into", "then", "when", "mission",
        "learn", "about", "more", "the", "and", "for", "are", "you", "can", "will",
        "each", "step", "idea", "make", "like", "what",
    }
    terms = []
    for w in raw:
        lw = w.lower()
        if lw in skip or lw in terms:
            continue
        terms.append(lw if len(w) > 3 else w)
        if len(terms) >= 8:
            break
    # Prefer readable original casing for glossary display
    glossary = []
    for t in terms:
        glossary.append({"id": t.lower().replace(" ", "-"), "term": t})

    pages = [
        {
            "title": f"Why {title}?",
            "layout": "text",
            "theory": ["constructivism", "dual-coding", "cognitive-load"],
            "figures": [
                {
                    "place": "top",
                    "slides": [
                        {"src": hook_src or cover_src, "caption": f"Figure 1. A real-world door into {title}.", "alt": title},
                        *([{ "src": cover_src, "caption": "Same idea, another angle.", "alt": title}] if cover_src and cover_src != hook_src else []),
                    ],
                }
            ],
            "blocks": [
                {"type": "p", "text": intro},
                {"type": "p", "text": f"In the mission you practiced short steps. This book slows down: {objective}"},
                {"type": "p", "text": f"Everyday hook: notice {ex0}."},
            ],
        },
        {
            "title": "The big model",
            "layout": "full-fig",
            "theory": ["multimedia-learning", "dual-coding"],
            "figures": [
                {
                    "place": "full",
                    "slides": [
                        {"src": model_src or cover_src, "caption": f"Figure 2. Hold this picture of {theme} in your mind.", "alt": theme},
                    ],
                }
            ],
            "blocks": [
                {"type": "p", "text": f"Theme: {theme}."},
                {"type": "p", "text": "Point to the photo and say what stays the same vs what can change."},
            ],
        },
        {
            "title": "What makes it change",
            "layout": "text",
            "theory": ["cognitive-load", "dual-coding"],
            "figures": [
                {
                    "place": "top",
                    "slides": [
                        {"src": mech_src or model_src or cover_src, "caption": "Figure 3. The process or force that drives the change.", "alt": "Mechanism"},
                    ],
                }
            ],
            "blocks": [
                {"type": "p", "text": f"Ask: what energy, force, or rule turns {ex0} into a new situation?"},
                {"type": "p", "text": f"Compare with {ex1}. Name one thing that stayed the same."},
            ],
        },
        {
            "title": "Look closer",
            "layout": "full-fig",
            "theory": ["multimedia-learning", "spiral-scaffold"],
            "figures": [
                {
                    "place": "full",
                    "slides": [
                        {"src": repr_src or model_src or cover_src, "caption": "Figure 4. A closer structure or pattern underneath the everyday view.", "alt": "Representation"},
                    ],
                }
            ],
            "blocks": [
                {"type": "p", "text": "Models are tools, not photographs of every detail. Use them to explain, then check against real life."},
            ],
        },
        {
            "title": "How the 10 steps connect",
            "layout": "text",
            "theory": ["spiral-scaffold", "cognitive-load"],
            "blocks": [
                {"type": "p", "text": "Meet → try → sort → lab → explain → rule → stretch → myth → fluency → mastery."},
                {"type": "ul", "items": steps[:5]},
                {"type": "p", "text": "Each game step added one layer. The book gathers the full story."},
            ],
        },
        {
            "title": "Transfer lab",
            "layout": "split",
            "theory": ["constructivism", "dual-coding", "retrieval-practice"],
            "figures": [
                {
                    "place": "right",
                    "slides": [
                        s
                        for s in [
                            {"src": t_a, "caption": f"Try with {ex0}.", "alt": ex0} if t_a else None,
                            {"src": t_b, "caption": f"Compare with {ex1}.", "alt": ex1} if t_b else None,
                            {"src": t_c, "caption": "Find one more example nearby.", "alt": "Transfer"} if t_c else None,
                        ]
                        if s and s.get("src")
                    ],
                }
            ],
            "blocks": [
                {"type": "p", "text": f"Use {ex0} as your lab. Drag/flip the photos if more than one appears."},
                {"type": "ul", "items": [
                    "What changed?",
                    "What stayed the same?",
                    "What rule explains it?",
                ]},
            ],
        },
        {
            "title": "Myths to bust",
            "layout": "text",
            "theory": ["conceptual-change"],
            "blocks": [
                {"type": "p", "text": f"Myth: {title} is just a fancy word. Better: it names a rule you can test with examples."},
                {"type": "p", "text": "Myth: if I memorized a sentence, I understand. Better: I can show an example and a counter-example."},
                {"type": "p", "text": "Red words are glossary terms. Tap one to ask the tutor."},
            ],
        },
        {
            "title": "Mastery",
            "layout": "text",
            "theory": ["retrieval-practice", "spiral-scaffold"],
            "figures": [
                {
                    "place": "top",
                    "slides": [
                        {"src": cover_src or hook_src or model_src, "caption": f"Figure 5. Teach {title} using this picture as your anchor.", "alt": title},
                    ],
                }
            ],
            "blocks": [
                {"type": "p", "text": f"Teach a friend in one minute: what {title} means, one example ({ex0}), and one myth to avoid."},
                {"type": "ul", "items": [
                    f"Sketch the idea behind {theme}",
                    f"Point to {ex0} in real life",
                    f"Use one glossary word correctly",
                ]},
            ],
        },
    ]

    # Drop empty slide lists
    for p in pages:
        figs = []
        for f in p.get("figures") or []:
            slides = [s for s in (f.get("slides") or []) if s.get("src")]
            if not slides:
                continue
            f = dict(f)
            f["slides"] = slides
            figs.append(f)
        p["figures"] = figs

    book = {
        "missionIndex": target["index"],
        "title": title,
        "subtitle": theme,
        "subject": subject,
        "theories": [
            "cognitive-load",
            "dual-coding",
            "multimedia-learning",
            "constructivism",
            "conceptual-change",
            "spiral-scaffold",
            "retrieval-practice",
        ],
        "cover": {"title": title, "art": cover_src},
        "glossary": glossary,
        "pages": pages,
    }

    return f'''/**
 * Digital book - {game} mission {target["level"]}: {title}
 * Theory spine: cognitive load, dual coding, multimedia learning,
 * constructivism, conceptual change, spiral scaffold, retrieval practice.
 * Images: local assets under /games/{game}/assets/book/ (verified downloads).
 */
export const BOOK = {js_escape_book(book)};

export default BOOK;
'''


def seed_legacy_images(target: dict, imgs: dict) -> None:
    """Reuse verified on-disk photos (esp. Chemistry Tiny Bits) before searching."""
    asset_dir = target["asset_dir"]
    game = target["game"]
    n = target["level"]
    candidates = {
        "cover": [f"m{n}-cover.jpg", f"m{n}-fig1.svg"],
        "hook": [f"m{n}-particles.jpg", f"m{n}-hook.jpg", f"m{n}-fig1.svg"],
        "model": [f"m{n}-states.jpg", f"m{n}-model.jpg", f"m{n}-fig2.svg"],
        "mechanism": [f"m{n}-melt.jpg", f"m{n}-mechanism.jpg", f"m{n}-boil.jpg"],
        "representation": [f"m{n}-lattice.jpg", f"m{n}-representation.jpg", f"m{n}-fig2.svg"],
        "transfer_a": [f"m{n}-boil.jpg", f"m{n}-transfer_a.jpg", f"m{n}-fig3.svg"],
        "transfer_b": [f"m{n}-melt.jpg", f"m{n}-transfer_b.jpg", f"m{n}-fig3.svg"],
        "transfer_c": [f"m{n}-cover.jpg", f"m{n}-transfer_c.jpg", f"m{n}-particles.jpg"],
    }
    if game == "chemistry-lab" and n == 1:
        candidates = {
            "cover": ["m1-cover.jpg"],
            "hook": ["m1-particles.jpg"],
            "model": ["m1-states.jpg"],
            "mechanism": ["m1-melt.jpg"],
            "representation": ["m1-lattice.jpg"],
            "transfer_a": ["m1-boil.jpg"],
            "transfer_b": ["m1-melt.jpg"],
            "transfer_c": ["m1-cover.jpg"],
        }
    for slot, names in candidates.items():
        if slot in imgs:
            continue
        for name in names:
            p = asset_dir / name
            if not p.exists():
                continue
            blob = p.read_bytes()
            # allow SVG only as last-resort placeholder; prefer photos
            if name.endswith(".svg"):
                if any((asset_dir / alt).exists() for alt in names if alt.endswith((".jpg", ".png", ".webp"))):
                    continue
                imgs[slot] = {
                    "file": name,
                    "src": f"/games/{game}/assets/book/{name}",
                    "cached": True,
                }
                break
            if len(blob) >= MIN_BYTES and is_valid_image(blob):
                imgs[slot] = {
                    "file": name,
                    "src": f"/games/{game}/assets/book/{name}",
                    "cached": True,
                }
                break


def process_target(target: dict) -> dict:
    print(f"\n== {target['game']} L{target['level']} · {target['meta'].get('kidTitle')}")
    asset_dir = target["asset_dir"]
    asset_dir.mkdir(parents=True, exist_ok=True)
    qmap = queries_for(target)
    used = set()
    imgs: dict[str, dict] = {}
    credits = []
    prefix = f"m{target['level']}"

    seed_legacy_images(target, imgs)
    for slot in SLOT_KEYS:
        if slot in imgs and str(imgs[slot].get("file", "")).endswith((".jpg", ".png", ".webp", ".gif")):
            print(f"    cache {slot} -> {imgs[slot]['file']}")
            continue
        stem = f"{prefix}-{slot}"
        credit = download_slot(asset_dir, stem, qmap[slot], used)
        if credit:
            imgs[slot] = credit
            credits.append(credit)
        time.sleep(0.25)

    if not imgs:
        print("  WARN: no images; book will still generate with empty figures")

    # Keep handcrafted Tiny Bits book (gold standard); still refresh image seeds above.
    if not (target["game"] == "chemistry-lab" and target["level"] == 1):
        book_js = build_book(target, imgs)
        target["out_book"].parent.mkdir(parents=True, exist_ok=True)
        target["out_book"].write_text(book_js, encoding="utf-8", newline="\n")
    else:
        print("    keep handcrafted Tiny Bits book text")

    credits_path = asset_dir / f"CREDITS-m{target['level']}.json"
    credits_path.write_text(json.dumps(credits, indent=2), encoding="utf-8")
    return {
        "game": target["game"],
        "level": target["level"],
        "images": len(imgs),
        "book": str(target["out_book"]),
        "handcrafted": target["game"] == "chemistry-lab" and target["level"] == 1,
    }


def main():
    # Line-buffered logs so progress is visible while downloading.
    try:
        sys.stdout.reconfigure(line_buffering=True)
    except Exception:
        pass
    targets = discover_targets()
    print(f"Discovered {len(targets)} mission books to build", flush=True)
    results = []
    # Sequential for image integrity (Wikimedia throttles parallel bursts).
    print("Running sequentially for reliable image verification…", flush=True)
    for t in targets:
        try:
            results.append(process_target(t))
        except Exception as e:
            print(f"ERROR {t['game']} L{t['level']}: {e}", flush=True)
            results.append({"game": t["game"], "level": t["level"], "error": str(e)})

    summary = ROOT / "tools" / "book_build_summary.json"
    summary.write_text(json.dumps(results, indent=2), encoding="utf-8")
    ok = sum(1 for r in results if not r.get("error"))
    print(f"\nDONE {ok}/{len(results)} books. Summary → {summary}", flush=True)
    return 0 if ok == len(results) else 1


if __name__ == "__main__":
    sys.exit(main())
