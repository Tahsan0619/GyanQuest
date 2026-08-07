#!/usr/bin/env python3
"""Fetch NASA Image Library photos into assets/book-shared (reliable, educational)."""
from __future__ import annotations

import json
import re
import ssl
import time
import urllib.parse
import urllib.request
from pathlib import Path

ssl._create_default_https_context = ssl._create_unverified_context

ROOT = Path(__file__).resolve().parents[1]
SHARED = ROOT / "assets" / "book-shared"
UA = {"User-Agent": "GyanQuestBookBot/3.2 (educational; https://github.com/Tahsan0619/GyanQuest)"}
API = "https://images-api.nasa.gov/search"

QUERIES = {
    "space": ["earth from space", "saturn", "jupiter", "moon", "nebula", "rocket launch", "mars", "solar"],
    "physics": ["force", "gravity", "friction", "astronaut push", "ISS"],
    "chemistry": ["crystal", "ice", "water", "combustion"],
    "biology": ["cell", "plant", "leaf", "microscope"],
    "electrical": ["circuit", "solar panel", "battery"],
    "computing": ["computer", "chip", "satellite communication"],
    "eco": ["earth atmosphere", "ocean", "forest from space"],
    "anatomy": ["heart", "bone", "blood"],
    "ai_data": ["robot", "rover", "autonomous"],
    "civil_mech": ["gear", "bridge", "structure"],
    "math": ["graph", "geometry", "pattern"],
    "general": ["laboratory", "experiment", "education"],
}


def search(q: str) -> list[dict]:
    params = urllib.parse.urlencode({"q": q, "media_type": "image"})
    req = urllib.request.Request(f"{API}?{params}", headers=UA)
    with urllib.request.urlopen(req, timeout=45) as r:
        data = json.loads(r.read().decode())
    items = []
    for hit in (data.get("collection") or {}).get("items") or []:
        links = hit.get("links") or []
        href = None
        for L in links:
            if L.get("rel") == "preview" or (L.get("render") == "image"):
                href = L.get("href")
                break
        if not href and links:
            href = links[0].get("href")
        meta = (hit.get("data") or [{}])[0]
        if href:
            items.append({"url": href, "title": meta.get("title") or q, "nasa_id": meta.get("nasa_id")})
    return items


def ok_img(b: bytes) -> bool:
    return b and len(b) > 12000 and (b[:3] == b"\xff\xd8\xff" or b[:8] == b"\x89PNG\r\n\x1a\n")


def slug(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:36]


def main():
    SHARED.mkdir(parents=True, exist_ok=True)
    credits = []
    total = 0
    for theme, qs in QUERIES.items():
        d = SHARED / theme
        d.mkdir(exist_ok=True)
        print(f"\n## NASA {theme}", flush=True)
        got = 0
        for q in qs:
            if got >= 8:
                break
            try:
                hits = search(q)
            except Exception as e:
                print(f"  search err {q}: {e}", flush=True)
                time.sleep(1)
                continue
            time.sleep(0.6)
            for h in hits[:5]:
                if got >= 8:
                    break
                try:
                    req = urllib.request.Request(h["url"], headers=UA)
                    with urllib.request.urlopen(req, timeout=60) as r:
                        blob = r.read()
                except Exception as e:
                    print(f"  dl err: {e}", flush=True)
                    continue
                if not ok_img(blob):
                    continue
                ext = ".jpg" if blob[:3] == b"\xff\xd8\xff" else ".png"
                name = f"nasa-{slug(q)}-{got+1}{ext}"
                path = d / name
                path.write_bytes(blob)
                flat = SHARED / f"{theme}-{name}"
                flat.write_bytes(blob)
                got += 1
                total += 1
                print(f"  OK {name} ({len(blob)} B)", flush=True)
                credits.append({"file": f"{theme}/{name}", "query": q, "title": h["title"], "nasa_id": h.get("nasa_id")})
                break
        print(f"  theme total {got}", flush=True)
    (SHARED / "CREDITS-nasa.json").write_text(json.dumps(credits, indent=2), encoding="utf-8")
    print(f"\nDONE nasa photos={total}", flush=True)


if __name__ == "__main__":
    main()
