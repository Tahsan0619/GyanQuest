from pathlib import Path
import re

root = Path(r"c:\Users\Tahsan\Downloads\ImpactX\games")
books = sorted(root.glob("*/books/level*.js"))

# Template fingerprints from the bulk generator
TEMPLATE_MARKERS = [
    "A real-world door into",
    "Same idea, another angle",
    "Hold this picture of",
    "The process or force that drives the change",
    "A closer structure or pattern underneath",
    "Drag/flip the photos if more than one appears",
    "Why What is AI??",  # broken template title
    "is just a fancy word",
    "Teach a friend in one minute: what ",
]

handcrafted_hints = [
    "A rock that will not wake",
    "Light ball, heavy drum",
    "You push - it pushes back",
    "Hunt one kind of atom",
    "Atoms that stick as buddies",
    "Kitchen lab",  # tiny bits
]

rows = []
for b in books:
    t = b.read_text(encoding="utf-8", errors="replace")
    game = b.parent.parent.name
    level = b.name
    markers = [m for m in TEMPLATE_MARKERS if m in t]
    # image refs
    imgs = re.findall(r'"(/games/[^"]+/assets/book/[^"]+\.(?:jpg|jpeg|png|webp|gif))"', t)
    missing = 0
    for src in imgs:
        p = Path(r"c:\Users\Tahsan\Downloads\ImpactX") / src.lstrip("/")
        if not p.exists() or p.stat().st_size < 1000:
            missing += 1
    # uniqueness: first page title
    m = re.search(r'"title":\s*"([^"]+)"', t)
    # better: first page title inside pages
    pm = re.search(r'"pages"\s*:\s*\[\s*\{\s*"title":\s*"([^"]+)"', t) or re.search(
        r"title: \"([^\"]+)\",\n\s*layout:", t
    )
    page1 = pm.group(1) if pm else "?"
    status = "TEMPLATE" if markers else "UNIQUE-ish"
    if any(h in t for h in handcrafted_hints) and not markers:
        status = "HANDCRAFTED"
    rows.append((status, game, level, page1, len(imgs), missing, len(markers)))

from collections import Counter
c = Counter(r[0] for r in rows)
print("STATUS COUNTS:", dict(c))
print("TOTAL BOOKS:", len(rows))
print()
print("--- Still TEMPLATE ---")
for r in rows:
    if r[0] == "TEMPLATE":
        print(f"{r[1]}/{r[2]} page1={r[3]!r} imgs={r[4]} missing={r[5]} markers={r[6]}")
print()
print("--- HANDCRAFTED ---")
for r in rows:
    if r[0] == "HANDCRAFTED":
        print(f"{r[1]}/{r[2]} page1={r[3]!r} imgs={r[4]}")
print()
print("--- UNIQUE-ish (no template markers) ---")
for r in rows:
    if r[0] == "UNIQUE-ish":
        print(f"{r[1]}/{r[2]} page1={r[3]!r} imgs={r[4]} missing={r[5]}")
