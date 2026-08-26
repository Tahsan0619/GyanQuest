#!/usr/bin/env python3
"""Build tools/gyanquest.ico from the website logo PNG."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PNG = ROOT / "assets" / "gyanquest-logo.png"
ICO = ROOT / "tools" / "gyanquest.ico"
SIZES = [(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]


def ensure_ico() -> Path:
    from PIL import Image

    if not PNG.is_file():
        raise SystemExit(f"Logo not found: {PNG}")
    ICO.parent.mkdir(parents=True, exist_ok=True)
    img = Image.open(PNG).convert("RGBA")
    w, h = img.size
    side = min(w, h)
    left = (w - side) // 2
    top = (h - side) // 2
    img = img.crop((left, top, left + side, top + side))
    img.save(ICO, format="ICO", sizes=SIZES)
    return ICO


if __name__ == "__main__":
    path = ensure_ico()
    print(f"Wrote {path} ({path.stat().st_size} bytes)")
