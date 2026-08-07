#!/usr/bin/env python3
"""Export mission META catalog for unique book rewriting."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GAMES = ROOT / "games"


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
        "predict": s("predict"),
        "bdHook": s("bdHook"),
        "everyday": everyday,
        "subTitles": subs,
    }


def main():
    catalog = []
    for game_dir in sorted(GAMES.iterdir()):
        books = game_dir / "books"
        if not books.exists():
            continue
        for bp in sorted(books.glob("level*.js")):
            n = int(re.search(r"level(\d+)", bp.name).group(1))
            meta = extract_level_meta(game_dir / "js" / f"level{n}.js")
            catalog.append(
                {
                    "game": game_dir.name,
                    "level": n,
                    "book_path": str(bp.relative_to(ROOT)).replace("\\", "/"),
                    "asset_dir": f"games/{game_dir.name}/assets/book",
                    "meta": meta,
                }
            )
    out = ROOT / "tools" / "book_mission_catalog.json"
    out.write_text(json.dumps(catalog, indent=2), encoding="utf-8")
    print(f"Wrote {len(catalog)} missions -> {out}")


if __name__ == "__main__":
    main()
