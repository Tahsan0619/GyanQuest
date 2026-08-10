from pathlib import Path
import re

root = Path(r"c:\Users\Tahsan\Downloads\ImpactX\games")
total_playable = 0
for p in sorted(root.glob("*/js/missions-meta.js")):
    t = p.read_text(encoding="utf-8", errors="ignore")
    titles = re.findall(r'"kidTitle"\s*:\s*"([^"]+)"', t)
    # also unquoted style
    if not titles:
        titles = re.findall(r"kidTitle:\s*\"([^\"]+)\"", t)
    playable = len(re.findall(r"playable:\s*true", t))
    game = p.parent.parent.name
    print(f"{game}: playable={playable} titles={titles[:playable]}")
    total_playable += playable
print("TOTAL_PLAYABLE", total_playable)
print("EXISTING_BOOKS", len(list(root.glob("*/books/level*.js"))))
